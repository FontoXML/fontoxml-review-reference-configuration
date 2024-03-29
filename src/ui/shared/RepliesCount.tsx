import * as React from 'react';

import {
	Block,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fontoxml-design-system/src/components';
import t from 'fontoxml-localization/src/t';

type Props = {
	count: number;
};

const RepliesCount: React.FC<Props> = ({ count }) => {
	return (
		<Block>
			<HorizontalSeparationLine marginSizeBottom="m" />

			<Flex spaceSize="s">
				<Icon icon="far fa-reply" />
				<Label>
					{t(
						'{REPLIES_COUNT, plural, one {1 reply} other {# replies}}',
						{
							REPLIES_COUNT: count,
						}
					)}
				</Label>
			</Flex>
		</Block>
	);
};

export default RepliesCount;
