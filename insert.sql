DO $$
BEGIN

-- 100 random products
INSERT INTO products(product_id, title, description, price)
	SELECT gen_random_uuid(), 'product', 'description', random()::numeric * 100
	FROM generate_series(1, 100);

UPDATE products
SET title = 'product' || '-' || product_id,
	description = 'description' || '-' || description;

-- 100 random carts with random user ids
INSERT INTO carts(id, user_id, created_at, updated_at, status)
	SELECT gen_random_uuid(), gen_random_uuid(), now()::date, now()::date, 'OPEN'
	FROM generate_series(1, 100);

INSERT INTO cart_items (cart_id, product_id, count)
	SELECT c.id, p.product_id, COALESCE(NULLIF(trunc(random()::numeric * 100 / 10, 0), 0), 1)
	FROM carts c, products p;

END; $$