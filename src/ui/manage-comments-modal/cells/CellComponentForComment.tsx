import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../shared/types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForComment = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
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
