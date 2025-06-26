import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ //Isso garante que o controller e ja realiza as validacoes 
      errorHttpStatusCode: 422, //Essa classe ja entende pelas ferramentas do nest que deve aplicar as validacoes quando tiver isso envolvido em uma classe
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
