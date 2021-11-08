import React, { useCallback } from 'react';

import { Drop, Menu, MenuItem } from 'fds/components';
import t from 'fontoxml-localization/src/t';

export default function ReplyActionsDrop({
	onEditButtonClick,
	onRemoveButtonClick,
	closeDrop,
}) {
	const handleEditButtonClick = useCallback(() => {
		onEditButtonClick();
		closeDrop();
	}, [onEditButtonClick]);

	const handleRemoveButtonClick = useCallback(() => {
		onRemoveButtonClick();
		closeDrop();
	}, [onRemoveButtonClick]);

	return (
		<Drop>
			<Menu>
				<MenuItem
					icon="fas fa-pencil-square-o"
					label={t('Edit')}
					onClick={handleEditButtonClick}
				/>

				<MenuItem
					icon="times"
					label={t('Remove')}
					onClick={handleRemoveButtonClick}
				/>
			</Menu>
		</Drop>
	);
}
