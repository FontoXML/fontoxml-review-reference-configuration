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
		| ReviewCardContentComponentProps['reviewAnnotation']
		| ReviewReply
		| ReviewAnnotation;
	isReviewAnnotationResolved?: boolean;
};

function AuthorAndTimestampLabel({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}: Props) {
	const timestampLabel =
		useTimestamp(
			reviewAnnotation,
			isReviewAnnotationResolved
		);

	const authorId = React.useMemo<string | null>(() => {
		const authorField = isReviewAnnotationResolved
			? 'resolvedAuthor'
			: 'author';

		const authorData = reviewAnnotation[authorField];
		return authorData?.id;
	}, [reviewAnnotation.resolvedAuthor, reviewAnnotation.author, isReviewAnnotationResolved]);

	return (
		<Flex alignItems="center" spaceSize="s">
			<FxProfileChip profileId={authorId} />

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
