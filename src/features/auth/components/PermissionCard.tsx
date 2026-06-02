import { Shield, type LucideIcon } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

type PermissionCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  granted: boolean;
  onRequest: () => void;
  color?: string;
  bg?: string;
};

export function PermissionCard({
  icon: Icon,
  title,
  description,
  granted,
  onRequest,
  color = '#7C3AED',
  bg = '#EDE9FE',
}: PermissionCardProps) {
  return (
    <View className="bg-surface rounded-2xl p-4 border border-border/60 mb-3">
      <View className="flex-row items-start">
        <View className="h-11 w-11 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: bg }}>
          <Icon size={22} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-foreground">{title}</Text>
          <Text className="text-[13px] text-foreground-secondary mt-1 leading-5">{description}</Text>
          <Pressable
            onPress={onRequest}
            disabled={granted}
            className={`mt-3 py-2.5 rounded-xl items-center ${granted ? 'bg-success/10' : 'bg-primary'}`}
            accessibilityRole="button">
            <Text className={`text-[13px] font-semibold ${granted ? 'text-success' : 'text-white'}`}>
              {granted ? 'Granted ✓' : 'Allow Access'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function PermissionCardPlaceholder() {
  return (
    <View className="items-center py-8">
      <Shield size={48} color="#7C3AED" />
    </View>
  );
}
