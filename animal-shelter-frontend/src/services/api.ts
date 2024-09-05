import axios from 'axios';
import { AnimalStatus } from '../constants';


const api = axios.create({
  baseURL: 'http://localhost:8000/users',
});


const getToken = () => {
    console.log(localStorage.getItem('authToken'));
    return localStorage.getItem('authToken');
};

const authApi = axios.create({
    baseURL: 'http://localhost:8000/users',
});
authApi.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const ping = async () => {
    try {
        const response = await api.get('/ping/');
        return response.data;
    } catch (error) {
        console.error('Error pinging server:', error);
        throw error;
    }
};

export const registerUser = async (values: {
    username: string;
    email: string;
    password: string;
    role: string;
    }) => {
    try {
        const response = await api.post('/register/', values);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (values: {
    username: string;
    password: string;
}) => {
    try {
        return api.post('/login/', values)
            .then(response => {
                return response.data;
            });
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchAnimals = async () => {
    try {
        const response = await authApi.get('/animals/');
        return response.data;
    } catch (error) {
        console.error('Error fetching animals:', error);
        throw error;
    }
};

export const fetchAnimal = async (id: string) => {
    try {
        const response = await authApi.get(`/animals/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching animal:', error);
        throw error;
    }
};

export const createAnimal = async (values: {
    name: string;
    age: number;
    breed: string;
    animal_type: 'dog' | 'cat';
    status: 'adopted' | 'for_adoption' | 'waiting';
  }) => {
    try {
      const response = await authApi.post('/animals/create/', values);
      return response.data;
    } catch (error) {
      console.error('Error creating animal:', error);
      throw error;
    }
};

export const updateAnimal = async (id: number, values: {
    name: string;
    breed: string;
    age: number;
    animal_type: string;
    }) => {
    try {
        const response = await authApi.put(`/animals/${id}/update/`, values);
        return response.data;
    } catch (error) {
        console.error('Error updating animal:', error);
        throw error;
    }
};

export const deleteAnimal = async (id: number) => {
    try {
        const response = await authApi.delete(`/delete-animal/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting animal:', error);
        throw error;
    }
};

export const fetchVolunteers = async () => {
    try {
      const response = await authApi.get('/volunteers/');
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
};

export const fetchAdopters = async () => {
    try {
      const response = await authApi.get('/adopters/');
      return response.data;
    } catch (error) {
      console.error('Error fetching adopters:', error);
      throw error;
    }
};

export const fetchAdoptions = async () => {
    try {
      const response = await authApi.get('/adoptions/');
      return response.data;
    } catch (error) {
      console.error('Error fetching adoptions:', error);
      throw error;
    }
};

export const createVolunteer = async (values: {
    username: string;
    email: string;
    password: string;
    status: string;
  }) => {
    try {
      const response = await authApi.post('/volunteers/', {
        ...values,
        role: 'volunteer',
      });
      return response.data;
    } catch (error) {
      console.error('Error creating volunteer:', error);
      throw error;
    }
};

export const updateVolunteer = async (
    id: number, 
    values: { 
      username: string; 
      email: string; 
      status: string; 
      password?: string; 
    }
  ) => {
    try {
      const response = await authApi.put(`/volunteers/${id}/`, {
        ...values,
        role: 'volunteer',
      });
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer:', error);
      throw error;
    }
}; 

export const createAdopter = async (values: {
    username: string;
    email: string;
    password: string;
    status: string;
}) => {
    try {
        const response = await authApi.post('/adopters/', {
        ...values,
        role: 'adopter',
        });
        return response.data;
    } catch (error) {
        console.error('Error creating adopter:', error);
        throw error;
    }
};

export const updateAdopter = async (
    id: number,
    values: {
      username: string;
      email: string;
      status: string;
      password?: string;
    }
  ) => {
    try {
      const response = await authApi.put(`/adopters/${id}/`, {
        ...values,
        role: 'adopter',
      });
      return response.data;
    } catch (error) {
      console.error('Error updating adopter:', error);
      throw error;
    }
};  

export const createAdoption = async (values: {
    animal_id: number;
    adopter_id: number;
    volunteer_id: number;
    status: string;
  }) => {
    try {
      const response = await authApi.post('/adoptions/', values);
      return response.data;
    } catch (error) {
      console.error('Error creating adoption:', error);
      throw error;
    }
};

export const updateAdoption = async (id: number, values: {
    animal: number;
    adopter: number;
    volunteer: number;
    adoption_date: string;
    status: string;
  }) => {
    try {
      const response = await authApi.put(`/adoptions/${id}/`, values);
      return response.data;
    } catch (error) {
      console.error('Error updating adoption:', error);
      throw error;
    }
};

export const createUserAdoption = async (animalId: number) => {
    try {
      const response = await authApi.post('/create-adoption/', { animal_id: animalId });
      return response.data;
    } catch (error) {
      console.error('Error creating adoption:', error);
      throw error;
    }
};

export const deleteVolunteer = async (id: number) => {
    try {
      const response = await authApi.delete(`/volunteers/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      throw error;
    }
};

export const deleteAdopter = async (id: number) => {
    try {
      const response = await authApi.delete(`/adopters/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting adopter:', error);
      throw error;
    }
};

export const deleteAdoption = async (id: number) => {
    try {
        const response = await authApi.delete(`/adoptions/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting adoption:', error);
        throw error;
    }
};

export const applyForAdoption = async (animalId: number) => {
    try {
      const response = await authApi.post('/adoptions/apply/', { animal_id: animalId });
      return response.data;
    } catch (error) {
      console.error('Error applying for adoption:', error);
      throw error;
    }
};
  
export const processAdoption = async (adoptionId: number, action: 'accept' | 'reject') => {
    try {
      const response = await authApi.post(`/adoptions/${adoptionId}/process/`, { action });
      return response.data;
    } catch (error) {
      console.error('Error processing adoption:', error);
      throw error;
    }
};

export default api;