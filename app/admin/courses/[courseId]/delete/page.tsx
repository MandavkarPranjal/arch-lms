'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageCircleWarning, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { deleteCourse, getCourseForDeletion } from './actions';
import { useState, useTransition, useEffect } from 'react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DeleteCourseRoute() {
    const [pending, startTransition] = useTransition();
    const [confirmationText, setConfirmationText] = useState('');
    const [course, setCourse] = useState<{ id: string; title: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();

    useEffect(() => {
        async function fetchCourse() {
            try {
                const courseData = await getCourseForDeletion(courseId);
                setCourse({ id: courseData.id, title: courseData.title });
            } catch (error) {
                toast.error('Failed to load course data');
                router.push('/admin/courses');
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [courseId, router]);

    const isDeleteEnabled = course && confirmationText === course.title;

    function onSubmit() {
        if (!isDeleteEnabled || !course) return;

        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                deleteCourse(course.id, confirmationText),
            );

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
            }

            if (result?.status === 'success') {
                toast.success(result.message);
                router.push('/admin/courses');
            } else if (result?.status === 'error') {
                toast.error(result.message);
            }
        });
    }

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-xl">
                <Card className="mt-32">
                    <CardContent className="flex justify-center py-8">
                        <Loader2 className="size-6 animate-spin" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!course) {
        return null;
    }

    return (
        <div className="mx-auto w-full max-w-xl items-center">
            <Card className="mt-32">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl">Delete Course</CardTitle>
                    <CardDescription className="text-lg">
                        This course will be deleted and all its data will be permanently deleted.
                    </CardDescription>
                    <Alert variant="destructive" className="bg-destructive/15">
                        <AlertTitle>
                            <span className="font-bold">Waring: </span>This action cannot be undone.
                        </AlertTitle>
                    </Alert>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmation" className="text-muted-foreground">
                            Enter the course name <span className="font-bold">{course.title}</span>{' '}
                            to continue:
                        </Label>
                        <Input
                            id="confirmation"
                            placeholder={`Type "${course.title}" to confirm`}
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            disabled={pending}
                            className="border-destructive/50"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Link
                            href="/admin/courses"
                            className={buttonVariants({ variant: 'outline' })}
                        >
                            Cancel
                        </Link>

                        <Button
                            variant="destructive"
                            onClick={onSubmit}
                            disabled={pending || !isDeleteEnabled}
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="size-4" />
                                    Delete Course
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
