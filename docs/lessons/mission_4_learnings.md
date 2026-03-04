# ADW Mission 4 Learnings: Marketplace Browse

## Technical Takeaways
1. **Joining with Types**: When returning compound Supabase queries (e.g., product joined with `supplier_profiles` and `product_categories`), defining precise TypeScript interfaces like `FlowerProductWithSupplier` helps prevent deeply nested data access errors during render. The `as unknown as [Type]` assertion is necessary in Supabase JS due to complex generated types.
2. **Component Architecture**: Abstracting the complex card UI into a dedicated component (`MarketplaceProductCard`) keeps the main `/shop/browse` page clean, allowing it to focus strictly on data fetching and search parameter URL syncing.
3. **Empty States & Filters**: Checking both `search` and `categoryId` params allowed for differentiated empty states ("No products match filters" vs "No products exist").
4. **URL Parameters via Next.js 15**: Properly handled Next.js 15 `searchParams` by treating them explicitly as a `Promise<{ [key: string]: string | string[] | undefined }>` and extracting the single-string value before passing to the `getProducts` action.
