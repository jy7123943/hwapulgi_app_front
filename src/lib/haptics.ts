import { generateHapticFeedback } from '@apps-in-toss/web-framework';

type HapticType =
  | 'tickWeak'
  | 'tap'
  | 'tickMedium'
  | 'softMedium'
  | 'basicWeak'
  | 'basicMedium'
  | 'success'
  | 'error'
  | 'wiggle'
  | 'confetti';

export async function safeHaptic(type: HapticType) {
  try {
    await generateHapticFeedback({ type });
  } catch {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      const durationByType: Record<HapticType, number> = {
        tickWeak: 12,
        tap: 14,
        tickMedium: 20,
        softMedium: 18,
        basicWeak: 16,
        basicMedium: 26,
        success: 30,
        error: 28,
        wiggle: 22,
        confetti: 34,
      };

      navigator.vibrate(durationByType[type]);
    }
  }
}
