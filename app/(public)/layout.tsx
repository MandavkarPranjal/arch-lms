import { Navbar } from './_components/navbar';
import { Footer } from './_components/footer';
import { ReactNode } from 'react';

export default function LayoutPublic({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="w-full flex-1">{children}</main>
            <Footer />
        </div>
    );
}
