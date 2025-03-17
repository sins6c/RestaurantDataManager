import { CustomerData } from '../types';

export const saveCustomerData = (data: CustomerData) => {
  const existingData = localStorage.getItem('customerData');
  const customers = existingData ? JSON.parse(existingData) : [];
  customers.push(data);
  localStorage.setItem('customerData', JSON.stringify(customers));
};

export const getCustomerData = (): CustomerData[] => {
  const data = localStorage.getItem('customerData');
  return data ? JSON.parse(data) : [];
};

export const clearCustomerData = () => {
  localStorage.removeItem('customerData');
};

export const updateCustomerData = (customers: CustomerData[]) => {
  localStorage.setItem('customerData', JSON.stringify(customers));
};