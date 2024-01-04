import { Order } from 'src/order';
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ColumnType, OneToMany, ManyToMany, ManyToOne, JoinColumn, Relation, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type CartStatusType = 'OPEN' | 'ORDERED';

@Entity({
  name: 'products'
})
export class Product {
  @PrimaryColumn()
  product_id: string;

  @Column({type: 'text'})
  title: string;

  @Column({type: 'text'})
  description: string;

  @Column()
  price: number;

  @OneToMany(() => CartItem, (ci) => ci.product)
  cartItems: CartItem[];
};

@Entity({
  name: "cart_items"
})
export class CartItem {

  @PrimaryColumn({type: 'uuid', name: 'cart_id'})
  cart_id: string;

  @PrimaryColumn({type: 'uuid', name: 'product_id'})
  product_id: string;

  @Column()
  count: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Relation<Cart>;


  @ManyToOne(() => Product, (p) => p.cartItems)
  @JoinColumn({name: 'product_id'})
  product: Relation<Product>;
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

  @OneToMany(() => CartItem, (ci) => ci.cart, { cascade: true  })
  items: CartItem[];

  @OneToMany(() => Order, (o) => o.cart)
  orders: Order[];
}

@Entity({name: 'users'})
export class User {
  @PrimaryColumn({type: 'uuid'})
  id: string;
  
  @Column()
  login: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updated_at: Date;
}