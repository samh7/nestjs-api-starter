export interface EnvSchema {
	PORT: number;
	DB_PORT: number;
	DATABASE: string;
	DB_HOST: string;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	NODE_ENV: string;
	JWT_ACCESS_TOKEN_SECRET: string;
	LOG_LEVEL: string;
	JWT_EXPIRES_IN: string;
	FRONTEND_URL: string;
	BACKEND_URL: string;
	VERIFY_EMAIL_URL: string;
	APP_NAME: string;
	EMAIL_USERNAME: string;
	EMAIL_PASSWORD: string;

}
