import { useMemo } from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager.js';
import { BusyState } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

const configuredScope = configurationManager.get('scope');

/**
 * A custom React hook that formats the author and timestamp of the given reviewAnnotation or reply
 * as a single human-friendly label ready for display.
 * Renders the author name as "You" if the author id matches the current scope user id.
 *
 * Note: the authorLabel and timestampLabel are joined together by this string: " – ".
 * This uses a special "en-dash" symbol: –, which is slightly different than a regular dash: -.
 * This allows you to easily split these labels if necessary. Without risking accidental splits on
 * parts of the author name.
 * The timestamp label will not contain any kind of dashes.
 *
 * @param  {object}   reviewAnnotationOrReply
 * @param  {boolean}  [forResolvedReviewAnnotation=false]  If set to true it uses the resolvedAuthor and
 * resolvedTimestamp fields of the given reviewAnnotation, otherwise it uses the (created) author
 * and timestamp fields.
 * @param  {string}   [fallback=t('Author not available')]  A string to display when the (resolved)
 * author field is not set on the given reviewAnnotationOrReply.
 *
 * @return {object}
 *
 * @category add-on/fontoxml-feedback
 * @fontosdk
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
			return authorLabel;
		}

		const authorField = forResolvedReviewAnnotation ? 'resolvedAuthor' : 'author';
		const timestampField = forResolvedReviewAnnotation ? 'resolvedTimestamp' : 'timestamp';

		if (!reviewAnnotationOrReply[authorField]) {
			return fallback;
		}

		if (
			configuredScope.user &&
			reviewAnnotationOrReply[authorField].id !== configuredScope.user.id
		) {
			authorLabel = reviewAnnotationOrReply[authorField].displayName;
		}

		let timestamp = reviewAnnotationOrReply[timestampField];
		if (!timestamp) {
			return authorLabel;
		}

		authorLabel = t('{AUTHOR_LABEL}', { AUTHOR_LABEL: authorLabel });
		timestamp = t('{TIMESTAMP, fonto_date}, {TIMESTAMP, time, short}', {
			TIMESTAMP: timestamp
		});

		return {
			author: authorLabel,
			timestamp: timestamp
		};
	}, [fallback, forResolvedReviewAnnotation, reviewAnnotationOrReply]);
}
