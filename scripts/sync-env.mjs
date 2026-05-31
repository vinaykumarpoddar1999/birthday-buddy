import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const envPath = join(root, '.env');
const examplePath = join(root, '.env.example');

if (!existsSync(envPath)) {
  copyFileSync(examplePath, envPath);
  console.log('Created .env from .env.example');
}

function upsertEnv(lines) {
  const current = readFileSync(envPath, 'utf8');
  const map = new Map(
    current
      .split('\n')
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx), line.slice(idx + 1)];
      }),
  );

  for (const [key, value] of Object.entries(lines)) {
    if (value) map.set(key, value);
  }

  const header = [
    '# BirthdayBuddy — auto-synced where possible',
    '# Remote: Supabase Dashboard → Project Settings → API',
    '# Local: run npm run supabase:start (requires Docker)',
    '',
  ];

  const body = [...map.entries()].map(([k, v]) => `${k}=${v}`).join('\n');
  writeFileSync(envPath, `${header.join('\n')}${body}\n`, 'utf8');
}

try {
  const output = execSync('npx supabase status -o env', {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  const parsed = {};
  for (const line of output.split('\n')) {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (key === 'API_URL') parsed.EXPO_PUBLIC_SUPABASE_URL = value;
    if (key === 'ANON_KEY') parsed.EXPO_PUBLIC_SUPABASE_ANON_KEY = value;
  }

  if (parsed.EXPO_PUBLIC_SUPABASE_URL && parsed.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    upsertEnv(parsed);
    console.log('Synced .env from local Supabase (supabase status).');
  } else {
    console.log('Supabase running but keys not found. Edit .env manually.');
  }
} catch {
  console.log(
    'Local Supabase not running. Copy keys from https://supabase.com/dashboard → Settings → API into .env',
  );
}
