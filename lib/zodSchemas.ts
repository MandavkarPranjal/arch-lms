import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const coursesStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [ // NOTE: This is dummy categories
    "Development",
    "Design",
    "Business",
    "Marketing",
    "Finance",
    "Health",
    "Education",
    "Technology",
    "Gaming",
    "Lifestyle",
    "Music",
    "Photography",
    "Productivity",
    "Science",
    "Writing",
] as const;

export const courseSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 character long" })
        .max(100, { message: "Title must be at most 100 character long" }),
    description: z
        .string()
        .min(3, { message: "Description must be at least 3 character long" }),

    filekey: z
        .string()
        .min(1, { message: "File is required" }),

    price: z.coerce
        .number()
        .min(1, { message: "Price must be a positive number" }), // user can't create free courses
    duration: z.coerce
        .number()
        .min(1, { message: "Duration must be at least 1 hour" }),
    level: z.enum(courseLevels, { message: "Level is required" }),

    category: z.enum(courseCategories, { message: "Category is required" }),
    smallDescription: z
        .string()
        .min(3, { message: "Small description must be at least 3 character long" })
        .max(200, { message: "Small description must be at most 200 character long" }),

    slug: z
        .string()
        .min(3, { message: "Slug must be at least 3 character long" }),

    status: z.enum(coursesStatus, { message: "Status is required" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
