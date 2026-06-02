import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  ImagePlus,
  Layers,
  Palette,
  Shapes,
  Sparkles,
  Type,
  Wand2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { feedback } from '@/shared/feedback';
import { useCardStudioStore } from '../../store/card-studio.store';
import { useCardEditor } from '../../hooks/useCardEditor';
import { BackgroundStudio } from './BackgroundStudio';
import { DecorationPicker } from './DecorationPicker';
import { ElementActionBar } from './ElementActionBar';
import { FormatPicker } from './FormatPicker';
import { ImageControls } from './ImageControls';
import { PersonalizationForm } from './PersonalizationForm';
import { QuickDesignPanel } from './QuickDesignPanel';
import { TextControls } from './TextControls';

const TOOL_ITEMS = [
  { id: 'quick' as const, label: 'Quick', icon: Wand2 },
  { id: 'background' as const, label: 'Background', icon: Palette },
  { id: 'elements' as const, label: 'Stickers', icon: Shapes },
  { id: 'content' as const, label: 'Content', icon: Type },
  { id: 'image' as const, label: 'Photo', icon: ImagePlus },
];

const PURPLE = '#7C3AED';
const PINK = '#EC4899';
const MUTED = '#9CA3AF';
const BORDER = '#F3F4F6';

export function ContextualToolbar() {
  const activePanel = useCardStudioStore((s) => s.activePanel);
  const setActivePanel = useCardStudioStore((s) => s.setActivePanel);
  const editorModeValue = useCardStudioStore((s) => s.editorMode);
  const setEditorMode = useCardStudioStore((s) => s.setEditorMode);
  const selectedElement = useCardStudioStore((s) =>
    s.selectedElementId ? s.elements.find((e) => e.id === s.selectedElementId) ?? null : null,
  );
  const selectElement = useCardStudioStore((s) => s.selectElement);
  const isDragging = useCardStudioStore((s) => s.isDragging);
  const { addTextElement, addShapeElement } = useCardEditor();
  const addElement = useCardStudioStore((s) => s.addElement);

  const addPhotoElement = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      feedback.error('Permission needed', 'Allow photo library to add image elements.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets[0]) return;

    const maxZ = Math.max(
      0,
      ...useCardStudioStore.getState().elements.map((element) => element.zIndex),
    );
    addElement({
      id: `el-${Date.now()}`,
      type: 'image',
      uri: result.assets[0].uri,
      x: 52,
      y: 95,
      width: 180,
      height: 180,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      visible: true,
      borderRadius: 18,
    });
  };

  const renderPanel = () => {
    if (selectedElement?.type === 'text') {
      return (
        <>
          <ElementActionBar element={selectedElement} />
          <TextControls element={selectedElement} />
        </>
      );
    }
    if (selectedElement?.type === 'image') {
      return (
        <>
          <ElementActionBar element={selectedElement} />
          <ImageControls element={selectedElement} />
        </>
      );
    }
    if (selectedElement) {
      return <ElementActionBar element={selectedElement} />;
    }

    if (editorModeValue === 'quick') {
      return <QuickDesignPanel />;
    }

    switch (activePanel) {
      case 'background':
        return (
          <>
            <FormatPicker />
            <BackgroundStudio />
          </>
        );
      case 'elements':
        return (
          <View>
            <View style={styles.addRow}>
              <Pressable
                onPress={() => addTextElement('Your text here')}
                style={styles.addTextBtn}
                accessibilityRole="button"
                accessibilityLabel="Add text element">
                <Text style={styles.addTextLabel}>+ Add Text</Text>
              </Pressable>
              <Pressable
                onPress={addPhotoElement}
                style={styles.addPhotoBtn}
                accessibilityRole="button"
                accessibilityLabel="Add photo element">
                <ImagePlus size={14} color={PINK} />
                <Text style={styles.addPhotoLabel}>+ Add Photo</Text>
              </Pressable>
            </View>
            <View style={styles.addRow}>
              <Pressable
                onPress={() => addShapeElement('rounded')}
                style={styles.addShapeBtn}
                accessibilityRole="button"
                accessibilityLabel="Add shape">
                <Text style={styles.addShapeLabel}>Add Shape</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
                  if (cameraPerm.status !== 'granted') {
                    feedback.error('Permission needed', 'Allow camera access first.');
                    return;
                  }
                  const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    quality: 0.85,
                    mediaTypes: ['images'],
                  });
                  if (result.canceled || !result.assets[0]) return;
                  const maxZ = Math.max(
                    0,
                    ...useCardStudioStore.getState().elements.map((element) => element.zIndex),
                  );
                  addElement({
                    id: `el-${Date.now()}`,
                    type: 'image',
                    uri: result.assets[0].uri,
                    x: 52,
                    y: 95,
                    width: 180,
                    height: 180,
                    rotation: 0,
                    opacity: 1,
                    zIndex: maxZ + 1,
                    visible: true,
                    borderRadius: 18,
                  });
                }}
                style={styles.addShapeBtn}
                accessibilityRole="button"
                accessibilityLabel="Take photo with camera">
                <Camera size={14} color={MUTED} />
                <Text style={styles.addShapeLabel}>Camera Shot</Text>
              </Pressable>
            </View>
            <DecorationPicker />
          </View>
        );
      case 'content':
        return (
          <ScrollView
            style={{ maxHeight: 280 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled={!isDragging}
            keyboardShouldPersistTaps="handled">
            <PersonalizationForm />
          </ScrollView>
        );
      case 'image':
        return (
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              Tap a photo on the canvas to edit, or add one from Stickers tab.
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.emptyPanel}>
            <Sparkles size={22} color={PURPLE} />
            <Text style={styles.emptyTitle}>Advanced editing</Text>
            <Text style={styles.emptySubtitle}>
              Pick Background, Stickers, Content, or Photo above. Tap any canvas element for quick controls.
            </Text>
          </View>
        );
    }
  };

  const isQuickMode = editorModeValue === 'quick';

  return (
    <View style={styles.root}>
      <View style={styles.modeRow}>
        <Pressable
          onPress={() => {
            selectElement(null);
            setEditorMode('quick');
          }}
          style={[styles.modeBtn, isQuickMode && styles.modeBtnActive]}
          accessibilityRole="button"
          accessibilityLabel={isQuickMode ? 'Quick mode, active' : 'Switch to quick mode'}>
          <Wand2 size={12} color={isQuickMode ? PURPLE : MUTED} />
          <Text style={[styles.modeLabel, isQuickMode && styles.modeLabelActive]}>Quick</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            selectElement(null);
            setEditorMode('advanced');
          }}
          style={[styles.modeBtn, !isQuickMode && styles.modeBtnActive]}
          accessibilityRole="button"
          accessibilityLabel={!isQuickMode ? 'Advanced mode, active' : 'Switch to advanced mode'}>
          <Layers size={12} color={!isQuickMode ? PURPLE : MUTED} />
          <Text style={[styles.modeLabel, !isQuickMode && styles.modeLabelActive]}>Advanced</Text>
        </Pressable>
      </View>

      <Text style={styles.modeHint}>
        {isQuickMode
          ? 'Fill details & auto-generate — switch to Advanced for full control'
          : 'Full canvas control — backgrounds, stickers, layers & more'}
      </Text>

      {!selectedElement && !isQuickMode ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolScroll}
          contentContainerStyle={styles.toolScrollContent}>
          {TOOL_ITEMS.filter((t) => t.id !== 'quick').map(({ id, label, icon: Icon }) => {
            const isActive = activePanel === id;
            return (
              <Pressable
                key={id}
                onPress={() => setActivePanel(isActive ? 'none' : id)}
                style={[styles.toolTab, isActive && styles.toolTabActive]}
                accessibilityRole="button"
                accessibilityLabel={`${label}${isActive ? ', active' : ''}`}>
                <Icon size={14} color={isActive ? PURPLE : MUTED} />
                <Text style={[styles.toolTabLabel, isActive && styles.toolTabLabelActive]}>{label}</Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setActivePanel(activePanel === 'background' ? 'none' : 'background')}
            style={[styles.toolTab, activePanel === 'background' && styles.toolTabActive]}
            accessibilityRole="button"
            accessibilityLabel="Card format">
            <Layers size={14} color={activePanel === 'background' ? PURPLE : MUTED} />
            <Text style={[styles.toolTabLabel, activePanel === 'background' && styles.toolTabLabelActive]}>
              Format
            </Text>
          </Pressable>
        </ScrollView>
      ) : selectedElement ? (
        <View style={styles.editingBanner}>
          <Text style={styles.editingBannerText}>Editing {selectedElement.type}</Text>
          <Pressable onPress={() => selectElement(null)} accessibilityRole="button" accessibilityLabel="Done editing">
            <Text style={styles.doneBtn}>Done</Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        style={styles.panelScroll}
        scrollEnabled={!isDragging}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled>
        {renderPanel()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: '#FFFFFF',
  },
  modeRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: MUTED,
  },
  modeLabelActive: {
    color: PURPLE,
  },
  modeHint: {
    fontSize: 10,
    color: MUTED,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  toolScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
    flexGrow: 0,
  },
  toolScrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  toolTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  toolTabActive: {
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  toolTabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  toolTabLabelActive: {
    color: PURPLE,
  },
  editingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  editingBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: PURPLE,
    textTransform: 'capitalize',
  },
  doneBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: PURPLE,
  },
  panelScroll: {
    flex: 1,
  },
  addRow: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 8,
  },
  addTextBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
    alignItems: 'center',
  },
  addTextLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: PURPLE,
  },
  addPhotoBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(236,72,153,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(236,72,153,0.2)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  addPhotoLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: PINK,
  },
  addShapeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  addShapeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  hintBox: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  hintText: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyPanel: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});
