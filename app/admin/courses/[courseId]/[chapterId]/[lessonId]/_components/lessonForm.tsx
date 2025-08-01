'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import { AdminLessonType } from '@/app/data/admin/admin-get-lesson';
import { lessonSchema, LessonSchemaType } from '@/lib/zodSchemas';
import { Button, buttonVariants } from '@/components/ui/button';
import { Uploader } from '@/components/file-uploader/uploader';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { useForm } from 'react-hook-form';
import { updateLesson } from '../actions';
import { ArrowLeft } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

interface AppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({ chapterId, courseId, data }: AppProps) {
    const [pending, startTransition] = useTransition();

    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
            notesKey: data.notesKey ?? undefined,
        },
    });

    async function onSubmit(values: LessonSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(updateLesson(values, data.id));

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
            }

            if (result?.status === 'success') {
                toast.success(result.message);
            } else if (result?.status === 'error') {
                toast.error(result.message);
            }
        });
    }

    return (
        <div>
            <Link
                href={`/admin/courses/${courseId}/edit`}
                className={buttonVariants({
                    variant: 'outline',
                    className: 'mb-6',
                })}
            >
                <ArrowLeft className="size-4" />
                <span>Go Back</span>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Lesson Configuration</CardTitle>
                    <CardDescription>
                        Configure the video and description for this lesson.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lesson Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="thumbnailKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader
                                                onChange={field.onChange}
                                                value={field.value}
                                                fileTypeAccepted="image"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video File</FormLabel>
                                        <FormControl>
                                            <Uploader
                                                onChange={field.onChange}
                                                value={field.value}
                                                fileTypeAccepted="video"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="notesKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes File</FormLabel>
                                        <FormControl>
                                            <Uploader
                                                onChange={field.onChange}
                                                value={field.value}
                                                fileTypeAccepted="document"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={pending}>
                                {pending ? 'Saving...' : 'Save Lesson'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
