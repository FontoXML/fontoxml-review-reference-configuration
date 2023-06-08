import * as React from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type {
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel';

type Props = {
	reviewAnnotation:
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply;
	isReviewAnnotationResolved?: boolean;
};

const AuthorAndTimestampLabel: React.FC<Props> = ({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}) => {
	const { author: authorLabel, timestamp: timestampLabel } =
		useAuthorAndTimestampLabel(
			reviewAnnotation,
			isReviewAnnotationResolved
		);

	// Make sure the author label is not truncated too much and not too little,
	// making it and the timestamp label visible.
	const authorLabelRef = React.useRef<HTMLElement>(null);

	const handleAuthorLabelRef = (domNode: HTMLElement) => {
		authorLabelRef.current = domNode;
	};

	const [authorLabelScrollWidth, setAuthorLabelScrollWidth] =
		React.useState<number>(0);

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
