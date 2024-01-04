import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus, Query } from '@nestjs/common';

import { BasicAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService
  ) { }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest, @Query('userid') userId: string) {
    console.log('findUserCart: ', userId);

    const id = getUserIdFromRequest(req) ?? userId;
    const cart = await this.cartService.findOrCreateByUserId(id);

    return cart?.items ?? [];
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Query('userid') userId: string, @Body() body) { // TODO: validate body payload...
    const id = getUserIdFromRequest(req) ?? userId;
    console.log('updateUserCart: ', id)
    const cart = await this.cartService.updateByUserId(id, body)

    return cart.items;
  }

  // @UseGuards(JwtAuthGuard)
  @UseGuards(BasicAuthGuard)
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
  @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Query('userid') userId: string, @Body() body) {
    const id = getUserIdFromRequest(req) ?? userId;
    const cart = await this.cartService.findByUserId(id);

    console.log('checkout: ', userId, ' - ', cart?.id);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const total = calculateCartTotal(cart);
    
    console.log('checkout total: ', total);
    const order = await this.cartService.createOrderFromCart(cart, total);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
