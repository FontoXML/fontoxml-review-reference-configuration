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
	const shouldBeBold = !reviewAnnotation.isSelected || forResolvedReviewAnnotation;

	return (
		<Flex alignItems="center" spaceSize="s">
			<Label isBold={shouldBeBold} tooltipContent={authorLabel}>
				{authorLabel}
			</Label>
			{timestampLabel && (
				<Flex flex="0 0 auto" spaceSize="s">
					<Label isBold={shouldBeBold}>–</Label>
					<Label isBold={shouldBeBold}>{timestampLabel}</Label>
				</Flex>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
