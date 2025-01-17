import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem, Product } from './cart/models';
import { Order } from './order';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_HOST!,
      port: parseInt(process.env.PG_PORT!),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DBNAME,
      synchronize: false,
      logging: true,
      entities: [Cart, CartItem, Order, Product],
      subscribers: [],
      migrations: [],
      ssl: true,
  })
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
