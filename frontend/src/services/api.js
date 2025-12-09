import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE_URL}/documents/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocuments = async () => {
  return axios.get(`${API_BASE_URL}/documents`);
};

export const deleteDocument = async (id) => {
  return axios.delete(`${API_BASE_URL}/documents/${id}`);
};

export const getDownloadUrl = (id) => {
  return `${API_BASE_URL}/documents/${id}`;
};
