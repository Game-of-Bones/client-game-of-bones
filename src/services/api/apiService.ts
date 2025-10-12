import apiClient from './interceptors';
import type { ApiResponse } from '../../types/api.types';

class ApiService {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await apiClient.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export default new ApiService();
