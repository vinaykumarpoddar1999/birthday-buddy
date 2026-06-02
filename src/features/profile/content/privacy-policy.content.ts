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
      'We collect information you provide directly, such as your name, email, profile photo, birthday entries, reminder preferences, and feedback you submit. We may also collect device identifiers, app version, and usage analytics to improve reliability and features. Contact and calendar data is only accessed when you explicitly grant permission.',
  },
  {
    title: 'How We Use Your Data',
    content:
      'Your data is used to deliver core features: storing birthdays, scheduling reminders, generating AI wishes and cards, syncing optional calendar events, and personalizing your experience. We do not sell your personal information. Aggregated, anonymized data may be used to understand app performance and usage trends.',
  },
  {
    title: 'Data Storage & Security',
    content:
      'Account credentials and sensitive tokens are stored using secure on-device storage (Expo Secure Store). Birthday and profile data may be stored locally and, when you sign in, synced with our backend. We apply industry-standard safeguards including encryption in transit (HTTPS) and access controls on our servers.',
  },
  {
    title: 'Permissions',
    content:
      'The app may request notifications (birthday reminders), contacts (import birthdays), calendar (sync events), camera and photo library (profile and card images), and biometric authentication (optional app lock). You can revoke permissions anytime in your device settings; some features may be limited without them.',
  },
  {
    title: 'Third-Party Services',
    content:
      'We use trusted providers for authentication, cloud storage, analytics, and AI generation. These partners process data only as needed to provide their service and are bound by contractual privacy obligations. Links to external sites are not covered by this policy.',
  },
  {
    title: 'Your Rights',
    content:
      'You may access, update, or delete your profile data from within the app. You can export your data, disable notifications, sign out, or permanently delete your account from Privacy & Security settings. Depending on your region, you may have additional rights to request access, correction, or deletion by contacting support@birthdaybuddy.app.',
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
