import { useEffect } from 'react';

interface InfiniteScrollOptions {
  ref: React.RefObject<HTMLTableRowElement | null>;
  callback: () => void;
  hasMore: boolean;
  loading: boolean;
};

export const useInfiniteScroll = ({
  ref,
  callback,
  hasMore,
  loading,
}: InfiniteScrollOptions) => {
  useEffect(() => {
    const target = ref?.current as HTMLElement;
    if (!target || !hasMore || loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    });

    observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [hasMore, loading, callback]);
};
