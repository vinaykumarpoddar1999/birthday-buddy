import { Pressable, Text, View } from 'react-native';
import { Delete } from 'lucide-react-native';

type PinKeypadProps = {
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
};

export function PinKeypad({ value, maxLength, onChange, error, label }: PinKeypadProps) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  const handlePress = (key: string) => {
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (key && value.length < maxLength) {
      onChange(value + key);
    }
  };

  return (
    <View className="items-center">
      {label ? <Text className="text-body text-foreground-secondary mb-4">{label}</Text> : null}
      <View className="flex-row gap-3 mb-6">
        {Array.from({ length: maxLength }).map((_, i) => (
          <View
            key={i}
            className={`h-4 w-4 rounded-full ${i < value.length ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </View>
      {error ? <Text className="text-caption text-error mb-4">{error}</Text> : null}
      <View className="flex-row flex-wrap justify-center max-w-[280px]">
        {keys.map((key, i) => (
          <Pressable
            key={`${key}-${i}`}
            onPress={() => handlePress(key)}
            disabled={!key}
            className={`w-[84px] h-[64px] items-center justify-center m-1 rounded-2xl ${key ? 'bg-surface border border-border/60 active:bg-primary/5' : ''}`}
            accessibilityRole="button">
            {key === 'del' ? (
              <Delete size={22} color="#6B7280" />
            ) : key ? (
              <Text className="text-[24px] font-semibold text-foreground">{key}</Text>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
