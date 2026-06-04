/** In-memory route context for engagement prompt gating (no React hooks in services). */

let currentRootSegment: string | null = null;
let mainAppEntered = false;

export function setEngagementRouteSegment(segment: string | null): void {
  currentRootSegment = segment;
}

export function getEngagementRouteSegment(): string | null {
  return currentRootSegment;
}

export function isOnMainAppRoute(): boolean {
  return currentRootSegment === '(tabs)';
}

export function hasEnteredMainApp(): boolean {
  return mainAppEntered;
}

export function markMainAppEntered(): void {
  mainAppEntered = true;
}

export function isOnAuthRoute(): boolean {
  return currentRootSegment === '(auth)';
}
