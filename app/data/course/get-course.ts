import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import 'server-only';

export async function getIndividualCourse(slug: string) {
    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
            status: 'Published',
        },
        select: {
            id: true,
            title: true,
            description: true,
            filekey: true,
            price: true,
            duration: true,
            level: true,
            smallDescription: true,
            chapters: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: 'asc',
                        },
                    },
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!course) {
        return notFound();
    }

    return course;
}
