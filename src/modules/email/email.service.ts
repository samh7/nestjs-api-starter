import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import environment from "../../common/environment";
import { ConfirmEmailType, EmailTemplate, EmailType, WelcomeEmailType } from "../../common/types";
import { generateVerificationEmail } from "./templates/confirmEmail";
import { generateWelcomeEmail } from "./templates/welcomeEmail";
@Injectable()
export class EmailService {
	private readonly transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: environment.EMAIL_USERNAME,
				pass: environment.EMAIL_PASSWORD,
			},
		});


	}


	async sendEmail(to: string, subject: string, template: EmailTemplate, context: EmailType) {

		let html = '';
		switch (template) {
			case 'confirm-email':
				html = generateVerificationEmail(context as ConfirmEmailType);
				break;
			case 'welcome':
				html = generateWelcomeEmail(context as WelcomeEmailType);
				break;
			default:
				throw new Error(`Unknown template: ${template}`);
		}
		const mailOptions = {
			from: environment.EMAIL_USERNAME,
			to,
			subject,
			html: html
		};

		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			throw new Error(`Failed to send email: ${error}`);
		}
	}
}
