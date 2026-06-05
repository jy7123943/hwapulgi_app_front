import { QueryCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ApiError } from '../api/client';

function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message || '요청을 처리할 수 없어요.';
  }
  if (err instanceof Error) {
    return err.message || '알 수 없는 오류가 발생했어요.';
  }
  return '알 수 없는 오류가 발생했어요.';
}

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (err, query) => {
        // 화면에서 명시적으로 처리한다고 표시한 쿼리는 토스트 생략
        if (query.meta?.silentError === true) return;
        toast.error(describeError(err));
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (err) => {
          toast.error(describeError(err));
        },
      },
    },
  });
}
