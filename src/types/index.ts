export interface Field {
  id: string;
  name: string;
  address: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  price?: number;
}

export interface Reservation {
  id: string;
  fieldId: string;
  userId: string;
  date: string;
  timeSlot: TimeSlot;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  reservations: Reservation[];
}
