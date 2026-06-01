/** Strip all emojis from wish data files */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wishDir = path.join(__dirname, '../src/features/ai-wishes/data');

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}]/gu;

function stripEmojis(text) {
  return text
    .replace(EMOJI_REGEX, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.!?,;:])/g, '$1')
    .trim();
}

for (const file of fs.readdirSync(wishDir)) {
  if (!file.endsWith('.ts') || file === 'index.ts') continue;
  const filePath = path.join(wishDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/text: '((?:\\'|[^'])*)'/g, (match, text) => {
    const unescaped = text.replace(/\\'/g, "'");
    const stripped = stripEmojis(unescaped);
    if (stripped === unescaped) return match;
    return `text: '${stripped.replace(/'/g, "\\'")}'`;
  });
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log('Stripped:', file);
  }
}

// Also strip wish-generator.ts
const genPath = path.join(__dirname, '../src/features/ai-wishes/engine/wish-generator.ts');
if (fs.existsSync(genPath)) {
  let content = fs.readFileSync(genPath, 'utf8');
  const newContent = content.replace(/'([^']*(?:\\'[^']*)*)'/g, (match, text) => {
    if (!EMOJI_REGEX.test(text.replace(/\\'/g, "'"))) return match;
    const stripped = stripEmojis(text.replace(/\\'/g, "'"));
    return `'${stripped.replace(/'/g, "\\'")}'`;
  });
  if (newContent !== content) {
    fs.writeFileSync(genPath, newContent);
    console.log('Stripped: wish-generator.ts');
  }
}

console.log('Done.');
