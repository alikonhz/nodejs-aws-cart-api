import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import 'reflect-metadata';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

const port = process.env.PORT || 4000;

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  await app.init();

  await AppDataSource.initialize();
  
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());

  console.log('event: ', JSON.stringify(event));

  return server(event, context, callback);
};

bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
