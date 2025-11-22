import instance from './axios';
import { getAuthHeaders } from './helpers';

export const getProfile = async () => {
  const response = await instance.get('/api/profile/', {
    headers: getAuthHeaders(),
  });
  return response.data;
};
