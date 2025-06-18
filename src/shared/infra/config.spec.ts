import { Config } from "./config"


describe("Config test", () => {

    test('static functionDb', () => {
        const db = Config.db();
        expect(db.host).toBe(Config.env.DB_HOST)
    })


    test('should return when env alredy loaded', () => {
        const db = Config.db();
        Config.readEnv();
        expect(db.host).toBe(Config.env.DB_HOST)
    })

})