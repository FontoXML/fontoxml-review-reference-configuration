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
		<Flex alignItems="center" flex="1" spaceSize="s">
			<Label isBold={shouldBeBold} tooltipContent={authorLabel}>
				{authorLabel}
			</Label>
			{timestampLabel && (
				<Flex flex="1" spaceSize="s">
					<Label isBold={shouldBeBold}>–</Label>
					<Label isBold={shouldBeBold} tooltipContent={timestampLabel}>
						{timestampLabel}
					</Label>
				</Flex>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
