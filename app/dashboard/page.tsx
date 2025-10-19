import { PublicCourseCard } from '../(public)/_components/publicCourseCard';
import { getEnrolledCourses } from '../data/user/get-enrolled-courses';
import { CourseProgressCard } from './_components/CourseProgressCard';
import { getAllCourses } from '../data/course/get-all-courses';
import { EmptyState } from '@/components/general/empty-state';

export default async function DashboardPage() {
    const [courses, enrolledCourses] = await Promise.all([getAllCourses(), getEnrolledCourses()]);

    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Enrolled Courses</h1>
                <p className="text-muted-foreground">
                    Here you can see all the courses you have enrolled in.
                </p>
            </div>

            {enrolledCourses.length === 0 ? (
                <EmptyState
                    title="No courses purchased"
                    description="You have not purchased any courses yet. Purchase a course to get started."
                    buttonText="Browse Courses"
                    href="/courses"
                />
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {enrolledCourses.map((course) => (
                        <CourseProgressCard key={course.course.id} data={course} />
                    ))}
                </div>
            )}

            <section className="mt-10">
                <div className="mb-5 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Available Courses</h1>
                    <p className="text-muted-foreground">
                        Here you can see all the courses you purchase
                    </p>
                </div>

                {courses.filter(
                    (course) =>
                        !enrolledCourses.some(({ course: enrolled }) => enrolled.id === course.id),
                ).length === 0 ? (
                    <EmptyState
                        title="No courses available"
                        description="You have purchased all available courses"
                        buttonText="Browse Courses"
                        href="/courses"
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {courses
                            .filter(
                                (course) =>
                                    !enrolledCourses.some(
                                        ({ course: enrolled }) => enrolled.id === course.id,
                                    ),
                            )
                            .map((course) => (
                                <PublicCourseCard key={course.id} data={course} />
                            ))}
                    </div>
                )}
            </section>
        </>
    );
}
