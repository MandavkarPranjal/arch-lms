'use server';

import { requireUser } from '@/app/data/user/require-user';
import arcjet, { fixedWindow } from '@/lib/arcjet';
import { auth, dodoPayments } from '@/lib/auth';

import { redirect } from 'next/navigation';
import { ApiResponse } from '@/lib/types';
import { headers } from 'next/headers';
import { request } from '@arcjet/next';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import Stripe from 'stripe';

const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max: 5,
    }),
);

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | never> {
    const user = await requireUser();

    let checkoutUrl: string;

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.id,
        });

        if (decision.isDenied()) {
            return {
                status: 'error',
                message: 'You have been blocked',
            };
        }
        const course = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                id: true,
                title: true,
                price: true,
                slug: true,
            },
        });

        if (!course) {
            return {
                status: 'error',
                message: 'Course not found',
            };
        }

        let stripeCustomerId: string;
        const userWithStripeCustomerId = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                stripeCustomerId: true,
            },
        });

        if (userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user.id,
                },
            });

            stripeCustomerId = customer.id;

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    stripeCustomerId: stripeCustomerId,
                },
            });
        }

        const result = await prisma.$transaction(async (tx) => {
            const existingEnrollment = await tx.enrollment.findUnique({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: course.id,
                    },
                },
                select: {
                    status: true,
                    id: true,
                },
            });

            if (existingEnrollment?.status === 'Active') {
                return {
                    status: 'success',
                    message: 'You are already enrolled in this course',
                };
            }

            let enrollment;

            if (existingEnrollment) {
                enrollment = await tx.enrollment.update({
                    where: {
                        id: existingEnrollment.id,
                    },
                    data: {
                        amount: course.price,
                        status: 'Pending',
                        updatedAt: new Date(),
                    },
                });
            } else {
                enrollment = await tx.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        amount: course.price,
                        status: 'Pending',
                    },
                });
            }

            const checkoutSession = await stripe.checkout.sessions.create({
                customer: stripeCustomerId,
                line_items: [
                    {
                        price: 'price_1RyQnpSWETC09HrVOOzWGJLK',
                        quantity: 1,
                    },
                ],

                mode: 'payment',
                success_url: `${env.BETTER_AUTH_URL}/payment/success?courseId=${course.id}&enrollmentId=${enrollment.id}`,
                cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel?courseId=${course.id}&enrollmentId=${enrollment.id}`,
                metadata: {
                    userId: user.id,
                    courseId: course.id,
                    enrollmentId: enrollment.id,
                },
            });

            return {
                enrollment: enrollment,
                checkoutUrl: checkoutSession.url,
            };
        });

        checkoutUrl = result.checkoutUrl as string;
    } catch (error) {
        if (error instanceof Stripe.errors.StripeError) {
            return {
                status: 'error',
                message: 'Payment System Error. Please try again later.',
            };
        }

        return {
            status: 'error',
            message: 'Failed to enroll in course',
        };
    }

    redirect(checkoutUrl);
}

export async function dodoEnrollInCourseAction(courseId: string) {
    const user = await requireUser();
    console.log('User authenticated:', user);

    // Log session for debugging
    const session = await auth.api.getSession({ headers: await headers() });
    console.log('Session:', session);

    try {
        // Get the course with product ID
        const courseWithProduct = await prisma.course.findUnique({
            where: { id: courseId },
            select: { id: true, title: true, price: true, productId: true },
        });

        if (!courseWithProduct || !courseWithProduct.productId) {
            return {
                status: 'error',
                message: 'Course not found or product not configured',
            };
        }

        // Check if user is already enrolled
        const existingEnrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
            select: {
                status: true,
                id: true,
            },
        });

        if (existingEnrollment?.status === 'Active') {
            return {
                status: 'success',
                message: 'You are already enrolled in this course',
                alreadyEnrolled: true,
            };
        }

        // Create or update pending enrollment
        if (existingEnrollment) {
            await prisma.enrollment.update({
                where: {
                    id: existingEnrollment.id,
                },
                data: {
                    amount: courseWithProduct.price,
                    status: 'Pending',
                    updatedAt: new Date(),
                },
            });
        } else {
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: courseId,
                    amount: courseWithProduct.price,
                    status: 'Pending',
                },
            });
        }

        // Create or update pending enrollment
        let enrollmentId: string;
        if (existingEnrollment) {
            await prisma.enrollment.update({
                where: {
                    id: existingEnrollment.id,
                },
                data: {
                    amount: courseWithProduct.price,
                    status: 'Pending',
                    updatedAt: new Date(),
                },
            });
            enrollmentId = existingEnrollment.id;
        } else {
            const enrollment = await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: courseId,
                    amount: courseWithProduct.price,
                    status: 'Pending',
                },
            });
            enrollmentId = enrollment.id;
        }

        // Use DodoPayments client directly
        const checkoutSession = await dodoPayments.checkoutSessions.create({
            product_cart: [
                {
                    product_id: courseWithProduct.productId,
                    quantity: 1,
                },
            ],
            customer: {
                email: user.email || 'customer@example.com',
                name: user.name || 'John Doe',
            },
            success_url: `${env.BETTER_AUTH_URL}/payment/success?courseId=${courseId}&enrollmentId=${enrollmentId}`,
            cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel?courseId=${courseId}&enrollmentId=${enrollmentId}`,
            webhook_url: `${env.BETTER_AUTH_URL}/api/auth/dodopayments/webhooks`,
            metadata: {
                enrollmentId: enrollmentId,
                userId: user.id,
                courseId: courseId,
            },
        });

        console.log('Checkout successful:', checkoutSession.checkout_url);
        return { success: true, url: checkoutSession.checkout_url };
    } catch (err) {
        console.error('Error in dodoEnrollInCourseAction:', err);
        throw err;
    }
}
