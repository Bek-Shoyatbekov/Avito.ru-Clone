module.exports = {
    HOST: 'localhost',
    USER: 'postgres',
    PASSWORD: 'bekzodbek01',
    DB: "Avito_ru",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};