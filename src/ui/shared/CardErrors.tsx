import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';

type Props = {
	onReviewAnnotationErrorAcknowledge: ReviewCardContentComponentProps['onReviewAnnotationErrorAcknowledge'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onReviewAnnotationRemove: ReviewCardContentComponentProps['onReviewAnnotationRemove'];
	onReviewAnnotationShare: ReviewCardContentComponentProps['onReviewAnnotationShare'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const CardErrors: React.FC<Props> = ({
	onReviewAnnotationErrorAcknowledge,
	onReviewAnnotationRefresh,
	onReviewAnnotationRemove,
	onReviewAnnotationShare,
	reviewAnnotation,
}) => {
	// ErrorToast renders a TextLink if onHideLinkClick is provided, so we only
	// do so when needed: when the error recovery option is ACKNOWLEDGEABLE.
	const onHideLinkClick =
		reviewAnnotation.error &&
		typeof reviewAnnotation.error !== 'number' &&
		reviewAnnotation.error.recovery === ReviewRecoveryOption.ACKNOWLEDGEABLE
			? onReviewAnnotationErrorAcknowledge
			: undefined;

	return (
		<>
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === ReviewBusyState.SHARING && (
					<ErrorToast
						error={
							typeof reviewAnnotation.error !== 'number'
								? reviewAnnotation.error
								: null
						}
						onHideLinkClick={onHideLinkClick}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === ReviewBusyState.REMOVING && (
					<ErrorToast
						error={
							typeof reviewAnnotation.error !== 'number'
								? reviewAnnotation.error
								: null
						}
						onHideLinkClick={onHideLinkClick}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
		</>
	);
};

export default CardErrors;
