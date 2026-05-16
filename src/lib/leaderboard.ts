import { submitGameCenterLeaderBoardScore } from '@apps-in-toss/web-framework';

export async function submitScore(points: number): Promise<boolean> {
  try {
    const result = await submitGameCenterLeaderBoardScore({
      score: String(points),
    });

    if (!result) {
      console.warn('[리더보드] 지원하지 않는 앱 버전');
      return false;
    }

    if (result.statusCode === 'SUCCESS') {
      return true;
    }

    console.error('[리더보드] 점수 제출 실패:', result.statusCode);
    return false;
  } catch (error) {
    console.error('[리더보드] 점수 제출 중 오류:', error);
    return false;
  }
}
