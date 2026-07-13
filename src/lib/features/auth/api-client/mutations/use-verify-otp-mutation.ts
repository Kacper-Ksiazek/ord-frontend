import { createMutation } from '@tanstack/svelte-query';
import type { OtpVerifyBody } from '$auth/types';
import { httpPostVerifyOtp } from '../api/http-post-verify-otp';

export function createVerifyOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => httpPostVerifyOtp(body)
	}));
}
