export type QawListApprovalFilter = 'all' | 'approved' | 'pending';

export type GetQuicklyAddedWordsParams = {
	page?: number;
	perPage?: number;
	/** When set, list endpoint returns only approved or pending (unapproved) words. */
	isApproved?: boolean;
};
