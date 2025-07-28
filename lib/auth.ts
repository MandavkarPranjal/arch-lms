import 'server-only';

import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import OtpEmail from '@/components/email/otp';
import { betterAuth } from 'better-auth';
import { resend } from './resend';
import { prisma } from './db';
import { env } from './env';

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
    ],
});
