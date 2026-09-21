import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:5173',
  })

  const config = new DocumentBuilder()
    .setTitle('ITERNAUTA API')
    .setDescription(
      'API REST para la biblioteca virtual de mangas, cómics y novelas gráficas de ITERNAUTA.',
    )
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(
    app,
    config,
  )

  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000)
}

await bootstrap()