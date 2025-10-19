'use client';

import MuxPlayer from '@mux/mux-player-react';

interface MuxPlayerClientProps {
    playbackId: string;
    playbackToken: string;
    licenseToken: string;
}

export function MuxPlayerClient({ playbackId, playbackToken, licenseToken }: MuxPlayerClientProps) {
    return (
        <MuxPlayer
            playbackId={playbackId}
            tokens={{
                playback: playbackToken,
                drm: licenseToken,
            }}
        />
    );
}
