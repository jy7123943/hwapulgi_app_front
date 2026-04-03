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
      navigator.vibrate(type === 'success' ? 30 : 15);
    }
  }
}
