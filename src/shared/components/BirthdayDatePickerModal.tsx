import { Calendar } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type BirthdayDatePickerModalProps = {
  visible: boolean;
  value: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
  title?: string;
};

export function BirthdayDatePickerModal({
  visible,
  value,
  onConfirm,
  onClose,
  title = 'Select Birthday',
}: BirthdayDatePickerModalProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear() - 25);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);

  useEffect(() => {
    if (!visible) return;
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setYear(parseInt(value.split('-')[0], 10));
      setMonth(parseInt(value.split('-')[1], 10) - 1);
      setDay(parseInt(value.split('-')[2], 10));
    } else {
      setYear(today.getFullYear() - 25);
      setMonth(0);
      setDay(1);
    }
  }, [visible, value, today]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i);

  const handleConfirm = () => {
    const d = Math.min(day, daysInMonth);
    onConfirm(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center gap-2">
              <Calendar size={20} color="#7C3AED" />
              <Text className="text-title font-bold text-foreground">{title}</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Day</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {days.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDay(d)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${day === d ? 'bg-primary/10' : ''}`}
                    accessibilityRole="button">
                    <Text className={`text-[15px] font-semibold ${day === d ? 'text-primary' : 'text-foreground'}`}>
                      {String(d).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Month</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, idx) => (
                  <Pressable
                    key={m}
                    onPress={() => setMonth(idx)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${month === idx ? 'bg-primary/10' : ''}`}
                    accessibilityRole="button">
                    <Text className={`text-[15px] font-semibold ${month === idx ? 'text-primary' : 'text-foreground'}`}>
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Year</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => setYear(y)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${year === y ? 'bg-primary/10' : ''}`}
                    accessibilityRole="button">
                    <Text className={`text-[15px] font-semibold ${year === y ? 'text-primary' : 'text-foreground'}`}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <Pressable
            onPress={handleConfirm}
            className="bg-primary rounded-2xl py-4 items-center"
            accessibilityRole="button"
            accessibilityLabel="Confirm date">
            <Text className="text-white font-bold text-[15px]">Confirm Date</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function formatBirthdayDisplay(value: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Select birthday';
  const [y, m, d] = value.split('-');
  const monthIdx = parseInt(m, 10) - 1;
  return `${parseInt(d, 10)} ${MONTHS[monthIdx] ?? m} ${y}`;
}
