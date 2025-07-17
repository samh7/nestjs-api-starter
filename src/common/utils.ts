import { randomBytes } from "crypto";
import { ApiResponse } from './api-response';

export function generateEmailVerificationCode(length = 32): string {
	return randomBytes(length)
		.toString('base64url')
		.slice(0, length);
}


// export async function tryExecuteAsync<T>(fn: () => Promise<T>): Promise<ApiResponse<T | undefined>> {
// 	try {
// 		const data = await fn();
// 		return {
// 			success: true,
// 			data
// 		};
// 	} catch (error) {
// 		return {
// 			success: false,
// 			error
// 		};
// 	}
// }


export async function tryExecuteAsync<T, Dto extends any[]>(fn: (...arg: Dto) => Promise<T>, ...arg: Dto): Promise<ApiResponse<T | undefined>> {
	try {
		const data = await fn(...arg);
		return {
			success: true,
			data
		};
	} catch (error) {
		return {
			success: false,
			error
		};
	}
}


export function hasPassedHours(now, referenceDate, hours) {
	// Ensure both inputs are valid Date objects
	if (!(now instanceof Date) || isNaN(now.getTime())) {
		console.error("The 'now' argument must be a valid Date object.");
		return false;
	}
	if (!(referenceDate instanceof Date) || isNaN(referenceDate.getTime())) {
		console.error("The 'referenceDate' argument must be a valid Date object.");
		return false;
	}
	if (typeof hours !== 'number' || hours < 0) {
		console.error("The 'hours' argument must be a non-negative number.");
		return false;
	}

	// Calculate the difference in milliseconds
	const differenceInMilliseconds = now.getTime() - referenceDate.getTime();

	// Convert the specified hours to milliseconds
	const hoursInMilliseconds = hours * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds

	// Compare the difference
	return differenceInMilliseconds > hoursInMilliseconds;
}
