import * as React from 'react';

import { BusyState } from 'fontoxml-feedback/src/types';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';

const CardErrors = ({
	onReviewAnnotationRefresh,
	onReviewAnnotationRemove,
	onReviewAnnotationShare,
	reviewAnnotation,
}) => {
	return (
		<>
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === BusyState.SHARING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === BusyState.REMOVING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
		</>
	);
};

export default CardErrors;
