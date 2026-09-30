import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewCellComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import commentTypes from '../../commentTypes';
import type { ReviewAnnotationMetadata } from '../../shared/types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForType = ({
	row,
}: ReviewAnnotationsOverviewCellComponentProps) => {
	const typeLabel = useMemo(() => {
		if (row.data.type === 'proposal') {
			return t('Proposal');
		}

		const commentTypeValue = row.data.metadata
			.commentType as ReviewAnnotationMetadata['commentType'];

		const commentType = commentTypes.find(
			(commentType) => commentType.value === commentTypeValue
		);
		return commentType ? commentType.label : commentTypeValue;
	}, [row.data.metadata.commentType, row.data.type]);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
		>
			<Label tooltipContent={typeLabel}>{typeLabel}</Label>
		</Flex>
	);
};

export default CellComponentForType;
