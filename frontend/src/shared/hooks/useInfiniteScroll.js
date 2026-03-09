// useInfiniteScroll — fires callback when user scrolls near bottom
import { useEffect, useRef, useCallback } from 'react';

const useInfiniteScroll = (callback, hasMore) => {
    const observerRef = useRef(null);

    const lastElementRef = useCallback(
        (node) => {
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    callback();
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [callback, hasMore]
    );

    useEffect(() => {
        return () => observerRef.current?.disconnect();
    }, []);

    return lastElementRef;
};

export default useInfiniteScroll;
