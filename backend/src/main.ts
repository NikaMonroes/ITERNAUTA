import 'dotenv/config'

import { NestFactory } from '@nestjs/core'

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)


  //prueba para Vercel
  app.getHttpAdapter().get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  })
})

  app.enableCors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
})

  const config = new DocumentBuilder()
    .setTitle('ITERNAUTA API')
    .setDescription(
      'API REST para la biblioteca virtual de manga y cómics de ITERNAUTA.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build()

  const document = SwaggerModule.createDocument(
    app,
    config,
  )

  SwaggerModule.setup(
    'api',
    app,
    document,
  )

  await app.listen(
    process.env.PORT ?? 3000,
  )
}

//await bootstrap()
bootstrap().catch((error) => {
  console.error('ITERNAUTA bootstrap failed:', error)
  process.exit(1)
})