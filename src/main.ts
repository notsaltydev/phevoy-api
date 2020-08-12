import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getDbConnectionOptions } from "./shared/utils";
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { Logger, ValidationPipe } from "@nestjs/common";

const port = process.env.PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(
        AppModule.forRoot(await getDbConnectionOptions(process.env.NODE_ENV)),
        {
            // logger: Boolean(process.env.ENABLELOGGING),
            logger: console
        },
    );

    /**
     * Helmet can help protect your app from some well-known
     * web vulnerabilities by setting HTTP headers appropriately.
     * Generally, Helmet is just a collection of 12 smaller
     * middleware functions that set security-related HTTP headers
     *
     * https://github.com/helmetjs/helmet#how-it-works
     */
    app.use(helmet());

    app.enableCors();

    // /**
    //  * we need this because "cookie" is true in csrfProtection
    //  */
    // app.use(cookieParser());

    // app.use(csurf({ cookie: true }));

    /**
     * To protect your applications from brute-force attacks
     */
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }),
    );

    /**
     * Apply validation for all inputs globally
     */
    app.useGlobalPipes(
        new ValidationPipe({
            /**
             * Strip away all none-object existing properties
             */
            whitelist: true,
            /***
             * Transform input objects to their corresponding DTO objects
             */
            transform: true,
        }),
    );

    await app.listen(port);

    Logger.log(`Server started running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
