'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState, useTransition } from 'react';
import { authClient } from '@/lib/auth-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyRequest() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [emailPending, startEmailTransition] = useTransition();
    const params = useSearchParams();
    const email = params.get('email') as string;
    const isOtpCompleted = otp.length === 6;

    const setLastUsedLoginMethodCookie = () => {
        const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
        const name = 'better-auth.last_used_login_method';
        const value = encodeURIComponent('email');
        document.cookie = `${name}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax; Priority=Medium`;
    };

    function verifyOtp() {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                email: email,
                otp: otp,
                fetchOptions: {
                    onSuccess: () => {
                        try {
                            setLastUsedLoginMethodCookie();
                        } catch (err) {
                            console.warn('Failed to set last_used_login_method cookie', err);
                            toast.error('Failed to set last used login method');
                        }
                        toast.success('Email Verified');
                        router.push('/');
                    },
                    onError: () => {
                        toast.error('Error verifying Email/OTP');
                    },
                },
            });
        });
    }
    return (
        <Card className="mx-auto w-full">
            <CardHeader className="text-center">
                <CardTitle className="text-xl">Please check your email</CardTitle>
                <CardDescription>
                    We&apos;ve sent you a verification code to your email address. Please opent the
                    email and paste the code below.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <InputOTP
                        value={otp}
                        onChange={(value) => setOtp(value)}
                        maxLength={6}
                        className="gap-2"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className="text-muted-foreground text-sm">
                        Enter the 6-digit code to your email
                    </p>
                </div>

                <Button
                    onClick={verifyOtp}
                    disabled={emailPending || !isOtpCompleted}
                    className="w-full cursor-pointer"
                >
                    {emailPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            <span>Loading...</span>
                        </>
                    ) : (
                        'Verify Account'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
