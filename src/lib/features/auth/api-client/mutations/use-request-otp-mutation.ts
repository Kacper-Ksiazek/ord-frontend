import { createMutation } from '@tanstack/svelte-query';
import type { OtpRequestBody } from '$auth/types';
import { requestOtp } from '../api/request-otp';

export function createRequestOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpRequestBody) => requestOtp(body)
	}));
}
