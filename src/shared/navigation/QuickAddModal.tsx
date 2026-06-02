import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BookUser, UserPlus, X } from 'lucide-react-native';

import { scale } from '@features/home/constants/design-tokens';

type QuickAddModalProps = {
  visible: boolean;
  onClose: () => void;
  onAddManually: () => void;
  onSelectFromContact: () => void;
};

export function QuickAddModal({
  visible,
  onClose,
  onAddManually,
  onSelectFromContact,
}: QuickAddModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={styles.modalOverlay}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close add menu">
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quick Add</Text>
            <Pressable
              onPress={onClose}
              style={styles.modalClose}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          <Pressable
            onPress={onAddManually}
            style={styles.modalOption}
            accessibilityRole="button"
            accessibilityLabel="Add person manually">
            <View style={[styles.modalOptionIcon, { backgroundColor: '#7C3AED' }]}>
              <UserPlus size={22} color="#FFFFFF" />
            </View>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Add Person Manually</Text>
              <Text style={styles.modalOptionSub}>
                Enter details yourself with birthday and reminders
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={onSelectFromContact}
            style={[styles.modalOption, { marginTop: scale(12) }]}
            accessibilityRole="button"
            accessibilityLabel="Select from contact">
            <View style={[styles.modalOptionIcon, { backgroundColor: '#EC4899' }]}>
              <BookUser size={22} color="#FFFFFF" />
            </View>
            <View style={styles.modalOptionText}>
              <Text style={styles.modalOptionTitle}>Select from Contact</Text>
              <Text style={styles.modalOptionSub}>
                Pick a contact and complete their birthday details
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(28),
    borderTopRightRadius: scale(28),
    paddingHorizontal: scale(20),
    paddingTop: scale(20),
    paddingBottom: scale(36),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: '#0F172A',
  },
  modalClose: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    borderRadius: scale(18),
    backgroundColor: '#F8F6FC',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.1)',
  },
  modalOptionIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: '#0F172A',
  },
  modalOptionSub: {
    fontSize: scale(12),
    color: '#64748B',
    marginTop: scale(2),
  },
});
