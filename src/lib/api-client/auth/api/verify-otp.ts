import type { OtpVerifyBody, UserDTO } from '$lib/features/auth/types';
import { api } from '../../axios';

export async function verifyOtp(body: OtpVerifyBody): Promise<UserDTO> {
	const response = await api.post<UserDTO>('/api/v1/auth/otp-verify', body);

	return response.data;
}
