'use server';

import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';
import { requireAdmin } from '@/app/data/admin/require-admin';
import { ApiResponse } from '@/lib/types';
import { prisma } from '@/lib/db';

export async function updateLesson(
    values: LessonSchemaType,
    lessonId: string,
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const result = lessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: 'error',
                message: 'Invalid data',
            };
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                videoKey: result.data.videoKey,
                notesKey: result.data.notesKey,
                thumbnailKey: result.data.thumbnailKey,
            },
        });

        return {
            status: 'success',
            message: 'Lesson updated successfully',
        };
    } catch {
        return {
            status: 'error',
            message: 'Failed to update lesson',
        };
    }
}
