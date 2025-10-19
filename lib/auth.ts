import { dodopayments, checkout, portal, webhooks } from '@dodopayments/better-auth';
import { emailOTP, lastLoginMethod } from 'better-auth/plugins';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import OtpEmail from '@/components/email/otp';
import { admin } from 'better-auth/plugins';
import { betterAuth } from 'better-auth';
import DodoPayments from 'dodopayments';
import { resend } from './resend';
import { prisma } from './db';
import { env } from './env';

// Type definition for DodoPayments webhook payload
interface PaymentWebhookPayload {
    id: string;
    customer_email: string;
    metadata?: {
        enrollmentId?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

// Webhook handler for payment succeeded to activate enrollment
async function handlePaymentSucceeded(payload: PaymentWebhookPayload) {
    console.log('Payment succeeded payload:', JSON.stringify(payload, null, 2));

    const { metadata, customer_email, id: eventId } = payload;

    console.log('Event ID:', eventId);
    console.log('Metadata:', metadata);
    console.log('Customer Email:', customer_email);

    let enrollment;

    // Try to find by metadata enrollmentId if available
    if (metadata?.enrollmentId) {
        console.log('Looking for enrollment by ID:', metadata.enrollmentId);
        enrollment = await prisma.enrollment.findUnique({
            where: { id: metadata.enrollmentId },
            include: { course: true, user: true },
        });
        console.log('Found enrollment by ID:', enrollment);
    } else {
        console.log('No enrollmentId in metadata, looking by email');
        // Fallback to finding by customer email
        enrollment = await prisma.enrollment.findFirst({
            where: {
                user: {
                    email: customer_email,
                },
                status: 'Pending',
            },
            include: { course: true, user: true },
        });
        console.log('Found enrollment by email:', enrollment);
    }

    if (enrollment && enrollment.status === 'Pending') {
        // Update enrollment to Active
        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: 'Active' },
        });

        console.log(
            `Enrollment activated for user ${enrollment.user.email} in course ${enrollment.course.title}`,
        );
    } else if (!enrollment) {
        console.error('No pending enrollment found for customer:', customer_email);
    } else {
        console.log('Enrollment found but status is not Pending:', enrollment.status);
    }
}

export const dodoPayments = new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    environment: env.DODO_ENVIRONMENT,
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql', // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            accessType: 'offline',
            prompt: 'select_account',
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp }) {
                await resend.emails.send({
                    from: 'Arch-LMS <onboarding@resend.dev>',
                    to: [email],
                    subject: 'Arch LMS - Verify your email',
                    react: OtpEmail({ otp }),
                    // html: `<p>Your OTP is <strong>${otp}</strong></p>`,
                });
            },
        }),
        admin(),
        lastLoginMethod(),
        dodopayments({
            client: dodoPayments,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: 'pdt_RluHNx8iVYLOihtAdFPmK',
                            slug: 'arch-lms-1',
                        },
                    ],
                    successUrl: '/payment/success',
                    authenticatedUsersOnly: true,
                }),
                portal(),
                webhooks({
                    webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPayload: async (payload: any) => {
                        console.log('Received webhook:', payload.event_type);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPaymentSucceeded: async (payload: any) => {
                        await handlePaymentSucceeded(payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPaymentFailed: async (payload: any) => {
                        console.log('Payment failed:', payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPaymentProcessing: async (payload: any) => {
                        console.log('Payment processing:', payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onPaymentCancelled: async (payload: any) => {
                        console.log('Payment cancelled:', payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSubscriptionActive: async (payload: any) => {
                        console.log('Subscription active:', payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSubscriptionCancelled: async (payload: any) => {
                        console.log('Subscription cancelled:', payload);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onSubscriptionRenewed: async (payload: any) => {
                        console.log('Subscription renewed:', payload);
                    },
                }),
            ],
        }),
    ],
});
