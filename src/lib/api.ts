import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const analyzeResume = async (file: File, jobDescription: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/analysis/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};