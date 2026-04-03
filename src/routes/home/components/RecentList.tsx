import { colors } from '@toss/tds-colors';
import { Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import { formatSessionLabel } from '../../../lib/storage';
import type { SessionResult } from '../../../types';

interface RecentListProps {
  sessions: SessionResult[];
}

export function RecentList({ sessions }: RecentListProps) {
  return (
    <SectionCard>
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
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              alignItems: 'center',
              padding: 16,
              borderRadius: 18,
              background: '#fff5f1',
            }}
          >
            <div>
              <strong css={{ display: 'block', marginBottom: 4 }}>{formatSessionLabel(session)}</strong>
              <p css={{ margin: 0, color: colors.grey600 }}>{new Date(session.createdAt).toLocaleString('ko-KR')}</p>
            </div>
            <div
              css={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4,
                color: colors.red700,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>{session.hits} hits</span>
              <span>{session.releasedPercent}%</span>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
