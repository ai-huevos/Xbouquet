-- Update the status check constraint for the orders table to include new states
ALTER TABLE public.orders
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
ADD CONSTRAINT orders_status_check CHECK (
    status IN (
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'partially_fulfilled',
        'delivered',
        'cancelled'
    )
);