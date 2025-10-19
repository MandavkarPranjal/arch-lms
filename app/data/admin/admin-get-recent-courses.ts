import { requireAdmin } from './require-admin';
import { prisma } from '@/lib/db';
import 'server-only';

export async function adminGetRecentCourses() {
    await requireAdmin();

    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 2,
        select: {
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            filekey: true,
            slug: true,
        },
    });

    return data;
}
