import React from 'react';

import { Flex, Label } from 'fds/components';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel';

function AuthorAndTimestampLabel({
	reviewAnnotation,
	forResolvedReviewAnnotation = false,
}) {
	const { author: authorLabel, timestamp: timestampLabel } =
		useAuthorAndTimestampLabel(
			reviewAnnotation,
			forResolvedReviewAnnotation
		);

	const authorLabelRef = React.useRef(null);
	const handleLabelRef = (domNode: HTMLElement) => {
		authorLabelRef.current = domNode;
	};
	const [authorLabelScrollWidth, setAuthorLabelScrollWidth] =
		React.useState(false);
	React.useEffect(() => {
		if (authorLabelRef.current) {
			setAuthorLabelScrollWidth(authorLabelRef.current.scrollWidth);
		}
	}, []);

	return (
		<Flex alignItems="baseline" spaceSize="s">
			<Flex
				flex="0 1 auto"
				style={{ minWidth: Math.min(authorLabelScrollWidth, 32) }}
			>
				<Label tooltipContent={authorLabel} onRef={handleLabelRef}>
					{authorLabel}
				</Label>
			</Flex>

			{timestampLabel && (
				<Label
					colorName="text-muted-color"
					flex="0 3 auto"
					size="s"
					tooltipContent={timestampLabel}
				>
					{timestampLabel}
				</Label>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
