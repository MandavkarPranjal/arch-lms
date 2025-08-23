/* eslint-disable */
'use client';

import { useCallback } from 'react';
import Lenis from 'lenis';

export function useLenisScroll() {
    const scrollTo = useCallback(
        (
            target: string | HTMLElement,
            options?: {
                offset?: number;
                duration?: number;
                easing?: (t: number) => number;
            },
        ) => {
            // This function can be used to scroll to elements programmatically
            // It will work once Lenis is properly initialized
            const lenis = (window as any).lenis as Lenis;

            if (lenis) {
                if (typeof target === 'string') {
                    const element = document.querySelector(target) as HTMLElement;
                    if (element) {
                        lenis.scrollTo(element, {
                            offset: options?.offset || 0,
                            duration: options?.duration || 1.2,
                            easing:
                                options?.easing ||
                                ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
                        });
                    }
                } else {
                    lenis.scrollTo(target, {
                        offset: options?.offset || 0,
                        duration: options?.duration || 1.2,
                        easing:
                            options?.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
                    });
                }
            }
        },
        [],
    );

    return { scrollTo };
}
