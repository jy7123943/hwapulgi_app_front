/**
 * 브라우저(등급분류 심의용) 데모 빌드 전용 @apps-in-toss/web-framework 스텁.
 * 광고/햅틱/리더보드 등 네이티브 기능은 브라우저에서 미지원(no-op)으로 두고,
 * appLogin은 reject 시켜 게스트 로그인으로 폴백되게 한다.
 */
const unsupported = () => false;

function noopWithSupport<T extends (...args: any[]) => any>(fn: T) {
  return Object.assign(fn, { isSupported: unsupported });
}

export const TossAds: any = {
  initialize: noopWithSupport((opts?: any) => {
    opts?.callbacks?.onInitialized?.();
  }),
  attachBanner: noopWithSupport((_adGroupId?: any, _el?: any, _opts?: any) => ({
    destroy: () => {},
  })),
  destroyAll: noopWithSupport(() => {}),
};

export async function appLogin(): Promise<{ authorizationCode: string; referrer: string }> {
  throw new Error('web-demo: appLogin은 브라우저에서 지원되지 않습니다 (게스트로 폴백).');
}

export const generateHapticFeedback = noopWithSupport((_opts?: any) => {});
export const loadFullScreenAd = noopWithSupport((_opts?: any) => () => {});
export const showFullScreenAd = noopWithSupport((_opts?: any) => {});
export const submitGameCenterLeaderBoardScore = noopWithSupport((_opts?: any) => {});