import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ColumnType, OneToMany, ManyToMany, ManyToOne, JoinColumn, Relation } from 'typeorm';

export type CartStatusType = 'OPEN' | 'ORDERED';

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};

@Entity({
  name: "cart_items"
})
export class CartItem {

  @PrimaryColumn({type: 'uuid', name: 'cart_id'})
  cart_id: string;

  @PrimaryColumn({type: 'uuid'})
  product_id: string;

  @Column()
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Relation<Cart>;
}

@Entity({
  name: "carts"
})
export class Cart {

  @PrimaryColumn({type: 'uuid'})
  id: string;

  @Column({type: 'uuid'})
  user_id: string;

  @Column({type: 'date'})
  created_at: Date;

  @Column({type: 'date'})
  updated_at: Date;

  @Column({
    type: "enum",
    enum: ['OPEN', 'ORDERED'],
    default: 'OPEN'
  })
  status: CartStatusType;

  @OneToMany(() => CartItem, (ci) => ci.cart, { cascade: true })
  items: CartItem[];

  @OneToMany(() => Order, (o) => o.cart)
  orders: Order[];
}

export type PaymentType = {
  provider: string,
};

export type DeliveryType = {
  provider: string,
};

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  cart_id: string;

  @Column({ type: 'jsonb' })
  payment: PaymentType;

  @Column({ type: 'jsonb' })
  delivery: DeliveryType;

  @Column()
  comments: string;

  @Column()
  status: string;

  @Column()
  total: number;

  @ManyToOne(() => Cart, (cart) => cart.orders)
  @JoinColumn({ name: 'cart_id' })
  cart: Relation<Cart>;
}