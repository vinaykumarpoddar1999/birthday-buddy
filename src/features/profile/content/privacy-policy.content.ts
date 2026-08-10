export interface LegalSection {
  title: string;
  content: string;
}

export const PRIVACY_POLICY_SECTIONS: LegalSection[] = [
  {
    title: 'Introduction',
    content:
      'BirthdayBuddy ("we", "our", or "us") respects your privacy. This policy explains what data we collect, how we use it, and the choices you have when using our mobile application.',
  },
  {
    title: 'Data We Collect',
    content:
      'We collect information you provide directly, such as your name, email (optional), profile photo, birthday entries, reminder preferences, cards, wishes, and feedback you submit. The app stores a device identifier locally to support backups and database integrity. Contact data is only accessed when you explicitly grant permission to import birthdays. We do not collect usage analytics or advertising identifiers in the current offline release.',
  },
  {
    title: 'How We Use Your Data',
    content:
      'Your data is used to deliver core features: storing birthdays, scheduling reminders, generating wishes and cards, and personalizing your experience on your device. We do not sell your personal information. Data stays on your device unless you choose to export or share it.',
  },
  {
    title: 'Data Storage & Security',
    content:
      'BirthdayBuddy is offline-first. Profile and birthday data are stored locally in an on-device SQLite database. Sensitive credentials and encryption keys use Expo Secure Store. Backups you create are saved to a file you control. When you open external links (privacy policy, terms, support), those requests use HTTPS.',
  },
  {
    title: 'Permissions',
    content:
      'The app may request notifications (birthday reminders and alarms), contacts (import birthdays), camera and photo library (profile and card images). Calendar sync settings are stored locally; native calendar access is only used when you enable sync in a future update. You can revoke permissions anytime in device settings; some features may be limited without them.',
  },
  {
    title: 'Third-Party Services',
    content:
      'The offline release does not send your birthday data to third-party servers. Optional links open our website for legal documents and support email. If we add cloud sync or AI features in a future update, we will update this policy and the Play Store Data Safety section before enabling them.',
  },
  {
    title: 'Your Rights',
    content:
      'You may access, update, or delete your profile data from within the app. You can export your data, disable notifications, or wipe all local data from Backup & Restore or Privacy & Security settings. For questions or deletion requests, contact support@birthdaybuddy.app.',
  },
  {
    title: 'Children\'s Privacy',
    content:
      'BirthdayBuddy is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us data, contact us and we will delete it promptly.',
  },
  {
    title: 'Policy Updates',
    content:
      'We may update this policy from time to time. Material changes will be reflected in the app with an updated effective date. Continued use after changes constitutes acceptance of the revised policy.',
  },
  {
    title: 'Contact Us',
    content:
      'For privacy questions or requests, email support@birthdaybuddy.app. We aim to respond within a reasonable timeframe.',
  },
];
