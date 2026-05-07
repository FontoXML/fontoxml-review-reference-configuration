import * as React from 'react';

import { Flex } from 'fontoxml-design-system/src/components';
import type {
	ReviewAnnotation,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

import useAuthorAndTimestampLabel from './useAuthorAndTimestampLabel';

type Props = {
	reviewAnnotation: ReviewAnnotation | ReviewReply;
	isReviewAnnotationResolved?: boolean;
};

const AuthorAndTimestampLabel: React.FC<Props> = ({
	reviewAnnotation,
	isReviewAnnotationResolved = false,
}) => {
	const { authorId, timestamp: timestampLabel } = useAuthorAndTimestampLabel(
		reviewAnnotation,
		isReviewAnnotationResolved
	);

	return (
		<Flex alignItems="center" spaceSize="s" flex="1">
			<FxProfileChip
				profileId={authorId}
				secondaryLabel={
					timestampLabel
						? {
								value: timestampLabel,
								position: 'below',
							}
						: null
				}
			/>
		</Flex>
	);
};

export default AuthorAndTimestampLabel;
