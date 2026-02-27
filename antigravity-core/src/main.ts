import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Hybrid Application: REST HTTP + Kafka Microservice Connectors
  const app = await NestFactory.create(AppModule);

  // Configure Global Validation Pipeline (Zod/Class-validator layer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Attach Kafka Brokers mapped to exactly the docker-compose ENV
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'antigravity-core',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'antigravity-consumer-group',
      },
    },
  });

  // Start Kafka consumers asynchronously
  await app.startAllMicroservices();

  // Open HTTP edge layer proxy 
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Antigravity Performance Network is running HTTP on: ${await app.getUrl()}`);
  console.log(`Antigravity Kafka Consumer Loop Initiated on Kafka: ${process.env.KAFKA_BROKER || 'localhost:9092'}`);
}
bootstrap();
