import { prisma } from '@/lib/db';
import 'server-only';

export async function getAllCourses() {
    const data = await prisma.course.findMany({
        where: {
            status: 'Published',
        },
        orderBy: {
            createdAt: 'desc',
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            slug: true,
            filekey: true,
            id: true,
            level: true,
            duration: true,
        },
    });

    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
