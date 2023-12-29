import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Cart, CartItem } from '../../cart/models';

export type PaymentType = {
  provider: string,
};

export type DeliveryType = {
  provider: string,
};

@Entity({ name: 'orders' })
export class Order {
  @PrimaryColumn('uuid')
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
