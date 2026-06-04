import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

function parseTimeToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(Number.isFinite(h) ? h : 8, Number.isFinite(m) ? m : 0, 0, 0);
  return d;
}

function formatTime24(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

export function formatTime12Label(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

type Props = {
  value: string;
  onChange: (time: string) => void;
  label?: string;
};

export const ReminderTimePickerField = ({ value, onChange, label = 'Select time' }: Props) => {
  const [show, setShow] = useState(false);
  const dateValue = parseTimeToDate(value);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(formatTime24(selected));
  };

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="flex-row items-center bg-primary/5 border border-primary/25 rounded-2xl px-4 py-4 gap-3"
        accessibilityRole="button"
        accessibilityLabel={label}>
        <Clock size={22} color="#7C3AED" />
        <View className="flex-1">
          <Text className="text-[12px] text-foreground-secondary font-semibold">{label}</Text>
          <Text className="text-[18px] font-bold text-primary mt-0.5">{formatTime12Label(value)}</Text>
        </View>
      </Pressable>
      {show ? (
        <DateTimePicker
          value={dateValue}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onPickerChange}
        />
      ) : null}
    </View>
  );
};
