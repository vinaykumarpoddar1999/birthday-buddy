import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const REMOTE_ALARM_URI =
  'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c2a9dba2.mp3?filename=alarm-clock-90867.mp3';

let player: AudioPlayer | null = null;

export async function startBirthdayAlarmAudio(): Promise<void> {
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    });
    await stopBirthdayAlarmAudio();

    let source: number | { uri: string };
    try {
      source = require('../../../assets/sounds/alarm.mp3');
    } catch {
      source = { uri: REMOTE_ALARM_URI };
    }

    player = createAudioPlayer(source);
    player.loop = true;
    player.volume = 1;
    player.play();
  } catch {
    // Vibration-only fallback handled by birthday-alarm.service
  }
}

export async function stopBirthdayAlarmAudio(): Promise<void> {
  if (!player) return;
  try {
    player.pause();
    player.remove();
  } catch {
    /* ignore */
  }
  player = null;
}
