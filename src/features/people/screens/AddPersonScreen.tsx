import { zodResolver } from '@hookform/resolvers/zod';
import { feedback } from '@/shared/feedback';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Cake,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  Heart,
  HeartHandshake,
  ImagePlus,
  Gem,
  Star,
  User,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { ProfileAvatar } from '@shared/ui/ProfileAvatar';
import { useProfileStore } from '@features/profile/store/profile.store';
import { usePerson, usePersonMutations } from '@features/people/hooks/usePeople';
import type { EventType, Gender, Person, RelationshipType } from '@/types/entities';
import { isPlaceholderBirthDate } from '@/services/contacts/contacts-import.service';
import { getAge } from '../utils/birthday-utils';

const BOY_IMAGE = require('../../../../assets/images/boy.png');
const GIRL_IMAGE = require('../../../../assets/images/girl.png');

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  nickname: z.string().optional(),
  gender: z.enum(['male', 'female']),
  birthDate: z.string().min(1, 'Date of birth is required'),
  relationship: z.enum(['friend', 'family', 'colleague', 'partner', 'relative']),
  phone: z.string().optional(),
  email: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type PersonEventType = 'birthday' | 'anniversary' | 'wedding' | 'custom';

const EVENT_TABS: { id: PersonEventType; label: string; Icon: LucideIcon }[] = [
  { id: 'birthday', label: 'Birthday', Icon: Cake },
  { id: 'anniversary', label: 'Anniversary', Icon: Heart },
  { id: 'wedding', label: 'Wedding', Icon: Gem },
  { id: 'custom', label: 'Custom', Icon: Star },
];

function mapEventType(type: PersonEventType): EventType {
  if (type === 'wedding') return 'wedding_anniversary';
  return type;
}

function eventTypeFromPerson(type: EventType): PersonEventType {
  if (type === 'wedding_anniversary') return 'wedding';
  if (type === 'custom') return 'custom';
  if (type === 'anniversary') return 'anniversary';
  return 'birthday';
}

function personToFormValues(person: Person): FormValues {
  const gender: FormValues['gender'] =
    person.gender === 'male' || person.gender === 'female' ? person.gender : 'female';
  return {
    fullName: person.fullName,
    nickname: person.nickname ?? '',
    gender,
    birthDate: person.birthDate,
    relationship: person.relationship,
    phone: person.phone ?? '',
    email: person.email ?? '',
  };
}

const RELATIONSHIPS: { value: RelationshipType; label: string }[] = [
  { value: 'friend', label: 'Best Friend' },
  { value: 'family', label: 'Family' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner', label: 'Partner' },
  { value: 'relative', label: 'Relative' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text className="text-[12px] text-foreground-secondary font-semibold mb-1.5 ml-0.5">
      {label}
      {required && <Text className="text-error"> *</Text>}
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

function SectionTitle({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <View className="flex-row items-center gap-2 mb-4">
      <Icon size={16} color="#7C3AED" strokeWidth={2} />
      <Text className="text-[14px] font-bold text-foreground">{title}</Text>
    </View>
  );
}

// ─── Date Picker ───────────────────────────────────────────────────────────

function DatePickerModal({
  visible, value, onConfirm, onClose,
}: { visible: boolean; value: string; onConfirm: (d: string) => void; onClose: () => void }) {
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
            <Text className="text-title font-bold text-foreground">Select Date</Text>
            <Pressable onPress={onClose} className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Day</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {days.map((d) => (
                  <Pressable key={d} onPress={() => setDay(d)}
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
                  <Pressable key={m} onPress={() => setMonth(idx)}
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
                  <Pressable key={y} onPress={() => setYear(y)}
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

// ─── Option Picker ─────────────────────────────────────────────────────────

function OptionPickerModal({
  visible, title, options, selected, onSelect, onClose,
}: {
  visible: boolean; title: string; options: string[];
  selected: string; onSelect: (v: string) => void; onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-5 max-h-[60%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-title font-bold text-foreground">{title}</Text>
            <Pressable onPress={onClose} className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => { onSelect(opt); onClose(); }}
                className={`flex-row items-center justify-between py-3.5 px-4 rounded-xl mb-1.5 ${
                  selected === opt ? 'bg-primary/10' : ''
                }`}>
                <Text className={`text-[15px] ${selected === opt ? 'text-primary font-semibold' : 'text-foreground'}`}>
                  {opt}
                </Text>
                {selected === opt && (
                  <View className="h-5 w-5 rounded-full bg-primary items-center justify-center">
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────

export function AddPersonScreen() {
  const {
    personId: personIdParam,
    prefillName,
    prefillPhone,
    prefillEmail,
    prefillBirthDate,
    prefillAvatarUri,
    queueIds,
    queueIndex: queueIndexParam,
  } = useLocalSearchParams<{
    personId?: string | string[];
    prefillName?: string;
    prefillPhone?: string;
    prefillEmail?: string;
    prefillBirthDate?: string;
    prefillAvatarUri?: string;
    queueIds?: string;
    queueIndex?: string;
  }>();
  const personId = Array.isArray(personIdParam) ? personIdParam[0] : personIdParam;
  const queueIdList = (queueIds ?? '').split(',').filter(Boolean);
  const queueIndex = Number.parseInt(queueIndexParam ?? '0', 10) || 0;
  const isQueueFlow = queueIdList.length > 0;
  const isEditing = Boolean(personId);
  const { data: existingPerson } = usePerson(personId);
  const { addPerson, updatePerson } = usePersonMutations();
  const reminderSettings = useProfileStore((s) => s.reminderSettings);

  const [eventType, setEventType] = useState<PersonEventType>('birthday');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);

  const {
    control, handleSubmit, watch, setValue, getValues, reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      nickname: '',
      gender: 'female',
      birthDate: '',
      relationship: 'friend',
      phone: '',
      email: '',
    },
  });

  const birthDate = watch('birthDate');
  const fullName = watch('fullName');
  const gender = watch('gender');
  const computedAge = birthDate ? (() => { try { return getAge(birthDate); } catch { return null; } })() : null;

  useEffect(() => {
    if (!existingPerson) return;
    const values = personToFormValues(existingPerson);
    if (isPlaceholderBirthDate(values.birthDate)) {
      values.birthDate = '';
    }
    reset(values);
    setEventType(eventTypeFromPerson(existingPerson.eventType));
    if (existingPerson.avatarUri) setProfileImage(existingPerson.avatarUri);
  }, [existingPerson, reset]);

  useEffect(() => {
    if (isEditing || !prefillName) return;
    reset({
      fullName: prefillName,
      nickname: '',
      gender: 'female',
      birthDate: prefillBirthDate ?? '',
      relationship: 'friend',
      phone: prefillPhone ?? '',
      email: prefillEmail ?? '',
    });
    if (prefillAvatarUri) setProfileImage(prefillAvatarUri);
  }, [
    isEditing,
    prefillName,
    prefillPhone,
    prefillEmail,
    prefillBirthDate,
    prefillAvatarUri,
    reset,
  ]);

  const pickImage = useCallback(async (source: 'camera' | 'gallery') => {
    let result: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') { feedback.error('Permission needed', 'Camera access is required.'); return; }
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') { feedback.error('Permission needed', 'Photo library access is required.'); return; }
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    }
    if (!result.canceled && result.assets[0]) setProfileImage(result.assets[0].uri);
  }, []);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const defaultReminderDay = reminderSettings.reminderDaysBefore[0] ?? 3;
      const defaultReminderTime = reminderSettings.defaultTime;

      const payload = {
        fullName: data.fullName,
        nickname: data.nickname,
        gender: data.gender as Gender,
        birthDate: data.birthDate,
        relationship: data.relationship as RelationshipType,
        phone: data.phone,
        email: data.email,
        avatarUri: profileImage ?? undefined,
        favoriteColor: '',
        favoriteCake: '',
        hobbies: [] as string[],
        notes: '',
        reminderDaysBefore: defaultReminderDay,
        reminderTime: defaultReminderTime,
        repeatYearly: true,
        eventType: mapEventType(eventType),
      };

      if (isEditing && personId) {
        await updatePerson({ id: personId, ...payload });
        feedback.success('Person Updated', `${data.fullName} has been saved.`);

        const nextIndex = queueIndex + 1;
        if (isQueueFlow && nextIndex < queueIdList.length) {
          router.replace({
            pathname: '/add-person',
            params: {
              personId: queueIdList[nextIndex],
              queueIds,
              queueIndex: String(nextIndex),
            },
          });
          return;
        }

        if (isQueueFlow) {
          router.replace('/(tabs)/contacts');
          return;
        }

        router.back();
        return;
      }

      await addPerson(payload);
      feedback.success('Person Added', `${data.fullName} has been added.`);
      router.back();
    },
    [
      addPerson,
      updatePerson,
      profileImage,
      eventType,
      isEditing,
      personId,
      isQueueFlow,
      queueIdList,
      queueIndex,
      queueIds,
      reminderSettings,
    ],
  );

  const relLabel = RELATIONSHIPS.find((r) => r.value === watch('relationship'))?.label ?? 'Select';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-border/60 bg-surface">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-background border border-border items-center justify-center"
          accessibilityRole="button">
          <ArrowLeft size={20} color="#374151" />
        </Pressable>
        <View className="flex-1 items-center px-3">
          <Text className="text-[17px] font-bold text-foreground">
            {isQueueFlow
              ? `Complete Details (${queueIndex + 1}/${queueIdList.length})`
              : isEditing
                ? 'Edit Person'
                : 'Add Person'}
          </Text>
          <Text className="text-[12px] text-foreground-secondary mt-0.5">
            {isQueueFlow
              ? 'Add birthday and preferences for this contact'
              : isEditing
                ? 'Update details & reminders'
                : 'Birthday or special day'}
          </Text>
        </View>
        <View className="h-10 w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Event Type */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 py-3 gap-2">
          {EVENT_TABS.map((tab) => {
            const TabIcon = tab.Icon;
            const isActive = eventType === tab.id;
            return (
            <Pressable
              key={tab.id}
              onPress={() => setEventType(tab.id)}
              className={`flex-row items-center px-4 py-2.5 rounded-full gap-1.5 ${
                isActive ? 'bg-primary' : 'bg-white border border-gray-100'
              }`}
              accessibilityRole="button">
              <TabIcon size={14} color={isActive ? '#FFFFFF' : '#7C3AED'} strokeWidth={2} />
              <Text className={`text-[12px] font-semibold ${isActive ? 'text-white' : 'text-foreground-secondary'}`}>
                {tab.label}
              </Text>
            </Pressable>
            );
          })}
        </ScrollView>

        <View className="px-5">
          {/* Photo */}
          <View className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <ProfileAvatar
                  size="lg"
                  profileImage={profileImage}
                  name={fullName}
                  gender={gender}
                  borderClassName="border-2 border-primary/20"
                />
                <View className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary border-2 border-white items-center justify-center">
                  <Camera size={12} color="#FFF" />
                </View>
              </View>
              <View className="flex-1 gap-2">
                <Pressable
                  onPress={() => pickImage('camera')}
                  className="flex-row items-center bg-gray-50 rounded-xl px-3.5 py-2.5 gap-2"
                  accessibilityRole="button">
                  <Camera size={14} color="#7C3AED" />
                  <Text className="text-[13px] font-semibold text-foreground">Take Photo</Text>
                </Pressable>
                <Pressable
                  onPress={() => pickImage('gallery')}
                  className="flex-row items-center bg-gray-50 rounded-xl px-3.5 py-2.5 gap-2"
                  accessibilityRole="button">
                  <ImagePlus size={14} color="#7C3AED" />
                  <Text className="text-[13px] font-semibold text-foreground">Choose Photo</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Basic Info */}
          <View className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <SectionTitle title="Basic Information" icon={User} />

            <Field error={errors.fullName?.message}>
              <FieldLabel label="Full Name" required />
              <Controller control={control} name="fullName"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="e.g. Riya Singh"
                    placeholderTextColor="#C4B5FD"
                    className={`bg-gray-50 border rounded-xl px-4 py-3.5 text-[15px] text-foreground ${
                      errors.fullName ? 'border-error' : 'border-gray-200'
                    }`}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel label="Nickname" />
              <Controller control={control} name="nickname"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="e.g. Riya"
                    placeholderTextColor="#C4B5FD"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-foreground"
                  />
                )}
              />
            </Field>

            <Field error={errors.birthDate?.message}>
              <FieldLabel label="Date of Birth" required />
              <Controller control={control} name="birthDate"
                render={({ field: { value } }) => (
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    className={`flex-row items-center bg-gray-50 border rounded-xl px-4 py-3.5 gap-2 ${
                      errors.birthDate ? 'border-error' : 'border-gray-200'
                    }`}>
                    <Calendar size={16} color="#7C3AED" />
                    <Text className={`text-[15px] flex-1 ${value ? 'text-foreground' : 'text-foreground-muted'}`}>
                      {value ? formatDisplayDate(value) : 'Select date'}
                    </Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </Pressable>
                )}
              />
            </Field>

            {computedAge !== null && (
              <View className="bg-primary/5 rounded-xl px-4 py-3 mb-4 flex-row items-center justify-between">
                <Text className="text-[13px] text-foreground-secondary">Age</Text>
                <Text className="text-[15px] font-bold text-primary">{computedAge} years</Text>
              </View>
            )}

            <View className="mb-1">
              <FieldLabel label="Gender" />
              <Controller control={control} name="gender"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row gap-2">
                    {(
                      [
                        { id: 'female' as const, label: 'Female', image: GIRL_IMAGE },
                        { id: 'male' as const, label: 'Male', image: BOY_IMAGE },
                      ] as const
                    ).map((option) => (
                      <Pressable
                        key={option.id}
                        onPress={() => onChange(option.id)}
                        className={`flex-col items-center px-3 py-3 rounded-xl border gap-2 flex-1 ${
                          value === option.id
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${option.label}`}>
                        <Image
                          source={option.image}
                          style={{ width: 48, height: 48, borderRadius: 24 }}
                          contentFit="cover"
                        />
                        <Text
                          className={`text-[12px] font-semibold ${value === option.id ? 'text-primary' : 'text-foreground-secondary'}`}>
                          {option.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>

          {/* Relationship & Contact */}
          <View className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <SectionTitle title="Relationship & Contact" icon={HeartHandshake} />

            <Field>
              <FieldLabel label="Relationship" required />
              <Pressable
                onPress={() => setShowRelationshipPicker(true)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2"
                accessibilityRole="button">
                <Text className="text-[15px] text-foreground flex-1">{relLabel}</Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>
            </Field>

            <Field>
              <FieldLabel label="Phone Number" />
              <Controller control={control} name="phone"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#C4B5FD"
                    keyboardType="phone-pad"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-foreground"
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel label="Email" />
              <Controller control={control} name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value} onChangeText={onChange} onBlur={onBlur}
                    placeholder="riya@gmail.com"
                    placeholderTextColor="#C4B5FD"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-foreground"
                  />
                )}
              />
            </Field>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-1 bg-white border border-gray-200 rounded-2xl py-4 items-center"
              accessibilityRole="button">
              <Text className="text-[15px] font-bold text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="flex-[2] rounded-2xl py-4 items-center overflow-hidden"
              accessibilityRole="button">
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="flex-row items-center gap-2">
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text className="text-[15px] font-bold text-white">Save Person</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <DatePickerModal
        visible={showDatePicker} value={birthDate}
        onConfirm={(d) => { setValue('birthDate', d, { shouldValidate: true }); setShowDatePicker(false); }}
        onClose={() => setShowDatePicker(false)}
      />
      <OptionPickerModal
        visible={showRelationshipPicker} title="Select Relationship"
        options={RELATIONSHIPS.map((r) => r.label)} selected={relLabel}
        onSelect={(label) => { const r = RELATIONSHIPS.find((x) => x.label === label); if (r) setValue('relationship', r.value, { shouldValidate: true }); }}
        onClose={() => setShowRelationshipPicker(false)}
      />
    </SafeAreaView>
  );
}
