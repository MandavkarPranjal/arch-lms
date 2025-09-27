'use server';

import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { revalidatePath } from 'next/cache';
import { ApiResponse } from '@/lib/types';
import { dodoPayments } from '@/lib/auth';
import { request } from '@arcjet/next';
import { prisma } from '@/lib/db';

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
);

export async function getCourseForDeletion(courseId: string) {
    const session = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: session.user.id,
        });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: 'error',
                    message: 'You have been blocked due to rate limiting',
                };
            } else {
                return {
                    status: 'error',
                    message:
                        'Request blocked by security filters. If this is a mistake, please contact support.',
                };
            }
        }

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
        // First, get the course to verify the title and productId
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            select: { title: true, productId: true },
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

        // Archive the DodoPayments product if it exists
        if (course.productId) {
            try {
                await dodoPayments.products.archive(course.productId);
                console.log('DodoPayments product archived:', course.productId);
            } catch (archiveError) {
                console.error('Failed to archive DodoPayments product:', archiveError);
                return {
                    status: 'error',
                    message: 'Failed to archive payment product. Course deletion aborted.',
                };
            }
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
