import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3001;
  await app.listen(port);
}
bootstrap();
