-- =====================================================
-- NewPrint3D - Melhorias de Performance e Funcionalidade
-- Execute este script após os scripts 001, 002 e 003
-- =====================================================

-- ====================================
-- ADICIONAR ÍNDICES PARA PERFORMANCE
-- ====================================

-- Índice para ordenação de pedidos por data de criação (DESC)
CREATE INDEX IF NOT EXISTS idx_orders_created_at_desc ON orders(created_at DESC);

-- Índice para busca de pedidos por payment_intent do Stripe
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);

-- Índice para joins de order_items com products
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Índice composto para produtos ativos e em destaque (consulta comum)
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON products(active, featured) WHERE active = true;

-- Índice para busca de produtos por categoria (com active)
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category, active) WHERE active = true;

-- ====================================
-- ADICIONAR COLUNAS PARA AUDITORIA
-- ====================================

-- Adicionar soft delete para usuários (sem deletar permanentemente)
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Adicionar soft delete para pedidos
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP DEFAULT NULL;

-- Adicionar campo para rastreamento de IP (útil para auditoria)
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45) DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP DEFAULT NULL;

-- ====================================
-- ADICIONAR TABELAS ADICIONAIS
-- ====================================

-- Tabela de cupons de desconto
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2) DEFAULT 0,
    max_uses INTEGER DEFAULT NULL,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP DEFAULT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de avaliações de produtos
CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de favoritos (wishlist)
CREATE TABLE IF NOT EXISTS wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Tabela de logs de inventário (auditoria de estoque)
CREATE TABLE IF NOT EXISTS inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    quantity_change INTEGER NOT NULL,
    quantity_before INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL,
    notes TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- ADICIONAR ÍNDICES NAS NOVAS TABELAS
-- ====================================

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_product_id ON inventory_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_order_id ON inventory_logs(order_id);

-- ====================================
-- ADICIONAR TRIGGERS PARA NOVAS TABELAS
-- ====================================

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- ADICIONAR CONSTRAINTS
-- ====================================

-- Garantir que promo code tenha desconto válido
ALTER TABLE promo_codes ADD CONSTRAINT check_discount_value
    CHECK (discount_value > 0 AND
           (discount_type = 'percentage' AND discount_value <= 100 OR discount_type = 'fixed'));

-- Garantir que uses_count não exceda max_uses
ALTER TABLE promo_codes ADD CONSTRAINT check_uses_count
    CHECK (max_uses IS NULL OR uses_count <= max_uses);

-- ====================================
-- FUNÇÃO PARA GERAR NÚMERO DE PEDIDO ÚNICO
-- ====================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    number_exists BOOLEAN;
BEGIN
    LOOP
        new_number := 'NP3D-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
        SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO number_exists;
        EXIT WHEN NOT number_exists;
    END LOOP;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- MENSAGEM DE SUCESSO
-- ====================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Melhorias aplicadas com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Índices de performance adicionados';
    RAISE NOTICE '✓ Soft delete implementado (users, orders)';
    RAISE NOTICE '✓ Tabelas adicionais criadas:';
    RAISE NOTICE '  - promo_codes (cupons de desconto)';
    RAISE NOTICE '  - product_reviews (avaliações)';
    RAISE NOTICE '  - wishlists (favoritos)';
    RAISE NOTICE '  - inventory_logs (auditoria de estoque)';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Função generate_order_number() disponível para uso';
    RAISE NOTICE '========================================';
END $$;
