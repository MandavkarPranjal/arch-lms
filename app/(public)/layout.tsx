import { Navbar } from './_components/navbar';
import { Footer } from './_components/footer';
import { ReactNode } from 'react';

export default function LayoutPublic({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 flex-col">
                <div className="flex flex-col items-center justify-center">
                    <Navbar />
                    <main className="w-full">{children}</main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
