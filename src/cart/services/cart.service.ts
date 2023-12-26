import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem, CartStatusType } from '../models';
import { AppDataSource } from 'src/data-source';
import { EntityManager } from 'typeorm';

@Injectable()
export class CartService {
  async findByUserId(userId: string): Promise<Cart> {
    return await AppDataSource.transaction(async (em) => {
      return await this.findByUserIdTx(em, userId);
    });
  }

  async findByUserIdTx(em: EntityManager, userId: string): Promise<Cart> {
    const carts = await em.find(Cart, {
      where: {
        user_id: userId,
      },
      relations: {
        items: true,
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
    return await AppDataSource.transaction(async (em) => {
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
    return await AppDataSource.transaction(async (em) => {
      const cart = await this.findOrCreateByUserIdTx(em, userId);
      cart.items = items;
      await em.save(cart);

      return cart;
    });
  }

  async removeByUserId(userId): Promise<void> {
    await AppDataSource.transaction(async (em) => {
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
