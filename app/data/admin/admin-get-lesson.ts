import { requireAdmin } from './require-admin';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function adminGetLesson(id: string) {
    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: {
            id: id,
        },
        select: {
            title: true,
            description: true,
            thumbnailKey: true,
            videoKey: true,
            notesKey: true,
            id: true,
            position: true,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
