import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as formData from 'form-data';
import Mailgun from 'mailgun.js';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly domain;
  private readonly from;
  private readonly mg;

  constructor(private readonly configService: ConfigService) {
    const mailgunClient = new Mailgun(formData);

    this.mg = mailgunClient.client({
      username: 'api',
      key: this.configService.get<string>('MAILGUN_API_KEY') as string,
      url:
        this.configService.get<string>('MAILGUN_API_URL') ||
        'https://api.mailgun.net',
    });

    this.domain = this.configService.get<string>('MAILGUN_DOMAIN');
    this.from = this.configService.get<string>('MAILGUN_FROM');
  }

  /**
   * Sends an email using the Mailgun API.
   *
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The email subject.
   * @param {string} templateName - The template name to use for the email body.
   * @param {Record<string, any>} variables - The variables to pass to the template.
   * @returns {Promise<void>}
   */
  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any>,
  ): Promise<void> {
    const html = this.renderTemplate(templateName, variables);

    const messageData = {
      from: this.from,
      to,
      subject,
      html,
    };

    try {
      await this.mg.messages.create(this.domain, messageData);
    } catch (error) {
      console.log('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  private renderTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): string {
    try {
      const templatePath = path.join(
        __dirname,
        '..',
        'email',
        'templates',
        `${templateName}.hbs`,
      );
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = Handlebars.compile(templateContent);
      return compiledTemplate(variables);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to render email template: ${error.message}`,
      );
    }
  }
}
