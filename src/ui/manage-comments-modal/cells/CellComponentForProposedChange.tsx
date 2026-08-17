import { useMemo } from 'react';

import { Diff, Flex, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import type { ReviewAnnotationMetadata } from '../types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForProposedChange = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const originalText = useMemo(
		() => row.data.originalText ?? '',
		[row.data.originalText]
	);
	const { proposedChange, motivation } = useMemo(() => {
		const metadata = row.data.metadata as ReviewAnnotationMetadata;
		if (metadata.proposedChange) {
			return {
				proposedChange: metadata.proposedChange,
				motivation: metadata.comment,
			};
		}
		return { proposedChange: undefined, motivation: undefined };
	}, [row.data.metadata]);

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

			{motivation && <Label isItalic>{t('Motivation:')}</Label>}
			{motivation && (
				<Label tooltipContent={motivation}>{motivation}</Label>
			)}
		</Flex>
	);
};

export default CellComponentForProposedChange;
