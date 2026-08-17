import { useMemo } from 'react';

import { Flex, Icon, Label } from 'fontoxml-design-system/src/components';
import type { CellComponentProps } from 'fontoxml-design-system/src/components/data-table/types';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const paddingSize: FdsPaddingSize = { horizontal: 'm' };

const CellComponentForRepliesCount = ({
	row,
}: CellComponentProps<ReviewAnnotationsOverviewDataTableRow>) => {
	const { count, label } = useMemo(() => {
		const count = row.data.replies.length;

		return {
			count,
			label: t(
				'{REPLIES_COUNT, plural, one {1 reply} other {# replies}}',
				{ REPLIES_COUNT: count }
			),
		};
	}, [row.data.replies]);

	if (count === 0) {
		return null;
	}

	return (
		<Flex
			alignItems="center"
			flex="1"
			flexDirection="row"
			paddingSize={paddingSize}
			spaceSize="s"
		>
			<Icon icon="far fa-reply" size="s" />

			<Label>{label}</Label>
		</Flex>
	);
};

export default CellComponentForRepliesCount;
