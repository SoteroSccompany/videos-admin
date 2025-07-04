import { INestApplication } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";
import { AppModule } from "src/app.module";
import { applyGlobalConfig } from "src/nest-modules/global.config";


export function startApp() {
    let _app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule], //Se coloca aqui a aplicacao inteira, entao aqui se tem tudo que se precisa para testar a aplicacao. 
            //O teste e mais custoso, por isso esta no topo da pirande e por isso e mais lento e mais caro
        }).compile();
        const sequelize = moduleFixture.get<Sequelize>(getConnectionToken())

        await sequelize.sync({ force: true }); //Forca a criacao do banco de dados, para que ele seja criado do zero.

        _app = moduleFixture.createNestApplication(); //Gera a aplicacao nest e ele controla com base.
        applyGlobalConfig(_app); //Aplica as configuracoes globais, como pipes, interceptors e filters
        await _app.init(); //Aqui inicia a implementacao. 
    });

    afterEach(async () => {
        await _app?.close(); //Fecha a aplicacao nest
    });

    return {
        get app() {
            return _app;
        }
    }
}