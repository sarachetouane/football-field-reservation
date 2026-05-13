export interface Field {
  id: string;
  name: string;
  address: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  availableSlots: TimeSlot[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price?: number;
  fieldId: string;
  date: string;
}

export interface Reservation {
  id: string;
  fieldId: string;
  userId: string;
  date: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  reservations: Reservation[];
  createdAt: Date;
  updatedAt: Date;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
