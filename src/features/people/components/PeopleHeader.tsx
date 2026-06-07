import { Plus, Users } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

import { TabScreenHeader } from '@shared/ui/TabScreenHeader';

type PeopleHeaderProps = {
  onAddPress: () => void;
};

export function PeopleHeader({ onAddPress }: PeopleHeaderProps) {
  return (
    <TabScreenHeader
      title="People"
      icon={Users}
      rightAction={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add person"
          onPress={onAddPress}
          className="h-11 flex-row items-center bg-primary rounded-full px-4 gap-1.5"
          style={{
            shadowColor: '#7C3AED',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text className="text-[13px] font-bold text-white">Add</Text>
        </Pressable>
      }
    />
  );
}
