import instance from './axios';
import { getAuthHeaders } from './helpers';

export const fetchMessages = async () => {
  const response = await instance.get('/api/messages/', {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const sendMessage = async (text) => {
  const response = await instance.post(
    '/api/messages/',
    { text },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};
