import React, { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  Film,
  Gift,
  Heart,
  CircleHelp,
  Image as ImageIcon,
  Layers,
  Mail,
  MessageCircle,
  Mic,
  Plus,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useSurpriseLinkStore } from '../../store/surprise-link.store';
import type { ExperienceModule, ModuleType } from '../../types';
import { ContinueButton } from '../../components/common/StudioHeader';
import { StudioScreenIntro } from '../../components/common/StudioScreenIntro';
import { StudioStepLayout } from '../../components/common/StudioStepLayout';

interface ModuleTypeConfig {
  type: ModuleType;
  label: string;
  description: string;
  Icon: LucideIcon;
  color: string;
  gradient: [string, string];
}

const MODULE_TYPES: ModuleTypeConfig[] = [
  { type: 'photo_gallery', label: 'Photo Gallery', description: 'Beautiful photo carousel or grid', Icon: ImageIcon, color: '#3B82F6', gradient: ['#EFF6FF', '#DBEAFE'] },
  { type: 'video_memory', label: 'Video Memory', description: 'Share a special video moment', Icon: Film, color: '#8B5CF6', gradient: ['#F5F3FF', '#EDE9FE'] },
  { type: 'voice_message', label: 'Voice Message', description: 'Record a heartfelt audio message', Icon: Mic, color: '#EC4899', gradient: ['#FDF2F8', '#FCE7F3'] },
  { type: 'timeline', label: 'Timeline', description: 'Walk through your journey together', Icon: Clock, color: '#14B8A6', gradient: ['#F0FDFA', '#CCFBF1'] },
  { type: 'countdown', label: 'Countdown', description: 'Build anticipation for the big day', Icon: Clock, color: '#F59E0B', gradient: ['#FFFBEB', '#FEF3C7'] },
  { type: 'scratch_card', label: 'Scratch Card', description: 'Hidden surprise to scratch and reveal', Icon: Sparkles, color: '#EF4444', gradient: ['#FEF2F2', '#FECACA'] },
  { type: 'quiz', label: 'Fun Quiz', description: 'Test how well they know you', Icon: CircleHelp, color: '#6366F1', gradient: ['#EEF2FF', '#C7D2FE'] },
  { type: 'open_when', label: 'Open When', description: 'Letters for every mood and moment', Icon: Mail, color: '#22C55E', gradient: ['#F0FDF4', '#DCFCE7'] },
  { type: 'reasons_love', label: 'Reasons I Love You', description: 'Count the ways, one card at a time', Icon: Heart, color: '#EC4899', gradient: ['#FDF2F8', '#FBCFE8'] },
  { type: 'future_dreams', label: 'Future Dreams', description: 'Dream together about tomorrow', Icon: Star, color: '#7C3AED', gradient: ['#F5F3FF', '#DDD6FE'] },
  { type: 'message', label: 'Personal Message', description: 'Write a heartfelt letter or note', Icon: MessageCircle, color: '#0EA5E9', gradient: ['#F0F9FF', '#BAE6FD'] },
  { type: 'gift_box', label: 'Gift Box', description: 'Dramatic unveiling of your surprise', Icon: Gift, color: '#D97706', gradient: ['#FFFBEB', '#FDE68A'] },
];

function ModuleEditor({
  module,
  index,
  total,
}: {
  module: ExperienceModule;
  index: number;
  total: number;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const updateModule = useSurpriseLinkStore((s) => s.updateModule);
  const removeModule = useSurpriseLinkStore((s) => s.removeModule);
  const reorderModules = useSurpriseLinkStore((s) => s.reorderModules);

  const config = MODULE_TYPES.find((m) => m.type === module.type) ?? MODULE_TYPES[10];
  const { Icon } = config;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0] && module.type === 'photo_gallery') {
      updateModule(module.id, {
        items: [...module.items, { id: `photo-${Date.now()}`, uri: result.assets[0].uri, caption: '' }],
      });
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 0.8 });
    if (!result.canceled && result.assets[0] && module.type === 'video_memory') {
      updateModule(module.id, { videoUri: result.assets[0].uri });
    }
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
    if (!result.canceled && result.assets[0] && module.type === 'voice_message') {
      updateModule(module.id, { audioUri: result.assets[0].uri });
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()} className="mx-5 mb-3">
      <View
        className="rounded-2xl overflow-hidden bg-white"
        style={{
          borderWidth: 1.5,
          borderColor: `${config.color}20`,
          shadowColor: config.color,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
        }}>
        {/* Module Header */}
        <Pressable
          onPress={() => setCollapsed((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={`${collapsed ? 'Expand' : 'Collapse'} ${module.title}`}>
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="flex-row items-center px-4 py-3.5">
            <View className="flex-row items-center flex-1 gap-2.5">
              <View
                className="h-8 w-8 rounded-lg items-center justify-center"
                style={{ backgroundColor: `${config.color}20` }}>
                <Icon size={16} color={config.color} />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-black text-foreground" numberOfLines={1}>
                  {module.title}
                </Text>
                <Text className="text-[10px] text-foreground-secondary">{config.label}</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-0.5">
              {index > 0 && (
                <Pressable
                  onPress={() => reorderModules(index, index - 1)}
                  accessibilityRole="button"
                  accessibilityLabel="Move up"
                  className="p-1.5"
                  hitSlop={6}>
                  <ChevronUp size={16} color={config.color} />
                </Pressable>
              )}
              {index < total - 1 && (
                <Pressable
                  onPress={() => reorderModules(index, index + 1)}
                  accessibilityRole="button"
                  accessibilityLabel="Move down"
                  className="p-1.5"
                  hitSlop={6}>
                  <ChevronDown size={16} color={config.color} />
                </Pressable>
              )}
              <Pressable
                onPress={() => removeModule(module.id)}
                accessibilityRole="button"
                accessibilityLabel="Remove module"
                className="p-1.5 ml-1"
                hitSlop={6}>
                <Trash2 size={15} color="#EF4444" />
              </Pressable>
              <View className="ml-1">
                {collapsed ? (
                  <ChevronDown size={16} color="#9CA3AF" />
                ) : (
                  <ChevronUp size={16} color="#9CA3AF" />
                )}
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Module Body */}
        {!collapsed && (
          <View className="p-4">
            <View className="mb-3">
              <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Module Title</Text>
              <TextInput
                value={module.title}
                onChangeText={(v) => updateModule(module.id, { title: v })}
                className="text-[13px] font-semibold text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                placeholder="Module title"
              />
            </View>

            {module.type === 'message' && (
              <View>
                <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Your Message</Text>
                <TextInput
                  value={module.content}
                  onChangeText={(v) => updateModule(module.id, { content: v })}
                  multiline
                  className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 min-h-[90px] border border-gray-100"
                  style={{ textAlignVertical: 'top' }}
                  placeholder="Write your heartfelt message..."
                />
              </View>
            )}

            {module.type === 'countdown' && (
              <View className="gap-3">
                <View>
                  <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Target Date</Text>
                  <TextInput
                    value={module.targetDate}
                    onChangeText={(v) => updateModule(module.id, { targetDate: v })}
                    className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View>
                  <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Reveal Message</Text>
                  <TextInput
                    value={module.revealMessage}
                    onChangeText={(v) => updateModule(module.id, { revealMessage: v })}
                    className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                    placeholder="Message when countdown ends"
                  />
                </View>
              </View>
            )}

            {module.type === 'scratch_card' && (
              <View>
                <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Hidden Message</Text>
                <TextInput
                  value={module.hiddenMessage}
                  onChangeText={(v) => updateModule(module.id, { hiddenMessage: v })}
                  multiline
                  className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 min-h-[70px] border border-gray-100"
                  style={{ textAlignVertical: 'top' }}
                  placeholder="Hidden message to reveal..."
                />
              </View>
            )}

            {module.type === 'photo_gallery' && (
              <Pressable
                onPress={pickPhoto}
                accessibilityRole="button"
                accessibilityLabel="Add photo"
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                <LinearGradient
                  colors={config.gradient}
                  className="rounded-xl p-3.5 items-center flex-row justify-center gap-2 border border-blue-100">
                  <Camera size={16} color={config.color} />
                  <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                    Add Photo ({module.items.length} added)
                  </Text>
                </LinearGradient>
              </Pressable>
            )}

            {module.type === 'video_memory' && (
              <View className="gap-3">
                <Pressable
                  onPress={pickVideo}
                  accessibilityRole="button"
                  accessibilityLabel="Upload video"
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                  <LinearGradient
                    colors={config.gradient}
                    className="rounded-xl p-3.5 items-center flex-row justify-center gap-2 border border-purple-100">
                    <Film size={16} color={config.color} />
                    <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                      {module.videoUri ? 'Video Added' : 'Upload Video'}
                    </Text>
                  </LinearGradient>
                </Pressable>
                <TextInput
                  value={module.caption}
                  onChangeText={(v) => updateModule(module.id, { caption: v })}
                  className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                  placeholder="Video caption"
                />
              </View>
            )}

            {module.type === 'voice_message' && (
              <View className="gap-3">
                <Pressable
                  onPress={pickAudio}
                  accessibilityRole="button"
                  accessibilityLabel="Upload audio"
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                  <LinearGradient
                    colors={config.gradient}
                    className="rounded-xl p-3.5 items-center flex-row justify-center gap-2 border border-pink-100">
                    <Mic size={16} color={config.color} />
                    <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                      {module.audioUri ? 'Audio Added' : 'Upload Audio'}
                    </Text>
                  </LinearGradient>
                </Pressable>
                <View>
                  <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Transcript</Text>
                  <TextInput
                    value={module.transcript}
                    onChangeText={(v) => updateModule(module.id, { transcript: v })}
                    multiline
                    className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 min-h-[70px] border border-gray-100"
                    style={{ textAlignVertical: 'top' }}
                    placeholder="Transcript or written message"
                  />
                </View>
              </View>
            )}

            {module.type === 'timeline' && (
              <View>
                {module.events.map((ev) => (
                  <View key={ev.id} className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <TextInput
                      value={ev.date}
                      onChangeText={(v) =>
                        updateModule(module.id, {
                          events: module.events.map((e) => (e.id === ev.id ? { ...e, date: v } : e)),
                        })
                      }
                      className="text-[12px] text-foreground-secondary mb-1"
                      placeholder="Date (e.g. Jan 2020)"
                    />
                    <TextInput
                      value={ev.title}
                      onChangeText={(v) =>
                        updateModule(module.id, {
                          events: module.events.map((e) => (e.id === ev.id ? { ...e, title: v } : e)),
                        })
                      }
                      className="text-[13px] font-bold text-foreground mb-1"
                      placeholder="Milestone title"
                    />
                    <TextInput
                      value={ev.description}
                      onChangeText={(v) =>
                        updateModule(module.id, {
                          events: module.events.map((e) => (e.id === ev.id ? { ...e, description: v } : e)),
                        })
                      }
                      multiline
                      className="text-[12px] text-foreground"
                      style={{ textAlignVertical: 'top' }}
                      placeholder="Description"
                    />
                  </View>
                ))}
                <Pressable
                  onPress={() =>
                    updateModule(module.id, {
                      events: [
                        ...module.events,
                        { id: `ev-${Date.now()}`, date: '', title: '', description: '' },
                      ],
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Add milestone"
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                  <LinearGradient
                    colors={config.gradient}
                    className="rounded-xl p-2.5 items-center flex-row justify-center gap-1.5 border border-teal-100">
                    <Plus size={14} color={config.color} />
                    <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                      Add Milestone
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            {module.type === 'open_when' &&
              module.letters.map((letter) => (
                <View key={letter.id} className="mb-3">
                  <View className="flex-row items-center gap-1.5 mb-1.5">
                    <Mail size={12} color={config.color} />
                    <Text className="text-[11px] font-bold" style={{ color: config.color }}>
                      {letter.title}
                    </Text>
                  </View>
                  <TextInput
                    value={letter.content}
                    onChangeText={(v) =>
                      updateModule(module.id, {
                        letters: module.letters.map((l) =>
                          l.id === letter.id ? { ...l, content: v } : l,
                        ),
                      })
                    }
                    multiline
                    className="text-[12px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 min-h-[55px] border border-gray-100"
                    style={{ textAlignVertical: 'top' }}
                    placeholder="Letter content..."
                  />
                </View>
              ))}

            {module.type === 'reasons_love' &&
              module.cards.map((card) => (
                <View key={card.id} className="flex-row items-center gap-2 mb-2">
                  <View
                    className="h-6 w-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${config.color}15` }}>
                    <Text className="text-[10px] font-black" style={{ color: config.color }}>
                      {card.number}
                    </Text>
                  </View>
                  <TextInput
                    value={card.text}
                    onChangeText={(v) =>
                      updateModule(module.id, {
                        cards: module.cards.map((c) =>
                          c.id === card.id ? { ...c, text: v } : c,
                        ),
                      })
                    }
                    className="text-[12px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2 flex-1 border border-gray-100"
                    placeholder={`Reason #${card.number}`}
                  />
                </View>
              ))}

            {module.type === 'future_dreams' && (
              <View>
                {module.dreams.map((d) => (
                  <TextInput
                    key={d.id}
                    value={d.text}
                    onChangeText={(v) =>
                      updateModule(module.id, {
                        dreams: module.dreams.map((dr) =>
                          dr.id === d.id ? { ...dr, text: v } : dr,
                        ),
                      })
                    }
                    className="text-[12px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 mb-2 border border-gray-100"
                    placeholder="Dream or goal"
                  />
                ))}
                <Pressable
                  onPress={() =>
                    updateModule(module.id, {
                      dreams: [
                        ...module.dreams,
                        { id: `dream-${Date.now()}`, text: '', category: 'life' },
                      ],
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Add dream"
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                  <LinearGradient
                    colors={config.gradient}
                    className="rounded-xl p-2.5 items-center flex-row justify-center gap-1.5 border border-purple-100">
                    <Plus size={14} color={config.color} />
                    <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                      Add Dream
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            {module.type === 'quiz' && (
              <View>
                <View className="mb-3">
                  <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Reward Message</Text>
                  <TextInput
                    value={module.rewardMessage}
                    onChangeText={(v) => updateModule(module.id, { rewardMessage: v })}
                    className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                    placeholder="Message when quiz is completed"
                  />
                </View>
                {module.questions.map((q) => (
                  <View key={q.id} className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <TextInput
                      value={q.question}
                      onChangeText={(v) =>
                        updateModule(module.id, {
                          questions: module.questions.map((item) =>
                            item.id === q.id ? { ...item, question: v } : item,
                          ),
                        })
                      }
                      className="text-[12px] font-bold text-foreground mb-2"
                      placeholder="Question"
                    />
                    {q.options.map((opt, optIdx) => (
                      <TextInput
                        key={opt.id}
                        value={opt.text}
                        onChangeText={(v) =>
                          updateModule(module.id, {
                            questions: module.questions.map((item) =>
                              item.id === q.id
                                ? {
                                    ...item,
                                    options: item.options.map((o, i) =>
                                      i === optIdx ? { ...o, text: v } : o,
                                    ),
                                  }
                                : item,
                            ),
                          })
                        }
                        className="text-[12px] text-foreground mb-1.5 bg-white rounded-lg px-3 py-1.5 border border-gray-100"
                        placeholder={`Option ${optIdx + 1}${opt.isCorrect ? ' (correct)' : ''}`}
                      />
                    ))}
                  </View>
                ))}
                <Pressable
                  onPress={() =>
                    updateModule(module.id, {
                      questions: [
                        ...module.questions,
                        {
                          id: `q-${Date.now()}`,
                          question: '',
                          options: [
                            { id: `o-${Date.now()}-1`, text: '', isCorrect: true },
                            { id: `o-${Date.now()}-2`, text: '', isCorrect: false },
                            { id: `o-${Date.now()}-3`, text: '', isCorrect: false },
                          ],
                        },
                      ],
                    })
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Add question"
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}>
                  <LinearGradient
                    colors={config.gradient}
                    className="rounded-xl p-2.5 items-center flex-row justify-center gap-1.5 border border-indigo-100">
                    <Plus size={14} color={config.color} />
                    <Text className="text-[12px] font-bold" style={{ color: config.color }}>
                      Add Question
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}

            {module.type === 'gift_box' && (
              <View>
                <Text className="text-[11px] font-bold text-foreground-secondary mb-1.5">Reveal Message</Text>
                <TextInput
                  value={module.revealMessage}
                  onChangeText={(v) => updateModule(module.id, { revealMessage: v })}
                  className="text-[13px] text-foreground bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-100"
                  placeholder="Message when gift box opens"
                />
              </View>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export function Step5ModulesScreen() {
  const modules = useSurpriseLinkStore((s) => s.modules);
  const safeModules = Array.isArray(modules) ? modules : [];
  const addModule = useSurpriseLinkStore((s) => s.addModule);
  const nextStep = useSurpriseLinkStore((s) => s.nextStep);

  const [showAddModal, setShowAddModal] = useState(false);

  const handleAdd = useCallback(
    (type: ModuleType) => {
      addModule(type);
      setShowAddModal(false);
    },
    [addModule],
  );

  return (
    <>
      <StudioStepLayout footer={<ContinueButton onPress={nextStep} />}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <StudioScreenIntro
          title="Experience Modules"
          subtitle="Add interactive blocks — galleries, timelines, quizzes, scratch cards, and more."
          Icon={Layers}
        />

        {/* Add Module Button */}
        <Animated.View entering={FadeInDown.delay(100).springify()} className="px-5 mb-5">
          <Pressable
            onPress={() => setShowAddModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Add new module"
            style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}>
            <LinearGradient
              colors={['#7C3AED', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
              style={{
                shadowColor: '#7C3AED',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}>
              <Plus size={18} color="#FFF" strokeWidth={2.5} />
              <Text className="text-[14px] font-black text-white">Add Module</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        {/* Active Modules */}
        {safeModules.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(150).springify()} className="mx-5">
            <LinearGradient
              colors={['#F5F3FF', '#EDE9FE']}
              className="p-8 rounded-2xl items-center"
              style={{
                borderWidth: 2,
                borderColor: '#E9D5FF',
                borderStyle: 'dashed',
              }}>
              <View className="h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-3">
                <Layers size={28} color="#7C3AED" />
              </View>
              <Text className="text-[16px] font-black text-foreground mb-1">Start Building</Text>
              <Text className="text-[12px] text-foreground-secondary text-center leading-4">
                Tap "Add Module" above to add your first{'\n'}interactive block to the experience
              </Text>
            </LinearGradient>
          </Animated.View>
        ) : (
          <>
            <View className="px-5 mb-3">
              <Text className="text-[12px] font-bold text-foreground-secondary">
                {safeModules.length} module{safeModules.length !== 1 ? 's' : ''} added
              </Text>
            </View>
            {safeModules.map((mod, i) => (
              <ModuleEditor key={mod.id} module={mod} index={i} total={safeModules.length} />
            ))}
          </>
        )}
        </ScrollView>
      </StudioStepLayout>

      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddModal(false)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Animated.View entering={FadeInUp.springify()}>
            <View className="bg-white rounded-t-3xl max-h-[75%]">
              <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
                <View>
                  <Text className="text-[18px] font-black text-foreground">Add Module</Text>
                  <Text className="text-[12px] text-foreground-secondary mt-0.5">
                    Choose an interactive block
                  </Text>
                </View>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  className="h-9 w-9 rounded-full bg-gray-100 items-center justify-center">
                  <X size={18} color="#6B7280" />
                </Pressable>
              </View>

              <ScrollView
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {MODULE_TYPES.map((m, i) => (
                  <Animated.View key={m.type} entering={FadeInDown.delay(i * 30).springify()}>
                    <Pressable
                      onPress={() => handleAdd(m.type)}
                      accessibilityRole="button"
                      accessibilityLabel={`Add ${m.label}`}
                      className="mb-2.5"
                      style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}>
                      <LinearGradient
                        colors={m.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="flex-row items-center p-3.5 rounded-2xl"
                        style={{
                          borderWidth: 1,
                          borderColor: `${m.color}15`,
                        }}>
                        <View
                          className="h-11 w-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: `${m.color}20` }}>
                          <m.Icon size={20} color={m.color} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-[14px] font-bold text-foreground">{m.label}</Text>
                          <Text className="text-[11px] text-foreground-secondary mt-0.5">
                            {m.description}
                          </Text>
                        </View>
                        <View
                          className="h-8 w-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: `${m.color}15` }}>
                          <Plus size={16} color={m.color} />
                        </View>
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
