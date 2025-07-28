'use server';

import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas';
import { ApiResponse } from '@/lib/types';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function CreateCourse(data: CourseSchemaType): Promise<ApiResponse> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                status: 'error',
                message: 'Unauthorized access',
            };
        }
        const validation = courseSchema.safeParse(data);

        if (!validation.success) {
            return {
                status: 'error',
                message: 'Invalid Form Data',
            };
        }

        await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
        });

        return {
            status: 'success',
            message: 'Course Created Successfully',
        };
    } catch {
        return {
            status: 'error',
            message: 'Failed to create course',
        };
    }
}
