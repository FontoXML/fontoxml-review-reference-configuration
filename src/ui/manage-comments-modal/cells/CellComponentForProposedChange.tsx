import { useMemo } from 'react';

import { Diff, Flex } from 'fontoxml-design-system/src/components';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewCellComponentProps } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../shared/types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForProposedChange = ({
	row,
}: ReviewAnnotationsOverviewCellComponentProps) => {
	const originalText = useMemo(
		() => row.data.originalText ?? '',
		[row.data.originalText]
	);
	const proposedChange = useMemo(() => {
		const metadata = row.data.metadata as ReviewAnnotationMetadata;
		return metadata.proposedChange ?? '';
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
		</Flex>
	);
};

export default CellComponentForProposedChange;
