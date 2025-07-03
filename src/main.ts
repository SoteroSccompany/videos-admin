import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundErrorFilter } from './nest-modules/shared-module/not-found/not-found-error.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/not-found/entity-validation-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ //Isso garante que o controller e ja realiza as validacoes 
      errorHttpStatusCode: 422, //Essa classe ja entende pelas ferramentas do nest que deve aplicar as validacoes quando tiver isso envolvido em uma classe
      whitelist: true,              // Remove campos não declarados no DTO
      forbidNonWhitelisted: true,   // Lança erro se vier algo além do esperado
      // transform: true,
    }),
  );
  app.useGlobalInterceptors( //Se comporta como um medeawlere, fica entre o controller e a resposata, 
    //Se pode mudar o que esta acontecendo. Pode se colocar @Interceptor dentro do controller para mais localidade, aqui esta assim por ser um 
    //comportamento padrao que se deseja do sistema
    new ClassSerializerInterceptor(app.get(Reflector)) //Aqui ele pega os decorators de tudo que esta sendo colocado dentro da entidade para fazer a conversao direta, coloca sempre na validacao que esta o decorator.
  )
  app.useGlobalInterceptors(new WrapperDataInterceptor())
  app.useGlobalFilters(new NotFoundErrorFilter(), new EntityValidationErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
