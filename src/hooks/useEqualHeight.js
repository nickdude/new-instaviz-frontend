import { useEffect } from 'react';

// Simple hook to make all elements matching `selector` have the same height (the tallest one).
// deps should include any data that affects card heights (lists, loading state, etc.)
export default function useEqualHeight(selector, deps = []) {
    useEffect(() => {
        const setHeights = () => {
            const els = Array.from(document.querySelectorAll(selector));
            if (!els || els.length === 0) return;

            // reset inline heights first
            els.forEach((el) => {
                el.style.height = 'auto';
            });

            const heights = els.map((el) => el.getBoundingClientRect().height || 0);
            const max = Math.max(...heights, 0);

            els.forEach((el) => {
                el.style.height = `${max}px`;
            });
        };

        // measure after next paint to ensure images/fonts are loaded
        const raf = requestAnimationFrame(() => setHeights());

        window.addEventListener('resize', setHeights);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', setHeights);
            const els = Array.from(document.querySelectorAll(selector));
            els.forEach((el) => {
                el.style.height = '';
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
