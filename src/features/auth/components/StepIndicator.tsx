import { Text, View } from 'react-native';

type StepIndicatorProps = {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
};

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <View className="mb-6">
      <View className="flex-row gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            className={`flex-1 h-1 rounded-full ${i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/60' : 'bg-border'}`}
          />
        ))}
      </View>
      {labels?.[currentStep] ? (
        <Text className="text-caption text-foreground-secondary mt-2">{labels[currentStep]}</Text>
      ) : null}
    </View>
  );
}
