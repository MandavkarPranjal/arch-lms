import { ArrowRight, SchoolIcon, Sparkles, TimerIcon } from 'lucide-react';
import type { PublicCourseType } from '@/app/data/course/get-all-courses';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface AppProps {
    data: PublicCourseType;
    isLatest?: boolean;
}

export function PublicCourseCard({ data, isLatest = false }: AppProps) {
    const thumbnailUrl = useConstructUrl(data.filekey);
    return (
        <Card className="group bg-card relative gap-0 overflow-hidden border-0 py-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            {isLatest && (
                <Badge className="from-primary to-primary/80 text-primary-foreground absolute top-4 left-4 z-10 bg-gradient-to-r shadow-lg">
                    <Sparkles className="mr-1 size-3" />
                    New
                </Badge>
            )}
            <Badge className="bg-muted/90 text-muted-foreground absolute top-4 right-4 z-10 backdrop-blur-sm">
                {data.level}
            </Badge>

            <div className="relative overflow-hidden">
                <Image
                    src={thumbnailUrl}
                    alt={`${data.title} thumbnail`}
                    width={600}
                    height={400}
                    className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <CardContent className="p-6">
                <Link
                    href={`/courses/${data.slug}`}
                    className="group-hover:text-primary text-card-foreground line-clamp-2 font-serif text-xl leading-tight font-semibold transition-colors hover:underline"
                >
                    {data.title}
                </Link>
                <p className="text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {data.smallDescription}
                </p>

                <div className="mt-6 flex items-center gap-x-6">
                    <div className="flex items-center gap-x-2">
                        <div className="bg-primary/10 rounded-lg p-2">
                            <TimerIcon className="text-primary size-4" />
                        </div>
                        <span className="text-card-foreground text-sm font-medium">
                            {data.duration}h
                        </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-muted rounded-lg p-2">
                            <SchoolIcon className="text-muted-foreground size-4" />
                        </div>
                    </div>
                </div>

                <Link
                    href={`/courses/${data.slug}`}
                    className={buttonVariants({
                        className:
                            'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground mt-6 w-full bg-gradient-to-r font-medium shadow-lg transition-all duration-200 hover:shadow-xl',
                    })}
                >
                    Explore Course
                    <ArrowRight className="ml-2 size-4" />
                </Link>
            </CardContent>
        </Card>
    );
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className="group relative gap-0 overflow-hidden border-0 py-0 shadow-lg">
            <div className="absolute top-4 right-4 z-10 flex items-center">
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="relative h-fit w-full">
                <Skeleton className="aspect-video w-full" />
            </div>

            <CardContent className="p-6">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>

                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                <div className="mt-6 flex items-center gap-x-6">
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-8 rounded-lg" />
                        <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Skeleton className="size-8 rounded-lg" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>

                <Skeleton className="mt-6 h-11 w-full rounded-md" />
            </CardContent>
        </Card>
    );
}
