
import React from 'react';

// Enums
export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  COLLABORATOR = 'COLLABORATOR',
  VOLUNTEER = 'VOLUNTEER'
}

export enum DonationType {
  MONETARY = 'Monetario',
  SUPPLIES = 'Insumos',
  SERVICE = 'Servicio'
}

export enum VolunteerStatus {
  PENDING = 'Pendiente', 
  ACTIVE = 'Activo',
  TRAINING = 'En Formación',
  INACTIVE = 'Inactivo',
  ON_LEAVE = 'Licencia'
}

export enum CampaignStatus {
  DRAFT = 'Borrador',
  PLANNED = 'Planificada',
  ACTIVE = 'En Curso',
  COMPLETED = 'Finalizada',
  CANCELLED = 'Cancelada'
}

export enum BlogPostStatus {
  DRAFT = 'Borrador',
  PUBLISHED = 'Publicado',
  ARCHIVED = 'Archivado'
}

export type DonationCategory = 'Higiene' | 'Ropa' | 'Alimentos' | 'Médico' | 'Entretención' | 'Otro';
export type HospitalUnit = 'Pediatría' | 'Medicina Hombres' | 'Medicina Mujeres' | 'Urgencias' | 'Geriatría' | 'Oncología';
export type VolunteerGroup = 'Grupo A (Lunes)' | 'Grupo B (Martes)' | 'Grupo C (Miércoles)' | 'Grupo D (Jueves)' | 'Grupo E (Viernes)' | 'Fines de Semana';

// Interfaces
export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  volunteerId?: number;
}

export interface BrandingConfig {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

export interface FooterConfig {
  legendText: string;
  goreLogo: string;
  coreLogo: string;
}

export interface SocialConfig {
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  isVisible: boolean;
  topbarText: string;
}

export interface PageBanner {
  pageId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

// BLOG ENHANCED STRUCTURE
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogSubCategory {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
}

export type BlogBlockType = 'text' | 'image' | 'button' | 'spacer' | 'heading';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  content: string; // Text or HTML content
  mediaUrl?: string; // For images
  caption?: string; // For images
  linkUrl?: string; // For buttons
  buttonStyle?: 'primary' | 'secondary' | 'outline'; // For buttons
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  blocks?: BlogBlock[];
  coverImage: string;
  author: string;
  publishDate: string;
  status: BlogPostStatus;
  tags: string[];
  categoryId?: number;
  subCategoryId?: number;
}

export interface HeroButton {
  label: string;
  link: string;
  style: 'primary' | 'outline';
}

export interface HeroSlide {
  id: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle: string;
  buttons: HeroButton[];
  isActive: boolean;
  order: number;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: 'Heart' | 'Users' | 'Smile' | 'Hand' | 'Star' | 'Sun';
}

export interface CustomPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  isVisible: boolean;
  lastModified: string;
}

export interface Volunteer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  status: VolunteerStatus;
  hoursThisMonth: number;
  joinDate: string;
  availability?: string;
  motivation?: string;
  profileImage?: string;
  establishment?: string;
  hospitalUnit?: HospitalUnit;
  location?: string;
  group?: VolunteerGroup;
  skills?: string[];
  vaccinationStatus?: boolean;
}

export interface Shift {
  id: number;
  volunteerId: number;
  date: string;
  startTime: string;
  endTime: string;
  establishment?: string;
  hospitalUnit: HospitalUnit;
  status: 'Programado' | 'Completado' | 'Cancelado';
}

export interface DonationItem {
  id: number;
  name: string;
  desc: string;
  priority: 'Alta' | 'Media' | 'Baja';
  category: DonationCategory;
  targetAmount?: number;
  currentAmount: number;
  unit?: string;
}

export interface Campaign {
  id: number;
  name: string;
  objective: string;
  startDate: string;
  endDate: string;
  channel: string;
  targetAudience: string;
  status: CampaignStatus;
  budget?: string;
  notes?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}
