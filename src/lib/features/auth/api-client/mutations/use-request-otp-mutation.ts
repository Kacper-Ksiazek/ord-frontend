import { createMutation } from '@tanstack/svelte-query';
import type { OtpRequestBody } from '$auth/types';
import { httpRequestOtp } from '../api/http-request-otp';

export function createRequestOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpRequestBody) => httpRequestOtp(body)
	}));
}
