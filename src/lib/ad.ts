import { loadFullScreenAd, showFullScreenAd, TossAds } from '@apps-in-toss/web-framework';

// 콘솔에서 발급받은 실제 광고 그룹 ID
const REWARDED_AD_GROUP_ID = 'ait-ad-test-rewarded-id';

let isRewardedAdLoaded = false;
let rewardedCleanup: (() => void) | null = null;

// ── 리워드 광고 ──

export function preloadRewardedAd() {
  if (isRewardedAdLoaded) return;
  if (!loadFullScreenAd.isSupported()) return;

  rewardedCleanup = loadFullScreenAd({
    options: { adGroupId: REWARDED_AD_GROUP_ID },
    onEvent: (event) => {
      if (event.type === 'loaded') {
        isRewardedAdLoaded = true;
      }
    },
    onError: (error) => {
      console.error('[리워드 광고] 로드 실패:', error);
      isRewardedAdLoaded = false;
    },
  });
}

export function showRewardedAd(): Promise<{ rewarded: boolean; amount?: number }> {
  if (!isRewardedAdLoaded || !showFullScreenAd.isSupported()) {
    return Promise.resolve({ rewarded: false });
  }

  return new Promise((resolve) => {
    let earned = false;
    let rewardAmount: number | undefined;

    showFullScreenAd({
      options: { adGroupId: REWARDED_AD_GROUP_ID },
      onEvent: (event) => {
        switch (event.type) {
          case 'userEarnedReward':
            earned = true;
            rewardAmount = event.data.unitAmount;
            break;
          case 'dismissed':
            resolve({ rewarded: earned, amount: rewardAmount });
            isRewardedAdLoaded = false;
            preloadRewardedAd();
            break;
          case 'failedToShow':
            resolve({ rewarded: false });
            isRewardedAdLoaded = false;
            break;
        }
      },
      onError: (error) => {
        console.error('[리워드 광고] 표시 실패:', error);
        resolve({ rewarded: false });
      },
    });
  });
}

export function isRewardedAdReady(): boolean {
  return isRewardedAdLoaded;
}

// ── 배너 광고 SDK 초기화 ──

let bannerInitialized = false;
let bannerInitPromise: Promise<void> | null = null;

export function initBannerAds(): Promise<void> {
  if (bannerInitialized) return Promise.resolve();
  if (bannerInitPromise) return bannerInitPromise;
  if (!TossAds.initialize.isSupported()) return Promise.resolve();

  bannerInitPromise = new Promise((resolve) => {
    TossAds.initialize({
      callbacks: {
        onInitialized: () => {
          bannerInitialized = true;
          resolve();
        },
        onInitializationFailed: (error) => {
          console.error('[배너 광고] SDK 초기화 실패:', error);
          resolve();
        },
      },
    });
  });

  return bannerInitPromise;
}

export function isBannerInitialized(): boolean {
  return bannerInitialized;
}

// ── 정리 ──

export function cleanupAllAds() {
  rewardedCleanup?.();
  rewardedCleanup = null;
  isRewardedAdLoaded = false;

  if (TossAds.destroyAll.isSupported()) {
    TossAds.destroyAll();
  }
}
