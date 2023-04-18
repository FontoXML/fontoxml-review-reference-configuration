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

const AuthorAndTimestampLabel: React.FC<Props> = ({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}) => {
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

	React.useEffect(() => {
		if (authorLabelRef.current) {
			setAuthorLabelScrollWidth(authorLabelRef.current.scrollWidth);
		}
	}, []);

	return (
		<Flex alignItems="center" spaceSize="s">
			{authorData.id && (
				<FxProfileChip
					profileId={authorData.id}
					secondaryLabel={{
						value: timestampLabel,
						position: 'below',
					}}
				/>
			)}

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
		</Flex>
	);
};

export default AuthorAndTimestampLabel;
