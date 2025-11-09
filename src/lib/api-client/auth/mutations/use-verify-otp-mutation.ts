import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { OtpVerifyBody, UserDTO } from '$lib/features/auth/types';
import { STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';
import { verifyOtp } from '../api/verify-otp';
import { authKeys } from '../keys';

export function createVerifyOtpMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (body: OtpVerifyBody) => verifyOtp(body),
		onSuccess: (user: UserDTO) => {
			// Update TanStack Query cache
			queryClient.setQueryData(authKeys.currentUser(), user);

			// Save to localStorage for instant access on page load
			setStorageItem(STORAGE_KEYS.USER, user);
		}
	}));
}
