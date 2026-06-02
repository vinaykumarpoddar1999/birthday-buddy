import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { AlertTriangle, ArrowLeft, Check, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '../store/profile.store';

export const DeleteAccountScreen = () => {
  const deleteAccount = useProfileStore((s) => s.deleteAccount);
  const queryClient = useQueryClient();
  const [agreed, setAgreed] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const canDelete = agreed && confirmText === 'DELETE' && !isDeleting;

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    try {
      await deleteAccount();
      await queryClient.invalidateQueries();
      router.replace('/(auth)/welcome');
    } finally {
      setIsDeleting(false);
    }
  };

  const deletedItems = [
    'All saved contacts and birthdays',
    'Generated wishes and history',
    'Created cards and drafts',
    'App preferences and settings',
    'Backup data',
    'Premium subscription data',
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row items-center px-5 py-3">
        <Pressable onPress={() => router.back()} className="mr-3 h-10 w-10 rounded-full bg-surface border border-border items-center justify-center" accessibilityRole="button">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <Text className="text-title text-foreground font-bold">Delete Account</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-32" showsVerticalScrollIndicator={false}>
        {/* Warning Banner */}
        <View className="bg-error/10 rounded-2xl p-4 border border-error/20 mt-4">
          <View className="flex-row items-center gap-2 mb-2">
            <AlertTriangle size={20} color="#EF4444" />
            <Text className="text-[16px] font-bold text-error">Danger Zone</Text>
          </View>
          <Text className="text-[13px] text-error/80 leading-5">
            This action is permanent and cannot be undone. All your data will be permanently deleted.
          </Text>
        </View>

        {/* What will be deleted */}
        <View className="mt-5">
          <Text className="text-[14px] font-bold text-foreground mb-3">What will be deleted:</Text>
          {deletedItems.map((item, i) => (
            <View key={i} className="flex-row items-center gap-2 mb-2">
              <Trash2 size={14} color="#EF4444" />
              <Text className="text-[13px] text-foreground-secondary">{item}</Text>
            </View>
          ))}
        </View>

        {/* Step 1: Checkbox */}
        <View className="mt-6">
          <Text className="text-[14px] font-bold text-foreground mb-3">Step 1: Confirm Understanding</Text>
          <Pressable
            className={`flex-row items-center p-4 rounded-xl border ${agreed ? 'bg-error/5 border-error/30' : 'bg-surface border-border'}`}
            onPress={() => setAgreed(!agreed)}
            accessibilityRole="checkbox">
            <View className={`h-5 w-5 rounded border mr-3 items-center justify-center ${agreed ? 'bg-error border-error' : 'border-border'}`}>
              {agreed && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text className="text-[13px] text-foreground flex-1">I understand this action is permanent and all my data will be deleted.</Text>
          </Pressable>
        </View>

        {/* Step 2: Type DELETE */}
        <View className="mt-5">
          <Text className="text-[14px] font-bold text-foreground mb-3">Step 2: Type DELETE to confirm</Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder='Type "DELETE"'
            placeholderTextColor="#9CA3AF"
            className="bg-surface border border-border rounded-xl px-4 py-3 text-[15px] text-foreground"
            autoCapitalize="characters"
          />
        </View>

        {/* Step 3: Delete Button */}
        <Pressable
          className={`rounded-2xl py-4 mt-6 items-center flex-row justify-center gap-2 ${canDelete ? 'bg-error' : 'bg-error/30'}`}
          onPress={handleDelete}
          disabled={!canDelete}
          accessibilityRole="button">
          <Trash2 size={18} color="#FFFFFF" />
          <Text className="text-[15px] font-bold text-white">Delete My Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
