CREATE TYPE public.carts_status_enum AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts
(
    status carts_status_enum NOT NULL DEFAULT 'OPEN'::carts_status_enum,
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at date NOT NULL,
    updated_at date NOT NULL,
    CONSTRAINT pk_carts PRIMARY KEY (id)
);


CREATE TABLE cart_items
(
	cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    count integer NOT NULL,
    CONSTRAINT pk_cart_items PRIMARY KEY (cart_id, product_id),
	CONSTRAINT fk_cart_items_ref_carts FOREIGN KEY (cart_id) REFERENCES carts(id)
);

CREATE TABLE orders
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id text NOT NULL,
    cart_id uuid NOT NULL,
    payment jsonb NOT NULL,
    delivery jsonb NOT NULL,
    comments text NOT NULL,
    status text NOT NULL,
    total integer NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (id),
    CONSTRAINT fk_orders_ref_carts FOREIGN KEY (cart_id) REFERENCES carts (id)
);