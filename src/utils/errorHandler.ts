import { ApiError } from '../types/api.types';

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.message) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado';
};

export const showErrorNotification = (error: any): void => {
  const message = handleApiError(error);
  console.error(message);
};
