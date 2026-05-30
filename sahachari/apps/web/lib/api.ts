import axios from 'axios';
import { EnhanceRequest, EnhanceResponse, GenerateRequest, GenerateResponse, SendEmailRequest, SendEmailResponse } from '../types/document.types';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

export const enhanceStory = (data: EnhanceRequest) =>
  api.post<EnhanceResponse>('/enhance', data).then(r => r.data);

export const generatePdf = (data: GenerateRequest) =>
  api.post<GenerateResponse>('/generate', data).then(r => r.data);

export const sendEmail = (data: SendEmailRequest) =>
  api.post<SendEmailResponse>('/send-email', data).then(r => r.data);