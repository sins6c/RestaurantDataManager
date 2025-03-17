export interface CustomerData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  number: string;
  email: string;
  place: string;
  favoriteFood: string;
  timestamp: string;
  visitFrequency: string;
  dietaryPreferences: string[];
  customFields?: Record<string, {
    name: string;
    value: any;
  }>;
}