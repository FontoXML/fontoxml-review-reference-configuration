import React from 'react';

import { Flex, Label } from 'fds/components';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel.jsx';

function AuthorAndTimestampLabel({ reviewAnnotation, forResolvedReviewAnnotation = false }) {
	const resolvedAuthorAndTimestampLabel = useAuthorAndTimestampLabel(
		reviewAnnotation,
		forResolvedReviewAnnotation
	);
	const authorLabel = resolvedAuthorAndTimestampLabel.author;
	const timestampLabel = resolvedAuthorAndTimestampLabel.timestamp;

	return (
		<Flex spaceSize="m" alignItems="baseline">
			<Label isBold size="l" tooltipContent={authorLabel}>
				{authorLabel}
			</Label>

			{timestampLabel && (
				<Flex flex="none" spaceSize="s">
					<Label isBold>{timestampLabel}</Label>
				</Flex>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
