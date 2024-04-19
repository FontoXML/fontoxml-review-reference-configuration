import * as React from 'react';

import type {
	ReviewAnnotation,
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import { currentScopeUser } from './constants';

/**
 * A custom React hook that returns the author id and formatted
 * timestamp for a review annotation or reply.
 *
 * @param reviewAnnotationOrReply    - Can be either a ReviewAnnotation or a
 * ReviewReply object. These objects contain information about the review
 * annotation or reply, including the author and timestamp.
 * @param isReviewAnnotationResolved - If set to true it uses the resolvedAuthor
 * and resolvedTimestamp fields of the given reviewAnnotation, otherwise it uses
 * the (created) author and timestamp fields.
 *
 * The hook first determines the authorId by checking the reviewAnnotationOrReply
 * object. If the author or resolvedAuthor field has an id property, it uses
 * that as the authorId. Otherwise, it falls back to the id property of the
 * configured user scope. If neither of these ids is available, it sets the
 * authorId to null, indicating an 'Anonymous' user.
 *
 * @returns Object containing the 'authorId' and the 'timestamp' keys.
 * @react
 */
export default function useAuthorAndTimestampLabel(
	reviewAnnotationOrReply:
		| ReviewAnnotation
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply,
	isReviewAnnotationResolved: boolean
): {
	authorId: string;
	timestamp: string;
} {
	const authorId = React.useMemo(() => {
		const authorField = isReviewAnnotationResolved
			? 'resolvedAuthor'
			: 'author';

		// If the annotation exists we'll use the id from the author or
		// resolvedAuthor.
		if (reviewAnnotationOrReply[authorField]?.id) {
			return reviewAnnotationOrReply[authorField].id;
		}

		// Otherwise we will obtain the id from the configured user scope.
		if (currentScopeUser.id) {
			return currentScopeUser.id;
		}

		// If neither of the prior ids exists, we'll return 'null' as default.
		// This user is considered to be an 'Anonymous' user.
		return null;
	}, [isReviewAnnotationResolved, reviewAnnotationOrReply]);

	const timestampField = isReviewAnnotationResolved
		? 'resolvedTimestamp'
		: 'timestamp';
	const timestamp = reviewAnnotationOrReply[timestampField];
	const formattedTimestamp = React.useMemo(() => {
		if (!timestamp) {
			return null;
		}

		return t('{TIMESTAMP, fonto_date}, {TIMESTAMP, time, short}', {
			TIMESTAMP: timestamp,
		});
	}, [timestamp]);

	return { authorId, timestamp: formattedTimestamp };
}
