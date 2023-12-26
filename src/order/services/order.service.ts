import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(    
    private dataSource: DataSource) {
  }

  async findById(orderId: string): Promise<Order> {
    return await this.dataSource.transaction(async (em) => {
      return em.findOneBy(Order, {
        id: orderId
      })
    });
  }

  async update(orderId, data): Promise<Order> {
    const order = this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    return await this.dataSource.transaction(async (em) => {
      const updatedOrder: Order = {
        ...data,
        id: orderId,
      };
      em.save(updatedOrder);

      return updatedOrder;
    });
  }
}
