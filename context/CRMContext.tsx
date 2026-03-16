import React, { createContext, useContext, useState, useEffect } from 'react';
import { Campaign, CampaignStatus } from '../types';
import { db } from '../services/db';

interface CRMContextType {
  campaigns: Campaign[];
  loading: boolean;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (id: number, campaign: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: number) => Promise<void>;
  getCampaignStats: () => { active: number; planned: number; completed: number };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await db.crm.getCampaigns();
            setCampaigns(data);
        } catch (e) {
            console.error("CRM Load error", e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, []);

  const addCampaign = async (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign = await db.crm.create(campaign);
    setCampaigns(prev => [...prev, newCampaign]);
  };

  const updateCampaign = async (id: number, updatedFields: Partial<Campaign>) => {
    await db.crm.update(id, updatedFields);
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updatedFields } : c)));
  };

  const deleteCampaign = async (id: number) => {
    await db.crm.delete(id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const getCampaignStats = () => {
    return {
      active: campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length,
      planned: campaigns.filter(c => c.status === CampaignStatus.PLANNED).length,
      completed: campaigns.filter(c => c.status === CampaignStatus.COMPLETED).length,
    };
  };

  return (
    <CRMContext.Provider value={{ campaigns, loading, addCampaign, updateCampaign, deleteCampaign, getCampaignStats }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
};