import { loadFullScreenAd, showFullScreenAd, TossAds } from '@apps-in-toss/web-framework';

// 콘솔에서 발급받은 실제 광고 그룹 ID
// TODO: 리워드 광고 그룹 발급 후 실제 ID 입력
const REWARDED_AD_GROUP_ID = 'ait-ad-test-rewarded-id';
const INTERSTITIAL_AD_GROUP_ID = 'ait.v2.live.690a2a3bf49549d5'; // 전면 광고

let isRewardedAdLoaded = false;
let isInterstitialAdLoaded = false;
let rewardedCleanup: (() => void) | null = null;
let interstitialCleanup: (() => void) | null = null;

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

// ── 전면형 광고 ──

export function preloadInterstitialAd() {
  if (isInterstitialAdLoaded) return;
  if (!loadFullScreenAd.isSupported()) return;

  interstitialCleanup = loadFullScreenAd({
    options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
    onEvent: (event) => {
      if (event.type === 'loaded') {
        isInterstitialAdLoaded = true;
      }
    },
    onError: (error) => {
      console.error('[전면 광고] 로드 실패:', error);
      isInterstitialAdLoaded = false;
    },
  });
}

export function showInterstitialAd(): Promise<void> {
  if (!isInterstitialAdLoaded || !showFullScreenAd.isSupported()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    showFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'dismissed' || event.type === 'failedToShow') {
          isInterstitialAdLoaded = false;
          preloadInterstitialAd();
          resolve();
        }
      },
      onError: (error) => {
        console.error('[전면 광고] 표시 실패:', error);
        resolve();
      },
    });
  });
}

export function isInterstitialAdReady(): boolean {
  return isInterstitialAdLoaded;
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

  interstitialCleanup?.();
  interstitialCleanup = null;
  isInterstitialAdLoaded = false;

  if (TossAds.destroyAll.isSupported()) {
    TossAds.destroyAll();
  }
}
