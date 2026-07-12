import { createMutation } from '@tanstack/svelte-query';
import type { OtpVerifyBody } from '$auth/types';
import { verifyOtp } from '../api/verify-otp';

export function createVerifyOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => verifyOtp(body)
	}));
}
