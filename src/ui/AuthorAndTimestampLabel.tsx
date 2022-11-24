import * as React from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type {
	ReviewAnnotation,
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel';

type Props = {
	reviewAnnotation:
		| ReviewAnnotation
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply;
	isReviewAnnotationResolved?: boolean;
};

function AuthorAndTimestampLabel({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}: Props) {
	const { author: authorData, timestamp: timestampLabel } =
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

		const authorData = reviewAnnotation[authorField];
		return authorData?.id || '';
	}, [
		reviewAnnotation.resolvedAuthor,
		reviewAnnotation.author,
		isReviewAnnotationResolved,
	]);

	return (
		<Flex alignItems="center" spaceSize="s">
			{authorData.id && <FxProfileChip profileId={authorData.id} />}

			{authorData.displayName && (
				<Flex
					flex="0 1 auto"
					style={{ minWidth: Math.min(authorLabelScrollWidth, 32) }}
				>
					<Label
						tooltipContent={authorData.displayName}
						data-test-id="author-label"
						onRef={handleAuthorLabelRef}
					>
						{authorData.displayName}
					</Label>
				</Flex>
			)}

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
