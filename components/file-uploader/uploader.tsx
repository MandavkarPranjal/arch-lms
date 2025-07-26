'use client';

import { FileRejection, useDropzone } from 'react-dropzone';
import { RenderEmptyState } from './render-state';
import { Card, CardContent } from '../ui/card';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploaderState {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: 'image' | 'video';
}

export function Uploader() {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: 'image',
    });

    async function uploadFile(file: File) {
        setFileState((prev) => ({
            ...prev,
            uploading: true,
            progress: 0,
        }));

        try {
            // 1. Get presigned url

            const presignedResponse = await fetch('/api/s3/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true,
                }),
            });

            if (!presignedResponse.ok) {
                toast.error('Failed to generate presigned url');
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true,
                }));

                return;
            }

            const { presignedUrl, key } = await presignedResponse.json();

            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
            });
        } catch {}
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileState({
                file: file,
                uploading: false,
                progress: 0,
                objectUrl: URL.createObjectURL(file),
                error: false,
                id: uuidv4(),
                isDeleting: false,
                fileType: 'image',
            });
        }
    }, []);

    function rejectFiles(fileRejection: FileRejection[]) {
        if (fileRejection.length) {
            const toManyFiles = fileRejection.find(
                (fileRejection) => fileRejection.errors[0].code === 'too-many-files',
            );

            const fileSizeTooBig = fileRejection.find(
                (rejection) => rejection.errors[0].code === 'file-too-large',
            );

            if (fileSizeTooBig) {
                toast.error('File Size exceeds the limit');
            }

            if (toManyFiles) {
                toast.error('Too many files selected, max is 1');
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB of max file size
        onDropRejected: rejectFiles,
    });

    return (
        <Card
            {...getRootProps()}
            className={cn(
                'relative h-64 w-full border-2 border-dashed transition-colors duration-100 ease-in-out',
                isDragActive
                    ? 'border-primary bg-primary/10 border-solid backdrop-blur-sm'
                    : 'border-border hover:border-primary',
            )}
        >
            <CardContent className="flex h-full w-full items-center justify-center">
                <input {...getInputProps()} />
                <RenderEmptyState isDragActive={isDragActive} />
            </CardContent>
        </Card>
    );
}
