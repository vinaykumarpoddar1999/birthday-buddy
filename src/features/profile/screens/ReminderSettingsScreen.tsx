import { router } from 'expo-router';
import { ArrowLeft, Bell, Clock, Plus, Trash2 } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReminderTimePickerField } from '@/shared/ui/ReminderTimePickerField';
import { generateUuidSync } from '@/utils/uuid';
import type { ReminderEntry } from '../types';
import { useProfileStore } from '../store/profile.store';
import {
  PRESET_DAYS_BEFORE,
  createReminderEntry,
  formatDaysBeforeLabel,
  formatReminderTime,
  normalizeReminderSettings,
} from '../utils/reminder-settings.utils';

type EditorState = {
  visible: boolean;
  editingId: string | null;
  daysBefore: number;
  customDays: string;
  time: string;
};

const INITIAL_EDITOR: EditorState = {
  visible: false,
  editingId: null,
  daysBefore: 7,
  customDays: '',
  time: '08:00',
};

export const ReminderSettingsScreen = () => {
  const reminderSettings = useProfileStore((s) => s.reminderSettings);
  const update = useProfileStore((s) => s.updateReminderSettings);
  const normalized = useMemo(() => normalizeReminderSettings(reminderSettings), [reminderSettings]);
  const [entries, setEntries] = useState<ReminderEntry[]>(normalized.reminderEntries);
  const [editor, setEditor] = useState<EditorState>(INITIAL_EDITOR);

  const openAdd = () => {
    setEditor({
      visible: true,
      editingId: null,
      daysBefore: 7,
      customDays: '',
      time: reminderSettings.defaultTime,
    });
  };

  const openEdit = (entry: ReminderEntry) => {
    const isPreset = (PRESET_DAYS_BEFORE as readonly number[]).includes(entry.daysBefore);
    setEditor({
      visible: true,
      editingId: entry.id,
      daysBefore: isPreset ? entry.daysBefore : -1,
      customDays: isPreset ? '' : String(entry.daysBefore),
      time: entry.time,
    });
  };

  const closeEditor = () => setEditor(INITIAL_EDITOR);

  const resolveDaysBefore = (): number | null => {
    if (editor.daysBefore === -1) {
      const custom = Number.parseInt(editor.customDays, 10);
      if (!Number.isFinite(custom) || custom < 0 || custom > 365) return null;
      return custom;
    }
    return editor.daysBefore;
  };

  const saveEditor = () => {
    const daysBefore = resolveDaysBefore();
    if (daysBefore === null) return;

    const nextEntry: ReminderEntry = {
      id: editor.editingId ?? generateUuidSync(),
      daysBefore,
      time: editor.time,
    };

    setEntries((current) => {
      if (editor.editingId) {
        return current.map((e) => (e.id === editor.editingId ? nextEntry : e));
      }
      return [...current, nextEntry];
    });
    closeEditor();
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((e) => e.id !== id));
  };

  const handleSaveAll = () => {
    const next = normalizeReminderSettings({
      ...reminderSettings,
      reminderEntries: entries,
    });
    update({
      reminderEntries: next.reminderEntries,
      reminderDaysBefore: next.reminderDaysBefore,
      multipleReminderTimes: next.multipleReminderTimes,
      defaultTime: next.defaultTime,
      timingMode: 'flexible',
    });
    router.back();
  };

  const sortedEntries = [...entries].sort((a, b) => b.daysBefore - a.daysBefore || a.time.localeCompare(b.time));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Go back">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold flex-1">Reminder Settings</Text>
        <Pressable onPress={handleSaveAll} accessibilityRole="button" accessibilityLabel="Save reminders">
          <Text className="text-body font-bold text-primary">Save</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        <View className="bg-primary/5 rounded-2xl p-4 mt-4 mb-5 border border-primary/10">
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 rounded-xl bg-primary/10 items-center justify-center">
              <Bell size={22} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-bold text-foreground">Multiple Reminders</Text>
              <Text className="text-[12px] text-foreground-secondary mt-0.5 leading-5">
                Add schedules with different timing and notification times for all birthdays.
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase">
            Your Reminders ({sortedEntries.length})
          </Text>
          <Pressable
            onPress={openAdd}
            className="flex-row items-center gap-1.5 bg-primary rounded-full px-3 py-1.5"
            accessibilityRole="button"
            accessibilityLabel="Add reminder">
            <Plus size={14} color="#FFFFFF" />
            <Text className="text-[12px] font-bold text-white">Add</Text>
          </Pressable>
        </View>

        {sortedEntries.length === 0 ? (
          <View className="bg-surface rounded-2xl border border-border/60 p-6 items-center">
            <Clock size={28} color="#9CA3AF" />
            <Text className="text-[15px] font-semibold text-foreground mt-3">No reminders yet</Text>
            <Text className="text-[13px] text-foreground-secondary text-center mt-1">
              Tap Add to create your first reminder schedule.
            </Text>
          </View>
        ) : (
          sortedEntries.map((entry) => (
            <Pressable
              key={entry.id}
              onPress={() => openEdit(entry)}
              className="bg-surface rounded-2xl border border-border/60 px-4 py-3.5 mb-2.5 flex-row items-center"
              accessibilityRole="button"
              accessibilityLabel={`Edit reminder ${formatDaysBeforeLabel(entry.daysBefore)}`}>
              <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
                <Clock size={18} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-foreground">
                  {formatDaysBeforeLabel(entry.daysBefore)}
                </Text>
                <Text className="text-[12px] text-foreground-secondary mt-0.5">
                  {formatReminderTime(entry.time)}
                </Text>
              </View>
              <Pressable
                onPress={() => removeEntry(entry.id)}
                hitSlop={8}
                className="h-9 w-9 rounded-full bg-error/10 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Remove reminder">
                <Trash2 size={16} color="#EF4444" />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Modal visible={editor.visible} transparent animationType="slide" onRequestClose={closeEditor}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-5 max-h-[85%]">
            <Text className="text-title font-bold text-foreground mb-1">
              {editor.editingId ? 'Edit Reminder' : 'Add Reminder'}
            </Text>
            <Text className="text-[13px] text-foreground-secondary mb-5">Choose when and what time to notify.</Text>

            <Text className="text-[11px] font-bold text-foreground-secondary tracking-wider uppercase mb-2">
              Reminder Timing
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {PRESET_DAYS_BEFORE.map((days) => {
                const selected = editor.daysBefore === days;
                return (
                  <Pressable
                    key={days}
                    onPress={() => setEditor((s) => ({ ...s, daysBefore: days, customDays: '' }))}
                    className={`rounded-xl px-3 py-2 border ${selected ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                    accessibilityRole="button">
                    <Text className={`text-[13px] font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>
                      {formatDaysBeforeLabel(days)}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable
                onPress={() => setEditor((s) => ({ ...s, daysBefore: -1 }))}
                className={`rounded-xl px-3 py-2 border ${editor.daysBefore === -1 ? 'bg-primary/10 border-primary' : 'bg-surface border-border'}`}
                accessibilityRole="button">
                <Text className={`text-[13px] font-semibold ${editor.daysBefore === -1 ? 'text-primary' : 'text-foreground'}`}>
                  Custom
                </Text>
              </Pressable>
            </View>

            {editor.daysBefore === -1 ? (
              <View className="mb-4">
                <Text className="text-[12px] text-foreground-secondary font-semibold mb-1.5">Custom Days Before</Text>
                <TextInput
                  value={editor.customDays}
                  onChangeText={(v) => setEditor((s) => ({ ...s, customDays: v.replace(/[^0-9]/g, '') }))}
                  keyboardType="number-pad"
                  placeholder="e.g. 5"
                  placeholderTextColor="#9CA3AF"
                  className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground"
                  accessibilityLabel="Custom days before"
                />
              </View>
            ) : null}

            <ReminderTimePickerField
              value={editor.time}
              onChange={(time) => setEditor((s) => ({ ...s, time }))}
              label="Reminder Time"
            />

            <View className="flex-row gap-3 mt-6">
              <Pressable
                onPress={closeEditor}
                className="flex-1 rounded-2xl py-4 items-center border border-border bg-surface"
                accessibilityRole="button">
                <Text className="text-[15px] font-semibold text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={saveEditor}
                className="flex-1 rounded-2xl py-4 items-center bg-primary"
                accessibilityRole="button">
                <Text className="text-[15px] font-bold text-white">
                  {editor.editingId ? 'Update' : 'Add Reminder'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
