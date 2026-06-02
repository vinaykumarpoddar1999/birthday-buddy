import { Linking, Platform, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { feedback } from '@/shared/feedback';

export type WishShareChannel =
  | 'whatsapp'
  | 'telegram'
  | 'sms'
  | 'email'
  | 'instagram'
  | 'copy'
  | 'more';

type ShareWishOptions = {
  text: string;
  personName?: string;
};

function buildShareMessage(text: string, personName?: string): string {
  if (personName) {
    return `🎂 Birthday wish for ${personName}:\n\n${text}`;
  }
  return text;
}

async function openUrl(url: string, fallbackMessage: string): Promise<boolean> {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    await Share.share({ message: fallbackMessage });
    return true;
  } catch {
    feedback.error('Unable to share', 'Please try another sharing option.');
    return false;
  }
}

export async function shareWish(channel: WishShareChannel, options: ShareWishOptions): Promise<boolean> {
  const message = buildShareMessage(options.text, options.personName);

  switch (channel) {
    case 'whatsapp': {
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
      const opened = await openUrl(url, message);
      if (!opened) {
        feedback.error('WhatsApp unavailable', 'Install WhatsApp or use Copy / More.');
      }
      return opened;
    }
    case 'telegram': {
      const url = `tg://msg?text=${encodeURIComponent(message)}`;
      const opened = await openUrl(url, message);
      if (!opened) {
        feedback.error('Telegram unavailable', 'Install Telegram or use Copy / More.');
      }
      return opened;
    }
    case 'sms': {
      const separator = Platform.OS === 'ios' ? '&' : '?';
      const url = `sms:${separator}body=${encodeURIComponent(message)}`;
      return openUrl(url, message);
    }
    case 'email': {
      const subject = options.personName
        ? `Happy Birthday, ${options.personName}! 🎂`
        : 'A special birthday wish 🎂';
      const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      return openUrl(url, message);
    }
    case 'instagram': {
      try {
        await Clipboard.setStringAsync(message);
        feedback.success('Copied!', 'Wish copied — paste it in Instagram DM or Story.');
        return true;
      } catch {
        feedback.error('Copy failed', 'Could not copy wish to clipboard.');
        return false;
      }
    }
    case 'copy': {
      try {
        await Clipboard.setStringAsync(message);
        feedback.success('Copied!', 'Wish copied to clipboard.');
        return true;
      } catch {
        feedback.error('Copy failed', 'Could not copy wish to clipboard.');
        return false;
      }
    }
    case 'more': {
      try {
        await Share.share({
          message,
          title: options.personName ? `Birthday wish for ${options.personName}` : 'Birthday wish',
        });
        return true;
      } catch {
        feedback.error('Share cancelled', 'Sharing was not completed.');
        return false;
      }
    }
    default:
      return false;
  }
}
