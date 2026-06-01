/** Offline v1: file storage uses local URIs only — no remote upload. */
export async function uploadImage(_localUri: string, _path: string): Promise<string> {
  return _localUri;
}

export async function deleteImage(_path: string): Promise<void> {
  // no-op offline
}
