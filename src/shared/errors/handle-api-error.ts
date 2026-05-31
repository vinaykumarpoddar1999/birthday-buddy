import { AppError, ApiError, AuthError, ValidationError } from './app-error';

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>;
    const message =
      typeof record.message === 'string'
        ? record.message
        : 'Something went wrong. Please try again.';

    const statusCode =
      typeof record.status === 'number'
        ? record.status
        : typeof record.statusCode === 'number'
          ? record.statusCode
          : undefined;

    if (statusCode === 401) {
      return new AuthError(message);
    }
    if (statusCode === 400) {
      return new ValidationError(message);
    }
    if (statusCode) {
      return new ApiError(message, statusCode);
    }
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
}
