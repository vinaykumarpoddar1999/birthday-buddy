import { useModalStore } from '@/stores/modal.store';

import { RatePromptModal } from './RatePromptModal';
import { UpdatePromptModal } from './UpdatePromptModal';

export function EngagementPromptHost() {
  const activeModal = useModalStore((s) => s.activeModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return (
    <>
      <RatePromptModal visible={activeModal === 'rate'} onClose={closeModal} />
      <UpdatePromptModal visible={activeModal === 'update'} onClose={closeModal} />
    </>
  );
}
