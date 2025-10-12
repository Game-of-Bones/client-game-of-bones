export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { data?: { message?: string } } };
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }

  return 'Ha ocurrido un error inesperado';
};

export const showErrorNotification = (error: unknown): void => {
  const message = handleApiError(error);
  console.error(message);
};
