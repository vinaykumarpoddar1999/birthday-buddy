import { router, type Href } from 'expo-router';
import { Platform } from 'react-native';

import {
  pickSingleContactNative,
  type PickedContact,
} from '@/services/contacts/contacts-import.service';
import { feedback } from '@/shared/feedback';

export function navigateToAddPersonWithContact(picked: PickedContact) {
  router.push({
    pathname: '/add-person',
    params: {
      prefillName: picked.fullName,
      prefillPhone: picked.phone ?? '',
      prefillEmail: picked.email ?? '',
      prefillBirthDate: picked.birthDate ?? '',
      prefillAvatarUri: picked.avatarUri ?? '',
    },
  });
}

export async function openSelectFromContact(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      const picked = await pickSingleContactNative();
      if (picked) {
        navigateToAddPersonWithContact(picked);
      }
      return;
    }
    router.push('/contact-picker' as Href);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not open contacts.';
    if (message.toLowerCase().includes('permission')) {
      feedback.error('Permission needed', 'Allow contacts access to pick someone.');
    } else {
      feedback.error('Contacts unavailable', message);
    }
    router.push('/contact-picker' as Href);
  }
}
