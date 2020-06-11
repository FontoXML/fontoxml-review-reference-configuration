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
		<Flex spacesize="m">
			<Flex flex="0 1 auto">
				<Label isBold={bold} tooltipContent={authorLabel + ' '}>
					{authorLabel}
				</Label>
			</Flex>
			<Flex flex="0 0 auto">
				{timestampLabel && <Label isBold={bold}>{'–'}</Label>}
				{timestampLabel && <Label isBold={bold}>{timestampLabel}</Label>}
			</Flex>
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
