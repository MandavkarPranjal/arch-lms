import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { courseId, enrollmentId, status } = await request.json();

        if (!courseId || !enrollmentId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update the enrollment status
        const updatedEnrollment = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { status },
            include: { course: true },
        });

        return NextResponse.json({
            success: true,
            courseSlug: updatedEnrollment.course.slug,
        });
    } catch (error) {
        console.error('Error updating enrollment:', error);
        return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
    }
}
