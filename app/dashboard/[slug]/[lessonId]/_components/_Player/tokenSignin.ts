'use server';

import Mux from '@mux/mux-node';
import { env } from '@/lib/env';

interface tokentList {
    playbackToken: string;
    licenseToken: string;
}

export async function createToken(playbackId: string): Promise<tokentList> {
    const mux = new Mux();

    const baseOptions = {
        keyId: env.MUX_SIGNIN_KEY_ID,
        keySecret: env.MUX_SIGNIN_KEY_SECRET,
        expiration: '7d',
    };

    const playbackToken = await mux.jwt.signPlaybackId(playbackId, {
        ...baseOptions,
        type: 'video',
    });

    const licenseToken = await mux.jwt.signDrmLicense(playbackId, {
        ...baseOptions,
        type: 'drm_license',
    });

    return {
        playbackToken,
        licenseToken,
    };
}
