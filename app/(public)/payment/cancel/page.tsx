'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = searchParams.get('courseId');

    const handleGoBack = () => {
        if (courseId) {
            router.push(`/courses/${courseId}`);
        } else {
            router.push('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold text-red-600">Payment Cancelled</h1>
                <p className="mb-4 text-gray-600">
                    Your payment was cancelled. You can try again later.
                </p>
                <button
                    onClick={handleGoBack}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
