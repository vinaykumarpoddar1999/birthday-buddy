import { Text, TextInput, View, type TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm text-foreground font-medium">{label}</Text> : null}
      <TextInput
        placeholderTextColor="#9CA3AF"
        className={`rounded-xl border bg-white px-4 py-3.5 text-foreground text-base ${error ? 'border-red-400' : 'border-border/60'} ${className ?? ''}`}
        {...props}
      />
      {error ? <Text className="text-xs text-red-500 font-medium">{error}</Text> : null}
    </View>
  );
}
