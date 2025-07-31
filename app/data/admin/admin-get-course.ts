import { requireAdmin } from './require-admin';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import 'server-only';

export async function adminGetCourse(id: string) {
    await requireAdmin();

    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            filekey: true,
            price: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            smallDescription: true,
            category: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            videoKey: true,
                            NotesKey: true,
                            position: true,
                        },
                    },
                },
            },
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export type AdminGetSingularCourse = Awaited<ReturnType<typeof adminGetCourse>>;
