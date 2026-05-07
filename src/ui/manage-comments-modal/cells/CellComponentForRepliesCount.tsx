import { useMemo } from 'react';

import { Flex, Icon, Label } from 'fontoxml-design-system/src/components';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import type {
	ReviewAnnotationsOverviewCellComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

export function determineReviewAnnotationReplies(
	reviewReplies: ReviewReply[]
): ReviewReply[] {
	return reviewReplies.filter(
		(reply) =>
			// Exclude replies that are being added.
			reply.busyState !== ReviewBusyState.ADDING
	);
}

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForRepliesCount = ({
	row,
}: ReviewAnnotationsOverviewCellComponentProps) => {
	const { count, label } = useMemo(() => {
		const count = determineReviewAnnotationReplies(row.data.replies).length;

		return {
			count,
			label: t(
				'{REPLIES_COUNT, plural, one {1 reply} other {# replies}}',
				{ REPLIES_COUNT: count }
			),
		};
	}, [row.data.replies]);

	if (count === 0) {
		return null;
	}

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			<Icon icon="far fa-reply" size="s" />

			<Label>{label}</Label>
		</Flex>
	);
};

export default CellComponentForRepliesCount;
