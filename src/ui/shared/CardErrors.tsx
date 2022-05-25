import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { BusyState, CardContentComponentProps } from 'fontoxml-feedback/src/types';

type Props = {
	onReviewAnnotationRefresh: CardContentComponentProps['onReviewAnnotationRefresh'];
	onReviewAnnotationRemove: CardContentComponentProps['onReviewAnnotationRemove'];
	onReviewAnnotationShare: CardContentComponentProps['onReviewAnnotationShare'];
	reviewAnnotation: CardContentComponentProps['reviewAnnotation'];
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
				reviewAnnotation.busyState === BusyState.SHARING && (
					<ErrorToast
						error={typeof reviewAnnotation.error !== 'number' ? reviewAnnotation.error : null}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === BusyState.REMOVING && (
					<ErrorToast
						error={typeof reviewAnnotation.error !== 'number' ? reviewAnnotation.error : null}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
		</>
	);
};

export default CardErrors;
