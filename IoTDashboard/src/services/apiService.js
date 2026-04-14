
import axios from 'axios';


const BASE_URL = 'https://jsonplaceholder.typicode.com'; // Demo público


const TOKEN = 'TU_TOKEN_AQUI'; 

export const fetchIoTData = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      
    },
    ...options, 
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 4000, 
  headers: {
    'Content-Type': 'application/json',
  
  },
});

apiClient.interceptors.request.use(
  (config) => {
    
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      throw new Error(`Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Sin respuesta del servidor');
    } else {
      throw new Error(error.message);
    }
  }
);

export const fetchIoTAxios = async (endpoint, signal) => {
  return apiClient.get(endpoint, { signal });
};

export default apiClient;
