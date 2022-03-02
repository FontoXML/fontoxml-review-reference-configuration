import { Drop, Menu, MenuItem } from 'fds/components';
import * as React from 'react';

import t from 'fontoxml-localization/src/t';

export default function ReplyActionsDrop({
	onEditButtonClick,
	onRemoveButtonClick,
	closeDrop,
}) {
	const handleEditButtonClick = React.useCallback(() => {
		onEditButtonClick();
		closeDrop();
	}, [closeDrop, onEditButtonClick]);

	const handleRemoveButtonClick = React.useCallback(() => {
		onRemoveButtonClick();
		closeDrop();
	}, [closeDrop, onRemoveButtonClick]);

	return (
		<Drop>
			<Menu>
				<MenuItem
					icon="far fa-edit"
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
