'use server';

import { courseSchema, CourseSchemaType } from '@/lib/zodSchemas';
import { requireAdmin } from '@/app/data/admin/require-admin';
import arcjet, { fixedWindow } from '@/lib/arcjet';
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

export async function CreateCourse(data: CourseSchemaType): Promise<ApiResponse> {
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
                    message: 'You are a bot! if this a mistake contact our support',
                };
            }
        }

        const validation = courseSchema.safeParse(data);

        if (!validation.success) {
            return {
                status: 'error',
                message: 'Invalid Form Data',
            };
        }

        const course = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
        });

        // Create DodoPayments product
        try {
            const product = await dodoPayments.products.create({
                price: {
                    currency: 'INR',
                    discount: 0,
                    price: validation.data.price,
                    purchasing_power_parity: true,
                    type: 'one_time_price',
                },
                tax_category: 'edtech',
                name: validation.data.title,
            });

            console.log('Product created:', JSON.stringify(product, null, 2)); // Log the full response

            // Update course with product ID (use the correct field from the response)
            await prisma.course.update({
                where: { id: course.id },
                data: { productId: product.product_id }, // Use product_id as per API response
            });
        } catch (productError) {
            console.error('Failed to create DodoPayments product:', productError);
            // Optionally, you could delete the course if product creation fails
            // await prisma.course.delete({ where: { id: course.id } });
            // return { status: 'error', message: 'Failed to create payment product' };
        }

        return {
            status: 'success',
            message: 'Course Created Successfully',
        };
    } catch (error) {
        console.error('Course creation failed:', error);

        // Handle specific Prisma errors
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return {
                status: 'error',
                message: 'A course with this slug already exists',
            };
        }

        return {
            status: 'error',
            message: 'Failed to create course',
        };
    }
}
