import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Button } from 'fontoxml-design-system/src/components';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import ProposalCardFooter from './ProposalCardFooter';

type Props = {
	onReplyAdd: ReviewCardContentComponentProps['onReplyAdd'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const ProposalReplyComponent: React.FC<Props> = ({ onReplyAdd, reviewAnnotation }) => {
	// Check if we are on the "/review" route.
	const { path } = useRouteMatch();
	const isOnReviewRoute = path === '/review';

	// If we are on the review route, we need to show the text input
	// to add the reply.
	if (isOnReviewRoute) {
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
}

export default ProposalReplyComponent;
