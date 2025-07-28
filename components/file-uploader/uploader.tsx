'use client';

import {
    RenderEmptyState,
    RenderErrorState,
    RenderUploadedState,
    RenderUploadingState,
} from './render-state';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
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

interface AppProps {
    value?: string;
    onChange?: () => void;
}

export function Uploader({ onChange, value }: AppProps) {
    const [fileState, setFileState] = useState<UploaderState>({
        error: false,
        file: null,
        id: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        fileType: 'image',
        key: value,
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

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentageCompleted = (event.loaded / event.total) * 100;

                        setFileState((prev) => ({
                            ...prev,
                            progress: Math.round(percentageCompleted),
                        }));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            progress: 100,
                            uploading: false,
                            key: key,
                        }));

                        onChange?.(key);

                        toast.success('File uploaded successfully');

                        resolve();
                    } else {
                        reject(new Error('Failed to upload file'));
                    }
                };
                xhr.onerror = () => {
                    reject(new Error('Failed to upload file'));
                };

                xhr.open('PUT', presignedUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });
        } catch {
            toast.error('Something went wrong');

            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true,
            }));
        }
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];

                if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                    URL.revokeObjectURL(fileState.objectUrl);
                }

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

                uploadFile(file);
            }
        },
        [fileState.objectUrl],
    );

    async function handleRemoveFile() {
        if (fileState.isDeleting || !fileState.objectUrl) return;

        try {
            setFileState((prev) => ({
                ...prev,
                isDeleting: true,
            }));

            const response = await fetch(`/api/s3/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: fileState.key,
                }),
            });

            if (!response.ok) {
                toast.error('Failed to delete file');

                setFileState((prev) => ({
                    ...prev,
                    isDeleting: false,
                    error: true,
                }));

                return;
            }

            if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl);
            }

            onChange?.('');

            setFileState(() => ({
                file: null,
                uploading: false,
                progress: 0,
                objectUrl: undefined,
                error: false,
                id: null,
                isDeleting: false,
                fileType: 'image',
            }));

            toast.success('File removed successfully');
        } catch {
            toast.error('Error removing file. Please try again');

            setFileState((prev) => ({
                ...prev,
                isDeleting: false,
                error: true,
            }));
        }
    }

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

    function renderContent() {
        if (fileState.uploading) {
            return (
                <RenderUploadingState
                    file={fileState.file as File} // shouldn't do it, but did it anyway for workaround
                    progress={fileState.progress}
                />
            );
        }

        if (fileState.error) {
            return <RenderErrorState />;
        }

        if (fileState.objectUrl) {
            return (
                <RenderUploadedState
                    previewUrl={fileState.objectUrl}
                    handleRemoveFile={handleRemoveFile}
                    isDeleting={fileState.isDeleting}
                />
            );
        }

        return <RenderEmptyState isDragActive={isDragActive} />;
    }

    useEffect(() => {
        return () => {
            if (fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl);
            }
        };
    }, [fileState.objectUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB of max file size
        onDropRejected: rejectFiles,
        disabled: fileState.uploading || !!fileState.objectUrl,
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
                {renderContent()}
            </CardContent>
        </Card>
    );
}
