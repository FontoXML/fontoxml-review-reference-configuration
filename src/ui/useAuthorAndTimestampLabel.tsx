import * as React from 'react';

import profileStore from 'fontoxml-authors/src/api/profileStore';
import configurationManager from 'fontoxml-configuration/src/configurationManager';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import type {
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const configuredScope = configurationManager.get('scope');

/**
 * A custom React hook that formats the author and timestamp of the given
 * reviewAnnotation or reply.
 *
 * Renders the author name as "You" if the author id matches the current scope
 * user id.
 *
 * The timestamp label will not contain any kind of dashes.
 *
 * @param reviewAnnotationOrReply    -
 * @param isReviewAnnotationResolved - If set to true it uses the resolvedAuthor
 * and resolvedTimestamp fields of the given reviewAnnotation, otherwise it uses
 * the (created) author and timestamp fields.
 * @param fallback                   - A string to display when the (resolved)
 * author field is not set on the given reviewAnnotationOrReply.
 *
 * @returns Object containing the 'author' and the 'timestamp' keys.
 * @react
 */
export default function useAuthorAndTimestampLabel(
	reviewAnnotationOrReply:
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply,
	isReviewAnnotationResolved: boolean,
	fallback = t('Author not available')
): {
	author: string;
	timestamp: string;
} {
	const formattedAuthor = React.useMemo(() => {
		let authorLabel = t('You');
		if (reviewAnnotationOrReply.busyState === ReviewBusyState.ADDING) {
			return authorLabel;
		}

		const authorField = isReviewAnnotationResolved
			? 'resolvedAuthor'
			: 'author';

		if (!reviewAnnotationOrReply[authorField]) {
			// Use fallback value if author is not present.
			return fallback;
		}

		if (
			configuredScope.user &&
			reviewAnnotationOrReply[authorField].id !== configuredScope.user.id
		) {
			const annotationAuthorId = reviewAnnotationOrReply[authorField].id;
			const profile = profileStore.getProfileById(annotationAuthorId);
			
			if (profile) {
				authorLabel = profile.getDisplayName();
			} else {
				authorLabel = reviewAnnotationOrReply[authorField].displayName;
			}
		}

		return t('{AUTHOR_LABEL}', { AUTHOR_LABEL: authorLabel });
	}, [fallback, isReviewAnnotationResolved, reviewAnnotationOrReply]);

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

	return { author: formattedAuthor, timestamp: formattedTimestamp };
}
