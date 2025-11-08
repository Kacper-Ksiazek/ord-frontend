import { createMutation } from '@tanstack/svelte-query';
import type { OtpRequestBody } from '$lib/types/auth';
import { requestOtp } from '../api/request-otp';

export function createRequestOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpRequestBody) => requestOtp(body)
	}));
}
