import { router, type Href } from 'expo-router';
import { Platform } from 'react-native';

import {
  createMinimalPersonFromContact,
  pickSingleContactNative,
  type PickedContact,
} from '@/services/contacts/contacts-import.service';
import { feedback } from '@/shared/feedback';

export function navigateToContactDetailsQueue(personIds: string[]): void {
  if (personIds.length === 0) return;
  router.push({
    pathname: '/contact-details-queue',
    params: { personIds: personIds.join(',') },
  });
}

export async function openContactDetailsFlow(picked: PickedContact): Promise<void> {
  try {
    const personId = await createMinimalPersonFromContact(picked);
    navigateToContactDetailsQueue([personId]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not save contact.';
    feedback.error('Import failed', message);
  }
}

export async function openSelectFromContact(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      const picked = await pickSingleContactNative();
      if (picked) {
        await openContactDetailsFlow(picked);
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
