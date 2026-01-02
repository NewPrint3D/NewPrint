-- =====================================================
-- NewPrint3D - Migration: Add PayPal Support
-- Purpose: Add paypal_order_id column and indexes
-- Date: 2025-10-31
-- =====================================================

-- Add paypal_order_id column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS paypal_order_id VARCHAR(255);

-- Add index for PayPal order ID lookups
CREATE INDEX IF NOT EXISTS idx_orders_paypal_order_id ON orders(paypal_order_id);

-- Add index for Stripe payment intent ID if not exists (should exist but ensuring)
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);

-- Add index for payment_status for performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Update CHECK constraint to include 'disputed' status
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'disputed'));

-- Verify the changes
DO $$
DECLARE
    column_exists BOOLEAN;
    index_exists BOOLEAN;
BEGIN
    -- Check if paypal_order_id column was added
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'orders'
        AND column_name = 'paypal_order_id'
    ) INTO column_exists;

    IF column_exists THEN
        RAISE NOTICE '✅ Column paypal_order_id added successfully';
    ELSE
        RAISE WARNING '❌ Failed to add paypal_order_id column';
    END IF;

    -- Check if index was created
    SELECT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'orders'
        AND indexname = 'idx_orders_paypal_order_id'
    ) INTO index_exists;

    IF index_exists THEN
        RAISE NOTICE '✅ Index idx_orders_paypal_order_id created successfully';
    ELSE
        RAISE WARNING '❌ Failed to create idx_orders_paypal_order_id index';
    END IF;

    RAISE NOTICE '🎉 Migration completed! PayPal support is now enabled.';
END $$;
