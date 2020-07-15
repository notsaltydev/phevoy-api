import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";

@Injectable()
export class EmailService {

    constructor(private readonly mailerService: MailerService) {
    }

    async sendEmail(config: { to: string, from: string, subject: string, context: { [name: string]: any; }, templatePath: string }): Promise<SentMessageInfo> {
        const sent: SentMessageInfo = await this.mailerService.sendMail({
            to: config.to,
            from: config.from,
            subject: config.subject,
            template: config.templatePath,
            context: config.context,
        });

        return sent;
    }
}
