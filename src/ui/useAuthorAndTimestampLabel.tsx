import * as React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager';
import { BusyState } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const configuredScope = configurationManager.get('scope');

/**
 * A custom React hook that formats the author and timestamp of the given reviewAnnotation or reply.
 *
 * Renders the author name as "You" if the author id matches the current scope user id.
 *
 * The timestamp label will not contain any kind of dashes.
 *
 * @param  {object}   reviewAnnotationOrReply
 * @param  {boolean}  [isReviewAnnotationResolved=false]  If set to true it uses the resolvedAuthor and
 * resolvedTimestamp fields of the given reviewAnnotation, otherwise it uses the (created) author
 * and timestamp fields.
 * @param  {string}   [fallback=t('Author not available')]  A string to display when the (resolved)
 * author field is not set on the given reviewAnnotationOrReply.
 *
 * @return {object} Object containing the 'author' and the 'timestamp' keys.
 * @react
 */
export default function useAuthorAndTimestampLabel(
	reviewAnnotationOrReply,
	isReviewAnnotationResolved,
	fallback = t('Author not available')
) {
	const formattedAuthor = React.useMemo(() => {
		let authorLabel = t('You');
		if (reviewAnnotationOrReply.busyState === BusyState.ADDING) {
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
			authorLabel = reviewAnnotationOrReply[authorField].displayName;
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
	}, [timestamp, timestampField]);

	return { author: formattedAuthor, timestamp: formattedTimestamp };
}
