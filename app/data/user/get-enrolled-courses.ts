import { requireUser } from './require-user';
import { prisma } from '@/lib/db';
import 'server-only';

export async function getEnrolledCourses() {
    const user = await requireUser();

    const data = await prisma.enrollment.findMany({
        where: {
            userId: user.id,
            status: 'Active',
        },
        select: {
            course: {
                select: {
                    id: true,
                    smallDescription: true,
                    title: true,
                    filekey: true,
                    level: true,
                    slug: true,
                    duration: true,
                    chapters: {
                        select: {
                            id: true,
                            lessons: {
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return data;
}
