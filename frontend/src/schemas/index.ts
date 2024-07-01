import { z } from "zod";

export const ProductSchema = z.object({
    product_brand_id: z
        .string()
        .min(1, { message: "Product brand ID is required." })
        .optional(),
    product_name: z
        .string()
        .max(200, { message: "Product name must be at most 200 characters." })
        .min(1, { message: "Product name is required." }),
    product_type: z
        .string()
        .max(50, { message: "Product type must be at most 50 characters." }),
    product_age: z
        .string()
        .max(10, { message: "Product age must be at most 10 characters." }),
    product_price: z
        .number()
        .nonnegative({ message: "Product price must be a non-negative number." }),
    product_price_discount: z
        .number()
        .nonnegative({ message: "Product price discount must be a non-negative number." })
        .optional(),
    product_img: z
        .string()
        .min(1, { message: "Product image URL is required." }),
    quantity: z
        .number()
        .nonnegative({ message: "Quantity must be a non-negative number." }),
    product_description: z
        .string()
        .min(1, { message: "Product description is required." }),
    product_status_id: z
        .string()
        .min(1, { message: "Product status ID is required." })
        .optional(),
})