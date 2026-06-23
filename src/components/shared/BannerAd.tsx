import { TossAds } from '@apps-in-toss/web-framework';
import { useEffect, useRef } from 'react';
import { isBannerInitialized, initBannerAds } from '../../lib/ad';

// 콘솔에서 발급받은 실제 배너 광고 그룹 ID
const BANNER_AD_GROUP_ID = 'ait.v2.live.d72d70f45a574984';

interface BannerAdProps {
  adGroupId?: string;
  height?: number;
}

export function BannerAd({ adGroupId = BANNER_AD_GROUP_ID, height = 96 }: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TossAds.attachBanner?.isSupported?.()) return;

    let attached: { destroy: () => void } | undefined;

    initBannerAds().then(() => {
      if (!isBannerInitialized() || !containerRef.current) return;

      attached = TossAds.attachBanner(adGroupId, containerRef.current, {
        theme: 'auto',
        tone: 'blackAndWhite',
        variant: 'expanded',
        callbacks: {
          onAdFailedToRender: (payload) => {
            console.error('[배너 광고] 렌더링 실패:', payload.error.message);
          },
          onNoFill: () => {
            console.warn('[배너 광고] 표시할 광고 없음');
          },
        },
      });
    });

    return () => {
      attached?.destroy();
    };
  }, [adGroupId]);

  return <div ref={containerRef} style={{ width: '100%', height }} />;
}
