import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import 'reflect-metadata';

import { AppModule } from './app.module';

const port = process.env.PORT || 3000;

let server: Handler;

async function bootstrap() {
  console.log('App initializing on %s port', port);
  console.log('pg host: ', process.env.PG_HOST);
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  //await app.init();

  //await app.listen(port);
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
