export type Place = {
  id: number;
  name: string;
  description?: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  distance?: number;
  openingHours?: string;
  reason?: string;
  estimatedBudget?: string;
};
