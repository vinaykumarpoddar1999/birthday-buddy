import * as DocumentPicker from 'expo-document-picker';

type DocumentPickerOptions = Parameters<typeof DocumentPicker.getDocumentAsync>[0];
type DocumentPickerResult = Awaited<ReturnType<typeof DocumentPicker.getDocumentAsync>>;

let pickerBusy = false;
let pickerQueue: Array<{
  resolve: (value: DocumentPickerResult) => void;
  reject: (reason: unknown) => void;
  options: DocumentPickerOptions | undefined;
}> = [];

async function runNextPicker(): Promise<void> {
  if (pickerBusy || pickerQueue.length === 0) return;
  pickerBusy = true;
  const { resolve, reject, options } = pickerQueue.shift()!;
  try {
    const result = await DocumentPicker.getDocumentAsync(options);
    resolve(result);
  } catch (error) {
    reject(error);
  } finally {
    pickerBusy = false;
    void runNextPicker();
  }
}

/** Serializes document picker calls to avoid "Different document picking in progress" errors. */
export function pickDocumentAsync(
  options?: DocumentPickerOptions,
): Promise<DocumentPickerResult> {
  return new Promise((resolve, reject) => {
    pickerQueue.push({ resolve, reject, options });
    void runNextPicker();
  });
}
