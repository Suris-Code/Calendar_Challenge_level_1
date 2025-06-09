import axios from 'axios';
import { YesNo } from '../types/enums';
import qs from 'qs';
import toastService from './toastService';

interface Appointment {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  userId?: string;
  isConfirmed: YesNo;
  isCancelled?: YesNo;
  cancellationReason?: string;
  meetingLink?: string;
  sendReminder: YesNo;
}

interface GetAppointmentsRequest {
  startDate?: string;
  endDate?: string;
}

// Base response structure for all API responses
interface Result {
  succeeded: boolean;
  message?: string;
  errors?: string[];
}

// Generic response that contains data
interface Response<T> {
  result: Result;
  data?: T;
}

// Response for appointments list
interface GetAppointmentsResponse extends Response<Appointment[]> {
}

// Response for a single appointment
interface GetAppointmentResponse extends Response<Appointment> {
}

interface CreateAppointmentRequest {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  userId?: string;
  isConfirmed?: YesNo;
  meetingLink?: string;
  sendReminder?: YesNo;
}

interface CreateAppointmentResponse extends Response<{ id: number }> {
}

interface UpdateAppointmentRequest {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  isConfirmed: YesNo;
  isCancelled: YesNo;
  cancellationReason?: string;
  meetingLink?: string;
  sendReminder: YesNo;
}

interface UpdateAppointmentResponse extends Response<void> {
}

interface DeleteAppointmentRequest {
  id: number;
}

interface DeleteAppointmentResponse extends Response<void> {
}

// Define the service as an object with standalone functions to avoid 'this' context issues
const appointmentsService = {
  getAppointments: async (request: GetAppointmentsRequest = {}): Promise<Appointment[]> => {
    try {
      const response = await axios.get<GetAppointmentsResponse>('/api/Appointments', {
        params: request,
        paramsSerializer: {
          serialize: (params) => qs.stringify(params, { 
              arrayFormat: 'repeat',
              serializeDate: (date: Date) => date.toISOString(),
              encode: false,
              allowDots: true
          })
        }
      });
      
      // Check if response has data property containing the array
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error: unknown) {
      console.error('Error fetching appointments:', error);
      
      // Show toast notification for 400 errors
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toastService.apiError(error);
      }
      
      return [];
    }
  },

  getAppointment: async (id: number): Promise<Appointment | null> => {
    try {
      const response = await axios.get<GetAppointmentResponse>(`/api/Appointments/${id}`);
      
      // Check if response is successful and contains data
      if (response.data?.result?.succeeded && response.data?.data) {
        return response.data.data;
      } else {
        console.warn('Unexpected response format or failed response:', response.data);
        return null;
      }
    } catch (error: unknown) {
      console.error(`Error fetching appointment with id ${id}:`, error);
      
      // Show toast notification for 400 errors
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toastService.apiError(error);
      }
      
      return null;
    }
  },

  createAppointment: async (request: CreateAppointmentRequest): Promise<Appointment | null> => {
    try {
      // Validate that startTime and endTime are properly formatted ISO dates
      if (!request.startTime || !request.endTime) {
        console.error('Invalid date formats in appointment request', request);
        return null;
      }
      
      const response = await axios.post<CreateAppointmentResponse>('/api/Appointments', request);
      
      if (response.data?.result?.succeeded && response.data?.data?.id) {
        // Fetch the created appointment to return complete data
        const createdAppointment = await appointmentsService.getAppointment(response.data.data.id);
        return createdAppointment;
      }
      return null;
    } catch (error: unknown) {
      console.error('Error creating appointment:', error);
      
      // Show toast notification for 400 errors
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.error('API Error Response:', error.response.data);
        toastService.apiError(error);
      }
      
      return null;
    }
  },

  updateAppointment: async (request: UpdateAppointmentRequest): Promise<Appointment | null> => {
    try {
      // Validate that startTime and endTime are properly formatted ISO dates
      if (!request.startTime || !request.endTime) {
        console.error('Invalid date formats in appointment update request', request);
        return null;
      }
      
      const response = await axios.put<UpdateAppointmentResponse>(`/api/Appointments/${request.id}`, request);
      
      if (response.data?.result?.succeeded) {
        // Fetch the updated appointment to return complete data
        const updatedAppointment = await appointmentsService.getAppointment(request.id);
        return updatedAppointment;
      }
      return null;
    } catch (error: unknown) {
      console.error(`Error updating appointment with id ${request.id}:`, error);
      
      // Show toast notification for 400 errors
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        console.error('API Error Response:', error.response.data);
        toastService.apiError(error);
      }
      
      return null;
    }
  },

  deleteAppointment: async (id: number): Promise<boolean> => {
    try {
      const request: DeleteAppointmentRequest = { id };
      const response = await axios.delete<DeleteAppointmentResponse>(`/api/Appointments/${id}`, { 
        data: request 
      });
      return response.data?.result?.succeeded || false;
    } catch (error: unknown) {
      console.error(`Error deleting appointment with id ${id}:`, error);
      
      // Show toast notification for 400 errors
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        toastService.apiError(error);
      }
      
      return false;
    }
  }
};

export type { 
  Appointment, 
  GetAppointmentsRequest, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  DeleteAppointmentRequest
};
export default appointmentsService; 