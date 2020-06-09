import React, { useCallback } from 'react';

import { Menu, MenuItem, Popover, PopoverBody } from 'fds/components';

export default function ReplyActionsMenuPopover({
	onEditButtonClick,
	onRemoveButtonClick,
	togglePopover
}) {
	const handleEditButtonClick = useCallback(() => {
		onEditButtonClick();
		togglePopover();
	}, [onEditButtonClick, togglePopover]);

	const handleRemoveButtonClick = useCallback(() => {
		onRemoveButtonClick();
		togglePopover();
	}, [onRemoveButtonClick, togglePopover]);

	return (
		<Popover>
			<PopoverBody paddingSize={0}>
				<Menu>
					<MenuItem
						icon="fas fa-pencil-square-o"
						label="Edit"
						onClick={handleEditButtonClick}
					/>

					<MenuItem icon="times" label="Remove" onClick={handleRemoveButtonClick} />
				</Menu>
			</PopoverBody>
		</Popover>
	);
}
