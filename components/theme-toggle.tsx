'use client';

import { useTheme } from '@/components/theme-provider';
import { TooltipWrapper } from './tooltip-wrapper';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className, ...props }: React.ComponentProps<typeof Button>) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX: x, clientY: y } = event;
        toggleTheme({ x, y });
    };

    return (
        <TooltipWrapper label={`Switch to ${isDark ? 'light' : 'dark'} mode`} asChild>
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    'relative cursor-pointer transition-colors',
                    isDark
                        ? 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50',
                    className,
                )}
                {...props}
                onClick={handleClick}
            >
                <div className="relative h-4 w-4">
                    <Sun
                        className={cn(
                            'absolute h-4 w-4 transition-all duration-300',
                            isDark
                                ? 'scale-0 rotate-90 opacity-0'
                                : 'scale-100 rotate-0 opacity-100',
                        )}
                    />
                    <Moon
                        className={cn(
                            'absolute h-4 w-4 transition-all duration-300',
                            isDark
                                ? 'scale-100 rotate-0 opacity-100'
                                : 'scale-0 -rotate-90 opacity-0',
                        )}
                    />
                </div>
                <span className="sr-only">Toggle theme</span>
            </Button>
        </TooltipWrapper>
    );
}
