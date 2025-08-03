import { PublicCourseCard, PublicCourseCardSkeleton } from '../_components/publicCourseCard';
import { getAllCourses } from '@/app/data/course/get-all-courses';
import { Suspense } from 'react';

export default function PublicCoursesRoute() {
    return (
        <div className="mt-5">
            <div className="mb-10 flex flex-col items-center space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explore Courses</h1>
                <p className="text-muted-foreground">
                    Discover a wide range of courses designed by industry experts to help you
                    achieve your goals.
                </p>
            </div>
            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </div>
    );
}

async function RenderCourses() {
    const courses = await getAllCourses();

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
                <PublicCourseCard key={course.id} data={course} isLatest={index === 0} />
            ))}
        </div>
    );
}

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
