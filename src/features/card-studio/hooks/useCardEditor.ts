import { useCallback } from 'react';

import { useCardStudioStore } from '../store/card-studio.store';
import type { CardElement } from '../types';

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
    (text = 'Tap to edit') => {
      const id = `el-${Date.now()}`;
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id,
        type: 'text',
        content: text,
        x: 60,
        y: 200,
        width: 220,
        height: 40,
        rotation: 0,
        opacity: 1,
        zIndex: maxZ + 1,
        visible: true,
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
      };
      addElement(el);
      selectElement(id);
    },
    [addElement, selectElement, elements],
  );

  const addStickerElement = useCallback(
    (emoji: string) => {
      const id = `el-${Date.now()}`;
      const maxZ = elements.length > 0 ? Math.max(...elements.map((e) => e.zIndex)) : 0;
      const el: CardElement = {
        id,
        type: 'sticker',
        content: emoji,
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
    [addElement, selectElement, elements],
  );

  return {
    elements,
    selectedElement,
    selectedElementId,
    addTextElement,
    addStickerElement,
    updateElement,
    deleteElement,
    selectElement,
    undo,
    redo,
  };
}
