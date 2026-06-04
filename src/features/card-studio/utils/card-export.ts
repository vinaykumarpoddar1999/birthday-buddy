import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { InteractionManager, PixelRatio, type View } from 'react-native';

import { getCanvasDimensions } from './canvas-dimensions';
import type { CanvasFormat } from '../types';

const HD_PIXEL_RATIO = Math.min(PixelRatio.get(), 3);
const HD_SCALE = 2;

export type ViewShotCaptureHandle = {
  capture?: (options?: {
    format?: 'png' | 'jpg' | 'webm';
    quality?: number;
    result?: 'tmpfile' | 'base64' | 'data-uri';
    width?: number;
    height?: number;
  }) => Promise<string>;
};

export function isCardExportAvailable(): boolean {
  return Constants.appOwnership !== 'expo';
}

export function getExportUnavailableMessage(): string {
  if (Constants.appOwnership === 'expo') {
    return 'HD export needs a development build. Run: npx expo run:android (or iOS), then open with the dev client QR — or press s in the terminal and use Expo Go for UI testing only.';
  }
  return 'Card capture is unavailable on this device. Rebuild the app and try again.';
}

export type CaptureCardOptions = {
  cardRef: React.RefObject<View | null>;
  canvasFormat: CanvasFormat;
  viewShotRef?: React.RefObject<ViewShotCaptureHandle | null>;
};

async function waitForLayout(): Promise<void> {
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
  await new Promise((r) => setTimeout(r, 280));
}

async function persistCaptureUri(tmpUri: string): Promise<string> {
  const cacheDir = FileSystem.cacheDirectory;
  if (!cacheDir) return tmpUri;
  const persistentUri = `${cacheDir}card-export-${Date.now()}.png`;
  await FileSystem.copyAsync({ from: tmpUri, to: persistentUri });
  return persistentUri;
}

async function getCaptureRef(): Promise<
  typeof import('react-native-view-shot').captureRef | null
> {
  try {
    const mod = await import('react-native-view-shot');
    return mod.captureRef;
  } catch (error) {
    if (__DEV__) {
      console.warn('[card-export] react-native-view-shot unavailable:', error);
    }
    return null;
  }
}

export async function captureCardImage({
  cardRef,
  canvasFormat,
  viewShotRef,
}: CaptureCardOptions): Promise<string | null> {
  if (!isCardExportAvailable()) {
    return null;
  }

  const { w: cardW, h: cardH } = getCanvasDimensions(canvasFormat);
  const exportWidth = Math.round(cardW * HD_PIXEL_RATIO * HD_SCALE);
  const exportHeight = Math.round(cardH * HD_PIXEL_RATIO * HD_SCALE);

  await waitForLayout();

  try {
    if (viewShotRef?.current?.capture) {
      const tmpUri = await viewShotRef.current.capture({
        format: 'png',
        quality: 1,
        result: 'tmpfile',
        width: exportWidth,
        height: exportHeight,
      });
      return persistCaptureUri(tmpUri);
    }

    const captureRef = await getCaptureRef();
    if (!captureRef || !cardRef.current) {
      if (__DEV__) console.warn('[card-export] Capture ref unavailable');
      return null;
    }

    const tmpUri = await captureRef(cardRef, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
      width: exportWidth,
      height: exportHeight,
    });
    return persistCaptureUri(tmpUri);
  } catch (error) {
    if (__DEV__) {
      console.warn('[card-export] Capture failed:', error);
    }
    return null;
  }
}
