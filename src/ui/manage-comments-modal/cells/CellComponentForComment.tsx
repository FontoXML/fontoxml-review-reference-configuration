import { useMemo } from 'react';

import { Diff, Flex, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import type { ReviewAnnotationMetadata } from '../types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForComment = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const originalText = useMemo(
		() => row.data.originalText ?? '',
		[row.data.originalText]
	);
	const proposedChange = useMemo(
		() =>
			row.data.metadata
				.proposedChange as ReviewAnnotationMetadata['proposedChange'],
		[row.data.metadata.proposedChange]
	);

	const commentOrMotivation = useMemo(
		() => row.data.metadata.comment as ReviewAnnotationMetadata['comment'],
		[row.data.metadata.comment]
	);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			{proposedChange && (
				<Diff
					dataTestId="comment"
					isSingleLine
					originalValue={originalText}
					value={proposedChange}
				/>
			)}

			{proposedChange && commentOrMotivation && (
				<Label isItalic>{t('Motivation:')}</Label>
			)}

			<Label tooltipContent={commentOrMotivation}>
				{commentOrMotivation}
			</Label>
		</Flex>
	);
};

export default CellComponentForComment;
