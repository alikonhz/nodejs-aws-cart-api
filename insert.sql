DO $$
BEGIN

-- 100 random carts with random user ids
INSERT INTO carts(id, user_id, created_at, updated_at, status)
	SELECT gen_random_uuid(), gen_random_uuid(), now()::date, now()::date, 'OPEN'
	FROM generate_series(1, 99);

-- 4 random products with random amount for each cart
INSERT INTO cart_items (cart_id, product_id, count)
	SELECT c.id, gen_random_uuid(), COALESCE(NULLIF(trunc(random()::numeric * 100 / 10, 0), 0), 1)
	FROM carts c
	INNER JOIN generate_series(1, 4) ON 1 = 1;

END; $$