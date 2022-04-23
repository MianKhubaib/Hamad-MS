import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:['error', 'warn', 'log', 'debug']
  });
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({enableDebugMessages: true}))
  const {httpAdapter} = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))


  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();


