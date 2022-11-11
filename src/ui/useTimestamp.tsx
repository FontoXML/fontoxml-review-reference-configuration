import * as React from 'react';

import type {
	ReviewAnnotation,
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

/**
 * A custom React hook that formats the timestamp of the given
 * reviewAnnotation or reply.
 *
 * The timestamp label will not contain any kind of dashes.
 *
 * @param reviewAnnotationOrReply    -
 * @param isReviewAnnotationResolved - If set to true it uses the resolvedAuthor
 * and resolvedTimestamp fields of the given reviewAnnotation, otherwise it uses
 * the (created) author and timestamp fields.
 *
 * @returns String containing the formatted timestamp.
 * @react
 */
export default function useTimestamp(
	reviewAnnotationOrReply:
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply
		| ReviewAnnotation,
	isReviewAnnotationResolved: boolean
): string {
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

	return formattedTimestamp;
}
