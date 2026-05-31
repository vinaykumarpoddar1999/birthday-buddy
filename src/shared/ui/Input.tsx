import { Text, TextInput, View, type TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm text-muted font-medium">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#6B7280"
        className={`rounded-xl border border-surface bg-surface px-4 py-3 text-foreground ${error ? 'border-error' : ''} ${className ?? ''}`}
        {...props}
      />
      {error ? <Text className="text-xs text-error">{error}</Text> : null}
    </View>
  );
}
