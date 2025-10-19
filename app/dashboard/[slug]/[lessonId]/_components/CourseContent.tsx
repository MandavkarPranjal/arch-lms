'use client';

import { RenderDescription } from '@/components/rich-text-editor/RenderDescription';
import { LessonContentType } from '@/app/data/course/get-lesson-content';
import { BookIcon, CheckCircle, FileTextIcon } from 'lucide-react';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { MuxPlayerClient } from './_Player/MuxPlayerClient';
import { useConfetti } from '@/hooks/use-confetti';
import { Button } from '@/components/ui/button';
import { MarkLessonComplete } from '../actions';
import { tryCatch } from '@/hooks/try-catch';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface AppProps {
    data: LessonContentType;
    tokens: {
        playbackToken: string;
        licenseToken: string;
    };
}

export function CourseContent({ data, tokens }: AppProps) {
    const [pending, startTransition] = useTransition();
    const { triggerConfetti } = useConfetti();
    const notesUrl = useConstructUrl(data.notesKey ?? '');

    function VideoPlayer({ videoKey }: { videoKey: string }) {
        if (!videoKey) {
            return (
                <div className="bg-muted/70 flex aspect-video flex-col items-center justify-center rounded-lg">
                    <BookIcon className="text-primary mx-auto mb-4 size-16" />
                    <p>This lesson does not have a video</p>
                </div>
            );
        }

        return (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                <MuxPlayerClient
                    playbackId={videoKey}
                    playbackToken={tokens.playbackToken}
                    licenseToken={tokens.licenseToken}
                />
            </div>
        );
    }

    function onSubmit() {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(
                MarkLessonComplete(data.id, data.chapter.course.slug),
            );

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
            }

            if (result?.status === 'success') {
                toast.success(result.message);
                triggerConfetti();
            } else if (result?.status === 'error') {
                toast.error(result.message);
            }
        });
    }

    return (
        <div className="bg-background flex h-full flex-col pl-6">
            <VideoPlayer videoKey={data.videoKey ?? ''} />

            <div className="border-b py-6">
                {data.lessonProgress.length > 0 ? (
                    <Button
                        variant="outline"
                        className="bg-green-500/10 text-green-500 hover:text-green-600"
                    >
                        <CheckCircle className="mr-2 size-4 text-green-500" />
                        Completed
                    </Button>
                ) : (
                    <Button variant="outline" onClick={onSubmit} disabled={pending}>
                        <CheckCircle className="mr-2 size-4 text-green-500" />
                        Mark as complete
                    </Button>
                )}

                <div className="space-y-3 pt-3">
                    <h1 className="text-foreground text-3xl font-bold tracking-tight">
                        {data.title}
                    </h1>
                    {data.description && <RenderDescription json={JSON.parse(data.description)} />}
                </div>
            </div>

            {data.notesKey && (
                <div className="py-6">
                    <div className="flex items-center gap-2 pb-4">
                        <FileTextIcon className="size-5" />
                        <h2 className="text-xl font-semibold">Lesson Notes</h2>
                    </div>
                    <Button variant="outline" asChild>
                        <a href={notesUrl} target="_blank" rel="noopener noreferrer" download>
                            <FileTextIcon className="mr-2 size-4" />
                            Download Notes
                        </a>
                    </Button>
                </div>
            )}
        </div>
    );
}
