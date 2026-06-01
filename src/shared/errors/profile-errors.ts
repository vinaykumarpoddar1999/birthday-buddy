import { AppError } from './app-error';

export class ProfileError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'ProfileError';
  }
}

export class SettingsError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'SettingsError';
  }
}

export class BackupError extends AppError {
  constructor(message: string) {
    super(message, 'DATABASE');
    this.name = 'BackupError';
  }
}

export class ImportError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'ImportError';
  }
}

export class ExportError extends AppError {
  constructor(message: string) {
    super(message, 'DATABASE');
    this.name = 'ExportError';
  }
}

export class NotificationError extends AppError {
  constructor(message: string) {
    super(message, 'UNKNOWN');
    this.name = 'NotificationError';
  }
}
