export type ErrorCode =
  | 'UNKNOWN'
  | 'API'
  | 'AUTH'
  | 'VALIDATION'
  | 'NETWORK'
  | 'NOT_FOUND'
  | 'FORBIDDEN';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode?: number;

  constructor(message: string, code: ErrorCode = 'UNKNOWN', statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode?: number) {
    super(message, 'API', statusCode);
    this.name = 'ApiError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH', 401);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}
