import React from 'react';
import { Text, View } from 'react-native';

const STEPS = [
  { num: 1, label: 'Template' },
  { num: 2, label: 'Customize' },
  { num: 3, label: 'Preview' },
  { num: 4, label: 'Share' },
];

type Props = { currentStep: 1 | 2 | 3 | 4 };

export function StepIndicator({ currentStep }: Props) {
  return (
    <View className="flex-row items-center px-6 py-2.5">
      {STEPS.map((step, idx) => {
        const isActive = step.num === currentStep;
        const isDone = step.num < currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <React.Fragment key={step.num}>
            <View className="items-center">
              <View
                className={`h-6 w-6 rounded-full items-center justify-center ${
                  isActive ? 'bg-primary' : isDone ? 'bg-primary' : 'bg-gray-200'
                }`}>
                <Text
                  className={`text-[10px] font-bold ${
                    isActive || isDone ? 'text-white' : 'text-gray-400'
                  }`}>
                  {isDone ? '✓' : step.num}
                </Text>
              </View>
              <Text
                className={`text-[9px] mt-1 font-semibold ${
                  isActive ? 'text-primary' : isDone ? 'text-primary/60' : 'text-gray-400'
                }`}>
                {step.label}
              </Text>
            </View>
            {!isLast && (
              <View
                className={`h-[1.5px] flex-1 mx-2 ${
                  isDone ? 'bg-primary/40' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}
