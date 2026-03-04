import { z } from 'zod';

export const bulkProductSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    category_id: z.string().uuid('Invalid category selected'),
    description: z.string().optional(),
    price_per_unit: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    stock_qty: z.coerce.number().int().min(0, 'Stock cannot be negative'),
});

export const bulkImportSchema = z.array(bulkProductSchema).min(1, 'You must import at least one product');

export type BulkProductFormValues = z.infer<typeof bulkProductSchema>;
export type BulkImportResult = {
    success: boolean;
    insertedCount?: number;
    error?: string;
};
