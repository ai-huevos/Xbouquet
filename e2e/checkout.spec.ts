import { test, expect } from '@playwright/test';

test.describe('Checkout Flow Tests', () => {

    test('Full Add to Cart and Checkout Redirect', async ({ page }) => {
        const ts = Date.now();
        const supplierEmail = `supplier${ts}@test.com`;
        const shopEmail = `shop${ts}@test.com`;

        // 1. Supplier Signup & Product Creation
        await page.goto('/signup');
        await page.fill('input[name="full_name"]', 'Test Supplier');
        await page.fill('input[name="email"]', supplierEmail);
        await page.fill('input[name="password"]', 'password123');
        await page.getByText('Supplier', { exact: true }).click();
        await page.waitForLoadState('networkidle'); // Ensure hydration
        await page.click('button[type="submit"]');

        // Wait for dashboard redirect
        await expect(page).toHaveURL(/\/supplier/);

        // Go to products and add one
        await page.goto('/supplier/products');
        await page.click('text="Add New Product"'); // Assuming there's a button, need to verify selector or just use url
        await page.goto('/supplier/products/new');

        await page.fill('input[name="name"]', 'Test E2E Rose');
        // Wait, let's use a simpler approach. If there are existing products, we can just use those.
        // But if DB is empty, this fails. Let's just create one.
        await page.fill('input[name="price_per_unit"]', '10.50');
        await page.fill('input[name="stock_qty"]', '100');
        // Select first category
        await page.selectOption('select[name="category_id"]', { index: 1 });
        await page.waitForLoadState('networkidle'); // Ensure hydration
        await page.click('button:has-text("Save Product")');

        // Wait for redirect to products list (exact match to avoid matching /new)
        await expect(page).toHaveURL(/\/supplier\/products(\?.*)?$/);

        // Logout
        await page.goto('/');
        // Assuming there's a logout button, or we can just clear cookies.
        await page.context().clearCookies();

        // 2. Shop Signup
        await page.goto('/signup');
        await page.fill('input[name="full_name"]', 'Test Shop');
        await page.fill('input[name="email"]', shopEmail);
        await page.fill('input[name="password"]', 'password123');
        await page.getByText('Buyer (Shop)', { exact: true }).click();
        await page.waitForLoadState('networkidle'); // Ensure hydration
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/\/shop\/browse/);

        // 3. Shop Goes to Product Detail and Adds to Cart
        await page.goto('/shop/browse');

        // Click the product link to navigate to the detail page (uses the invisible overlay link for accessibility)
        await page.click('text="View Test E2E Rose"');

        // Click the Add to Cart button on the detail page
        await page.click('button:has-text("Add to Cart")');

        // 4. Shop goes to checkout
        await page.goto('/shop/cart');
        await page.click('text="Proceed to Checkout"');

        // Click continue as guest on gateway
        await page.click('text="Continue as Guest"');

        // Click pay securely on payment page
        await page.click('button:has-text("Pay Securely with Card")');

        // 5. Expect Stripe redirect
        await expect(page).toHaveURL(/checkout\.stripe\.com/);
    });

});
