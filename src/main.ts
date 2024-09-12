import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //allow CORS localhost:5173
  // app.enableCors({
  //   origin: [
  //     'http://localhost:5173',
  //     'http://localhost:5173/',
  //     'http://localhost:5173/v2',
  //     'http://localhost:5173/v2/',
  //     'https://pmms.rtarf.mi.th/v2',
  //     'https://pmms.rtarf.mi.th/v2/',
  //     'http://localhost:5500',
  //     'localhost:5173'
  //   ],
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(process.env.PORT);
}
bootstrap();
