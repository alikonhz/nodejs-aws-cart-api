import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './services';

@Module({
  providers: [ CartService ],
  exports: [ CartService ],
  controllers: [ CartController ],
})
export class CartModule {}
