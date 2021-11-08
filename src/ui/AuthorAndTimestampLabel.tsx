import React from 'react';

import { Flex, Label } from 'fds/components';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel.jsx';

function AuthorAndTimestampLabel({ reviewAnnotation, forResolvedReviewAnnotation = false }) {
	const { author: authorLabel, timestamp: timestampLabel } = useAuthorAndTimestampLabel(
		reviewAnnotation,
		forResolvedReviewAnnotation
	);

	return (
		<Flex alignItems="center" flex="1" spaceSize="s">
			<Label tooltipContent={authorLabel}>
				{authorLabel}
			</Label>

			<Label colorName="text-muted-color" size="s" tooltipContent={timestampLabel}>
				{timestampLabel}
			</Label>
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
