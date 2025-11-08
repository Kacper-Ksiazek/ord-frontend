export type {
	BadRequestResponse,
	FieldError,
	OtpRequestBody,
	OtpVerifyBody,
	UserDTO
} from '$lib/types/auth';
export { getCurrentUser, logout, requestOtp, verifyOtp } from './api';
export { authKeys } from './keys';
export * from './mutations';
export * from './queries';
