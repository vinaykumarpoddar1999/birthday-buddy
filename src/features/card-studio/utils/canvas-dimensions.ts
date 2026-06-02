import type { CanvasFormat } from '../types';

export const CANVAS_DIMENSIONS: Record<CanvasFormat, { w: number; h: number }> = {
  portrait: { w: 340, h: 480 },
  landscape: { w: 480, h: 340 },
  square: { w: 400, h: 400 },
};

export function getCanvasDimensions(format: CanvasFormat) {
  return CANVAS_DIMENSIONS[format];
}

export function getCanvasScale(screenWidth: number, format: CanvasFormat, padding = 48) {
  const { w, h } = getCanvasDimensions(format);
  const maxW = screenWidth - padding;
  const scaleByW = maxW / w;
  const scaleByH = 0.42; // keep canvas prominent but leave room for controls
  return Math.min(scaleByW, scaleByH, 0.92);
}
