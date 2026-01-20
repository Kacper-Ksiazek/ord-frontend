import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { OtpVerifyBody, UserDTO } from '$auth/types';
import { STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';
import { verifyOtp } from '../api/verify-otp';
import { authKeys } from '../keys';

export function createVerifyOtpMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => verifyOtp(body),
		onSuccess: (user: UserDTO) => {
			queryClient.setQueryData(authKeys.currentUser(), user);

			setStorageItem(STORAGE_KEYS.USER, user);
		}
	}));
}
