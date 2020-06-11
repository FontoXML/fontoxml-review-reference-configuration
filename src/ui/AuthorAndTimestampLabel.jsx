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
		<Flex alignItems="center" spaceSize="s">
			<Label isBold={!reviewAnnotation.isSelected} tooltipContent={authorLabel}>
				{authorLabel}
			</Label>
			{timestampLabel && (
				<Flex flex="0 0 auto" spaceSize="s">
					<Label isBold={!reviewAnnotation.isSelected}>–</Label>
					<Label isBold={!reviewAnnotation.isSelected}>{timestampLabel}</Label>
				</Flex>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
