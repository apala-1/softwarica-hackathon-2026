// lib/api.ts - Updated version
import axios from 'axios';
import { EnhanceRequest, EnhanceResponse, GenerateRequest, GenerateResponse, SendEmailRequest, SendEmailResponse } from '../types/document.types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export const enhanceStory = (data: EnhanceRequest) =>
  api.post<EnhanceResponse>('/enhance', data).then(r => r.data);

export const generatePdf = (data: GenerateRequest) =>
  api.post<GenerateResponse>('/generate', data).then(r => r.data);

export const sendEmail = async (data: SendEmailRequest): Promise<SendEmailResponse> => {
  try {
    const response = await api.post<SendEmailResponse>('/send-email', data);
    return response.data;
  } catch (error: any) {
    console.error('Send email error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.response?.data?.message || 'इमेल पठाउन सकिएन');
  }
};