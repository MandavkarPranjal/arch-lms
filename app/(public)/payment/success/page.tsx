'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get('courseId');
    const enrollmentId = searchParams.get('enrollmentId');

    useEffect(() => {
        if (courseId) {
            // Update enrollment status to Active
            fetch('/api/update-enrollment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseId,
                    enrollmentId,
                    status: 'Active',
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        toast.success('Payment successful! You are now enrolled in the course.');
                        router.push(`/courses/${data.courseSlug}`);
                    } else {
                        toast.error(
                            'Payment successful, but failed to update enrollment. Please contact support.',
                        );
                        router.push('/');
                    }
                })
                .catch((error) => {
                    console.error('Error updating enrollment:', error);
                    toast.error(
                        'Payment successful, but failed to update enrollment. Please contact support.',
                    );
                    router.push('/');
                });
        } else {
            toast.success('Payment successful!');
            router.push('/');
        }
    }, [courseId, enrollmentId, router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold text-green-600">Payment Successful!</h1>
                <p className="text-gray-600">Processing your enrollment...</p>
            </div>
        </div>
    );
}
