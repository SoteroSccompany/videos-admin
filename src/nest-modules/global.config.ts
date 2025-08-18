import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from "@nestjs/common";
import { WrapperDataInterceptor } from "./shared-module/interceptors/wrapper-data/wrapper-data.interceptor";
import { EntityValidationErrorFilter } from "./shared-module/filters/entity-validation-error.filter";
import { NotFoundErrorFilter } from "./shared-module/filters/not-found-error.filter";
import { Reflector } from "@nestjs/core";


export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({ //Isso garante que o controller e ja realiza as validacoes 
            errorHttpStatusCode: 422, //Essa classe ja entende pelas ferramentas do nest que deve aplicar as validacoes quando tiver isso envolvido em uma classe
            // whitelist: true,              // Remove campos não declarados no DTO
            // forbidNonWhitelisted: true,   // Lança erro se vier algo além do esperado -> tomar cuidado com iss, quebra os testes. Pq caso envie por exemplo uma campo null que nao precisa enviar, ele quebra o teste
            transform: true,
        }),
    );
    app.useGlobalInterceptors(new WrapperDataInterceptor(), new ClassSerializerInterceptor(app.get(Reflector)))
    app.useGlobalFilters(new NotFoundErrorFilter(), new EntityValidationErrorFilter());
}


