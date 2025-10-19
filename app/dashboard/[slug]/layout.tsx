import { getCourseSidebarData } from '@/app/data/course/get-course-sidebar-data';
import { CourseSibebar } from '../_components/CourseSidebar';
import { ReactNode } from 'react';

interface CourseLayoutProps {
    params: Promise<{
        slug: string;
    }>;
    children: ReactNode;
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
    const { slug } = await params;

    const course = await getCourseSidebarData(slug);

    return (
        <div className="flex flex-1">
            <div className="border-border w-80 shrink-0 border-r">
                <CourseSibebar course={course.course} />
            </div>

            <div className="flex-1 overflow-hidden">{children}</div>
        </div>
    );
}
