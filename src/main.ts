import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './filters/exception.filter';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ enableDebugMessages: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Hamad')
    .setDescription('Hamad API description')
    .setVersion('1.0')
    .addTag('Hamad')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/apidocs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, function () {
    console.log('listening on port and server', port);
  });
  console.log('App running at', port);
}
bootstrap();
