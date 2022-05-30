import * as React from 'react';

import { Drop, Menu, MenuItem } from 'fontoxml-design-system/src/components';
import t from 'fontoxml-localization/src/t';

type Props = {
	onEditButtonClick(): void;
	onRemoveButtonClick(): void;
	closeDrop(): void;
};

export default function ReplyActionsDrop({
	onEditButtonClick,
	onRemoveButtonClick,
	closeDrop,
}: Props) {
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
