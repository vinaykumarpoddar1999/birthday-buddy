/**
 * One-time migration: convert emoji stickers to icon: keys and strip emojis from wish text.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '../src');

const EMOJI_TO_ICON = {
  '🎈': 'balloon', '🎊': 'party-popper', '🎉': 'party-popper', '✨': 'sparkles',
  '🎀': 'gift', '🎂': 'cake', '🎁': 'gift', '🧁': 'cake', '💖': 'heart',
  '❤️': 'heart', '💕': 'heart', '💗': 'heart', '💝': 'gift', '💘': 'heart',
  '💓': 'heart', '🥰': 'heart', '😍': 'heart', '⭐': 'star', '🥳': 'party-popper',
  '👑': 'crown', '💫': 'sparkles', '🎵': 'music', '🪩': 'sparkles', '🎆': 'sparkles',
  '🎇': 'sparkles', '🍾': 'wine', '🥂': 'wine', '🎪': 'party-popper', '⚡': 'zap',
  '🌸': 'flower', '🌹': 'flower2', '🌺': 'flower', '💐': 'flower2', '🌷': 'flower2',
  '🌻': 'flower', '🌼': 'flower', '🍀': 'leaf', '🌿': 'leaf', '🦋': 'sparkles',
  '🕊️': 'sparkles', '🌈': 'rainbow', '🍰': 'cake', '🍩': 'candy', '🍪': 'candy',
  '🍫': 'candy', '🍭': 'candy', '🍬': 'candy', '🕯️': 'sparkles', '🥧': 'cake',
  '🎃': 'sparkles', '🍦': 'candy', '🎭': 'sparkles', '🎨': 'palette', '🎤': 'mic',
  '🎸': 'music', '🎯': 'target', '🎮': 'gamepad', '🏆': 'trophy', '🎲': 'gamepad',
  '🧸': 'baby', '🪄': 'sparkles', '🔮': 'sparkles', '🌴': 'tree-palm', '🍃': 'leaf',
  '☀️': 'sun', '🌙': 'moon', '🪐': 'moon', '📸': 'camera', '💜': 'heart',
  '🤍': 'circle', '💛': 'heart', '💞': 'heart', '🏡': 'heart', '◆': 'circle',
  '◇': 'circle-dot', '✦': 'sparkles', '💑': 'heart', '🫶': 'heart',
};

const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

function emojiToIcon(content) {
  if (content.startsWith('icon:')) return content;
  const key = EMOJI_TO_ICON[content];
  return key ? `icon:${key}` : `icon:sparkles`;
}

function stripEmojis(text) {
  return text.replace(EMOJI_REGEX, '').replace(/\s{2,}/g, ' ').replace(/\s+([.!?,])/g, '$1').trim();
}

function walk(dir, ext, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full, ext, files);
    else if (entry.name.endsWith(ext)) files.push(full);
  }
  return files;
}

// Migrate card templates
const templateFiles = walk(path.join(SRC, 'features/card-studio/templates'), '.ts');
for (const file of templateFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace content: 'emoji' in sticker elements
  content = content.replace(/content: '([^']+)'/g, (match, val) => {
    if (EMOJI_TO_ICON[val] || (val.length <= 4 && EMOJI_REGEX.test(val))) {
      changed = true;
      return `content: '${emojiToIcon(val)}'`;
    }
    return match;
  });

  // Replace decorations arrays
  content = content.replace(/decorations: \[([^\]]+)\]/g, (match, inner) => {
    if (!EMOJI_REGEX.test(inner)) return match;
    changed = true;
    const items = inner.match(/'([^']+)'/g) || [];
    const converted = items.map((i) => {
      const val = i.slice(1, -1);
      return `'${emojiToIcon(val)}'`;
    });
    return `decorations: [${converted.join(', ')}]`;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Template:', path.relative(SRC, file));
  }
}

// Strip emojis from wish data files
const wishFiles = walk(path.join(SRC, 'features/ai-wishes/data'), '.ts');
for (const file of wishFiles) {
  let content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(/text: '([^']*(?:\\.[^']*)*)'/g, (match, text) => {
    const stripped = stripEmojis(text.replace(/\\'/g, "'"));
    if (stripped !== text.replace(/\\'/g, "'")) {
      return `text: '${stripped.replace(/'/g, "\\'")}'`;
    }
    return match;
  });
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log('Wish:', path.relative(SRC, file));
  }
}

console.log('Migration complete.');
