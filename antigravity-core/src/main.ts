import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Hybrid Application: REST HTTP + Kafka Microservice Connectors
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Configure Global Validation Pipeline (Zod/Class-validator layer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error('VALIDATION ERROR:', JSON.stringify(errors, null, 2));
        return new BadRequestException(errors);
      }
    }),
  );

  // Open HTTP edge layer proxy 
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log(`Antigravity Performance Network is running HTTP on: ${await app.getUrl()}`);
}
bootstrap();
