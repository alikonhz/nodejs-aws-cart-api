import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, CartItem, Product, User } from './cart/models';
import { Order } from './order';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';


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
      entities: [Cart, CartItem, Order, Product, User],
      subscribers: [],
      migrations: [],
      ssl: {
        rejectUnauthorized: false,
        ca: readFileSync(join(__dirname, 'us-east-1-bundle.pem')).toString(),
      },
  })
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
