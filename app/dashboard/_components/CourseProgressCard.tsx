/* eslint-disable */
'use client';

import { EnrolledCoursesType } from '@/app/data/user/get-enrolled-courses';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

interface AppProps {
    data: EnrolledCoursesType;
}

export function CourseProgressCard({ data }: AppProps) {
    const thumbnailUrl = useConstructUrl(data.course.filekey);
    const { completedLessons, totalLessons, progressPercentage } = useCourseProgress({
        courseData: data.course as any,
    });
    return (
        <Card className="group bg-card relative gap-0 overflow-hidden border-0 py-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <Badge className="bg-muted/90 text-muted-foreground absolute top-4 right-4 z-10 backdrop-blur-sm">
                {data.course.level}
            </Badge>

            <div className="relative overflow-hidden">
                <Image
                    src={thumbnailUrl}
                    alt={`${data.course.title} thumbnail`}
                    width={600}
                    height={400}
                    className="aspect-video h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>

            <CardContent className="p-6">
                <Link
                    href={`/dashboard/${data.course.slug}`}
                    className="group-hover:text-primary text-card-foreground line-clamp-2 font-serif text-xl leading-tight font-semibold transition-colors hover:underline"
                >
                    {data.course.title}
                </Link>
                <p className="text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                    {data.course.smallDescription}
                </p>

                <div className="mt-5 space-y-4">
                    <div className="mb-1 flex justify-between text-sm">
                        <p>Progress:</p>
                        <p className="font-medium">{progressPercentage}%</p>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5" />

                    <p className="text-muted-foreground mt-1 text-xs">
                        {completedLessons} of {totalLessons} lessons completed
                    </p>
                </div>

                <Link
                    href={`/dashboard/${data.course.slug}`}
                    className={buttonVariants({
                        className:
                            'from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground mt-6 w-full bg-gradient-to-r font-medium shadow-lg transition-all duration-200 hover:shadow-xl',
                    })}
                >
                    View Course
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
