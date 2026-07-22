import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForTimestamp = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const dateLabel = useMemo(
		() =>
			t('{DATE, fonto_date} {DATE, time}', {
				DATE: new Date(row.reviewAnnotation.timestamp),
			}),
		[row.reviewAnnotation.timestamp]
	);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
		>
			<Label tooltipContent={dateLabel}>{dateLabel}</Label>
		</Flex>
	);
};

export default CellComponentForTimestamp;
