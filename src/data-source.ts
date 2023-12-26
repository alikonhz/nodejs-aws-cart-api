import { DataSource } from 'typeorm';
import { Cart, CartItem, Product } from './cart';
import { Order } from './order';

export const AppDataSource = new DataSource({
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
});