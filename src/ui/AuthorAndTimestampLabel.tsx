import * as React from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type {
	ReviewAnnotation,
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

import useTimestamp from './useTimestamp';

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

	const authorId = React.useMemo<string | null>(() => {
		const authorField = isReviewAnnotationResolved
			? 'resolvedAuthor'
			: 'author';

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
