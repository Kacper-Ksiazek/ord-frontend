import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { OtpVerifyBody, UserDTO } from '$lib/types/auth';
import { verifyOtp } from '../api/verify-otp';
import { authKeys } from '../keys';

export function createVerifyOtpMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => verifyOtp(body),
		onSuccess: (user: UserDTO) => {
			queryClient.setQueryData(authKeys.currentUser(), user);
		}
	}));
}
