import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Palette, Eye, Share2, LayoutTemplate } from 'lucide-react-native';

const STEPS = [
  { num: 1, label: 'Template', Icon: LayoutTemplate },
  { num: 2, label: 'Customize', Icon: Palette },
  { num: 3, label: 'Preview', Icon: Eye },
  { num: 4, label: 'Share', Icon: Share2 },
] as const;

type Props = { currentStep: 1 | 2 | 3 | 4 };

export function StepIndicator({ currentStep }: Props) {
  return (
    <View className="px-5 py-3">
      <View className="flex-row items-center">
        {STEPS.map((step, idx) => {
          const isActive = step.num === currentStep;
          const isDone = step.num < currentStep;
          const isLast = idx === STEPS.length - 1;
          const { Icon } = step;

          return (
            <React.Fragment key={step.num}>
              <View className="items-center" style={{ minWidth: 52 }}>
                {isDone ? (
                  <View className="h-8 w-8 rounded-full items-center justify-center overflow-hidden">
                    <LinearGradient
                      colors={['#22C55E', '#16A34A']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 32,
                        height: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 16,
                      }}>
                      <Check size={15} color="#FFF" strokeWidth={3} />
                    </LinearGradient>
                  </View>
                ) : isActive ? (
                  <View className="h-8 w-8 rounded-full items-center justify-center overflow-hidden">
                    <LinearGradient
                      colors={['#7C3AED', '#5B21B6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 32,
                        height: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 16,
                      }}>
                      <Icon size={14} color="#FFF" strokeWidth={2.5} />
                    </LinearGradient>
                  </View>
                ) : (
                  <View className="h-8 w-8 rounded-full items-center justify-center bg-gray-100 border border-gray-200">
                    <Icon size={14} color="#9CA3AF" strokeWidth={2} />
                  </View>
                )}

                <Text
                  className={`text-[10px] mt-1.5 font-semibold ${
                    isActive
                      ? 'text-primary'
                      : isDone
                        ? 'text-green-600'
                        : 'text-foreground-muted'
                  }`}>
                  {step.label}
                </Text>
              </View>

              {!isLast && (
                <View className="flex-1 mx-1 mb-4">
                  <View className="h-[2.5px] rounded-full overflow-hidden bg-gray-100">
                    {isDone && (
                      <LinearGradient
                        colors={['#22C55E', '#16A34A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 2.5, borderRadius: 2 }}
                      />
                    )}
                    {isActive && (
                      <LinearGradient
                        colors={['#7C3AED', '#C4B5FD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 2.5, width: '50%', borderRadius: 2 }}
                      />
                    )}
                  </View>
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}
