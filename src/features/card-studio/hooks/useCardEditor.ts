import { useCallback } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';
import type { CardElement, TextPreset } from '../types';
import { TEXT_PRESETS } from '../utils/card-element-render';

export function useCardEditor() {
  const elements = useCardStudioStore((s) => s.elements);
  const selectedElementId = useCardStudioStore((s) => s.selectedElementId);
  const addElement = useCardStudioStore((s) => s.addElement);
  const updateElement = useCardStudioStore((s) => s.updateElement);
  const deleteElement = useCardStudioStore((s) => s.deleteElement);
  const selectElement = useCardStudioStore((s) => s.selectElement);
  const undo = useCardStudioStore((s) => s.undo);
  const redo = useCardStudioStore((s) => s.redo);

  const selectedElement = elements.find((el) => el.id === selectedElementId) || null;

  const addTextElement = useCallback(
    (text = 'Tap to edit', preset: TextPreset = 'custom') => {
      const id = `el-${Date.now()}`;
      const currentElements = useCardStudioStore.getState().elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map((e) => e.zIndex)) : 0;
      const presetStyle = preset !== 'custom' && TEXT_PRESETS[preset as keyof typeof TEXT_PRESETS]
        ? TEXT_PRESETS[preset as keyof typeof TEXT_PRESETS]
        : { fontSize: 18, fontWeight: '400' as const, textPreset: 'custom' as const };
      const el: CardElement = {
        id,
        type: 'text',
        content: text,
        x: 60,
        y: 200,
        width: 220,
        height: Math.max(40, presetStyle.fontSize * 1.5),
        rotation: 0,
        opacity: 1,
        zIndex: maxZ + 1,
        visible: true,
        fontSize: presetStyle.fontSize,
        fontWeight: presetStyle.fontWeight,
        textPreset: presetStyle.textPreset,
        color: '#000000',
        textAlign: 'center',
      };
      addElement(el);
      selectElement(id);
    },
    [addElement, selectElement],
  );

  const addStickerElement = useCallback(
    (iconKey: string) => {
      const id = `el-${Date.now()}`;
      const currentElements = useCardStudioStore.getState().elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id,
        type: 'sticker',
        content: `icon:${iconKey}`,
        x: 130,
        y: 200,
        width: 50,
        height: 50,
        rotation: 0,
        opacity: 1,
        zIndex: maxZ + 1,
        visible: true,
        fontSize: 36,
      };
      addElement(el);
      selectElement(id);
    },
    [addElement, selectElement],
  );

  const addShapeElement = useCallback(
    (shapeType: 'rectangle' | 'circle' | 'rounded' = 'rounded') => {
      const id = `el-${Date.now()}`;
      const currentElements = useCardStudioStore.getState().elements;
      const maxZ = currentElements.length > 0 ? Math.max(...currentElements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id,
        type: 'shape',
        shapeType,
        x: 100,
        y: 180,
        width: 140,
        height: 80,
        rotation: 0,
        opacity: 0.6,
        zIndex: maxZ + 1,
        visible: true,
        backgroundColor: 'rgba(124,58,237,0.25)',
        borderRadius: shapeType === 'circle' ? 999 : 12,
      };
      addElement(el);
      selectElement(id);
    },
    [addElement, selectElement],
  );

  return {
    elements,
    selectedElement,
    selectedElementId,
    addTextElement,
    addStickerElement,
    addShapeElement,
    updateElement,
    deleteElement,
    selectElement,
    undo,
    redo,
  };
}
