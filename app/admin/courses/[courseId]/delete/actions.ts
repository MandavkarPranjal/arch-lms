'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '@/lib/types';
import { prisma } from '@/lib/db';

export async function getCourseForDeletion(courseId: string) {
    await requireAdmin();

    try {
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, title: true },
        });

        if (!course) {
            throw new Error('Course not found');
        }

        return course;
    } catch {
        throw new Error('Failed to fetch course');
    }
}

export async function deleteCourse(
    courseId: string,
    confirmationText: string,
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        // First, get the course to verify the title matches
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true },
        });

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found!',
            };
        }

        // Validate that the confirmation text matches the course title
        if (confirmationText !== course.title) {
            return {
                status: 'error',
                message: 'Course name confirmation does not match!',
            };
        }

        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath('/admin/courses');

        return {
            status: 'success',
            message: 'Course deleted successfully!',
        };
    } catch {
        return {
            status: 'error',
            message: 'Failed to delete Course!',
        };
    }
}
