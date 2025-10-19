import { AdminCourseCard, AdminCourseCardSkeleton } from './courses/_components/adminCourseCard';
import { ChartAreaInteractive } from '@/components/sidebar/chart-area-interactive';
import { adminGetEnrollmentStats } from '../data/admin/admin-get-enrollment-stats';
import { adminGetRecentCourses } from '../data/admin/admin-get-recent-courses';
import { SectionCards } from '@/components/sidebar/section-cards';
import { EmptyState } from '@/components/general/empty-state';
import { buttonVariants } from '@/components/ui/button';
import { Suspense } from 'react';
import Link from 'next/link';

export default async function adminIndexPage() {
    const enrollmentData = await adminGetEnrollmentStats();
    return (
        <div>
            <SectionCards />
            <ChartAreaInteractive data={enrollmentData} />

            <div className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Courses</h2>
                    <Link href="/admin/courses" className={buttonVariants({ variant: 'outline' })}>
                        View All Courses
                    </Link>
                </div>

                <Suspense fallback={<RenderRecentCoursesSkeleton />}>
                    <RenderRecentCourses />
                </Suspense>
            </div>
        </div>
    );
}

async function RenderRecentCourses() {
    const data = await adminGetRecentCourses();

    if (data.length === 0) {
        return (
            <EmptyState
                buttonText="Create New Course"
                description="You don’t have any courses. Create one to see them here."
                title="You don't have any yet!"
                href="/admin/courses/create"
            />
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {data.map((course) => (
                <AdminCourseCard key={course.id} data={course} />
            ))}
        </div>
    );
}

function RenderRecentCoursesSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
