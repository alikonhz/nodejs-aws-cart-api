import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as awslambda from 'aws-cdk-lib/aws-lambda';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CartApiServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const env = {
      PG_HOST: process.env.PG_HOST!,
      PG_PORT: process.env.PG_PORT!,
      PG_USERNAME: process.env.PG_USERNAME!,
      PG_PASSWORD: process.env.PG_PASSWORD!,
      PG_DBNAME: process.env.PG_DBNAME!,
    };
    const lambda = new NodejsFunction(this, 'CartApiService', {
      functionName: 'cartApiService',
      entry: path.join(__dirname, '../../dist/main.js'),
      handler: 'index.handler',
      runtime: awslambda.Runtime.NODEJS_18_X,
      environment: env,
      timeout: cdk.Duration.minutes(5),
    });

    console.log(JSON.stringify(env));

    const api = new HttpApi(this, 'CartHttpApi', {
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
      }
    });

    api.addRoutes({
      path: '/api/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('CartHttpApiLambdaIntegration', lambda),
    });

    new cdk.CfnOutput(this, 'CartHttpApiUrl', {
      exportName: 'CartHttpApiUrlExport',
      value: api.url ?? '',
    });
  }
}
