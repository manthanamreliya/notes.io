import { apiClient } from './apiClient';
import { AxiosError } from 'axios';

export interface ApiBaseResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  errors?: string[];
}

function handleApiError<T = any>(err: unknown): ApiBaseResponse<T> {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as {
      success?: boolean;
      statusCode?: number;
      message?: string;
      errors?: string[];
    };
    return {
      success: false,
      statusCode: data.statusCode || err.response.status,
      message: data.message || 'An error occurred while processing notes.',
      errors: data.errors || [],
    };
  }
  return {
    success: false,
    message: err instanceof Error ? err.message : 'Network error. Please try again.',
  };
}

/**
 * GET /api/admin/notes
 */
export async function getAdminNotes(): Promise<ApiBaseResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<any[]>>('/admin/notes');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/admin/users
 */
export async function getAdminUsers(): Promise<ApiBaseResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<any[]>>('/admin/users');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/admin/notes (Multipart Form Data)
 */
export async function uploadNote(formData: FormData): Promise<ApiBaseResponse<any>> {
  try {
    const response = await apiClient.post<ApiBaseResponse<any>>('/admin/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/admin/notes/:id
 */
export async function deleteNote(id: string): Promise<ApiBaseResponse<void>> {
  try {
    const response = await apiClient.delete<ApiBaseResponse<void>>(`/admin/notes/${id}`);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/notes
 */
export async function getNotes(): Promise<ApiBaseResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<any[]>>('/notes');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/notes/department/:departmentId
 */
export async function getNotesByDepartment(departmentId: string): Promise<ApiBaseResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<any[]>>(`/notes/department/${encodeURIComponent(departmentId)}`);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/notes/:id/view-url
 */
export async function getNoteViewUrl(id: string): Promise<ApiBaseResponse<{ viewUrl: string; expiresAt: number }>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<{ viewUrl: string; expiresAt: number }>>(`/notes/${id}/view-url`);
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * GET /api/departments
 */
export async function getDepartments(): Promise<ApiBaseResponse<any[]>> {
  try {
    const response = await apiClient.get<ApiBaseResponse<any[]>>('/departments');
    return response.data;
  } catch (err) {
    return handleApiError(err);
  }
}
