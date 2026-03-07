import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    category_id: z.string().uuid('Invalid category selected'),
    description: z.string().optional(),
    price_per_unit: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    stock_qty: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    box_type: z.enum(['QB', 'HB', 'FB']).optional().nullable(),
    stems_per_bunch: z.coerce.number().int().min(1, 'Must be at least 1').optional().nullable(),
    stem_length_cm: z.coerce.number().int().min(1, 'Must be at least 1 cm').optional().nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
