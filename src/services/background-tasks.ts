/**
 * Background task definitions must be registered at module scope before the app finishes loading.
 * Import this file once from the root layout.
 */
import '@/services/backup/backup-scheduler.service';
import '@/services/notifications/notification-scheduler.service';
