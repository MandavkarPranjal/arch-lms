import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from 'lucide-react';
import { AdminCourseType } from '@/app/data/admin/admin-get-courses';
import { Button, buttonVariants } from '@/components/ui/button';
import { useConstructUrl } from '@/hooks/use-construct-url';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface AppProps {
    data: AdminCourseType;
}

export function AdminCourseCard({ data }: AppProps) {
    const thumbnailUrl = useConstructUrl(data.filekey);
    return (
        <Card className="group relative gap-0 py-0">
            {/* absolute dropdown */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/edit`}>
                                <Pencil className="mr-2 size-4" />
                                Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/courses/${data.slug}`}>
                                <Eye className="mr-2 size-4" />
                                Preview
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${data.id}/delete`}>
                                <Trash2 className="text-destructive mr-2 size-4" />
                                Delete Course
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Image
                src={thumbnailUrl}
                alt={`${data.title} thumbnail`}
                width={600}
                height={400}
                className="aspect-video h-full w-full rounded-t-lg object-cover"
            />

            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${data.id}`}
                    className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
                >
                    {data.title}
                </Link>

                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
                    {data.smallDescription}
                </p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                        <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
                        <p className="text-muted-foreground text-sm">{data.duration}h</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School className="text-primary bg-primary/10 size-6 rounded-md p-1" />
                        <p className="text-muted-foreground text-sm">{data.level}</p>
                    </div>
                </div>

                <Link
                    className={buttonVariants({
                        className: 'mt-4 w-full',
                    })}
                    href={`/admin/courses/${data.id}/edit`}
                >
                    Edit Course <ArrowRight className="ml-1 size-4" />
                </Link>
            </CardContent>
        </Card>
    );
}
