import { createMutation } from '@tanstack/svelte-query';
import type { OtpRequestBody } from '$auth/types';
import { httpPostRequestOtp } from '../api/http-post-request-otp';

export function createRequestOtpMutation() {
	return createMutation(() => ({
		mutationFn: (body: OtpRequestBody) => httpPostRequestOtp(body)
	}));
}
