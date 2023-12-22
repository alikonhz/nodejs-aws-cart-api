import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ColumnType } from 'typeorm';

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

  @PrimaryColumn({type: 'uuid'})
  cart_id: string;

  @PrimaryColumn({type: 'uuid'})
  product_id: string;

  @Column()
  count: number;
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

  items: CartItem[];
}
