import { AppError } from '@shared/errors/app-error';

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 'UNKNOWN');
    this.name = 'DatabaseError';
  }
}

export class MigrationError extends AppError {
  constructor(message: string) {
    super(message, 'UNKNOWN');
    this.name = 'MigrationError';
  }
}
