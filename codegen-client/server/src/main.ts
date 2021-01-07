import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { version } from '../package.json';
import { BunyanLoggerService } from './logger/logger.service';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { UncaughtExceptionsFilter } from './exceptions/uncaught-exception-filter';
import { HttpExceptionFilter } from './exceptions/http';
import { join } from 'path';
import * as http from 'http';
import * as serveStatic from 'serve-static';
import * as finalhandler from 'finalhandler';

async function bootstrap() {
  const logger = new BunyanLoggerService();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger },
  );

  app.use(compression());
  app.enableCors();
  app.useStaticAssets({root:join(process.cwd(), '../../output')
,prefix:'/static'});
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new UncaughtExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get('ConfigService');
  const port = configService.get('PORT');
  const clientPort = configService.get('CLIENT_PORT');
  const useSwaggerDoc = configService.get('SWAGGER_DOC') === 'TRUE';

  if (useSwaggerDoc) {
    const options = new DocumentBuilder()
      .setTitle('swagger codegen')
      .setDescription('fetch代码自动生成服务')
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  const serve = serveStatic(join(process.cwd(),'../client'),{ 'index': ['index.html', 'index.htm']});

  http.createServer(function onRequest (req, res) {
    serve(req as any, res as any, finalhandler(req, res))
  }).listen(clientPort||3001)

  await app.listen(port || 3000,'0.0.0.0');
}

bootstrap();
