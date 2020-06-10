import { useMemo } from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager.js';
import { BusyState } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

const configuredScope = configurationManager.get('scope');

/**
 * A custom React hook that formats the author and timestamp of the given reviewAnnotation or reply.
 *
 * Renders the author name as "You" if the author id matches the current scope user id.
 *
 * The timestamp label will not contain any kind of dashes.
 *
 * @param  {object}   reviewAnnotationOrReply
 * @param  {boolean}  [forResolvedReviewAnnotation=false]  If set to true it uses the resolvedAuthor and
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
	forResolvedReviewAnnotation,
	fallback = t('Author not available')
) {
	return useMemo(() => {
		let authorLabel = t('You');

		if (reviewAnnotationOrReply.busyState === BusyState.ADDING) {
			return { author: authorLabel };
		}

		const authorField = forResolvedReviewAnnotation ? 'resolvedAuthor' : 'author';
		const timestampField = forResolvedReviewAnnotation ? 'resolvedTimestamp' : 'timestamp';

		// Use fallback value if author is not present. Return author.
		if (!reviewAnnotationOrReply[authorField]) {
			return { author: fallback };
		}

		if (
			configuredScope.user &&
			reviewAnnotationOrReply[authorField].id !== configuredScope.user.id
		) {
			authorLabel = reviewAnnotationOrReply[authorField].displayName;
		}

		// Author label localization
		authorLabel = t('{AUTHOR_LABEL}', { AUTHOR_LABEL: authorLabel });

		// If no timestamp, return localized authorname.
		let timestamp = reviewAnnotationOrReply[timestampField];
		if (!timestamp) {
			return { author: authorLabel };
		}

		// Timestamp localization
		timestamp = t('{TIMESTAMP, fonto_date}, {TIMESTAMP, time, short}', {
			TIMESTAMP: timestamp
		});

		// Return author and timestamp.
		return {
			author: authorLabel,
			timestamp: timestamp
		};
	}, [fallback, forResolvedReviewAnnotation, reviewAnnotationOrReply]);
}
