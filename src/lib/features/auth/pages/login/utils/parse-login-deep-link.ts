const LOGIN_DEEP_LINK_EMAIL_PARAM = 'email';
const LOGIN_DEEP_LINK_CODE_PARAM = 'code';
const OTP_CODE_PATTERN = /^\d{6}$/;

export type LoginDeepLink = {
	email: string | null;
	code: string | null;
};

export function parseLoginDeepLink(searchParams: URLSearchParams): LoginDeepLink {
	const email = searchParams.get(LOGIN_DEEP_LINK_EMAIL_PARAM)?.trim() ?? '';
	const code = searchParams.get(LOGIN_DEEP_LINK_CODE_PARAM)?.trim() ?? '';

	return {
		email: email.includes('@') ? email : null,
		code: OTP_CODE_PATTERN.test(code) ? code : null
	};
}

/** Identity of the raw `email`/`code` query, including invalid values, so the page can consume the link once. */
export function loginDeepLinkKey(searchParams: URLSearchParams): string | null {
	const hasEmail = searchParams.has(LOGIN_DEEP_LINK_EMAIL_PARAM);
	const hasCode = searchParams.has(LOGIN_DEEP_LINK_CODE_PARAM);

	if (!hasEmail && !hasCode) {
		return null;
	}

	return `${searchParams.get(LOGIN_DEEP_LINK_EMAIL_PARAM) ?? ''}\n${searchParams.get(LOGIN_DEEP_LINK_CODE_PARAM) ?? ''}`;
}
