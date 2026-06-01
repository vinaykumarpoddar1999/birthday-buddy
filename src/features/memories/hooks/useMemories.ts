/** Offline v1: memories not persisted yet */
export function useMemories() {
  return { memories: [], isLoading: false, createMemory: async () => {}, deleteMemory: async () => {} };
}
