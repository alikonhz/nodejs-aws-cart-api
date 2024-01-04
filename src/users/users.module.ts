import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { User } from 'src/cart';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [ UsersService ],
  exports: [ UsersService ],
})
export class UsersModule {}
