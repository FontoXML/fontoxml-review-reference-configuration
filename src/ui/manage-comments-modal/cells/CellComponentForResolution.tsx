import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import type { ReviewAnnotationResolvedMetadata } from '../types';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const resolutionLabelByResolution = {
	accepted: t('Accepted'),
	rejected: t('Rejected'),
};

const CellComponentForResolution = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const resolutionLabel = useMemo(
		() =>
			row.data.resolvedMetadata
				? resolutionLabelByResolution[
						row.data.resolvedMetadata
							.resolution as ReviewAnnotationResolvedMetadata['resolution']
					]
				: t('Unresolved'),
		[row.data.resolvedMetadata]
	);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			<Label tooltipContent={resolutionLabel}>{resolutionLabel}</Label>
		</Flex>
	);
};

export default CellComponentForResolution;
