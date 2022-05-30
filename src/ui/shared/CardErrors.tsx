import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import { ReviewBusyState } from 'fontoxml-feedback/src/types';

type Props = {
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onReviewAnnotationRemove: ReviewCardContentComponentProps['onReviewAnnotationRemove'];
	onReviewAnnotationShare: ReviewCardContentComponentProps['onReviewAnnotationShare'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const CardErrors: React.FC<Props> = ({
	onReviewAnnotationRefresh,
	onReviewAnnotationRemove,
	onReviewAnnotationShare,
	reviewAnnotation,
}) => {
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
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
		</>
	);
};

export default CardErrors;
