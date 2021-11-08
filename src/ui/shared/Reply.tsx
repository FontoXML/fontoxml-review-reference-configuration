import React, { Fragment, useCallback } from 'react';

import {
	Block,
	Button,
	CompactButton,
	Flex,
	HorizontalSeparationLine,
	Icon,
	PopoverAnchor
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import { BusyState } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel.jsx';
import ReplyActionsMenuPopover from './ReplyActionsMenuPopover.jsx';

// 2px to visually align the reply icon nicely to the authorLabel
const iconContainerStyles = { marginTop: '2px' };

export default function Reply({
	ContentComponent,
	isLast,
	reviewAnnotation,
	onCancelRetryRemove,
	onHide,
	onRefresh,
	onRemove,
	onShowEditForm,
	reply,
	showActionsMenuButton
}) {
	const error = reply.error;
	const isDisabled = reply.isLoading;

	const handleEditButtonClick = useCallback(() => onShowEditForm(reply.id), [
		onShowEditForm,
		reply.id
	]);
	const handleCancelRemoveButtonClick = useCallback(() => onCancelRetryRemove(reply.id), [
		onCancelRetryRemove,
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
					<Icon icon="fas fa-reply" />
				</Flex>

				<Block flex="1" spaceVerticalSize="m">
					<Flex justifyContent="space-between">
						<AuthorAndTimestampLabel reviewAnnotation={reply} />

						{showActionsMenuButton && !reply.error && (
							<PopoverAnchor
								renderAnchor={({ isPopoverOpened, onRef, togglePopover }) => (
									<CompactButton
										icon="ellipsis-h"
										tooltipContent={t('More actions')}
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

					{/* If there was an error while removing the annotation, we show that error in an ErrorToast.
					Instead of showing the regular footer, show something that looks similar to the footer you
					see when editing a reply.
					And make sure to render that footer in the error state (Retry remove label on the primary button).*/}
					{error && reply.busyState === BusyState.REMOVING && (
						<Fragment>
							<ErrorToast
								error={error}
								onHideLinkClick={handleHideClick}
								onRefreshLinkClick={handleRefreshLinkClick}
								onRetryLinkClick={handleRemoveButtonClick}
							/>

							<HorizontalSeparationLine marginSizeBottom="m" marginSizeTop="m" />

							<Flex justifyContent="flex-end" spaceSize="m">
								<Button
									isDisabled={isDisabled}
									label={t('Cancel')}
									onClick={handleCancelRemoveButtonClick}
								/>

								<Button
									label={t('Retry remove')}
									onClick={handleRemoveButtonClick}
									type="primary"
								/>
							</Flex>
						</Fragment>
					)}

					{error && reply.busyState !== BusyState.REMOVING && (
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
