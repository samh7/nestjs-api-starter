export type ConfirmEmailType = {
	name: string;
	verificationLink: string;
	year: Date;
	appName: string;
};


export type WelcomeEmailType = {
	name: string,
	appName: string,
	dashboardLink: string,
	year: Date;
};


export type EmailType = ConfirmEmailType | WelcomeEmailType;
export type EmailTemplate = "confirm-email" | "welcome";
