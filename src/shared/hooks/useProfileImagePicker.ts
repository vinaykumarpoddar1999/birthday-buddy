import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

import { useFeedback } from '@/shared/hooks/useFeedback';

export type ProfileImageSource = 'camera' | 'gallery';

export function useProfileImagePicker(onImageSelected: (uri: string | null) => void) {
  const { showError, showActionSheet, showConfirm } = useFeedback();

  const pickImage = useCallback(
    async (source: ProfileImageSource) => {
      let result: ImagePicker.ImagePickerResult;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showError('Permission needed', 'Camera access is required to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showError('Permission needed', 'Photo library access is required.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.85,
        });
      }

      if (result.canceled || !result.assets[0]) return;

      try {
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 512, height: 512 } }],
          { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
        );
        const dir = `${FileSystem.documentDirectory}profile/`;
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        const dest = `${dir}avatar-${Date.now()}.jpg`;
        await FileSystem.copyAsync({ from: manipulated.uri, to: dest });
        onImageSelected(dest);
      } catch {
        onImageSelected(result.assets[0].uri);
      }
    },
    [onImageSelected, showError],
  );

  const showImagePicker = useCallback(() => {
    showActionSheet({
      title: 'Profile Photo',
      options: [
        { label: 'Take Photo', onPress: () => void pickImage('camera') },
        { label: 'Choose From Gallery', onPress: () => void pickImage('gallery') },
        {
          label: 'Remove Photo',
          destructive: true,
          onPress: () => {
            showConfirm({
              title: 'Remove Photo',
              message: 'Remove your profile photo?',
              destructive: true,
              confirmLabel: 'Remove',
              onConfirm: () => onImageSelected(null),
            });
          },
        },
      ],
    });
  }, [onImageSelected, pickImage, showActionSheet, showConfirm]);

  return { showImagePicker, pickImage };
}
