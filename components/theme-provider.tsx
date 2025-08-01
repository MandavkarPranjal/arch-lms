'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: (coords?: { x: number; y: number }) => void;
};

const initialState: ThemeProviderState = {
    theme: 'dark',
    setTheme: () => null,
    toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = 'dark', ...props }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [mounted, setMounted] = useState(false);

    // Only run on client side after mounting
    useEffect(() => {
        setMounted(true);

        // Get theme from localStorage only on client
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
            setTheme(savedTheme);
        }

        // Remove the disable-transitions class after initial load
        setTimeout(() => {
            document.documentElement.classList.remove('disable-transitions');
        }, 100);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        if (!mounted) return;

        const root = document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
        } else {
            root.classList.remove('dark');
            root.style.colorScheme = 'light';
        }
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    const handleThemeToggle = (coords?: { x: number; y: number }) => {
        if (!mounted) return;

        const newTheme = theme === 'light' ? 'dark' : 'light';

        // Check if View Transitions API is supported and user doesn't prefer reduced motion
        const supportsViewTransitions =
            typeof document !== 'undefined' && 'startViewTransition' in document;
        const prefersReducedMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (supportsViewTransitions && !prefersReducedMotion) {
            // Set coordinates for the circle reveal animation
            if (coords) {
                document.documentElement.style.setProperty('--x', `${coords.x}px`);
                document.documentElement.style.setProperty('--y', `${coords.y}px`);
            }

            // Use View Transitions API
            document.startViewTransition(() => {
                applyTheme(newTheme);
            });
        } else {
            // Fallback to regular transition
            applyTheme(newTheme);
        }
    };

    const handleSetTheme = (newTheme: Theme) => {
        if (mounted) {
            applyTheme(newTheme);
        } else {
            setTheme(newTheme);
        }
    };

    const value: ThemeProviderState = {
        theme,
        setTheme: handleSetTheme,
        toggleTheme: handleThemeToggle,
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <ThemeProviderContext.Provider {...props} value={value}>
                {children}
            </ThemeProviderContext.Provider>
        );
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
