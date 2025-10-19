import { getLessonContent } from '@/app/data/course/get-lesson-content';
import { createToken } from './_components/_Player/tokenSignin';
import { LessonSkeleton } from './_components/LessonSkeleton';
import { CourseContent } from './_components/CourseContent';
import { Suspense } from 'react';

type Params = Promise<{ lessonId: string }>;

export default async function LessonContentPage({ params }: { params: Params }) {
    const { lessonId } = await params;
    return (
        <Suspense fallback={<LessonSkeleton />}>
            <LessonContentLoader lessonId={lessonId} />;
        </Suspense>
    );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
    const data = await getLessonContent(lessonId);
    const tokens = await createToken(data.videoKey ?? '');

    return <CourseContent data={data} tokens={tokens} />;
}
