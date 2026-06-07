import type { FAQItem } from '../types';

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I add a new birthday?',
    answer:
      'Tap the "+" button on the bottom navigation bar or go to People > Add Person. Fill in their details including name, birthday, and relationship.',
    category: 'Getting Started',
  },
  {
    id: 'faq-2',
    question: 'Can I import contacts from my phone?',
    answer:
      'Yes! Tap "Import Contacts" from the home screen or people tab. Pick someone from your phone and complete their birthday details.',
    category: 'Getting Started',
  },
  {
    id: 'faq-3',
    question: 'How do birthday reminders work?',
    answer:
      'BirthdayBuddy sends push notifications before each birthday. Go to Settings > Reminder Settings to add multiple schedules with different days-before and times.',
    category: 'Reminders',
  },
  {
    id: 'faq-4',
    question: 'Can I set multiple reminders?',
    answer:
      'Yes! In Reminder Settings you can add, edit, and remove reminder entries. Each entry combines timing (same day, 3/7/10/15 days before, or custom) with a specific notification time.',
    category: 'Reminders',
  },
  {
    id: 'faq-6',
    question: 'How does the AI Wish Generator work?',
    answer:
      "Our AI creates personalized birthday wishes based on the person's details, your relationship, and selected tone. Choose from heartfelt, funny, romantic, or motivational styles.",
    category: 'AI Features',
  },
  {
    id: 'faq-7',
    question: 'Are AI-generated wishes unique?',
    answer:
      "Each wish is generated uniquely based on the person's profile and your customization choices. No two wishes are the same!",
    category: 'AI Features',
  },
  {
    id: 'faq-8',
    question: 'How do I create a birthday card?',
    answer:
      'Go to Card Studio from the Home screen or a person\'s profile. Choose a template, customize it with text and decorations, then share or download.',
    category: 'Cards',
  },
  {
    id: 'faq-9',
    question: 'Can I use my own photos in cards?',
    answer:
      'Absolutely! In the Card Studio editor, you can upload photos from your gallery or take a new photo to add to any card template.',
    category: 'Cards',
  },
  {
    id: 'faq-10',
    question: 'How do I share a birthday card?',
    answer:
      'After creating a card, tap Share. You can share via WhatsApp, Instagram, email, or save it to your gallery.',
    category: 'Cards',
  },
  {
    id: 'faq-13',
    question: 'How do I backup my data?',
    answer:
      'Go to Settings > Backup & Restore and tap "Backup Now" to save a JSON backup to your device. Use "Restore Backup" to replace data from a previous backup.',
    category: 'Data',
  },
  {
    id: 'faq-14',
    question: 'How do I import data with preview?',
    answer:
      'Go to Settings > Backup & Restore > Import Data with Preview. You can review what will be imported before confirming.',
    category: 'Data',
  },
  {
    id: 'faq-18',
    question: 'Is my data secure?',
    answer:
      'Yes! BirthdayBuddy stores your data locally on your device. Your information never leaves your phone unless you choose to export a backup.',
    category: 'Privacy',
  },
  {
    id: 'faq-19',
    question: 'What is the Birthday Streak?',
    answer:
      "Your streak counts consecutive days you've used BirthdayBuddy. It resets if you miss a day. Keep it going for achievements!",
    category: 'Features',
  },
  {
    id: 'faq-22',
    question: 'How do I change my profile photo?',
    answer:
      'Go to your Profile > Edit Profile and tap on the profile photo. You can take a new photo or choose from your gallery.',
    category: 'Account',
  },
];
