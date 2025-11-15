import type { paths } from '@ord-api/ord-api-types';

export type OtpRequestBody =
	paths['/api/v1/auth/otp-request']['post']['requestBody']['content']['application/json'];

export type OtpVerifyBody =
	paths['/api/v1/auth/otp-verify']['post']['requestBody']['content']['application/json'];
