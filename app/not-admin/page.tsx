import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ArrowLeft, ShieldX } from 'lucide-react';
import Link from 'next/link';

export default function NotAdmin() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="bg-destructive/10 mx-auto w-fit rounded-full p-4">
                        <ShieldX className="text-destructive size-16" />
                    </div>

                    <CardTitle className="text-2xl">Access Restricted</CardTitle>
                    <CardDescription className="mx-auto max-w-xs">
                        Hey! You are not an admin. You can&apos;t access this page.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Link
                        href="/"
                        className={buttonVariants({
                            className: 'w-full',
                        })}
                    >
                        <ArrowLeft className="mr-1 size-4" />
                        Back to Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
