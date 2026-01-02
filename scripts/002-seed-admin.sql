-- =====================================================
-- NewPrint3D - Criar Usuário Admin Padrão
-- Execute este script após 001-create-tables.sql
-- =====================================================

-- IMPORTANTE: Altere a senha após o primeiro login!
-- Email: admin@newprint3d.com
-- Senha: Admin123!

-- Inserir usuário admin
-- Senha hash para "Admin123!" usando bcrypt
-- Hash gerado com: bcrypt.hash('Admin123!', 10)
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES (
    'admin@newprint3d.com',
    '$2b$10$shf97r3Zy1rWcq.476KFyOfCWShiM5MPATpITlqXzcHSpZJ3co4ae',
    'Admin',
    'NewPrint3D',
    'admin'
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Usuário admin criado com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Email: admin@newprint3d.com';
    RAISE NOTICE 'Senha: Admin123!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'IMPORTANTE: Altere a senha após o primeiro login!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Próximo passo: Execute 003-seed-products.sql (opcional)';
END $$;
