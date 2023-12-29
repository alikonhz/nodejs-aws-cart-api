import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem } from '../models';
import { DataSource, EntityManager } from 'typeorm';
import { Order } from 'src/order';

@Injectable()
export class CartService {
  constructor(private dataSource: DataSource) {
  }

  async findByUserId(userId: string): Promise<Cart> {
    return await this.dataSource.transaction(async (em) => {
      return await this.findByUserIdTx(em, userId);
    });
  }

  async createOrderFromCart(cart: Cart, total: number): Promise<Order> {
    return await this.dataSource.transaction(async (em) => {
      const id = v4();
      const order = new Order();
      order.id = id;
      order.cart = cart;
      order.user_id = cart.user_id;
      order.payment = {
        provider: 'Stripe'
      };
      order.delivery = {
        provider: 'FEDEX'
      };
      order.comments = 'No comments';
      order.status = 'CREATED';
      order.total = total;

      await em.save(order);

      await em.createQueryBuilder()
        .update(Cart)
        .set({
          status: 'ORDERED',
        })
        .where('id = :id', { id: cart.id})
        .execute();

      return order;
    });
  }
  
  async findByUserIdTx(em: EntityManager, userId: string): Promise<Cart> {
    const carts = await em.find(Cart, {
      where: {
        user_id: userId,
        status: 'OPEN',
      },
      relations: {
        items: {
          product: true,
        }
      }
    });

    if (!carts || carts.length == 0) {
      return null;
    }

    return carts[0];
  }

  async createByUserIdTx(em: EntityManager, userId: string): Promise<Cart> {
    const now = new Date();
    const newId = v4();

    const userCart: Cart = new Cart();
    userCart.id = newId;
    userCart.items = [];
    userCart.user_id = userId;
    userCart.created_at = now;
    userCart.updated_at = now;
    userCart.status = 'OPEN';

    await em.save(userCart);

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    return await this.dataSource.transaction(async (em) => {
      return this.findOrCreateByUserIdTx(em, userId);
    });
  }

  async findOrCreateByUserIdTx(em: EntityManager, userId: string): Promise<Cart> {
    const userCart = await this.findByUserIdTx(em, userId);
      if (userCart) {
        return userCart;
      }

      return await this.createByUserIdTx(em, userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    return await this.dataSource.transaction(async (em) => {
      const cart = await this.findOrCreateByUserIdTx(em, userId);
      cart.items = items;
      await em.save(cart);

      return cart;
    });
  }

  async removeByUserId(userId): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      const cart = await this.findByUserIdTx(em, userId);
      if (!cart) {
        return;
      }

      await em.createQueryBuilder()
        .delete()
        .from(CartItem)
        .where('cart_id = :id', { id: cart.id})
        .execute();

      em.remove(cart);
    });
  }
}
