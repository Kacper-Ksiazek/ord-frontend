import type { paths } from '@kacper-ksiazek/ord-api-types';

type OtpRequestBodyFromContract =
	paths['/api/v1/auth/otp-request']['post']['requestBody']['content']['application/json'];

/** Paraglide tags accepted by POST /api/v1/auth/otp-request (ord-api UiLocale). */
export type OtpEmailLocale = 'en' | 'pl' | 'de';

type OtpRequestBodyWithLocale = OtpRequestBodyFromContract & {
	locale?: OtpEmailLocale;
};

// Keep the generated body once `@kacper-ksiazek/ord-api-types` includes `locale`.
export type OtpRequestBody = 'locale' extends keyof OtpRequestBodyFromContract
	? OtpRequestBodyFromContract
	: OtpRequestBodyWithLocale;

export type OtpVerifyBody =
	paths['/api/v1/auth/otp-verify']['post']['requestBody']['content']['application/json'];
