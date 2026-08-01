import { useMemo } from 'react';

import { Flex, Label } from 'fontoxml-design-system/src/components';
import type {
	FdsDataTableCellComponentProps,
	FdsPaddingSize,
} from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForAuthor = ({
	row,
}: FdsDataTableCellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const { displayName, profileId } = useMemo(
		() => ({
			displayName: row.data.author.displayName || row.data.author.id,
			profileId: row.data.author.id,
		}),
		[row.data]
	);

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			{profileId && <FxProfileChip isCondensed profileId={profileId} />}

			<Label tooltipContent={displayName}>{displayName}</Label>
		</Flex>
	);
};

export default CellComponentForAuthor;
