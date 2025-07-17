import { HOURS_PASSED_BEFORE_SENT_EMAIL } from "#/common/constants";
import { EnvSchema } from "#/common/env.schema";
import { hasPassedHours } from "#/common/utils";
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from "@nestjs/typeorm";
import * as nodemailer from 'nodemailer';
import { Repository } from "typeorm";
import { ConfirmEmailType, EmailTemplate, EmailType, WelcomeEmailType } from "../../common/types";
import { User } from "../users/entities/user.entity";
import { generateVerificationEmail } from "./templates/confirmEmail";
import { generateWelcomeEmail } from "./templates/welcomeEmail";
@Injectable()
export class EmailService {
	private readonly transporter: nodemailer.Transporter;

	constructor(
		private readonly configService: ConfigService<EnvSchema>,
		@InjectRepository(User)
		private readonly userService: Repository<User>
	) {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.configService.get("EMAIL_USERNAME"),
				pass: this.configService.get("EMAIL_PASSWORD"),
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
			from: this.configService.get("EMAIL_USERNAME"),
			to,
			subject,
			html
		};

		try {

			const savedUser = await this.userService.findOneBy({ email: to });

			const canSentEmail = hasPassedHours(new Date(), savedUser.lastEmailSent, HOURS_PASSED_BEFORE_SENT_EMAIL);

			if (!canSentEmail && (template !== "confirm-email" && template !== "welcome")) {

				throw new BadRequestException("Sorry you cant send and email now");
			}

			await this.transporter.sendMail(mailOptions);


			const updateUser = Object.assign(savedUser, {
				lastEmailSent: new Date()
			});

			this.userService.save(updateUser);

		} catch (error) {
			throw new Error(`Failed to send email: ${error}`);
		}
	}
}
