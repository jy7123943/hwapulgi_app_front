import { colors } from '@toss/tds-colors';
import { Button, Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import { formatSessionLabel } from '../../../lib/storage';
import type { SessionResult } from '../../../types';

interface RecentListProps {
  onReplay: (session: SessionResult) => void;
  sessions: SessionResult[];
}

export function RecentList({ onReplay, sessions }: RecentListProps) {
  return (
    <SectionCard css={{ background: '#ffffff' }}>
      <Text as="div" typography="t6" fontWeight="bold" css={{ marginBottom: 12 }}>
        최근 기록
      </Text>
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {sessions.map((session) => (
          <article
            key={session.id}
            css={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              borderRadius: 18,
              background: colors.grey50,
            }}
          >
            <div>
              <strong css={{ display: 'block', marginBottom: 4 }}>{formatSessionLabel(session)}</strong>
              <p css={{ margin: 0, color: colors.grey600 }}>
                {session.hits} hits · {session.angerBefore} → {session.angerAfter}
              </p>
            </div>
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <Text as="span" typography="t7" fontWeight="bold" css={{ color: '#c96f2a' }}>
                {session.releasedPercent}%
              </Text>
              <Button
                color="dark"
                onClick={() => onReplay(session)}
                size="small"
              >
                다시 혼내주기
              </Button>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
