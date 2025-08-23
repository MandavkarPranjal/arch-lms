import { PublicCourseCard, PublicCourseCardSkeleton } from '../_components/publicCourseCard';
import { getAllCourses } from '@/app/data/course/get-all-courses';
import { Suspense } from 'react';

export default function PublicCoursesRoute() {
    return (
        <div className="from-background via-muted/30 to-secondary/20 bg-gradient-to-br">
            <div className="container mx-auto px-4 py-16 pt-32">
                <div className="mb-16 flex flex-col items-center space-y-6 text-center">
                    <div className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium">
                        <span className="mr-2">🎓</span>
                        Professional Architecture Education
                    </div>
                    <h1 className="text-foreground font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                        Master Architecture
                        <span className="text-primary block">Through Expert Courses</span>
                    </h1>
                    <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                        Discover comprehensive courses designed by industry professionals to elevate
                        your architectural skills, from foundational principles to advanced design
                        techniques.
                    </p>
                </div>
                <Suspense fallback={<LoadingSkeletonLayout />}>
                    <RenderCourses />
                </Suspense>
            </div>
        </div>
    );
}

async function RenderCourses() {
    const courses = await getAllCourses();

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
                <PublicCourseCard key={course.id} data={course} isLatest={index === 0} />
            ))}
        </div>
    );
}

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
                <PublicCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
