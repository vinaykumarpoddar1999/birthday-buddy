import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Clock, FileEdit } from 'lucide-react-native';

import { useCardStudioStore } from '../../store/card-studio.store';
import { TemplateThumbnail } from './TemplateThumbnail';
import { templateRegistry } from '../../templates/registry/template-registry';

export function SavedDraftsSection() {
  const drafts = useCardStudioStore((s) => s.drafts);
  const loadDraft = useCardStudioStore((s) => s.loadDraft);
  const deleteDraft = useCardStudioStore((s) => s.deleteDraft);

  const handleLoad = useCallback(
    (id: string) => loadDraft(id),
    [loadDraft],
  );

  if (drafts.length === 0) return null;

  return (
    <View className="mb-5">
      <View className="flex-row items-center px-5 mb-3 gap-2">
        <FileEdit size={15} color="#7C3AED" />
        <Text className="text-[15px] font-bold text-foreground flex-1">Saved Drafts</Text>
        <Text className="text-[10px] text-foreground-muted">{drafts.length} saved</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
        {[...drafts].reverse().slice(0, 10).map((draft) => {
          const template = templateRegistry.getTemplate(draft.templateId);
          return (
            <Pressable
              key={draft.id}
              onPress={() => handleLoad(draft.id)}
              onLongPress={() => deleteDraft(draft.id)}
              className="w-28"
              accessibilityRole="button"
              accessibilityLabel={`Load draft ${draft.name}`}
              accessibilityHint="Long press to delete">
              <View className="rounded-xl overflow-hidden border border-gray-100 bg-white mb-1.5">
                {template ? (
                  <TemplateThumbnail template={template} width={112} />
                ) : (
                  <View className="w-28 h-[140px] bg-gray-100 items-center justify-center">
                    <FileEdit size={20} color="#9CA3AF" />
                  </View>
                )}
              </View>
              <Text className="text-[11px] font-semibold text-foreground" numberOfLines={1}>
                {draft.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-0.5">
                <Clock size={9} color="#9CA3AF" />
                <Text className="text-[9px] text-foreground-muted">
                  {new Date(draft.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
