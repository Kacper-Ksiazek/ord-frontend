import type { AggregatedFeedbackItem } from '$conversations/pages/session/components/feedback-panel/components/user-message-reviews-list-with-filters/utils/aggregate-feedback';
import type { UserMessageReviewFilters } from '../../../lib/filters';

export interface SubcategoryFiltersProps {
	filters: UserMessageReviewFilters;
	feedbacks: AggregatedFeedbackItem[];
}
