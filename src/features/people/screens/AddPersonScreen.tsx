import { zodResolver } from '@hookform/resolvers/zod';
import { feedback } from '@/shared/feedback';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Cake,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Gift,
  Heart,
  HeartHandshake,
  ImagePlus,
  Plus,
  Gem,
  Sparkles,
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
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { ProfilePlaceholder } from '@shared/ui/ProfilePlaceholder';
import { usePerson, usePersonMutations } from '@features/people/hooks/usePeople';
import type { EventType, Gender, Person, RelationshipType } from '@/types/entities';
import { isPlaceholderBirthDate } from '@/services/contacts/contacts-import.service';
import { getAge } from '../utils/birthday-utils';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  nickname: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  birthDate: z.string().min(1, 'Date of birth is required'),
  relationship: z.enum(['friend', 'family', 'colleague', 'partner', 'relative']),
  phone: z.string().optional(),
  email: z.string().optional(),
  favoriteColor: z.string().optional(),
  favoriteCake: z.string().optional(),
  hobbies: z.array(z.string()),
  notes: z.string().optional(),
  reminderDaysBefore: z.number().min(0).max(30),
  reminderTime: z.string(),
  repeatYearly: z.boolean(),
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
  return {
    fullName: person.fullName,
    nickname: person.nickname ?? '',
    gender: person.gender,
    birthDate: person.birthDate,
    relationship: person.relationship,
    phone: person.phone ?? '',
    email: person.email ?? '',
    favoriteColor: person.favoriteColor ?? '',
    favoriteCake: person.favoriteCake ?? '',
    hobbies: person.hobbies ?? [],
    notes: person.notes ?? '',
    reminderDaysBefore: person.reminderDaysBefore,
    reminderTime: person.reminderTime,
    repeatYearly: person.repeatYearly,
  };
}

const RELATIONSHIPS: { value: RelationshipType; label: string }[] = [
  { value: 'friend', label: 'Best Friend' },
  { value: 'family', label: 'Family' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'partner', label: 'Partner' },
  { value: 'relative', label: 'Relative' },
];

const FAVORITE_COLORS = [
  'Purple', 'Pink', 'Blue', 'Green', 'Red', 'Orange', 'Yellow', 'Teal', 'Coral', 'Gold',
];

const FAVORITE_CAKES = [
  'Chocolate Truffle', 'Black Forest', 'Red Velvet', 'Vanilla', 'Strawberry',
  'Butterscotch', 'Pineapple', 'Mango', 'Blueberry Cheesecake', 'Tiramisu',
];

const REMINDER_DAYS = [0, 1, 2, 3, 5, 7, 10, 14];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
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

// ─── Time Picker ───────────────────────────────────────────────────────────

function TimePickerModal({
  visible, value, onConfirm, onClose,
}: { visible: boolean; value: string; onConfirm: (t: string) => void; onClose: () => void }) {
  const [hour, setHour] = useState(parseInt(value.split(':')[0]) || 8);
  const [minute, setMinute] = useState(parseInt(value.split(':')[1]) || 0);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-title font-bold text-foreground">Select Time</Text>
            <Pressable onPress={onClose} className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
              <X size={18} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Hour</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {hours.map((h) => (
                  <Pressable key={h} onPress={() => setHour(h)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${hour === h ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${hour === h ? 'text-primary' : 'text-foreground'}`}>
                      {String(h).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Minute</Text>
              <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
                {minutes.map((m) => (
                  <Pressable key={m} onPress={() => setMinute(m)}
                    className={`py-2.5 rounded-xl mb-1 items-center ${minute === m ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${minute === m ? 'text-primary' : 'text-foreground'}`}>
                      {String(m).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <Pressable
            onPress={() => onConfirm(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)}
            className="bg-primary rounded-2xl py-4 items-center">
            <Text className="text-white font-bold text-[15px]">Confirm Time</Text>
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

  const [eventType, setEventType] = useState<PersonEventType>('birthday');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [hobbyInput, setHobbyInput] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCakePicker, setShowCakePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

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
      favoriteColor: '',
      favoriteCake: '',
      hobbies: [],
      notes: '',
      reminderDaysBefore: 3,
      reminderTime: '08:00',
      repeatYearly: true,
    },
  });

  const birthDate = watch('birthDate');
  const hobbies = watch('hobbies');
  const gender = watch('gender');
  const reminderDays = watch('reminderDaysBefore');
  const reminderTime = watch('reminderTime');
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
      favoriteColor: '',
      favoriteCake: '',
      hobbies: [],
      notes: '',
      reminderDaysBefore: 3,
      reminderTime: '08:00',
      repeatYearly: true,
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

  const addHobby = useCallback(() => {
    const trimmed = hobbyInput.trim();
    if (!trimmed) return;
    const current = getValues('hobbies');
    if (!current.includes(trimmed)) setValue('hobbies', [...current, trimmed]);
    setHobbyInput('');
  }, [hobbyInput, getValues, setValue]);

  const removeHobby = useCallback(
    (h: string) => setValue('hobbies', getValues('hobbies').filter((x) => x !== h)),
    [getValues, setValue],
  );

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const payload = {
        fullName: data.fullName,
        nickname: data.nickname,
        gender: data.gender as Gender,
        birthDate: data.birthDate,
        relationship: data.relationship as RelationshipType,
        phone: data.phone,
        email: data.email,
        favoriteColor: data.favoriteColor,
        favoriteCake: data.favoriteCake,
        hobbies: data.hobbies,
        notes: data.notes,
        avatarUri: profileImage ?? undefined,
        reminderDaysBefore: data.reminderDaysBefore,
        reminderTime: data.reminderTime,
        repeatYearly: data.repeatYearly,
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
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                    contentFit="cover"
                  />
                ) : (
                  <ProfilePlaceholder
                    size="lg"
                    variant={gender === 'female' ? 'female' : 'user'}
                    borderClassName="border-2 border-primary/20"
                  />
                )}
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
                    {(['female', 'male', 'other'] as Gender[]).map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => onChange(g)}
                        className={`flex-row items-center px-4 py-3 rounded-xl border gap-2 flex-1 justify-center ${
                          value === g ? 'bg-primary/10 border-primary/40' : 'bg-gray-50 border-gray-200'
                        }`}
                        accessibilityRole="button">
                        <ProfilePlaceholder
                          size="xs"
                          variant={g === 'female' ? 'female' : 'user'}
                          borderClassName={value === g ? 'border-2 border-primary/40' : 'border border-gray-200'}
                        />
                        <Text className={`text-[13px] font-semibold capitalize ${value === g ? 'text-primary' : 'text-foreground-secondary'}`}>
                          {g}
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

          {/* Details & Preferences */}
          <View className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <SectionTitle title="Details & Preferences" icon={Gift} />

            {/* Hobbies */}
            <View className="mb-4">
              <FieldLabel label="Hobbies & Interests" />
              {hobbies.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-2.5">
                  {hobbies.map((h) => (
                    <View key={h} className="flex-row items-center bg-primary/10 rounded-full px-3 py-1.5 gap-1.5">
                      <Text className="text-[12px] text-primary font-semibold">{h}</Text>
                      <Pressable onPress={() => removeHobby(h)} hitSlop={8}>
                        <X size={11} color="#7C3AED" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
              <View className="flex-row gap-2">
                <TextInput
                  value={hobbyInput}
                  onChangeText={setHobbyInput}
                  onSubmitEditing={addHobby}
                  placeholder="Add a hobby..."
                  placeholderTextColor="#C4B5FD"
                  returnKeyType="done"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-foreground"
                />
                <Pressable
                  onPress={addHobby}
                  className="bg-primary/10 rounded-xl px-4 items-center justify-center"
                  accessibilityRole="button">
                  <Plus size={18} color="#7C3AED" />
                </Pressable>
              </View>
            </View>

            <Field>
              <FieldLabel label="Favorite Color" />
              <Pressable
                onPress={() => setShowColorPicker(true)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2"
                accessibilityRole="button">
                <Text className={`text-[15px] flex-1 ${watch('favoriteColor') ? 'text-foreground' : 'text-foreground-muted'}`}>
                  {watch('favoriteColor') || 'Select color'}
                </Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>
            </Field>

            <Field>
              <FieldLabel label="Favorite Cake" />
              <Pressable
                onPress={() => setShowCakePicker(true)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2"
                accessibilityRole="button">
                <Text className={`text-[15px] flex-1 ${watch('favoriteCake') ? 'text-foreground' : 'text-foreground-muted'}`} numberOfLines={1}>
                  {watch('favoriteCake') || 'Select cake'}
                </Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>
            </Field>

            <Field>
              <FieldLabel label="Notes" />
              <Controller control={control} name="notes"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <TextInput
                      value={value} onChangeText={onChange} onBlur={onBlur}
                      placeholder="Allergies, gift ideas, etc."
                      placeholderTextColor="#C4B5FD"
                      multiline numberOfLines={3} maxLength={250}
                      textAlignVertical="top"
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-[15px] text-foreground"
                      style={{ minHeight: 80 }}
                    />
                    <Text className="text-[10px] text-foreground-muted text-right mt-1">
                      {(value ?? '').length}/250
                    </Text>
                  </View>
                )}
              />
            </Field>
          </View>

          {/* Event Settings */}
          <View className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
            <SectionTitle title="Event Settings" icon={Bell} />

            <Field>
              <FieldLabel label="Remind Me" />
              <Pressable
                onPress={() => setShowReminderPicker(true)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2"
                accessibilityRole="button">
                <Calendar size={16} color="#7C3AED" />
                <Text className="text-[15px] text-foreground flex-1">
                  {reminderDays === 0 ? 'On the day' : `${reminderDays} days before`}
                </Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>
            </Field>

            <Field>
              <FieldLabel label="Reminder Time" />
              <Pressable
                onPress={() => setShowTimePicker(true)}
                className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2"
                accessibilityRole="button">
                <Clock size={16} color="#7C3AED" />
                <Text className="text-[15px] text-foreground flex-1">{formatTime12(reminderTime)}</Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </Pressable>
            </Field>

            <View className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
              <Text className="text-[15px] text-foreground">Repeat Yearly</Text>
              <Controller control={control} name="repeatYearly"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                    thumbColor="#FFFFFF"
                  />
                )}
              />
            </View>
          </View>

          {/* AI Banner */}
          <View className="rounded-2xl overflow-hidden mb-6">
            <LinearGradient colors={['#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Pressable
                onPress={() => {
                  if (personId) {
                    router.push({ pathname: '/ai-wish', params: { personId } });
                    return;
                  }
                  feedback.warning('Save first', 'Save this person to generate AI gift suggestions.');
                }}
                className="flex-row items-center px-5 py-4 gap-3"
                accessibilityRole="button">
                <Sparkles size={22} color="#FCD34D" />
                <View className="flex-1">
                  <Text className="text-[13px] text-white font-bold">AI Gift Suggestions</Text>
                  <Text className="text-[11px] text-white/70 mt-0.5">
                    Get smart gift ideas for {watch('fullName') || 'them'}
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full px-3.5 py-2">
                  <Text className="text-[11px] text-white font-bold">Try</Text>
                </View>
              </Pressable>
            </LinearGradient>
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
      <TimePickerModal
        visible={showTimePicker} value={reminderTime}
        onConfirm={(t) => { setValue('reminderTime', t); setShowTimePicker(false); }}
        onClose={() => setShowTimePicker(false)}
      />
      <OptionPickerModal
        visible={showRelationshipPicker} title="Select Relationship"
        options={RELATIONSHIPS.map((r) => r.label)} selected={relLabel}
        onSelect={(label) => { const r = RELATIONSHIPS.find((x) => x.label === label); if (r) setValue('relationship', r.value, { shouldValidate: true }); }}
        onClose={() => setShowRelationshipPicker(false)}
      />
      <OptionPickerModal
        visible={showColorPicker} title="Favorite Color"
        options={FAVORITE_COLORS} selected={watch('favoriteColor') ?? ''}
        onSelect={(c) => setValue('favoriteColor', c)}
        onClose={() => setShowColorPicker(false)}
      />
      <OptionPickerModal
        visible={showCakePicker} title="Favorite Cake"
        options={FAVORITE_CAKES} selected={watch('favoriteCake') ?? ''}
        onSelect={(c) => setValue('favoriteCake', c)}
        onClose={() => setShowCakePicker(false)}
      />
      <OptionPickerModal
        visible={showReminderPicker} title="Remind Me Before"
        options={REMINDER_DAYS.map((d) => (d === 0 ? 'On the Day' : `${d} Days Before`))}
        selected={reminderDays === 0 ? 'On the Day' : `${reminderDays} Days Before`}
        onSelect={(label) => setValue('reminderDaysBefore', label === 'On the Day' ? 0 : parseInt(label))}
        onClose={() => setShowReminderPicker(false)}
      />
    </SafeAreaView>
  );
}
