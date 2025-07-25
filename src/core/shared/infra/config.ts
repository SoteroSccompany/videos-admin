import { config as readEnv } from 'dotenv';
import { join } from 'path';

export class Config {

    static env: any = null;

    static db() {
        Config.readEnv();

        return {
            dialect: 'sqlite' as any,
            host: Config.env.DB_HOST || 'localhost',
            logging: Config.env.DB_LOGGING === 'true'
        }
    }

    static readEnv() {
        if (Config.env) {
            return;
        }

        //Cria dentro da classe config todas as configuracaoes da classe Config.
        //Assim fica todas as coisas que estao dentro do arquivo aqui dentro da classe
        Config.env = readEnv({
            path: join(__dirname, `../../../../envs/.env.${process.env.NODE_ENV}`),
        }).parsed;
    }

}