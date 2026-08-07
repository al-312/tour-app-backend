import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { AppConfigService } from '@/core/config/app-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Set pino logger as NestJS global logger
  app.useLogger(app.get(Logger));

  // Apply security headers
  app.use(helmet());

  const config = app.get(AppConfigService);
  const port = config.port;

  // Enable Cross-Origin Resource Sharing
  app.enableCors({
    origin: config.corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Build Swagger OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tour App API')
    .setDescription('The API documentation for Tour App backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const loggerInstance = app.get(Logger);
  loggerInstance.log(
    `Starting NestJS application in ${config.nodeEnv} mode...`,
    'Bootstrap',
  );
  await app.listen(port);
  loggerInstance.log(
    `Application successfully listening on port ${port.toString()}`,
    'Bootstrap',
  );
  loggerInstance.log(
    `Swagger documentation available at http://localhost:${port.toString()}/api/docs`,
    'Bootstrap',
  );
}
void bootstrap();
