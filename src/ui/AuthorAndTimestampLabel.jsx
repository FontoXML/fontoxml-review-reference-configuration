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
	const authorLabel = resolvedAuthorAndTimestampLabel.authorLabel;
	const timestampLabel = resolvedAuthorAndTimestampLabel.timestamp;

	return (
		<Flex alignItems="center" justifyContent="space-between" spaceSize="s">
			<Label isBold={bold} tooltipContent={authorLabel}>
				{authorLabel}
			</Label>
			{timestampLabel && (
				<Flex flex="0 0 auto" spaceSize="s">
					<Label isBold={bold}>–</Label>
					<Label isBold={bold}>{timestampLabel}</Label>
				</Flex>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
