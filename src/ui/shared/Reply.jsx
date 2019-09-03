import React, { useCallback } from 'react';

import {
	Block,
	CompactButton,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
	PopoverAnchor
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import useAuthorAndTimestampLabel from 'fontoxml-feedback/src/useAuthorAndTimestampLabel.jsx';

import ReplyActionsMenuPopover from './ReplyActionsMenuPopover.jsx';

// 2px to visually align the reply icon nicely to the authorLabel
const iconContainerStyles = { marginTop: '2px' };

export default function Reply({
	ContentComponent,
	isLast,
	reviewAnnotation,
	onHide,
	onRefresh,
	onRemove,
	onShowEditForm,
	reply,
	showActionsMenuButton
}) {
	const error = reply.error;
	const isDisabled = reply.isLoading;

	const authorAndTimestampLabel = useAuthorAndTimestampLabel(reply);

	const handleEditButtonClick = useCallback(() => onShowEditForm(reply.id), [
		onShowEditForm,
		reply.id
	]);
	const handleRemoveButtonClick = useCallback(() => onRemove(reply.id), [onRemove, reply.id]);

	const handleHideClick = useCallback(() => onHide(reply.id), [onHide, reply.id]);
	const handleRefreshLinkClick = useCallback(() => onRefresh(reply.id), [onRefresh, reply.id]);

	return (
		<Block>
			<HorizontalSeparationLine />

			<Flex flex="none" paddingSize={isLast ? { top: 'm' } : { vertical: 'm' }} spaceSize="m">
				<Flex alignItems="flex-start" applyCss={iconContainerStyles} flex="none">
					<Icon icon="reply" colorName="icon-s-muted-color" />
				</Flex>

				<Block flex="1" spaceVerticalSize="m">
					<Flex justifyContent="space-between">
						<Label colorName="text-muted-color">{authorAndTimestampLabel}</Label>

						{showActionsMenuButton && (
							<PopoverAnchor
								renderAnchor={({ isPopoverOpened, onRef, togglePopover }) => (
									<CompactButton
										icon="ellipsis-h"
										isDisabled={isDisabled}
										isSelected={isPopoverOpened}
										onClick={togglePopover}
										onRef={onRef}
									/>
								)}
								renderPopover={({ togglePopover }) => (
									<ReplyActionsMenuPopover
										onEditButtonClick={handleEditButtonClick}
										onRemoveButtonClick={handleRemoveButtonClick}
										togglePopover={togglePopover}
									/>
								)}
							/>
						)}
					</Flex>

					<ContentComponent
						isReviewAnnotationSelected={reviewAnnotation.isSelected}
						metadata={reply.metadata}
						type={reviewAnnotation.type}
					/>

					{error && (
						<ErrorToast
							error={error}
							onHideLinkClick={handleHideClick}
							onRefreshLinkClick={handleRefreshLinkClick}
						/>
					)}
				</Block>
			</Flex>
		</Block>
	);
}
