import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

type AuthScreenLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  footer?: ReactNode;
  scrollable?: boolean;
  hero?: ReactNode;
  headerRight?: ReactNode;
};

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  showBack = false,
  onBack,
  footer,
  scrollable = true,
  hero,
  headerRight,
}: AuthScreenLayoutProps) {
  const handleBack = () => {
    if (onBack) onBack();
    else if (router.canGoBack()) router.back();
  };

  const body = (
    <>
      {hero}
      {(title || subtitle) && !hero ? (
        <View className="mb-6">
          {title ? <Text className="text-3xl text-foreground font-bold tracking-tight">{title}</Text> : null}
          {subtitle ? (
            <Text className="text-base text-foreground-secondary mt-2 leading-6">{subtitle}</Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </>
  );

  const scrollContent = (
    <View className="px-6 pt-2 pb-8">
      {body}
    </View>
  );

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#F5F3FF', '#FAFAFA', '#FFFFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="absolute inset-0"
      />
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="flex-row items-center justify-between px-5 pt-2 min-h-[44px]">
          {showBack ? (
            <Pressable
              onPress={handleBack}
              className="h-11 w-11 rounded-full bg-white/80 border border-border/60 items-center justify-center shadow-sm"
              accessibilityRole="button"
              accessibilityLabel="Go back">
              <ArrowLeft size={20} color="#374151" />
            </Pressable>
          ) : (
            <View className="w-11" />
          )}
          {headerRight ?? <View className="w-11" />}
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
          {scrollable ? (
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1 }}>
              {scrollContent}
            </ScrollView>
          ) : (
            <View className="flex-1 px-6 pt-2 pb-8">{body}</View>
          )}
        </KeyboardAvoidingView>

        {footer ? (
          <View className="px-6 pb-4 pt-2 bg-white/60 border-t border-border/30">{footer}</View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}
