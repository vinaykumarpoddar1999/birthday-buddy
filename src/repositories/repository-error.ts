import { AppError } from '@shared/errors/app-error';

export class RepositoryError extends AppError {
  constructor(message: string) {
    super(message, 'UNKNOWN');
    this.name = 'RepositoryError';
  }
}
