"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, coursesStatus } from "@/lib/zodSchemas";
import { ArrowLeft, PlusCircleIcon, PlusIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@arcjet/next";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

export default function CourseCreatePage() {
    // 1. Define your form.
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            filekey: "",
            price: 0,
            duration: 0,
            level: "Beginner",
            category: "Development",
            smallDescription: "",
            slug: "",
            status: "Draft",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: CourseSchemaType) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <>
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/courses"
                    className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                    })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">Create Courses</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide basic Information about the course</CardDescription>
                </CardHeader>
                <CardContent>
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

                            <div className="flex gap-4 items-end">
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

                                <Button type="button" className="w-fit" onClick={() => {
                                    const titleValue = form.getValues("title")

                                    const slug = slugify(titleValue);

                                    form.setValue("slug", slug, { shouldValidate: true })
                                }}>
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
                                            <Textarea placeholder="Small Description" className="min-h-[120px]" {...field} />
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
                                            {/**
                                            <Textarea placeholder="Description" className="min-h-[120px]" {...field} />
                                             */}
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
                                            <Input placeholder="Thumbnail url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseCategories.map((categories) => (
                                                        <SelectItem
                                                            key={categories}
                                                            value={categories}
                                                        >
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
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Level</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseLevels.map((categories) => (
                                                        <SelectItem
                                                            key={categories}
                                                            value={categories}
                                                        >
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
                                                <Input
                                                    placeholder="Duration"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Price"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Price"
                                                    type="number"
                                                    {...field}
                                                />
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
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {coursesStatus.map((categories) => (
                                                    <SelectItem
                                                        key={categories}
                                                        value={categories}
                                                    >
                                                        {categories}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button >
                                Create Course <PlusIcon className="ml-1" size={16} />
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}
