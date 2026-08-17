import { useMemo } from 'react';

import { Chip, Flex, Icon, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const resolutionLabelByResolution = {
	accepted: t('Accepted'),
	rejected: t('Rejected'),
};

const CellComponentForStatus = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const status = useMemo(() => {
		if (row.data.status === ReviewAnnotationStatus.PRIVATE) {
			return (
				<Flex alignItems="center" flexDirection="row" spaceSize="s">
					<Icon icon="far fa-user-lock" />

					<Label tooltipContent={t('Private')}>{t('Private')}</Label>
				</Flex>
			);
		}
		const resolution = row.data.resolvedMetadata?.resolution as
			| 'accepted'
			| 'rejected'
			| undefined;
		if (row.data.status === ReviewAnnotationStatus.RESOLVED && resolution) {
			return (
				<Chip
					iconBefore={resolution === 'accepted' ? 'check' : 'cross'}
					label={resolutionLabelByResolution[resolution]}
				/>
			);
		}
		return (
			<Label
				colorName="text-muted-color"
				tooltipContent={t('Unresolved')}
			>
				{t('Unresolved')}
			</Label>
		);
	}, [row.data.resolvedMetadata?.resolution, row.data.status]);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			{status}
		</Flex>
	);
};

export default CellComponentForStatus;
