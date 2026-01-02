-- =====================================================
-- NewPrint3D - Database Schema Verification Script
-- Purpose: Verify all required columns and indexes exist
-- =====================================================

-- Check if all required columns exist in orders table
SELECT
    'Column Check' as test_type,
    column_name,
    data_type,
    is_nullable,
    CASE
        WHEN column_name IN ('subtotal', 'shipping', 'tax', 'total') AND is_nullable = 'NO' THEN '✅ PASS'
        WHEN column_name IN ('stripe_payment_intent_id', 'paypal_order_id') AND is_nullable = 'YES' THEN '✅ PASS'
        ELSE '❌ FAIL'
    END as status
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('subtotal', 'shipping', 'tax', 'total', 'stripe_payment_intent_id', 'paypal_order_id')
ORDER BY column_name;

-- Check if required indexes exist
SELECT
    'Index Check' as test_type,
    indexname,
    tablename,
    '✅ PASS' as status
FROM pg_indexes
WHERE tablename = 'orders'
AND indexname IN (
    'idx_orders_stripe_payment_intent_id',
    'idx_orders_paypal_order_id',
    'idx_orders_order_number',
    'idx_orders_user_id'
)
ORDER BY indexname;

-- Check recent orders data integrity
SELECT
    'Data Integrity Check' as test_type,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN subtotal > 0 THEN 1 END) as orders_with_subtotal,
    COUNT(CASE WHEN shipping > 0 THEN 1 END) as orders_with_shipping,
    COUNT(CASE WHEN tax >= 0 THEN 1 END) as orders_with_tax,
    COUNT(CASE WHEN stripe_payment_intent_id IS NOT NULL THEN 1 END) as stripe_orders,
    COUNT(CASE WHEN paypal_order_id IS NOT NULL THEN 1 END) as paypal_orders,
    CASE
        WHEN COUNT(*) = COUNT(CASE WHEN subtotal > 0 THEN 1 END) THEN '✅ PASS'
        ELSE '❌ FAIL - Some orders missing subtotal'
    END as subtotal_status,
    CASE
        WHEN COUNT(*) = COUNT(CASE WHEN shipping >= 0 THEN 1 END) THEN '✅ PASS'
        ELSE '❌ FAIL - Some orders missing shipping'
    END as shipping_status
FROM orders
WHERE created_at > NOW() - INTERVAL '7 days';

-- Check payment method distribution
SELECT
    'Payment Methods' as test_type,
    payment_method,
    COUNT(*) as count,
    ROUND(AVG(total), 2) as avg_order_value,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_orders
FROM orders
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY payment_method
ORDER BY count DESC;

-- Summary message
DO $$
DECLARE
    missing_columns INTEGER;
    missing_indexes INTEGER;
BEGIN
    -- Count missing columns
    SELECT COUNT(*) INTO missing_columns
    FROM (
        SELECT column_name
        FROM (VALUES
            ('subtotal'),
            ('shipping'),
            ('tax'),
            ('total'),
            ('stripe_payment_intent_id'),
            ('paypal_order_id')
        ) AS required(column_name)
        WHERE NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'orders' AND columns.column_name = required.column_name
        )
    ) AS missing;

    -- Count missing indexes
    SELECT COUNT(*) INTO missing_indexes
    FROM (
        SELECT indexname
        FROM (VALUES
            ('idx_orders_stripe_payment_intent_id'),
            ('idx_orders_paypal_order_id'),
            ('idx_orders_order_number')
        ) AS required(indexname)
        WHERE NOT EXISTS (
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'orders' AND pg_indexes.indexname = required.indexname
        )
    ) AS missing;

    IF missing_columns = 0 AND missing_indexes = 0 THEN
        RAISE NOTICE '✅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
        RAISE NOTICE '✅ SCHEMA VERIFICATION PASSED';
        RAISE NOTICE '✅ All required columns and indexes exist';
        RAISE NOTICE '✅ Database is ready for payment processing';
        RAISE NOTICE '✅ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    ELSE
        RAISE WARNING '❌ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
        RAISE WARNING '❌ SCHEMA VERIFICATION FAILED';
        RAISE WARNING '❌ Missing columns: %', missing_columns;
        RAISE WARNING '❌ Missing indexes: %', missing_indexes;
        RAISE WARNING '❌ Run migration script: 005-add-paypal-support.sql';
        RAISE WARNING '❌ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    END IF;
END $$;
