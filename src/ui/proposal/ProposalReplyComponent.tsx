import * as React from 'react';

import { Button } from 'fontoxml-design-system/src/components';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import ProposalCardFooter from './ProposalCardFooter';

type Props = {
	context: ReviewCardContentComponentProps['context'];
	onReplyAdd: ReviewCardContentComponentProps['onReplyAdd'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const ProposalReplyComponent: React.FC<Props> = ({
	context,
	onReplyAdd,
	reviewAnnotation,
}) => {
	// Check if we are on the "/review" or "/*/history" route.
	const isOnReviewOrHistoryRoute =
		context === FeedbackContextType.REVIEW ||
		context === FeedbackContextType.REVIEW_DOCUMENT_HISTORY ||
		context === FeedbackContextType.EDITOR_DOCUMENT_HISTORY;

	// If we are on the review or history route, we need to show the
	// text input to add the reply.
	if (isOnReviewOrHistoryRoute) {
		return (
			<ProposalCardFooter
				onReplyAdd={onReplyAdd}
				reviewAnnotation={reviewAnnotation}
			/>
		);
	}

	// Otherwise, a button for adding the reply will be shown.
	return (
		<Button
			icon="far fa-reply"
			isDisabled={!!reviewAnnotation.error || reviewAnnotation.isLoading}
			label={t('Reply')}
			onClick={onReplyAdd}
			tooltipContent={t('Reply to the proposed change.')}
		/>
	);
};

export default ProposalReplyComponent;
