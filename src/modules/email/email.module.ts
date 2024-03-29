import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { SMTPTransportConfig } from "./interfaces/smtp-transport.interface";

export const smtpTransportConfig: SMTPTransportConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'phevoyapp@gmail.com',
    pass: 'Bpb93mmU'
}

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: smtpTransportConfig.host,
                port: smtpTransportConfig.port,
                secure: smtpTransportConfig.secure,
                auth: {
                    user: smtpTransportConfig.user,
                    pass: smtpTransportConfig.pass
                }
            },
            defaults: {
                from: '"nest-modules" <user@outlook.com>'
            },
            template: {
                dir: process.cwd() + '/templates/',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        }),
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {
}
