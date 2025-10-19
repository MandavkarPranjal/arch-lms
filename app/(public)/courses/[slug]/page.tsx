import {
    IconBook,
    IconCategory,
    IconChartBar,
    IconChevronDown,
    IconClock,
    IconPlayerPlay,
} from '@tabler/icons-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { checkIfUserBought } from '@/app/data/user/user-is-enrolled';
import { getIndividualCourse } from '@/app/data/course/get-course';
import { EnrollmentButton } from './_components/EnrollmentButton';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { CheckIcon } from 'lucide-react';
import { env } from '@/lib/env';
import Image from 'next/image';
import Link from 'next/link';

type Params = Promise<{
    slug: string;
}>;

export default async function SlugPage({ params }: { params: Params }) {
    const { slug } = await params;
    try {
        const course = await getIndividualCourse(slug);
        const isEnrolled = await checkIfUserBought(course.id);
        if (!course) {
            notFound();
        }

        return (
            <div className="from-background via-background to-muted/20 bg-gradient-to-br">
                <div className="container mx-auto px-4 py-8 pt-32">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        <div className="order-1 lg:col-span-2">
                            <div className="ring-border/50 relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1">
                                <Image
                                    src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storageapi.dev/${encodeURIComponent(course.filekey)}`}
                                    alt={`${course.title} thumbnail`}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>

                            <div className="mt-12 space-y-8">
                                <div className="space-y-6">
                                    <h1 className="text-foreground font-serif text-5xl font-bold tracking-tight lg:text-6xl">
                                        {course.title}
                                    </h1>
                                    <p className="text-muted-foreground text-xl leading-relaxed">
                                        {course.smallDescription}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2 px-4 py-2">
                                        <IconChartBar className="size-4" />
                                        <span className="font-medium">{course.level}</span>
                                    </Badge>
                                    <Badge className="bg-accent/10 text-accent-foreground hover:bg-accent/20 flex items-center gap-2 px-4 py-2">
                                        <IconClock className="size-4" />
                                        <span className="font-medium">{course.duration} hours</span>
                                    </Badge>
                                </div>

                                <Separator className="bg-border/50 my-12" />

                                <div className="space-y-8">
                                    <h2 className="text-foreground font-serif text-4xl font-semibold tracking-tight">
                                        Course Description
                                    </h2>

                                    <div className="prose prose-lg text-muted-foreground max-w-none">
                                        <RenderDescription
                                            json={(() => {
                                                try {
                                                    return JSON.parse(course.description);
                                                } catch (error) {
                                                    console.error(
                                                        'Failed to parse course description:',
                                                        error,
                                                    );
                                                    return {
                                                        type: 'doc',
                                                        content: [
                                                            {
                                                                type: 'paragraph',
                                                                content: [
                                                                    {
                                                                        type: 'text',
                                                                        text: 'Description unavailable',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    };
                                                }
                                            })()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-foreground font-serif text-4xl font-semibold tracking-tight">
                                        Course Content
                                    </h2>
                                    <div className="bg-muted/50 text-muted-foreground rounded-lg px-4 py-2 text-sm font-medium">
                                        {course.chapters.length} Chapters |{' '}
                                        {course.chapters.reduce(
                                            (total, chapter) => total + chapter.lessons.length,
                                            0,
                                        ) || 0}{' '}
                                        Lessons
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {course.chapters.map((chapter, index) => (
                                        <Collapsible key={chapter.id} defaultOpen={index === 0}>
                                            <Card className="border-border/50 bg-card/50 hover:border-primary/20 gap-0 overflow-hidden border-2 p-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                                                <CollapsibleTrigger className="w-full">
                                                    <CardContent className="hover:bg-muted/30 p-8 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="bg-primary/10 text-primary ring-primary/20 flex size-14 items-center justify-center rounded-full ring-2">
                                                                    <span className="text-lg font-bold">
                                                                        {index + 1}
                                                                    </span>
                                                                </div>
                                                                <div className="text-left">
                                                                    <h3 className="text-foreground text-2xl font-semibold">
                                                                        {chapter.title}
                                                                    </h3>
                                                                    <p className="text-muted-foreground mt-2">
                                                                        {chapter.lessons.length}{' '}
                                                                        lesson
                                                                        {chapter.lessons.length > 1
                                                                            ? 's'
                                                                            : ''}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-4">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="border-primary/20 text-primary"
                                                                >
                                                                    {chapter.lessons.length} lesson
                                                                    {chapter.lessons.length > 1
                                                                        ? 's'
                                                                        : ''}
                                                                </Badge>
                                                                <IconChevronDown className="text-muted-foreground size-6 transition-transform duration-200" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <div className="border-border/50 bg-muted/10 border-t">
                                                        <div className="space-y-2 p-8 pt-6">
                                                            {chapter.lessons.map(
                                                                (lesson, lessonIndex) => (
                                                                    <div
                                                                        key={lesson.id}
                                                                        className="group hover:bg-accent/50 flex items-center gap-5 rounded-xl p-4 transition-all duration-200"
                                                                    >
                                                                        <div className="border-primary/20 bg-background group-hover:border-primary group-hover:bg-primary/5 flex size-10 items-center justify-center rounded-full border-2 transition-colors">
                                                                            <IconPlayerPlay className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <p className="text-foreground group-hover:text-primary font-medium">
                                                                                {lesson.title}
                                                                            </p>
                                                                            <p className="text-muted-foreground text-sm">
                                                                                Lesson{' '}
                                                                                {lessonIndex + 1}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Card>
                                        </Collapsible>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="order-2 lg:col-span-1">
                            <div className="sticky top-24">
                                <Card className="border-border/50 bg-card/80 border-2 shadow-xl backdrop-blur-sm">
                                    <CardContent className="p-8">
                                        <div className="mb-8 text-center">
                                            <p className="text-muted-foreground text-lg font-medium">
                                                Course Price
                                            </p>
                                            <p className="text-primary mt-2 text-4xl font-bold">
                                                {new Intl.NumberFormat('en-US', {
                                                    style: 'currency',
                                                    currency: 'INR',
                                                }).format(course.price)}
                                            </p>
                                        </div>

                                        <Separator className="bg-border/50 my-6" />

                                        <div className="bg-primary/5 mb-8 space-y-6 rounded-xl p-6">
                                            <h4 className="text-foreground font-serif text-lg font-semibold">
                                                What you will get:
                                            </h4>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                                                        <IconClock className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground font-medium">
                                                            Course Duration
                                                        </p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {course.duration} hours
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                                                        <IconChartBar className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground font-medium">
                                                            Difficulty Level
                                                        </p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {course.level}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                                                        <IconBook className="size-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-foreground font-medium">
                                                            Total Lessons
                                                        </p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {course.chapters.reduce(
                                                                (total, chapter) =>
                                                                    total + chapter.lessons.length,
                                                                0,
                                                            ) || 0}{' '}
                                                            Lessons
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-8 space-y-4">
                                            <h4 className="text-foreground font-serif font-semibold">
                                                This course includes:
                                            </h4>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3">
                                                    <div className="rounded-full bg-green-500/10 p-1.5 text-green-600">
                                                        <CheckIcon className="size-4" />
                                                    </div>
                                                    <span className="text-foreground text-sm font-medium">
                                                        Full Lifetime Access
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <div className="rounded-full bg-green-500/10 p-1.5 text-green-600">
                                                        <CheckIcon className="size-4" />
                                                    </div>
                                                    <span className="text-foreground text-sm font-medium">
                                                        Access on mobile and desktop
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <div className="rounded-full bg-green-500/10 p-1.5 text-green-600">
                                                        <CheckIcon className="size-4" />
                                                    </div>
                                                    <span className="text-foreground text-sm font-medium">
                                                        Certificate of Completion
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="space-y-4">
                                            {isEnrolled ? (
                                                <Link
                                                    href="/dashboard"
                                                    className={buttonVariants({
                                                        className: 'w-full',
                                                    })}
                                                >
                                                    Watch Course
                                                </Link>
                                            ) : (
                                                <EnrollmentButton
                                                    courseId={course.id}
                                                    courseSlug={slug}
                                                />
                                            )}
                                            <p className="text-muted-foreground text-center text-xs">
                                                30-day money-back guarantee
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Failed to fetch course:', error);
        notFound();
    }
}
