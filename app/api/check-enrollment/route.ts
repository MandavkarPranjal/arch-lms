import { requireUser } from '@/app/data/user/require-user';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const user = await requireUser();
        const { searchParams } = new URL(request.url);
        const courseId = searchParams.get('courseId');

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId,
                },
            },
            select: {
                status: true,
            },
        });

        const isEnrolled = enrollment?.status === 'Active';

        return NextResponse.json({ isEnrolled });
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return NextResponse.json({ error: 'Failed to check enrollment' }, { status: 500 });
    }
}
