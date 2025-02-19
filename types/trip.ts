export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  description?: string;
}

export interface Activity {
  id: string;
  tripId: string;
  locationId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  cost?: number;
  notes?: string;
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}