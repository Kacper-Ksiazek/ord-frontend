import type { OtpRequestBody } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function httpRequestOtp(body: OtpRequestBody): Promise<void> {
	await api.post('/api/v1/auth/otp-request', body);
}
