import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/cart';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findOne(login: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { login: login } });
  }

  async createOne({ login, password }: User): Promise<User> {
    return await this.usersRepository.save({
      login,
      password,
    });
  }
}
