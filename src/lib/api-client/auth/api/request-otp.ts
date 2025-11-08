import type { OtpRequestBody } from '$lib/types/auth';
import { api } from '../../axios';

export async function requestOtp(body: OtpRequestBody): Promise<void> {
	await api.post('/api/v1/auth/otp-request', body);
}
