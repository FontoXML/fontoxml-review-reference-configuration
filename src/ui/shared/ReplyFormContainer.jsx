import React, { Fragment } from 'react';

import { Block, Flex, HorizontalSeparationLine, Icon } from 'fds/components';

// 2px to visually align the reply icon nicely to the authorLabel
const iconContainerStyles = { marginTop: '2px' };

function ReplyFormContainer({ children, isLast }) {
	return (
		<Fragment>
			<HorizontalSeparationLine />

			<Flex flex="none" paddingSize={isLast ? { top: 'm' } : { vertical: 'm' }} spaceSize="m">
				<Flex alignItems="flex-start" applyCss={iconContainerStyles} flex="none">
					<Icon icon="reply" colorName="icon-s-muted-color" />
				</Flex>

				<Block applyCss={{ marginTop: '-0.25rem' }} flex="1" spaceVerticalSize="m">
					<Block spaceVerticalSize="s">{children}</Block>
				</Block>
			</Flex>
		</Fragment>
	);
}

export default ReplyFormContainer;
