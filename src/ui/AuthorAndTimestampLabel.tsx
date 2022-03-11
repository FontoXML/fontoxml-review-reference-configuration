import { Flex, Label } from 'fds/components';
import * as React from 'react';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel';

function AuthorAndTimestampLabel({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}) {
	const { author: authorLabel, timestamp: timestampLabel } =
		useAuthorAndTimestampLabel(
			reviewAnnotation,
			isReviewAnnotationResolved
		);

	// Make sure the author label is not truncated too much and not too little,
	// making it and the timestamp label visible.
	const authorLabelRef = React.useRef(null);
	const handleAuthorLabelRef = (domNode: HTMLElement) => {
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
				<Label
					tooltipContent={authorLabel}
					data-test-id="author-label"
					onRef={handleAuthorLabelRef}
				>
					{authorLabel}
				</Label>
			</Flex>

			{timestampLabel && (
				<Label
					colorName="text-muted-color"
					flex="0 3 auto"
					size="s"
					tooltipContent={timestampLabel}
					data-test-id="timestamp-label"
				>
					{timestampLabel}
				</Label>
			)}
		</Flex>
	);
}

export default AuthorAndTimestampLabel;
