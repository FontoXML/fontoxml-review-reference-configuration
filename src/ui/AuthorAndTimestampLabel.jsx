import React from 'react';

import { Flex, Label } from 'fds/components';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel.jsx';

function AuthorAndTimestampLabel({
	reviewAnnotation,
	bold = true,
	forResolvedReviewAnnotation = false
}) {
	const resolvedAuthorAndTimestampLabel = useAuthorAndTimestampLabel(
		reviewAnnotation,
		forResolvedReviewAnnotation
	);
	const authorLabel = resolvedAuthorAndTimestampLabel.author;
	const timestampLabel = resolvedAuthorAndTimestampLabel.timestamp;

	// Create label. If we have both, split with a dash, else, show only author.
	let completeLabel = authorLabel;
	if (timestampLabel) {
		completeLabel = completeLabel + ' – ' + timestampLabel;
	}

	return (
		<Flex>
			<Label isBold={bold}>{completeLabel}</Label>
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
