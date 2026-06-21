/**
 * 브라우저(등급분류 심의용) 데모 빌드 전용 @toss/tds-mobile-ait 스텁.
 * TDSMobileAITProvider는 토스 밖에서 throw 하므로, 데모 빌드에서는 단순 통과 래퍼로 대체한다.
 */
import type { PropsWithChildren } from 'react';

export function TDSMobileAITProvider({ children }: PropsWithChildren<{ brandPrimaryColor?: string }>) {
  return <>{children}</>;
}