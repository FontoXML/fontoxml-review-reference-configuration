import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { BusyState } from 'fontoxml-feedback/src/types';

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
