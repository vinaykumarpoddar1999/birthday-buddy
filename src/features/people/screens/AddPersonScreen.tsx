import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronDown,
  Clock,
  Image,
  Lock,
  Plus,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
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
import { usePeopleStore } from '@store/people.store';
import type { Gender, PersonEventType, RelationshipType } from '@store/people.store';
import { getAge } from '../utils/birthday-utils';

// ─── Zod schema ───────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TABS: { id: PersonEventType; label: string; emoji: string }[] = [
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💕' },
  { id: 'wedding', label: 'Wedding Anniv.', emoji: '💍' },
  { id: 'custom', label: 'Custom Event', emoji: '⭐' },
];

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const m = parseInt(month) - 1;
  return `${parseInt(day)} ${MONTHS[m]} ${year}`;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

function computeAge(birthDate: string): number | null {
  if (!birthDate) return null;
  try {
    return getAge(birthDate);
  } catch {
    return null;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <View className="flex-row items-center mb-3">
      <View className="h-[3px] w-[3px] rounded-full bg-primary mr-2" />
      <Text className="text-[13px] font-bold text-foreground uppercase tracking-wider">{title}</Text>
    </View>
  );
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text className="text-[12px] text-foreground-secondary font-medium mb-1.5">
      {label}
      {required && <Text className="text-error"> *</Text>}
    </Text>
  );
}

function InputWrapper({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <View className="mb-4">
      {children}
      {error ? <Text className="text-[11px] text-error mt-1">{error}</Text> : null}
    </View>
  );
}

// ─── Date Picker Modal ────────────────────────────────────────────────────────

function DatePickerModal({
  visible,
  value,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  value: string;
  onConfirm: (date: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const initYear = value ? parseInt(value.split('-')[0]) : today.getFullYear() - 25;
  const initMonth = value ? parseInt(value.split('-')[1]) - 1 : 0;
  const initDay = value ? parseInt(value.split('-')[2]) : 1;

  const [year, setYear] = useState(initYear);
  const [month, setMonth] = useState(initMonth);
  const [day, setDay] = useState(initDay);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const months = MONTHS;
  const years = Array.from({ length: 100 }, (_, i) => today.getFullYear() - i);

  const handleConfirm = () => {
    const safeDay = Math.min(day, daysInMonth);
    const y = String(year);
    const m = String(month + 1).padStart(2, '0');
    const d = String(safeDay).padStart(2, '0');
    onConfirm(`${y}-${m}-${d}`);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-title font-bold text-foreground">Select Date</Text>
            <Pressable onPress={onClose}>
              <X size={22} color="#6B7280" />
            </Pressable>
          </View>

          <View className="flex-row gap-2 mb-5">
            {/* Day */}
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Day</Text>
              <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                {days.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDay(d)}
                    className={`py-2.5 rounded-lg mb-1 items-center ${day === d ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${day === d ? 'text-primary' : 'text-foreground'}`}>
                      {String(d).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {/* Month */}
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Month</Text>
              <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                {months.map((m, idx) => (
                  <Pressable
                    key={m}
                    onPress={() => setMonth(idx)}
                    className={`py-2.5 rounded-lg mb-1 items-center ${month === idx ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${month === idx ? 'text-primary' : 'text-foreground'}`}>
                      {m}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            {/* Year */}
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Year</Text>
              <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                {years.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => setYear(y)}
                    className={`py-2.5 rounded-lg mb-1 items-center ${year === y ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${year === y ? 'text-primary' : 'text-foreground'}`}>
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <Pressable
            onPress={handleConfirm}
            className="bg-primary rounded-xl py-3.5 items-center">
            <Text className="text-white font-bold text-[15px]">Confirm Date</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Time Picker Modal ────────────────────────────────────────────────────────

function TimePickerModal({
  visible,
  value,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  value: string;
  onConfirm: (time: string) => void;
  onClose: () => void;
}) {
  const [hour, setHour] = useState(parseInt(value.split(':')[0]) || 8);
  const [minute, setMinute] = useState(parseInt(value.split(':')[1]) || 0);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl p-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-title font-bold text-foreground">Select Time</Text>
            <Pressable onPress={onClose}><X size={22} color="#6B7280" /></Pressable>
          </View>

          <View className="flex-row gap-4 mb-5">
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Hour</Text>
              <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                {hours.map((h) => (
                  <Pressable key={h} onPress={() => setHour(h)}
                    className={`py-2.5 rounded-lg mb-1 items-center ${hour === h ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${hour === h ? 'text-primary' : 'text-foreground'}`}>
                      {String(h).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-foreground-secondary font-semibold text-center mb-2">Minute</Text>
              <ScrollView style={{ height: 160 }} showsVerticalScrollIndicator={false}>
                {minutes.map((m) => (
                  <Pressable key={m} onPress={() => setMinute(m)}
                    className={`py-2.5 rounded-lg mb-1 items-center ${minute === m ? 'bg-primary/10' : ''}`}>
                    <Text className={`text-[15px] font-semibold ${minute === m ? 'text-primary' : 'text-foreground'}`}>
                      {String(m).padStart(2, '0')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          <Pressable onPress={() => onConfirm(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)}
            className="bg-primary rounded-xl py-3.5 items-center">
            <Text className="text-white font-bold text-[15px]">Confirm Time</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Option Picker Modal ──────────────────────────────────────────────────────

function OptionPickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl p-5 max-h-[60%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-title font-bold text-foreground">{title}</Text>
            <Pressable onPress={onClose}><X size={22} color="#6B7280" /></Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => { onSelect(opt); onClose(); }}
                className={`flex-row items-center justify-between py-3.5 px-3 rounded-xl mb-1 ${selected === opt ? 'bg-primary/10' : ''}`}>
                <Text className={`text-[15px] ${selected === opt ? 'text-primary font-semibold' : 'text-foreground'}`}>
                  {opt}
                </Text>
                {selected === opt && <View className="h-5 w-5 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">✓</Text>
                </View>}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function AddPersonScreen() {
  const addPerson = usePeopleStore((s) => s.addPerson);

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
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
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

  const computedAge = birthDate ? computeAge(birthDate) : null;

  const pickImage = useCallback(async (source: 'camera' | 'gallery') => {
    let result: ImagePicker.ImagePickerResult;
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required.');
        return;
      }
      result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library access is required.');
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    }
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }, []);

  const addHobby = useCallback(() => {
    const trimmed = hobbyInput.trim();
    if (!trimmed) return;
    const current = getValues('hobbies');
    if (!current.includes(trimmed)) {
      setValue('hobbies', [...current, trimmed]);
    }
    setHobbyInput('');
  }, [hobbyInput, getValues, setValue]);

  const removeHobby = useCallback(
    (hobby: string) => {
      setValue('hobbies', getValues('hobbies').filter((h) => h !== hobby));
    },
    [getValues, setValue],
  );

  const onSubmit = useCallback(
    (data: FormValues) => {
      addPerson({
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
        profileImage: profileImage ?? undefined,
        reminderDaysBefore: data.reminderDaysBefore,
        reminderTime: data.reminderTime,
        repeatYearly: data.repeatYearly,
        eventType,
      });
      Alert.alert('🎉 Person Added!', `${data.fullName} has been added to your birthday list.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
    [addPerson, profileImage, eventType],
  );

  const relationshipLabel =
    RELATIONSHIPS.find((r) => r.value === watch('relationship'))?.label ?? 'Select';
  const colorLabel = watch('favoriteColor') || 'Select Color';
  const cakeLabel = watch('favoriteCake') || 'Select Cake';

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3 bg-background border-b border-border/50">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 rounded-full bg-surface border border-border items-center justify-center mr-3">
          <ArrowLeft size={20} color="#111827" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-[18px] font-bold text-foreground">Add Person / Event</Text>
          <Text className="text-[11px] text-foreground-secondary">
            Add birthday, anniversary or any special day
          </Text>
        </View>
        <View className="h-10 w-10 rounded-full bg-primary items-center justify-center">
          <Sparkles size={18} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Event Type Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3 gap-2">
          {EVENT_TABS.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => setEventType(tab.id)}
              className={`flex-row items-center px-3.5 py-2.5 rounded-xl border gap-1.5 ${
                eventType === tab.id
                  ? 'bg-primary/10 border-primary/40'
                  : 'bg-surface border-border'
              }`}>
              <Text className="text-[13px]">{tab.emoji}</Text>
              <Text className={`text-[13px] font-semibold ${eventType === tab.id ? 'text-primary' : 'text-foreground'}`}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="px-4">
          {/* Profile Photo */}
          <View className="bg-surface rounded-2xl border border-border/80 p-4 mb-4 shadow-card">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-[13px] font-bold text-foreground">Profile Photo</Text>
              <Text className="text-[11px] text-foreground-muted">Add a photo to make it personal</Text>
            </View>
            <View className="flex-row items-center gap-4">
              <View className="relative">
                {profileImage ? (
                  <View className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/30">
                    <ProfilePlaceholder
                      size="lg"
                      variant={gender === 'female' ? 'female' : 'user'}
                    />
                  </View>
                ) : (
                  <ProfilePlaceholder
                    size="lg"
                    variant={gender === 'female' ? 'female' : 'user'}
                    borderClassName="border-2 border-primary/30"
                  />
                )}
                <View className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary border-2 border-white items-center justify-center">
                  <Camera size={13} color="#FFFFFF" />
                </View>
              </View>
              <View className="flex-1 gap-2">
                <Pressable
                  onPress={() => pickImage('camera')}
                  className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                  <Camera size={15} color="#7C3AED" />
                  <Text className="text-[13px] font-semibold text-foreground">Take Photo</Text>
                </Pressable>
                <Pressable
                  onPress={() => pickImage('gallery')}
                  className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                  <Image size={15} color="#7C3AED" />
                  <Text className="text-[13px] font-semibold text-foreground">Choose from Gallery</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Basic Information */}
          <View className="bg-surface rounded-2xl border border-border/80 p-4 mb-4 shadow-card">
            <SectionLabel title="Basic Information" />

            {/* Full Name + Nickname */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputWrapper error={errors.fullName?.message}>
                  <FieldLabel label="Full Name" required />
                  <Controller
                    control={control}
                    name="fullName"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Riya Singh"
                        placeholderTextColor="#9CA3AF"
                        className={`bg-background border rounded-xl px-3 py-2.5 text-[14px] text-foreground ${errors.fullName ? 'border-error' : 'border-border'}`}
                      />
                    )}
                  />
                </InputWrapper>
              </View>
              <View className="flex-1">
                <InputWrapper>
                  <FieldLabel label="Nickname (Optional)" />
                  <Controller
                    control={control}
                    name="nickname"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Riya"
                        placeholderTextColor="#9CA3AF"
                        className="bg-background border border-border rounded-xl px-3 py-2.5 text-[14px] text-foreground"
                      />
                    )}
                  />
                </InputWrapper>
              </View>
            </View>

            {/* Date of Birth + Age */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputWrapper error={errors.birthDate?.message}>
                  <FieldLabel label="Date of Birth" required />
                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field: { value } }) => (
                      <Pressable
                        onPress={() => setShowDatePicker(true)}
                        className={`flex-row items-center bg-background border rounded-xl px-3 py-2.5 gap-2 ${errors.birthDate ? 'border-error' : 'border-border'}`}>
                        <Calendar size={14} color="#7C3AED" />
                        <Text className={`text-[14px] flex-1 ${value ? 'text-foreground' : 'text-foreground-muted'}`}>
                          {value ? formatDisplayDate(value) : '25 May 2001'}
                        </Text>
                        <ChevronDown size={14} color="#6B7280" />
                      </Pressable>
                    )}
                  />
                </InputWrapper>
              </View>
              <View className="flex-1">
                <InputWrapper>
                  <FieldLabel label="Age" />
                  <View className="flex-row items-center bg-background border border-border/50 rounded-xl px-3 py-2.5 gap-2">
                    <Text className="text-[14px] text-foreground flex-1">
                      {computedAge !== null ? `${computedAge} Years` : '—'}
                    </Text>
                    <Lock size={13} color="#9CA3AF" />
                  </View>
                </InputWrapper>
              </View>
            </View>

            {/* Gender */}
            <FieldLabel label="Gender (Optional)" />
            <Controller
              control={control}
              name="gender"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row gap-2 mb-4">
                  {(['female', 'male', 'other'] as Gender[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => onChange(g)}
                      className={`flex-row items-center px-3 py-2 rounded-xl border gap-1.5 flex-1 justify-center ${
                        value === g ? 'bg-primary/10 border-primary/40' : 'bg-background border-border'
                      }`}>
                      <Text className="text-[13px]">{g === 'female' ? '👩' : g === 'male' ? '👨' : '🧑'}</Text>
                      <Text className={`text-[12px] font-semibold capitalize ${value === g ? 'text-primary' : 'text-foreground-secondary'}`}>
                        {g}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Relationship & Contact */}
          <View className="bg-surface rounded-2xl border border-border/80 p-4 mb-4 shadow-card">
            <SectionLabel title="Relationship & Contact" />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputWrapper error={errors.relationship?.message}>
                  <FieldLabel label="Relationship" required />
                  <Controller
                    control={control}
                    name="relationship"
                    render={() => (
                      <Pressable
                        onPress={() => setShowRelationshipPicker(true)}
                        className={`flex-row items-center bg-background border rounded-xl px-3 py-2.5 gap-2 ${errors.relationship ? 'border-error' : 'border-border'}`}>
                        <Text className="text-[14px] text-foreground flex-1">{relationshipLabel}</Text>
                        <ChevronDown size={14} color="#6B7280" />
                      </Pressable>
                    )}
                  />
                </InputWrapper>
              </View>
              <View className="flex-1">
                <InputWrapper>
                  <FieldLabel label="Phone Number" />
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value, onBlur } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="+91 98765 43210"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        className="bg-background border border-border rounded-xl px-3 py-2.5 text-[14px] text-foreground"
                      />
                    )}
                  />
                </InputWrapper>
              </View>
            </View>

            <InputWrapper error={errors.email?.message}>
              <FieldLabel label="Email (Optional)" />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="riya.singh@gmail.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-background border border-border rounded-xl px-3 py-2.5 text-[14px] text-foreground"
                  />
                )}
              />
            </InputWrapper>
          </View>

          {/* Details & Preferences */}
          <View className="bg-surface rounded-2xl border border-border/80 p-4 mb-4 shadow-card">
            <SectionLabel title="Details & Preferences" />

            {/* Hobbies */}
            <View className="mb-4">
              <FieldLabel label="Hobbies" />
              <View className="flex-row flex-wrap gap-2 mb-2">
                {hobbies.map((h) => (
                  <View key={h} className="flex-row items-center bg-primary/10 border border-primary/30 rounded-full px-3 py-1.5 gap-1.5">
                    <Text className="text-[12px] text-primary font-semibold">{h}</Text>
                    <Pressable onPress={() => removeHobby(h)} hitSlop={8}>
                      <X size={11} color="#7C3AED" />
                    </Pressable>
                  </View>
                ))}
              </View>
              <View className="flex-row gap-2">
                <TextInput
                  value={hobbyInput}
                  onChangeText={setHobbyInput}
                  onSubmitEditing={addHobby}
                  placeholder="Add hobby..."
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                  className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-[14px] text-foreground"
                />
                <Pressable
                  onPress={addHobby}
                  className="bg-primary/10 border border-primary/30 rounded-xl px-3 items-center justify-center">
                  <Plus size={18} color="#7C3AED" />
                </Pressable>
              </View>
            </View>

            {/* Favorite Color + Cake */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <InputWrapper>
                  <FieldLabel label="Favorite Color" />
                  <Controller
                    control={control}
                    name="favoriteColor"
                    render={() => (
                      <Pressable
                        onPress={() => setShowColorPicker(true)}
                        className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                        <Text className="text-[14px] text-foreground flex-1">{colorLabel}</Text>
                        <ChevronDown size={14} color="#6B7280" />
                      </Pressable>
                    )}
                  />
                </InputWrapper>
              </View>
              <View className="flex-1">
                <InputWrapper>
                  <FieldLabel label="Favorite Cake" />
                  <Controller
                    control={control}
                    name="favoriteCake"
                    render={() => (
                      <Pressable
                        onPress={() => setShowCakePicker(true)}
                        className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                        <Text className="text-[14px] text-foreground flex-1 text-ellipsis" numberOfLines={1}>{cakeLabel}</Text>
                        <ChevronDown size={14} color="#6B7280" />
                      </Pressable>
                    )}
                  />
                </InputWrapper>
              </View>
            </View>

            {/* Notes */}
            <View>
              <FieldLabel label="Notes" />
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="She loves surprise parties! Don't forget her allergies."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                      maxLength={250}
                      textAlignVertical="top"
                      className="bg-background border border-border rounded-xl px-3 py-2.5 text-[14px] text-foreground"
                      style={{ minHeight: 72 }}
                    />
                    <Text className="text-[10px] text-foreground-muted text-right mt-1">
                      {(value ?? '').length}/250
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>

          {/* Event Settings */}
          <View className="bg-surface rounded-2xl border border-border/80 p-4 mb-4 shadow-card">
            <SectionLabel title="Event Settings" />

            <View className="flex-row items-center gap-3">
              {/* Remind Me */}
              <View className="flex-1">
                <FieldLabel label="Remind Me" />
                <Pressable
                  onPress={() => setShowReminderPicker(true)}
                  className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                  <Calendar size={14} color="#7C3AED" />
                  <Text className="text-[13px] text-foreground flex-1">{reminderDays} Days Before</Text>
                  <ChevronDown size={14} color="#6B7280" />
                </Pressable>
              </View>

              {/* Reminder Time */}
              <View className="flex-1">
                <FieldLabel label="Reminder Time" />
                <Pressable
                  onPress={() => setShowTimePicker(true)}
                  className="flex-row items-center bg-background border border-border rounded-xl px-3 py-2.5 gap-2">
                  <Clock size={14} color="#7C3AED" />
                  <Text className="text-[13px] text-foreground flex-1">{formatTime12(reminderTime)}</Text>
                  <ChevronDown size={14} color="#6B7280" />
                </Pressable>
              </View>

              {/* Repeat Yearly */}
              <View className="items-center">
                <FieldLabel label="Repeat Yearly" />
                <Controller
                  control={control}
                  name="repeatYearly"
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
          </View>

          {/* AI Suggestion Banner */}
          <View className="rounded-2xl overflow-hidden mb-6">
            <LinearGradient
              colors={['#7C3AED', '#5B21B6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="flex-row items-center px-4 py-3 gap-3">
              <Sparkles size={20} color="#FCD34D" />
              <View className="flex-1">
                <Text className="text-[12px] text-white/70">AI Suggestion</Text>
                <Text className="text-[13px] text-white font-semibold">
                  Let AI suggest the best gift ideas for {watch('fullName') || 'them'}
                </Text>
              </View>
              <Pressable className="bg-white/20 rounded-lg px-3 py-1.5">
                <Text className="text-[11px] text-white font-bold">Get Suggestions</Text>
              </Pressable>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={() => router.back()}
              className="flex-1 bg-surface border border-border rounded-2xl py-4 items-center">
              <Text className="text-[15px] font-bold text-foreground">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              className="flex-[2] rounded-2xl py-4 items-center overflow-hidden">
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <View className="flex-row items-center gap-2">
                <Text className="text-[15px] font-bold text-white">Save Person / Event</Text>
                <View className="h-6 w-6 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white text-[12px]">✓</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <DatePickerModal
        visible={showDatePicker}
        value={birthDate}
        onConfirm={(date) => { setValue('birthDate', date, { shouldValidate: true }); setShowDatePicker(false); }}
        onClose={() => setShowDatePicker(false)}
      />

      <TimePickerModal
        visible={showTimePicker}
        value={reminderTime}
        onConfirm={(time) => { setValue('reminderTime', time); setShowTimePicker(false); }}
        onClose={() => setShowTimePicker(false)}
      />

      <OptionPickerModal
        visible={showRelationshipPicker}
        title="Select Relationship"
        options={RELATIONSHIPS.map((r) => r.label)}
        selected={relationshipLabel}
        onSelect={(label) => {
          const rel = RELATIONSHIPS.find((r) => r.label === label);
          if (rel) setValue('relationship', rel.value, { shouldValidate: true });
        }}
        onClose={() => setShowRelationshipPicker(false)}
      />

      <OptionPickerModal
        visible={showColorPicker}
        title="Favorite Color"
        options={FAVORITE_COLORS}
        selected={watch('favoriteColor') ?? ''}
        onSelect={(c) => setValue('favoriteColor', c)}
        onClose={() => setShowColorPicker(false)}
      />

      <OptionPickerModal
        visible={showCakePicker}
        title="Favorite Cake"
        options={FAVORITE_CAKES}
        selected={watch('favoriteCake') ?? ''}
        onSelect={(c) => setValue('favoriteCake', c)}
        onClose={() => setShowCakePicker(false)}
      />

      <OptionPickerModal
        visible={showReminderPicker}
        title="Remind Me Before"
        options={REMINDER_DAYS.map((d) => (d === 0 ? 'On the Day' : `${d} Days Before`))}
        selected={reminderDays === 0 ? 'On the Day' : `${reminderDays} Days Before`}
        onSelect={(label) => {
          const days = label === 'On the Day' ? 0 : parseInt(label);
          setValue('reminderDaysBefore', days);
        }}
        onClose={() => setShowReminderPicker(false)}
      />
    </SafeAreaView>
  );
}
