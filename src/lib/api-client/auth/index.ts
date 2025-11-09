export type {
	BadRequestResponse,
	FieldError,
	OtpRequestBody,
	OtpVerifyBody,
	UserDTO
} from '$lib/features/auth/types';
export { getCurrentUser, logout, requestOtp, verifyOtp } from './api';
export { authKeys } from './keys';
export * from './mutations';
export * from './queries';
