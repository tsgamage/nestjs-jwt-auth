import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * - This is the global validation pipe
   * - using whitelist to remove any properties that are not in the dto
   * - using transform to convert the request body to the dto
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  /** using configService to get the port from the environment variables */
  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port')!;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
await bootstrap();
