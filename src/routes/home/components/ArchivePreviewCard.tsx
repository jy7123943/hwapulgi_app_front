import { colors } from '@toss/tds-colors';
import { Button, Text } from '@toss/tds-mobile';
import { SectionCard } from '../../../components/shared/Surface';
import type { WeeklyArchive } from '../../../types';

interface ArchivePreviewCardProps {
  archives: WeeklyArchive[];
  onOpen: () => void;
}

export function ArchivePreviewCard({ archives, onOpen }: ArchivePreviewCardProps) {
  return (
    <SectionCard css={{ background: '#ffffff' }}>
      <Text as="h3" typography="t6" fontWeight="bold" css={{ color: colors.grey900 }}>
        지난 주간 리포트
      </Text>

      <div css={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
        {archives.length > 0 ? (
          archives.slice(0, 3).map((archive) => (
            <div
              key={archive.id}
              css={{
                padding: 14,
                borderRadius: 18,
                background: colors.grey50,
              }}
            >
              <Text as="div" typography="t7" fontWeight="bold" css={{ color: colors.grey900 }}>
                {archive.label}
              </Text>
              <Text as="div" typography="t7" css={{ color: colors.grey600, marginTop: 4 }}>
                {archive.averageRelease}% 배출 · {archive.totalHits} hits
              </Text>
              <Text as="div" typography="t7" css={{ color: colors.grey600, marginTop: 2 }}>
                가장 힘들었던 날 {archive.hardestWeekday} · TOP 대상 {archive.topTarget}
              </Text>
            </div>
          ))
        ) : (
          <Text as="p" typography="t7" css={{ color: colors.grey600 }}>
            아직 지난 리포트가 없어요.
          </Text>
        )}
      </div>

      <Button
        color="primary"
        display="block"
        onClick={onOpen}
        size="large"
        css={{ marginTop: 16 }}
      >
        전체 리포트 보기
      </Button>
    </SectionCard>
  );
}
