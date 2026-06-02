import React from 'react';
import { View } from 'react-native';

interface StudioStepLayoutProps {
  intro?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/** Keeps step content directly under the header with a flex scroll region (fixes collapsed FlatLists). */
export function StudioStepLayout({ intro, children, footer }: StudioStepLayoutProps) {
  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      {intro}
      <View style={{ flex: 1, minHeight: 0 }}>{children}</View>
      {footer}
    </View>
  );
}
