import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewCellComponentProps } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../shared/types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForComment = ({
	row,
}: ReviewAnnotationsOverviewCellComponentProps) => {
	const comment = useMemo(() => {
		const metadata = row.data.metadata as ReviewAnnotationMetadata;
		return metadata.proposedChange ? '' : metadata.comment;
	}, [row.data.metadata]);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			<Label tooltipContent={comment}>{comment}</Label>
		</Flex>
	);
};

export default CellComponentForComment;
