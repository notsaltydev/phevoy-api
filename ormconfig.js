require('dotenv/config'); // load everything from `.env` file into the `process.env` variable

const {DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_HOST} = process.env;

module.exports = [
    {
        name: "prod-development",
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: true,
        logging: true,
        entities: [
            "dist/**/*.entity.js"
        ],
        migrations: [
            "dist/migrations/**/*.js"
        ],
        subscribers: [
            "dist/subscriber/**/*.js"
        ],
        cli: {
            entitiesDir: "dist/**/*.entity.js",
            migrationsDir: "dist/migrations",
            subscribersDir: "dist/subscriber"
        }
    },
    {
        name: "defaultDev",
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: false,
        logging: true,
        entities: [
            "src/**/*.entity.ts"
        ],
        migrations: [
            "src/migrations/**/*.ts"
        ],
        subscribers: [
            "src/subscriber/**/*.ts"
        ],
        cli: {
            "entitiesDir": "src/**/*.entity.ts",
            "migrationsDir": "src/migrations",
            "subscribersDir": "src/subscriber"
        }
    },
    {
        name: "development",
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: false,
        logging: true,
        entities: [
            "src/**/*.entity.ts"
        ],
        migrations: [
            "src/migrations/**/*.ts"
        ],
        subscribers: [
            "src/subscriber/**/*.ts"
        ],
        cli: {
            "entitiesDir": "src/**/*.entity.ts",
            "migrationsDir": "src/migrations",
            "subscribersDir": "src/subscriber"
        }
    },
    {
        name: "default",
        type: "postgres",
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        synchronize: false,
        logging: true,
        entities: [
            "src/**/*.entity.ts"
        ],
        migrations: [
            "src/migrations/**/*.ts"
        ],
        subscribers: [
            "src/subscriber/**/*.ts"
        ],
        cli: {
            "entitiesDir": "src/**/*.entity.ts",
            "migrationsDir": "src/migrations",
            "subscribersDir": "src/subscriber"
        }
    }
];
