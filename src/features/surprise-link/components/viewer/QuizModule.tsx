import React, { memo, useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Award, Check, X } from 'lucide-react-native';

import type { ExperienceModule, ExperienceTheme } from '../../types';

interface QuizModuleProps {
  module: Extract<ExperienceModule, { type: 'quiz' }>;
  theme: ExperienceTheme;
  interactive?: boolean;
  onComplete?: () => void;
}

export const QuizModule = memo(function QuizModule({
  module,
  theme,
  interactive = false,
  onComplete,
}: QuizModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const question = module.questions[currentIndex];

  const handleAnswer = useCallback(
    (optionId: string, isCorrect: boolean) => {
      if (selectedOptionId || !interactive) return;
      setSelectedOptionId(optionId);
      const nextScore = isCorrect ? score + 1 : score;
      setScore(nextScore);

      setTimeout(() => {
        if (currentIndex >= module.questions.length - 1) {
          setFinished(true);
          onComplete?.();
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedOptionId(null);
        }
      }, 800);
    },
    [selectedOptionId, interactive, score, currentIndex, module.questions.length, onComplete],
  );

  if (module.questions.length === 0) {
    return (
      <View className="mt-3 p-4 rounded-2xl items-center" style={{ backgroundColor: `${theme.primaryColor}10` }}>
        <Text style={{ color: theme.textColor, fontSize: 13, opacity: 0.5 }}>
          Add quiz questions in the studio
        </Text>
      </View>
    );
  }

  if (finished || (!interactive && module.questions.length > 0)) {
    const pct = module.questions.length > 0 ? Math.round((score / module.questions.length) * 100) : 0;
    return (
      <Animated.View
        entering={ZoomIn.springify().damping(14)}
        className="mt-3 p-6 rounded-2xl items-center"
        style={{ backgroundColor: `${theme.accentColor}18` }}>
        <View
          className="h-16 w-16 rounded-full items-center justify-center mb-3"
          style={{ backgroundColor: `${theme.accentColor}30` }}>
          <Award size={32} color={theme.accentColor} />
        </View>
        <Text style={{ color: theme.textColor, fontSize: 22, fontWeight: '900' }}>
          {interactive ? `${score}/${module.questions.length}` : `${module.questions.length} questions`}
        </Text>
        {interactive && (
          <Text style={{ color: theme.primaryColor, fontSize: 13, fontWeight: '700', marginTop: 4 }}>
            {pct >= 80 ? 'Amazing! 🎉' : pct >= 50 ? 'Good job! 👏' : 'Nice try! 💪'}
          </Text>
        )}
        <Text style={{ color: theme.textColor, fontSize: 13, marginTop: 8, textAlign: 'center', opacity: 0.8 }}>
          {module.rewardMessage || 'Great job completing the quiz!'}
        </Text>
      </Animated.View>
    );
  }

  return (
    <View className="mt-3">
      <View className="flex-row items-center justify-between mb-3">
        <Text style={{ color: theme.primaryColor, fontSize: 11, fontWeight: '800' }}>
          Question {currentIndex + 1}/{module.questions.length}
        </Text>
        <View className="flex-row items-center rounded-full px-3 py-1" style={{ backgroundColor: `${theme.primaryColor}15` }}>
          <Text style={{ color: theme.primaryColor, fontSize: 11, fontWeight: '700' }}>
            Score: {score}
          </Text>
        </View>
      </View>

      <View className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: `${theme.primaryColor}15` }}>
        <View
          className="h-full rounded-full"
          style={{
            backgroundColor: theme.primaryColor,
            width: `${((currentIndex + 1) / module.questions.length) * 100}%`,
          }}
        />
      </View>

      <Animated.View entering={FadeIn.duration(300)} key={`q-${currentIndex}`}>
        <Text style={{ color: theme.textColor, fontSize: 16, fontWeight: '800', marginBottom: 16, lineHeight: 24 }}>
          {question.question || 'Quiz question'}
        </Text>
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id;
          const showResult = !!selectedOptionId;
          const isCorrect = opt.isCorrect;
          let bgColor = `${theme.primaryColor}08`;
          let borderColor = `${theme.primaryColor}20`;

          if (showResult && isSelected) {
            bgColor = isCorrect ? '#22C55E20' : '#EF444420';
            borderColor = isCorrect ? '#22C55E' : '#EF4444';
          } else if (showResult && isCorrect) {
            bgColor = '#22C55E10';
            borderColor = '#22C55E60';
          }

          return (
            <Animated.View key={opt.id} entering={FadeInDown.delay(idx * 80).duration(300)}>
              <Pressable
                onPress={() => handleAnswer(opt.id, opt.isCorrect)}
                disabled={!!selectedOptionId}
                accessibilityRole="button"
                className="mb-2.5 p-4 rounded-2xl flex-row items-center border"
                style={{ backgroundColor: bgColor, borderColor }}>
                <View
                  className="h-8 w-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: showResult && (isSelected || isCorrect) ? borderColor : `${theme.primaryColor}15` }}>
                  {showResult && isSelected ? (
                    isCorrect ? <Check size={16} color="#FFF" /> : <X size={16} color="#FFF" />
                  ) : (
                    <Text style={{ color: theme.primaryColor, fontSize: 13, fontWeight: '800' }}>
                      {String.fromCharCode(65 + idx)}
                    </Text>
                  )}
                </View>
                <Text
                  className="flex-1"
                  style={{ color: theme.textColor, fontSize: 14, fontWeight: '600', lineHeight: 20 }}>
                  {opt.text || 'Option'}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
});
