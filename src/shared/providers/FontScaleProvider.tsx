import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { Text } from 'react-native';

import { useSettingsStore } from '@/stores/settings.store';

type FontSizeKey = 'small' | 'medium' | 'large';

const FONT_SCALE_MAP: Record<FontSizeKey, number> = {
  small: 0.9,
  medium: 1,
  large: 1.15,
};

type FontScaleContextValue = {
  fontScale: number;
};

const FontScaleContext = createContext<FontScaleContextValue>({ fontScale: 1 });

export function useFontScale(): FontScaleContextValue {
  return useContext(FontScaleContext);
}

type FontScaleProviderProps = {
  children: ReactNode;
};

export function FontScaleProvider({ children }: FontScaleProviderProps) {
  const fontSize = useSettingsStore((s) => s.appearanceSettings.fontSize);
  const fontScale = FONT_SCALE_MAP[fontSize] ?? 1;

  useEffect(() => {
    const textComponent = Text as typeof Text & {
      defaultProps?: { allowFontScaling?: boolean; maxFontSizeMultiplier?: number };
    };
    textComponent.defaultProps = {
      ...textComponent.defaultProps,
      allowFontScaling: true,
      maxFontSizeMultiplier: fontScale,
    };
  }, [fontScale]);

  const value = useMemo(() => ({ fontScale }), [fontScale]);

  return <FontScaleContext.Provider value={value}>{children}</FontScaleContext.Provider>;
}
