-- =====================================================
-- NewPrint3D - Produtos de Exemplo (OPCIONAL)
-- Execute este script se quiser produtos de exemplo
-- =====================================================

-- Inserir produtos de exemplo
INSERT INTO products (
    name_en, name_pt, name_es,
    description_en, description_pt, description_es,
    category, base_price, image_url,
    colors, sizes, materials, featured, stock_quantity
) VALUES
(
    'Custom Phone Stand',
    'Suporte para Celular Personalizado',
    'Soporte para Teléfono Personalizado',
    'Ergonomic phone stand with customizable colors and sizes',
    'Suporte ergonômico para celular com cores e tamanhos personalizáveis',
    'Soporte ergonómico para teléfono con colores y tamaños personalizables',
    'accessories',
    15.99,
    '/modern-3d-printed-phone-stand.jpg',
    ARRAY['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
    ARRAY['Small', 'Medium', 'Large'],
    ARRAY['PLA', 'ABS', 'PETG'],
    true,
    50
),
(
    'Decorative Vase',
    'Vaso Decorativo',
    'Jarrón Decorativo',
    'Modern geometric vase perfect for any room',
    'Vaso geométrico moderno perfeito para qualquer ambiente',
    'Jarrón geométrico moderno perfecto para cualquier habitación',
    'home',
    24.99,
    '/geometric-3d-printed-vase.jpg',
    ARRAY['#8B5CF6', '#06B6D4', '#EC4899', '#F59E0B'],
    ARRAY['Small', 'Medium', 'Large'],
    ARRAY['PLA', 'PETG'],
    true,
    30
),
(
    'Cable Organizer',
    'Organizador de Cabos',
    'Organizador de Cables',
    'Keep your desk tidy with this smart cable management solution',
    'Mantenha sua mesa organizada com esta solução inteligente de gerenciamento de cabos',
    'Mantén tu escritorio ordenado con esta solución inteligente de gestión de cables',
    'accessories',
    12.99,
    '/3d-printed-cable-organizer.jpg',
    ARRAY['#8B5CF6', '#06B6D4', '#10B981', '#64748B'],
    ARRAY['Standard'],
    ARRAY['PLA', 'ABS'],
    true,
    100
);

-- Mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Produtos de exemplo criados com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Você pode editar ou excluir estes produtos no painel admin';
    RAISE NOTICE 'Acesse: https://seu-dominio.com/admin';
    RAISE NOTICE '========================================';
END $$;
