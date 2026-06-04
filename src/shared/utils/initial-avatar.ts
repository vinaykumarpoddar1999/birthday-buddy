const AVATAR_GRADIENTS: [string, string][] = [
  ['#7C3AED', '#A855F7'],
  ['#6366F1', '#818CF8'],
  ['#3B82F6', '#60A5FA'],
  ['#0EA5E9', '#38BDF8'],
  ['#14B8A6', '#2DD4BF'],
  ['#10B981', '#34D399'],
  ['#059669', '#10B981'],
  ['#F59E0B', '#FBBF24'],
  ['#EA580C', '#FB923C'],
  ['#EF4444', '#F87171'],
  ['#E11D48', '#FB7185'],
  ['#DB2777', '#F472B6'],
  ['#EC4899', '#F9A8D4'],
  ['#A855F7', '#C084FC'],
  ['#8B5CF6', '#A78BFA'],
  ['#4F46E5', '#6366F1'],
  ['#2563EB', '#3B82F6'],
  ['#0891B2', '#22D3EE'],
  ['#0D9488', '#5EEAD4'],
  ['#16A34A', '#4ADE80'],
  ['#CA8A04', '#FACC15'],
  ['#C026D3', '#E879F9'],
  ['#9333EA', '#C084FC'],
  ['#7E22CE', '#A855F7'],
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getInitials(name?: string | null): string {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getAvatarGradient(name?: string | null): [string, string] {
  const key = name?.trim() || '?';
  const index = hashString(key.toLowerCase()) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}
