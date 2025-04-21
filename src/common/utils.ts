import { randomBytes } from "crypto";

export function generateEmailVerificationCode(length = 32): string {
	return randomBytes(length)
		.toString('base64url')
		.slice(0, length);
}
