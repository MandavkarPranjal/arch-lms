import { Badge } from '@/components/ui/badge';

export function LastUsedBadge() {
    return (
        <Badge
            className="pointer-events-none absolute top-2 right-2 z-20 origin-center -rotate-6 transform rounded-full px-2 py-0.5 text-[10px] shadow-sm"
            variant="outline"
        >
            <span className="text-primary-foreground hover:text-accent-foreground">Last used</span>
        </Badge>
    );
}
