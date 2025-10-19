'use client';

import { useTransition, useEffect, useState } from 'react';
import { dodoEnrollInCourseAction } from '../actions';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EnrollmentButtonProps {
    courseId: string;
    courseSlug: string;
}

export function EnrollmentButton({ courseId, courseSlug }: EnrollmentButtonProps) {
    const [pending, startTransition] = useTransition();
    const [isEnrolled, setIsEnrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check enrollment status on component mount
        const checkEnrollment = async () => {
            try {
                const response = await fetch(`/api/check-enrollment?courseId=${courseId}`);
                const data = await response.json();
                setIsEnrolled(data.isEnrolled);
            } catch (error) {
                console.error('Error checking enrollment:', error);
            }
        };

        checkEnrollment();
    }, [courseId]);

    function onEnroll() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(dodoEnrollInCourseAction(courseId));

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
                return;
            }

            if (result?.alreadyEnrolled) {
                setIsEnrolled(true);
                toast.success('You are already enrolled in this course');
                return;
            }

            if (result?.success && result.url) {
                window.location.href = result.url;
            } else {
                toast.error('Enrollment failed. Please try again.');
            }
        });
    }

    function onWatchNow() {
        router.push(`/courses/${courseSlug}`);
    }

    return (
        <Button onClick={isEnrolled ? onWatchNow : onEnroll} disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                </>
            ) : isEnrolled ? (
                'Watch Now'
            ) : (
                'Enroll Now!'
            )}
        </Button>
    );
}
