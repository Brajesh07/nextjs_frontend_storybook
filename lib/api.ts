import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse,
  StoryGenerationRequest,
  StoryGenerationResponse,
  CharacterGenerationRequest,
  CharacterGenerationResponse,
  PDFGenerationRequest,
  PDFGenerationResponse,
  SessionData
} from '@/types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  timeout: 300000, // 5 minutes for large operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    console.error('❌ API Response Error:', message);
    
    // Create a user-friendly error object
    const apiError = {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(apiError);
  }
);

// API Client Class
export class ApiClient {
  
  /**
   * Generate a personalized story
   */
  static async generateStory(data: StoryGenerationRequest): Promise<StoryGenerationResponse> {
    try {
      const response = await api.post<ApiResponse<StoryGenerationResponse>>('/api/story/generate', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to generate story');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate story');
    }
  }

  /**
   * Upload character photo
   */
  static async uploadPhoto(file: File, sessionId: string): Promise<{ imageUrl: string; provider: string }> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('sessionId', sessionId);

      const response = await api.post<ApiResponse<{ imageUrl: string; provider: string }>>(
        '/api/upload', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              // You can emit progress events here if needed
              console.log(`Upload progress: ${progress}%`);
            }
          },
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to upload photo');
      }

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload photo');
    }
  }

  /**
   * Generate character images
   */
  static async generateCharacterImages(data: CharacterGenerationRequest): Promise<CharacterGenerationResponse> {
    try {
      const response = await api.post<ApiResponse<CharacterGenerationResponse>>('/api/character/generate', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to generate character images');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate character images');
    }
  }

  /**
   * Generate PDF storybook
   */
  static async generatePDF(data: PDFGenerationRequest): Promise<PDFGenerationResponse> {
    try {
      const response = await api.post<ApiResponse<PDFGenerationResponse>>('/api/pdf/generate', data);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to generate PDF');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to generate PDF');
    }
  }

  /**
   * Get session data
   */
  static async getSessionData(sessionId: string): Promise<SessionData> {
    try {
      const response = await api.get<ApiResponse<SessionData>>(`/api/session/${sessionId}`);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to get session data');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get session data');
    }
  }

  /**
   * Download PDF file
   */
  static async downloadPDF(sessionId: string): Promise<Blob> {
    try {
      const response = await api.get(`/api/pdf/download/${sessionId}`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to download PDF');
    }
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await api.get<ApiResponse<{ status: string; timestamp: string }>>('/api/health');
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Health check failed');
      }
      
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message || 'Health check failed');
    }
  }

  /**
   * Get image URL for display
   */
  static getImageUrl(filename: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return `${baseUrl}/api/image/${filename}`;
  }
}

// Utility functions for API responses
export const isApiError = (error: any): error is { message: string; status?: number; data?: any } => {
  return error && typeof error.message === 'string';
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Export the configured axios instance for direct use if needed
export { api };

// Default export
export default ApiClient;