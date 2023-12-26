import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus, Query } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest, @Query('userid') userId: string) {
    console.log('findUserCart: ', userId);

    const id = getUserIdFromRequest(req) ?? userId;
    const cart = await this.cartService.findOrCreateByUserId(id);

    return cart?.items ?? [];
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Query('userid') userId: string, @Body() body) { // TODO: validate body payload...
    const id = getUserIdFromRequest(req) ?? userId;
    const cart = await this.cartService.updateByUserId(id, body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      }
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Delete()
  clearUserCart(@Req() req: AppRequest, @Query('userid') userId: string) {
    const id = getUserIdFromRequest(req) ?? userId;
    this.cartService.removeByUserId(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Query('userid') userId: string, @Body() body) {
    const id = getUserIdFromRequest(req) ?? userId;
    const cart = await this.cartService.findByUserId(id);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order = this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId: id,
      cartId,
      items,
      total,
    });
    this.cartService.removeByUserId(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
