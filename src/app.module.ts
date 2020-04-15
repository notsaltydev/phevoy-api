import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { ConnectionOptions } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({})
export class AppModule {
    static forRoot(connOptions: ConnectionOptions): DynamicModule {
        console.log('connOptions', connOptions);
        return {
            module: AppModule,
            controllers: [AppController],
            imports: [
                AuthModule,
                UsersModule,
                CoreModule,
                TypeOrmModule.forRoot(connOptions),
            ],
            providers: [AppService],
        };
    }
}
