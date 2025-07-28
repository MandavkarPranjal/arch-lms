import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
    return (
        <div className="text-center">
            {isDragActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <div className="animate-in fade-in zoom-in relative flex h-[90%] w-[90%] transform items-center justify-center transition-all duration-200 ease-out">
                        <p className="text-primary text-2xl font-semibold">Drop your file here</p>
                    </div>
                </div>
            )}
            <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <CloudUploadIcon className={cn('text-muted-foreground size-6')} />
            </div>
            <p className="text-foreground text-base font-semibold">
                Drop your files here or{' '}
                <span className="text-primary cursor-pointer font-bold">Click to upload</span>
            </p>
            <Button type="button" className="mt-4">
                Select Files
            </Button>
        </div>
    );
}

export function RenderErrorState() {
    return (
        <div className="text-center">
            <div className="bg-destructive/30 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
                <ImageIcon className={cn('text-destructive size-6')} />
            </div>

            <p className="text-base font-semibold">Upload Failed</p>
            <p className="text-muted-foreground mt-1 text-xs">Something went wrong</p>

            <Button type="button" className="mt-4">
                Try Again
            </Button>
        </div>
    );
}

export function RenderUploadedState({
    previewUrl,
    isDeleting,
    handleRemoveFile,
}: {
    previewUrl: string;
    isDeleting: boolean;
    handleRemoveFile: () => void;
}) {
    return (
        <div>
            <Image src={previewUrl} alt="uploaded file" fill className="object-contain p-2" />

            <Button
                variant="destructive"
                size="icon"
                className={cn('absolute top-4 right-4')}
                onClick={handleRemoveFile}
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <Loader2 className="size-4 animate-spin" />
                ) : (
                    <XIcon className="size-4" />
                )}
            </Button>
        </div>
    );
}

export function RenderUploadingState({ progress, file }: { progress: number; file: File }) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <p>{progress}</p>

            <p className="text-foreground mt-2 text-sm font-medium">Uploading...</p>

            <p className="text-muted-foreground mt-1 max-w-xs truncate text-xs">{file.name}</p>
        </div>
    );
}
