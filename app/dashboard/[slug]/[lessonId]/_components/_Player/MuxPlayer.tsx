import { MuxPlayerClient } from './MuxPlayerClient';
import { createToken } from './tokenSignin';

export default async function Player() {
    const { playbackToken, licenseToken } = await createToken();
    return (
        <div>
            <MuxPlayerClient playbackToken={playbackToken} licenseToken={licenseToken} />
        </div>
    );
}
