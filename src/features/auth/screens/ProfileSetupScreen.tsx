import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Cake, Check, User, X } from 'lucide-react-native';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { CelebrationBackground } from '@features/auth/components/CelebrationBackground';
import { useProfileStore } from '@features/profile/store/profile.store';
import { ROUTES } from '@/constants/routes';
import { Button } from '@shared/ui';

const BOY_IMAGE = require('../../../../assets/images/boy.png');
const GIRL_IMAGE = require('../../../../assets/images/girl.png');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  birthday: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female']),
});

type FormValues = z.infer<typeof schema>;

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text className="text-[12px] text-foreground-secondary font-semibold mb-1.5 ml-0.5">
      {label}
      {required ? <Text className="text-error"> *</Text> : null}
    </Text>
  );
}

function Field({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      {children}
      {error ? <Text className="text-[11px] text-error mt-1 ml-0.5">{error}</Text> : null}
    </View>
  );
}

function DatePickerModal({
  visible,
  value,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  value: string;
  onConfirm: (d: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(value ? parseInt(value.split('-')[0]) : today.getFullYear() - 25);
  const [month, setMonth] = useState(value ? parseInt(value.split('-')[1]) - 1 : 0);
  const [day, setDay] = useState(value ? parseInt(value.split('-')[2]) : 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-title font-bold text-foreground">Select Date of Birth</Text>
            <Pressable onPress={onClose} className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Day</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {days.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDay(d)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${day === d ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${day === d ? 'text-primary' : 'text-foreground'}`}>
                      {String(d).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Month</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, idx) => (
                  <Pressable
                    key={m}
                    onPress={() => setMonth(idx)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${month === idx ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${month === idx ? 'text-primary' : 'text-foreground'}`}>
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Year</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => setYear(y)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${year === y ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${year === y ? 'text-primary' : 'text-foreground'}`}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <Pressable
            onPress={() => {
              const d = Math.min(day, daysInMonth);
              onConfirm(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
            }}
            className="bg-primary rounded-2xl py-4 items-center">
            <Text className="text-white font-bold text-[15px]">Confirm Date</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ProfileSetupScreen() {
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', birthday: '', gender: 'female' },
  });

  const birthday = watch('birthday');
  const gender = watch('gender');

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      updateProfile({
        fullName: values.fullName.trim(),
        birthday: values.birthday,
        gender: values.gender,
        joinedAt: new Date().toISOString(),
      });
      router.replace(ROUTES.permissions);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1">
      <CelebrationBackground />
      <SafeAreaView className="flex-1">
        <ScrollView
          className="flex-1 px-6"
          contentContainerClassName="pb-10 pt-8"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View className="items-center mb-8">
            <View className="h-16 w-16 rounded-[22px] bg-primary/10 items-center justify-center mb-4">
              <User size={30} color="#7C3AED" strokeWidth={2} />
            </View>
            <Text className="text-[28px] font-bold text-foreground text-center tracking-tight">
              Set Up Your Profile
            </Text>
            <Text className="text-base text-foreground-secondary text-center mt-3 leading-6 px-2">
              Tell us a little about yourself so we can personalize your experience.
            </Text>
          </View>

          <View className="bg-surface/90 rounded-[28px] border border-border/60 p-5 shadow-sm">
            <View className="flex-row items-center gap-2 mb-5">
              <Cake size={16} color="#7C3AED" />
              <Text className="text-[14px] font-bold text-foreground">Basic Information</Text>
            </View>

            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Field error={errors.fullName?.message}>
                  <FieldLabel label="Full Name" required />
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your name"
                    placeholderTextColor="#9CA3AF"
                    className="bg-background border border-border rounded-xl px-4 py-3.5 text-[15px] text-foreground"
                    accessibilityLabel="Full name"
                  />
                </Field>
              )}
            />

            <Field error={errors.birthday?.message}>
              <FieldLabel label="Date of Birth" required />
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-background border border-border rounded-xl px-4 py-3.5 flex-row items-center justify-between"
                accessibilityRole="button"
                accessibilityLabel="Select date of birth">
                <Text className={`text-[15px] ${birthday ? 'text-foreground' : 'text-foreground-secondary'}`}>
                  {birthday ? formatDisplayDate(birthday) : 'Select your birthday'}
                </Text>
                <Cake size={18} color="#7C3AED" />
              </Pressable>
            </Field>

            <Field error={errors.gender?.message}>
              <FieldLabel label="Gender" required />
              <View className="flex-row gap-3">
                {(['female', 'male'] as const).map((option) => {
                  const selected = gender === option;
                  return (
                    <Pressable
                      key={option}
                      onPress={() => setValue('gender', option, { shouldValidate: true })}
                      className={`flex-1 rounded-2xl border p-3 items-center ${
                        selected ? 'border-primary bg-primary/5' : 'border-border bg-background'
                      }`}
                      accessibilityRole="button"
                      accessibilityLabel={option === 'female' ? 'Female' : 'Male'}>
                      <Image
                        source={option === 'female' ? GIRL_IMAGE : BOY_IMAGE}
                        style={{ width: 56, height: 56 }}
                        contentFit="contain"
                      />
                      <Text className={`text-[13px] font-semibold mt-2 capitalize ${selected ? 'text-primary' : 'text-foreground'}`}>
                        {option}
                      </Text>
                      {selected ? (
                        <View className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary items-center justify-center">
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </Field>
          </View>

          <View className="mt-8">
            <Button
              label={saving ? 'Saving…' : 'Continue'}
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={saving}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      <DatePickerModal
        visible={showDatePicker}
        value={birthday}
        onConfirm={(d) => {
          setValue('birthday', d, { shouldValidate: true });
          setShowDatePicker(false);
        }}
        onClose={() => setShowDatePicker(false)}
      />
    </View>
  );
}
