import React, { useCallback } from 'react';

import {
	Block,
	Button,
	DropAnchor,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Text,
	Label,
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { BusyState } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import ReplyActionsDrop from './ReplyActionsDrop';
import TruncatedText from './TruncatedText';

export default function Reply({
	reviewAnnotation,
	onCancelRetryRemove,
	onHide,
	onRefresh,
	onRemove,
	onShowEditForm,
	reply,
	showActionsMenuButton,
}) {
	const error = reply.error;
	const isDisabled = reply.isLoading;

	const handleEditButtonClick = useCallback(
		() => onShowEditForm(reply.id),
		[onShowEditForm, reply.id]
	);
	const handleCancelRemoveButtonClick = useCallback(
		() => onCancelRetryRemove(reply.id),
		[onCancelRetryRemove, reply.id]
	);
	const handleRemoveButtonClick = useCallback(
		() => onRemove(reply.id),
		[onRemove, reply.id]
	);

	const handleHideClick = useCallback(
		() => onHide(reply.id),
		[onHide, reply.id]
	);
	const handleRefreshLinkClick = useCallback(
		() => onRefresh(reply.id),
		[onRefresh, reply.id]
	);

	return (
		<>
			<HorizontalSeparationLine />

			<Block>
				<Flex
					// Use minHeight to prevent jumpiness if buttons are mounted/unmounted
					style={{ minHeight: '2rem' }}
					alignItems="center"
					flexDirection="row"
					justifyContent="space-between"
				>
					<Flex flexDirection="row" spaceSize="s">
						<Icon icon="fal fa-reply" />

						<AuthorAndTimestampLabel reviewAnnotation={reply} />
					</Flex>

					{showActionsMenuButton && !reply.error && (
						<DropAnchor
							renderAnchor={({
								isDropOpened,
								isFocused,
								onRef,
								setIsDropOpened,
							}) => (
								<Button
									icon="ellipsis-h"
									isDisabled={isDisabled}
									isSelected={isDropOpened}
									isFocused={isFocused}
									onClick={() => {
										setIsDropOpened(
											(isDropOpened) => !isDropOpened
										);
									}}
									onRef={onRef}
									tooltipContent={t('More actions')}
									type="transparent"
								/>
							)}
							renderDrop={({ setIsDropOpened }) => (
								<ReplyActionsDrop
									onEditButtonClick={handleEditButtonClick}
									onRemoveButtonClick={
										handleRemoveButtonClick
									}
									closeDrop={() => {
										setIsDropOpened(false);
									}}
								/>
							)}
						/>
					)}
				</Flex>

				<Block>
					{reviewAnnotation.isSelected && (
						<TruncatedText>{reply.metadata.reply}</TruncatedText>
					)}
					{!reviewAnnotation.isSelected && (
						<Label isBlock>{reply.metadata.reply}</Label>
					)}
				</Block>

				{/* If there was an error while removing the annotation, we show that error in an ErrorToast.
				Instead of showing the regular footer, show something that looks similar to the footer you
				see when editing a reply.
				And make sure to render that footer in the error state (Retry remove label on the primary button).*/}
				{error && reply.busyState === BusyState.REMOVING && (
					<>
						<ErrorToast
							error={error}
							onHideLinkClick={handleHideClick}
							onRefreshLinkClick={handleRefreshLinkClick}
							onRetryLinkClick={handleRemoveButtonClick}
						/>

						<HorizontalSeparationLine
							marginSizeBottom="m"
							marginSizeTop="m"
						/>

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
					</>
				)}

				{error && reply.busyState !== BusyState.REMOVING && (
					<ErrorToast
						error={error}
						onHideLinkClick={handleHideClick}
						onRefreshLinkClick={handleRefreshLinkClick}
					/>
				)}
			</Block>
		</>
	);
}