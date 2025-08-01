import { BookOpen, PlusCircle } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';

interface AppProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

export function EmptyState({ buttonText, description, title, href }: AppProps) {
    return (
        <div className="animate-in fade-in-50 bg-muted/30 flex h-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div className="bg-primary/10 mb-6 flex size-24 items-center justify-center rounded-full">
                <BookOpen className="text-primary size-12" />
            </div>
            <h2 className="text-foreground mb-3 text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground mb-8 max-w-md text-base leading-relaxed">
                {description}
            </p>
            <Link href={href} className={buttonVariants({ size: 'lg' })}>
                <PlusCircle className="mr-2 size-5" />
                {buttonText}
            </Link>
        </div>
    );
}
