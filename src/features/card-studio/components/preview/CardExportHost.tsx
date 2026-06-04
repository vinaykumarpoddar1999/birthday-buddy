import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import Constants from 'expo-constants';

import type { ViewShotCaptureHandle } from '../../utils/card-export';
import type {
  CanvasFormat,
  CardBackground,
  CardElement,
  CardTemplate,
  PersonalizationData,
} from '../../types';
import { CardRenderer } from './CardRenderer';

type Props = {
  template: CardTemplate;
  personalization: PersonalizationData;
  elements: CardElement[];
  customBackground: CardBackground | null;
  canvasFormat: CanvasFormat;
};

type ViewShotInstance = {
  capture?: ViewShotCaptureHandle['capture'];
};

export const CardExportHost = React.forwardRef<ViewShotCaptureHandle, Props>(
  function CardExportHost(
    { template, personalization, elements, customBackground, canvasFormat },
    forwardedRef,
  ) {
    const viewShotRef = useRef<ViewShotInstance>(null);
    const plainRef = useRef<View>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [ViewShot, setViewShot] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
      if (Constants.appOwnership === 'expo') return;
      import('react-native-view-shot')
        .then((mod) => setViewShot(() => mod.default as React.ComponentType<any>))
        .catch(() => setViewShot(null));
    }, []);

    useImperativeHandle(forwardedRef, () => ({
      capture: async (options) => {
        if (viewShotRef.current?.capture) {
          return viewShotRef.current.capture(options);
        }
        return '';
      },
    }));

    const card = (
      <CardRenderer
        template={template}
        personalization={personalization}
        elements={elements}
        scale={1}
        customBackground={customBackground}
        canvasFormat={canvasFormat}
      />
    );

    if (!ViewShot) {
      return (
        <View ref={plainRef} collapsable={false}>
          {card}
        </View>
      );
    }

    return (
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} collapsable={false}>
        {card}
      </ViewShot>
    );
  },
);
