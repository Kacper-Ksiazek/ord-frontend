import { createMutation } from '@tanstack/svelte-query';
import type { OtpVerifyBody } from '$auth/types';
import { httpVerifyOtp } from '../api/http-verify-otp';

export function createVerifyOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => httpVerifyOtp(body)
	}));
}
