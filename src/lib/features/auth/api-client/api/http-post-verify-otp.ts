import type { OtpVerifyBody, UserDTO } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function httpPostVerifyOtp(body: OtpVerifyBody): Promise<UserDTO> {
	const response = await api.post<UserDTO>('/api/v1/auth/otp-verify', body);

	return response.data;
}
