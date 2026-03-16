
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Volunteer, VolunteerStatus, Shift } from '../types';
import { db } from '../services/db';

interface VolunteerContextType {
  volunteers: Volunteer[];
  shifts: Shift[];
  loading: boolean;
  addVolunteer: (vol: Partial<Volunteer>) => Promise<void>;
  updateVolunteerStatus: (id: number, status: VolunteerStatus) => Promise<void>;
  updateVolunteerDetails: (id: number, details: Partial<Volunteer>) => Promise<void>;
  getVolunteerStats: () => { active: number; pending: number; totalHours: number };
  addShift: (shift: Omit<Shift, 'id'>) => Promise<void>;
  updateShift: (id: number, shift: Partial<Shift>) => Promise<void>;
  deleteShift: (id: number) => Promise<void>;
  getShiftsByVolunteer: (volunteerId: number) => Shift[];
}

const VolunteerContext = createContext<VolunteerContextType | undefined>(undefined);

export const VolunteerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Load from DB
  useEffect(() => {
    const loadData = async () => {
        try {
            const [vols, shfts] = await Promise.all([
                db.volunteers.getAll(),
                db.shifts.getAll()
            ]);
            setVolunteers(vols);
            setShifts(shfts);
        } catch (error) {
            console.error("Failed to load volunteer data", error);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const addVolunteer = async (volData: Partial<Volunteer>) => {
    const newVol = await db.volunteers.create({
      fullName: volData.fullName || '',
      email: volData.email || '',
      phone: volData.phone || '',
      establishment: volData.establishment || '',
      hospitalUnit: volData.hospitalUnit || undefined,
      location: volData.location || '',
      group: volData.group || undefined,
      motivation: volData.motivation || '',
      status: volData.status || VolunteerStatus.PENDING,
      hoursThisMonth: volData.hoursThisMonth || 0,
      joinDate: new Date().toISOString().split('T')[0]
    } as Omit<Volunteer, 'id'>);
    
    setVolunteers(prev => [...prev, newVol]);
  };

  const updateVolunteerDetails = async (id: number, details: Partial<Volunteer>) => {
    await db.volunteers.update(id, details);
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, ...details } : v));
  };

  // REGLA DE NEGOCIO: Validador de traslape de turnos
  const isShiftOverlapping = (shiftToCheck: Partial<Shift>, existingShifts: Shift[]): boolean => {
    const newStart = new Date(`${shiftToCheck.date}T${shiftToCheck.startTime}`).getTime();
    const newEnd = new Date(`${shiftToCheck.date}T${shiftToCheck.endTime}`).getTime();

    if (newStart >= newEnd) {
      throw new Error("La hora de inicio debe ser anterior a la hora de término.");
    }
    
    const conflictingShift = existingShifts.find(existingShift => {
      // Ignorar el propio turno si se está actualizando
      if (shiftToCheck.id && existingShift.id === shiftToCheck.id) {
        return false;
      }

      // Solo verificar turnos de la misma voluntaria en el mismo día
      if (existingShift.volunteerId === shiftToCheck.volunteerId && existingShift.date === shiftToCheck.date) {
        const oldStart = new Date(`${existingShift.date}T${existingShift.startTime}`).getTime();
        const oldEnd = new Date(`${existingShift.date}T${existingShift.endTime}`).getTime();
        
        // Lógica de traslape: (StartA < EndB) and (EndA > StartB)
        return newStart < oldEnd && newEnd > oldStart;
      }
      return false;
    });

    return !!conflictingShift;
  };

  // REGLA DE NEGOCIO: Cálculo de horas de un turno
  const calculateShiftHours = (startTime: string, endTime: string): number => {
      const start = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      const diff = end.getTime() - start.getTime();
      return diff / (1000 * 60 * 60);
  };
  
  // MANTENIMIENTO DE HORAS DE VOLUNTARIADO
  const adjustVolunteerHours = async (volunteerId: number, hours: number) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (volunteer) {
        const newTotal = Math.max(0, volunteer.hoursThisMonth + hours); // hours puede ser negativo
        await updateVolunteerDetails(volunteerId, { hoursThisMonth: newTotal });
    }
  };


  const updateVolunteerStatus = async (id: number, status: VolunteerStatus) => {
    await db.volunteers.update(id, { status });
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };


  const getVolunteerStats = () => {
    return {
      active: volunteers.filter(v => v.status === VolunteerStatus.ACTIVE).length,
      pending: volunteers.filter(v => v.status === VolunteerStatus.PENDING).length,
      totalHours: volunteers.reduce((acc, curr) => acc + curr.hoursThisMonth, 0)
    };
  };

  const addShift = async (shift: Omit<Shift, 'id'>) => {
    if (isShiftOverlapping(shift, shifts)) {
      throw new Error("Error de Traslape: La voluntaria ya tiene un turno asignado en ese rango horario.");
    }
    const newShift = await db.shifts.create(shift);
    setShifts(prev => [...prev, newShift]);
  };

  const updateShift = async (id: number, updatedFields: Partial<Shift>) => {
    const originalShift = shifts.find(s => s.id === id);
    if (!originalShift) throw new Error("Turno no encontrado");

    const mergedShift = { ...originalShift, ...updatedFields };

    if (isShiftOverlapping(mergedShift, shifts)) {
      throw new Error("Error de Traslape: El nuevo horario entra en conflicto con otro turno existente.");
    }
    
    // REGLA DE NEGOCIO: Actualización automática de horas
    if (updatedFields.status && updatedFields.status !== originalShift.status) {
        const shiftHours = calculateShiftHours(originalShift.startTime, originalShift.endTime);
        
        // Si se marca como completado Y ANTES no lo estaba, sumar horas
        if (updatedFields.status === 'Completado' && originalShift.status !== 'Completado') {
            await adjustVolunteerHours(originalShift.volunteerId, shiftHours);
        }
        // Si se cambia de completado a otro estado, restar horas
        else if (originalShift.status === 'Completado' && updatedFields.status !== 'Completado') {
            await adjustVolunteerHours(originalShift.volunteerId, -shiftHours);
        }
    }
    
    await db.shifts.update(id, updatedFields);
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteShift = async (id: number) => {
    try {
      const shiftToDelete = shifts.find(s => s.id === id);
      // Si se elimina un turno que ya estaba completado, se deben restar las horas.
      if (shiftToDelete && shiftToDelete.status === 'Completado') {
          const shiftHours = calculateShiftHours(shiftToDelete.startTime, shiftToDelete.endTime);
          await adjustVolunteerHours(shiftToDelete.volunteerId, -shiftHours);
      }

      await db.shifts.delete(id);
      setShifts(prev => prev.filter(s => s.id !== id));
    } catch (error) {
        console.error("Error al eliminar el turno:", error);
        alert("Ocurrió un error al intentar eliminar el turno. Por favor, inténtelo de nuevo.");
    }
  };

  const getShiftsByVolunteer = (volunteerId: number) => {
    return shifts.filter(s => s.volunteerId === volunteerId).sort((a,b) => a.date.localeCompare(b.date));
  };

  return (
    <VolunteerContext.Provider value={{ 
      volunteers, 
      shifts,
      loading,
      addVolunteer, 
      updateVolunteerStatus, 
      updateVolunteerDetails,
      getVolunteerStats,
      addShift,
      updateShift,
      deleteShift,
      getShiftsByVolunteer
    }}>
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteer = () => {
  const context = useContext(VolunteerContext);
  if (!context) throw new Error('useVolunteer must be used within a VolunteerProvider');
  return context;
};
