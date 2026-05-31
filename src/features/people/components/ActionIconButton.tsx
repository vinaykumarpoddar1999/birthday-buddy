import { Pressable } from 'react-native';
import {
  Ellipsis,
  Gift,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from 'lucide-react-native';

import type { ContactAction } from '../types';

type ActionIconButtonProps = {
  action: ContactAction;
  onPress: () => void;
};

const actionIconMap: Record<ContactAction, LucideIcon> = {
  call: Phone,
  message: MessageCircle,
  gift: Gift,
  wish: Send,
  more: Ellipsis,
};

export function ActionIconButton({ action, onPress }: ActionIconButtonProps) {
  const Icon = actionIconMap[action];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${action} action`}
      onPress={onPress}
      className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
      <Icon size={18} color="#7C3AED" />
    </Pressable>
  );
}
