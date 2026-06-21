/** @jsxImportSource @emotion/react */
/**
 * 브라우저(등급분류 심의용) 데모 빌드 전용 @toss/tds-mobile 스텁.
 * 토스 앱 빌드(ait build)에는 사용되지 않으며, Vite alias(WEB_DEMO=1)에서만 대체된다.
 * 토스 전용 UI 라이브러리가 토스 밖에서 throw 하는 것을 우회해 일반 브라우저에서 렌더되게 한다.
 */
import type { ElementType } from 'react';

export function Text({ as, css, children, typography, fontWeight, ...rest }: any) {
  const Tag = (as ?? 'span') as ElementType;
  return (
    <Tag css={css} {...rest}>
      {children}
    </Tag>
  );
}

export function Button({ css, children, display, onClick, disabled, type, ...rest }: any) {
  return (
    <button
      type={type ?? 'button'}
      onClick={onClick}
      disabled={disabled}
      css={[{ cursor: 'pointer', font: 'inherit' }, css]}
      {...rest}
    >
      {children}
    </button>
  );
}

export function FixedBottomCTA({ css, children, onClick, disabled, ...rest }: any) {
  return (
    <div
      css={[
        { position: 'fixed', left: 0, right: 0, bottom: 0, padding: 16, boxSizing: 'border-box', zIndex: 50 },
        css,
      ]}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        css={{ width: '100%', minHeight: 56, borderRadius: 999, cursor: 'pointer', font: 'inherit' }}
        {...rest}
      >
        {children}
      </button>
    </div>
  );
}

export function TextField({ css, value, onChange, placeholder, maxLength, autoFocus, ...rest }: any) {
  return (
    <input
      css={[{ width: '100%', border: 'none', outline: 'none', font: 'inherit', padding: 12, background: 'transparent' }, css]}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoFocus={autoFocus}
    />
  );
}

export function Slider({ css, value, onValueChange, min = 0, max = 100, step = 1, color }: any) {
  return (
    <input
      type="range"
      css={[{ width: '100%', accentColor: color }, css]}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
    />
  );
}

const frameShape = new Proxy({}, { get: () => 'clean' });
export const Asset: any = {
  Icon: (_props: any) => <span aria-hidden />,
  Image: (_props: any) => <span aria-hidden />,
  frameShape,
};