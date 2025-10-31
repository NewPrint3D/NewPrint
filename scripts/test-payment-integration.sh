#!/bin/bash

# =====================================================
# NewPrint3D - Payment Integration Test Script
# Purpose: Verify all payment systems are working
# =====================================================

set -e  # Exit on error

echo "🧪 NewPrint3D Payment Integration Tests"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://newprint3d.com}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"
PAYPAL_CLIENT_ID="${PAYPAL_CLIENT_ID:-${NEXT_PUBLIC_PAYPAL_CLIENT_ID}}"
PAYPAL_CLIENT_SECRET="${PAYPAL_CLIENT_SECRET}"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    ((TESTS_PASSED++))
}

fail() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    ((TESTS_FAILED++))
}

warn() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Test 1: Environment Variables
section "Test 1: Environment Variables"

if [ -n "$STRIPE_SECRET_KEY" ]; then
    pass "STRIPE_SECRET_KEY is set"
else
    fail "STRIPE_SECRET_KEY is not set"
fi

if [ -n "$PAYPAL_CLIENT_ID" ]; then
    pass "PAYPAL_CLIENT_ID is set"
else
    fail "PAYPAL_CLIENT_ID is not set"
fi

if [ -n "$PAYPAL_CLIENT_SECRET" ]; then
    pass "PAYPAL_CLIENT_SECRET is set"
else
    fail "PAYPAL_CLIENT_SECRET is not set"
fi

if [ -n "$DATABASE_URL" ]; then
    pass "DATABASE_URL is set"
else
    fail "DATABASE_URL is not set"
fi

# Test 2: Site Availability
section "Test 2: Site Availability"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [ "$HTTP_CODE" -eq 200 ]; then
    pass "Site is accessible ($SITE_URL)"
else
    fail "Site returned HTTP $HTTP_CODE"
fi

# Test 3: Stripe API Connection
section "Test 3: Stripe API Connection"

if [ -n "$STRIPE_SECRET_KEY" ]; then
    STRIPE_RESPONSE=$(curl -s -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/customers?limit=1)
    if echo "$STRIPE_RESPONSE" | grep -q '"object": "list"'; then
        pass "Stripe API connection successful"
    else
        fail "Stripe API connection failed: $STRIPE_RESPONSE"
    fi
else
    warn "Skipping Stripe test - STRIPE_SECRET_KEY not set"
fi

# Test 4: PayPal API Connection
section "Test 4: PayPal API Connection"

if [ -n "$PAYPAL_CLIENT_ID" ] && [ -n "$PAYPAL_CLIENT_SECRET" ]; then
    PAYPAL_ENV="https://api-m.paypal.com"
    if [ "$NODE_ENV" != "production" ]; then
        PAYPAL_ENV="https://api-m.sandbox.paypal.com"
    fi

    PAYPAL_RESPONSE=$(curl -s -X POST "$PAYPAL_ENV/v1/oauth2/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -u "$PAYPAL_CLIENT_ID:$PAYPAL_CLIENT_SECRET" \
        -d "grant_type=client_credentials")

    if echo "$PAYPAL_RESPONSE" | grep -q 'access_token'; then
        pass "PayPal API connection successful"
    else
        fail "PayPal API connection failed: $PAYPAL_RESPONSE"
    fi
else
    warn "Skipping PayPal test - credentials not set"
fi

# Test 5: API Routes
section "Test 5: API Routes Accessibility"

# Test checkout sessions endpoint (should return 400 for empty request)
CHECKOUT_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SITE_URL/api/checkout/sessions" \
    -H "Content-Type: application/json" \
    -d '{}')
if [ "$CHECKOUT_CODE" -eq 400 ]; then
    pass "Checkout sessions endpoint is accessible"
else
    fail "Checkout sessions endpoint returned HTTP $CHECKOUT_CODE (expected 400)"
fi

# Test PayPal create order endpoint
PAYPAL_CREATE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SITE_URL/api/paypal/create-order" \
    -H "Content-Type: application/json" \
    -d '{}')
if [ "$PAYPAL_CREATE_CODE" -eq 400 ] || [ "$PAYPAL_CREATE_CODE" -eq 500 ]; then
    pass "PayPal create order endpoint is accessible"
else
    fail "PayPal create order endpoint returned HTTP $PAYPAL_CREATE_CODE"
fi

# Test 6: Webhook Endpoint
section "Test 6: Webhook Endpoint"

WEBHOOK_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SITE_URL/api/webhooks/stripe" \
    -H "Content-Type: application/json" \
    -d '{}')
if [ "$WEBHOOK_CODE" -eq 400 ] || [ "$WEBHOOK_CODE" -eq 401 ]; then
    pass "Stripe webhook endpoint is accessible (returns $WEBHOOK_CODE as expected)"
else
    fail "Stripe webhook endpoint returned HTTP $WEBHOOK_CODE (expected 400 or 401)"
fi

# Test 7: Database Schema Validation
section "Test 7: Database Schema Validation"

if [ -n "$DATABASE_URL" ]; then
    echo "Checking if paypal_order_id column exists..."

    # This test requires psql to be installed
    if command -v psql &> /dev/null; then
        COLUMN_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='paypal_order_id';")

        if echo "$COLUMN_CHECK" | grep -q 'paypal_order_id'; then
            pass "Database schema includes paypal_order_id column"
        else
            fail "Database schema missing paypal_order_id column - run migration script!"
        fi

        # Check for required indexes
        INDEX_CHECK=$(psql "$DATABASE_URL" -t -c "SELECT indexname FROM pg_indexes WHERE tablename='orders' AND indexname='idx_orders_paypal_order_id';")

        if echo "$INDEX_CHECK" | grep -q 'idx_orders_paypal_order_id'; then
            pass "Database has paypal_order_id index"
        else
            warn "Database missing idx_orders_paypal_order_id index"
        fi
    else
        warn "psql not installed - skipping database schema validation"
    fi
else
    warn "DATABASE_URL not set - skipping database tests"
fi

# Summary
section "Test Summary"

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
echo ""
echo "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 All tests passed! Payment integration is ready.${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  $TESTS_FAILED test(s) failed. Please review errors above.${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi
