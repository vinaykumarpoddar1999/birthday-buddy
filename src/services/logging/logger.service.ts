import { cacheStorage } from '@/lib/mmkv';

const LOG_KEY = 'app_logs';
const MAX_LOG_LINES = 200;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function appendLog(level: LogLevel, event: string, meta?: Record<string, unknown>) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    meta,
  });

  const existing = cacheStorage.getString(LOG_KEY) ?? '';
  const lines = existing ? existing.split('\n').filter(Boolean) : [];
  lines.push(line);
  if (lines.length > MAX_LOG_LINES) {
    lines.splice(0, lines.length - MAX_LOG_LINES);
  }
  cacheStorage.set(LOG_KEY, lines.join('\n'));

  if (__DEV__) {
    const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    fn(`[${level}] ${event}`, meta ?? '');
  }
}

export const logger = {
  debug: (event: string, meta?: Record<string, unknown>) => appendLog('debug', event, meta),
  info: (event: string, meta?: Record<string, unknown>) => appendLog('info', event, meta),
  warn: (event: string, meta?: Record<string, unknown>) => appendLog('warn', event, meta),
  error: (event: string, meta?: Record<string, unknown>) => appendLog('error', event, meta),
  getRecentLogs: (): string[] => (cacheStorage.getString(LOG_KEY) ?? '').split('\n').filter(Boolean),
  clear: () => cacheStorage.remove(LOG_KEY),
};
