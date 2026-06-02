import type { CanvasFormat } from '../types';

export const CANVAS_DIMENSIONS: Record<CanvasFormat, { w: number; h: number }> = {
  portrait: { w: 340, h: 480 },
  landscape: { w: 480, h: 340 },
  square: { w: 400, h: 400 },
};

export function getCanvasDimensions(format: CanvasFormat) {
  return CANVAS_DIMENSIONS[format];
}

export type CanvasScaleMode = 'editor' | 'preview' | 'export';

export function getCanvasScale(
  screenWidth: number,
  format: CanvasFormat,
  mode: CanvasScaleMode = 'editor',
) {
  const { w, h } = getCanvasDimensions(format);
  const padding = mode === 'editor' ? 32 : 48;
  const maxW = screenWidth - padding;
  const scaleByW = maxW / w;

  if (mode === 'export') return 1;
  if (mode === 'preview') return Math.min(scaleByW, 0.92);
  return Math.min(scaleByW, 0.88);
}
