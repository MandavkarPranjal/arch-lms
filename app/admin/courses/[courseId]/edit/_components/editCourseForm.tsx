'use client';

import {
    courseCategories,
    courseLevels,
    courseSchema,
    CourseSchemaType,
    coursesStatus,
} from '@/lib/zodSchemas';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AdminGetSingularCourse } from '@/app/data/admin/admin-get-course';
import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import { Uploader } from '@/components/file-uploader/uploader';
import { Loader2, PlusIcon, SparklesIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { editCourse } from '../actions';
import { useTransition } from 'react';
import { toast } from 'sonner';
import slugify from 'slugify';

interface AppProps {
    data: AdminGetSingularCourse;
}

export function EditCourseForm({ data }: AppProps) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: data.title,
            description: data.description,
            filekey: data.filekey,
            price: data.price,
            duration: data.duration,
            level: data.level,
            category: data.category as CourseSchemaType['category'],
            smallDescription: data.smallDescription,
            slug: data.slug,
            status: data.status,
        },
    });

    function onSubmit(values: CourseSchemaType) {
        startTransition(async () => {
            const { data: result, error } = await tryCatch(editCourse(values, data.id));

            if (error) {
                toast.error('An unexpected error occurred. Please try again later.');
            }

            if (result?.status === 'success') {
                toast.success(result.message);
                form.reset();
                router.push('/admin/courses');
            } else if (result?.status === 'error') {
                toast.error(result.message);
            }
        });
    }
    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-end gap-4">
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Slug</FormLabel>
                                <FormControl>
                                    <Input placeholder="Slug" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="button"
                        className="w-fit"
                        onClick={() => {
                            const titleValue = form.getValues('title');

                            const slug = slugify(titleValue);

                            form.setValue('slug', slug, { shouldValidate: true });
                        }}
                    >
                        Generate Slug <SparklesIcon className="ml-1" size={16} />
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name="smallDescription"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Small Description"
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <RichTextEditor field={field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="filekey"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                                <Uploader
                                    onChange={field.onChange}
                                    value={field.value}
                                    fileTypeAccepted="image"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseCategories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {courseLevels.map((categories) => (
                                            <SelectItem key={categories} value={categories}>
                                                {categories}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Duration (hours)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Duration" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Price" type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {coursesStatus.map((categories) => (
                                        <SelectItem key={categories} value={categories}>
                                            {categories}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={pending}>
                    {pending ? (
                        <>
                            Updating...
                            <Loader2 className="ml-1 animate-spin" />
                        </>
                    ) : (
                        <>
                            Update Course <PlusIcon className="ml-1" size={16} />
                        </>
                    )}
                </Button>
            </form>
        </Form>
    );
}
