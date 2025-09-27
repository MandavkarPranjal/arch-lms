'use client';

import { dodoEnrollInCourseAction } from '../actions';
import { Button } from '@/components/ui/button';
import { tryCatch } from '@/hooks/try-catch';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function EnrollmentButton({ courseId }: { courseId: string }) {
    const [pending, startTransition] = useTransition();

    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(dodoEnrollInCourseAction(courseId));

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
                return;
            }

            if (result?.success && result.url) {
                window.location.href = result.url;
            } else {
                toast.error('Enrollment failed. Please try again.');
            }
        });
    }

    return (
        <Button onClick={onSubmit} disabled={pending} className="w-full">
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                </>
            ) : (
                'Enroll Now!'
            )}
        </Button>
    );
}
