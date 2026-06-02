import type { ExperienceModule, SurpriseExperience, ValidationIssue } from '../types';

export function validateExperience(experience: Partial<SurpriseExperience>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!experience.personalization?.recipientName?.trim()) {
    issues.push({ field: 'recipientName', message: 'Recipient name is required', severity: 'error' });
  }
  if (!experience.personalization?.senderName?.trim()) {
    issues.push({ field: 'senderName', message: 'Sender name is required', severity: 'warning' });
  }
  if (!experience.templateId) {
    issues.push({ field: 'template', message: 'No template selected', severity: 'error' });
  }
  if (!experience.modules?.length) {
    issues.push({ field: 'modules', message: 'Add at least one module', severity: 'warning' });
  }

  experience.modules?.forEach((mod) => {
    validateModule(mod, issues);
  });

  return issues;
}

function validateModule(mod: ExperienceModule, issues: ValidationIssue[]): void {
  switch (mod.type) {
    case 'photo_gallery':
      if (mod.items.length === 0) {
        issues.push({ field: mod.id, message: `${mod.title}: No photos added`, severity: 'warning' });
      }
      mod.items.forEach((item) => {
        if (!item.uri) {
          issues.push({ field: item.id, message: 'Broken or missing image', severity: 'error' });
        }
      });
      break;
    case 'video_memory':
      if (!mod.videoUri) {
        issues.push({ field: mod.id, message: `${mod.title}: No video uploaded`, severity: 'warning' });
      }
      break;
    case 'voice_message':
      if (!mod.audioUri && !mod.transcript.trim()) {
        issues.push({ field: mod.id, message: `${mod.title}: No audio or transcript`, severity: 'warning' });
      }
      break;
    case 'timeline':
      if (mod.events.length === 0) {
        issues.push({ field: mod.id, message: `${mod.title}: No timeline events`, severity: 'warning' });
      }
      break;
    case 'countdown':
      if (!mod.targetDate) {
        issues.push({ field: mod.id, message: `${mod.title}: Countdown date missing`, severity: 'warning' });
      }
      break;
    case 'scratch_card':
      if (!mod.hiddenMessage.trim()) {
        issues.push({ field: mod.id, message: `${mod.title}: Hidden message empty`, severity: 'warning' });
      }
      break;
    case 'quiz':
      if (mod.questions.length === 0) {
        issues.push({ field: mod.id, message: `${mod.title}: No quiz questions`, severity: 'warning' });
      }
      break;
    case 'message':
      if (!mod.content.trim()) {
        issues.push({ field: mod.id, message: `${mod.title}: Message is empty`, severity: 'warning' });
      }
      break;
    default:
      break;
  }
}

export function getCompletionRate(experience: SurpriseExperience, viewedSections: string[]): number {
  if (experience.modules.length === 0) return 0;
  const viewed = new Set(viewedSections);
  const completed = experience.modules.filter((m) => viewed.has(m.id)).length;
  return Math.round((completed / experience.modules.length) * 100);
}
