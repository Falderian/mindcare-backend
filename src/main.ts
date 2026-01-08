import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new CustomValidationPipe());
  const PORT = process.env.PORT ?? 3030;
  await app.listen(PORT);
  Logger.debug(`[Server] is running on http://localhost:${PORT}`);
}
bootstrap();
