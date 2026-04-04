type HitSoundLevel = "soft" | "medium" | "hard";

function createAudioPool(src: string, poolSize = 2) {
  if (typeof window === "undefined" || typeof Audio === "undefined") {
    return [];
  }

  return Array.from({ length: poolSize }, () => {
    const audio = new Audio(src);
    audio.preload = "auto";
    return audio;
  });
}

function createSoundRotator(srcList: string[], poolSize = 2) {
  const pools = srcList.map((src) => createAudioPool(src, poolSize));
  let poolIndex = 0;
  let audioIndex = 0;

  return () => {
    if (pools.length === 0) {
      return;
    }

    const currentPool = pools[poolIndex];
    if (currentPool.length === 0) {
      return;
    }

    const audio = currentPool[audioIndex];
    poolIndex = (poolIndex + 1) % pools.length;
    audioIndex = (audioIndex + 1) % currentPool.length;

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  };
}

const base = import.meta.env.BASE_URL;

const playSoft = createSoundRotator(
  [
    `${base}sound/hit-soft1.mp3`,
    `${base}sound/hit-soft2.mp3`,
    `${base}sound/hit-soft3.mp3`,
  ],
  2,
);

const playMedium = createSoundRotator(
  [
    `${base}sound/hit-medium1.mp3`,
    `${base}sound/hit-medium2.mp3`,
    `${base}sound/hit-medium3.mp3`,
  ],
  2,
);

const playHard = createSoundRotator(
  [
    `${base}sound/hit-hard1.mp3`,
    `${base}sound/hit-hard2.mp3`,
    `${base}sound/hit-hard3.mp3`,
  ],
  2,
);

export function playHitSound(level: HitSoundLevel) {
  if (level === "hard") {
    playHard();
    return;
  }

  if (level === "medium") {
    playMedium();
    return;
  }

  playSoft();
}
