import {
	Block,
	Button,
	DropAnchor,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fds/components';
import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import {
	BusyState,
	CardContentComponentProps,
	Reply as ReplyType
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import { CARD_HEADER_HEIGHT } from './../constants';
import ReplyActionsDrop from './ReplyActionsDrop';
import TruncatedText from './TruncatedText';

type Props = {
	reviewAnnotation: CardContentComponentProps['reviewAnnotation']; 
	onCancelRetryRemove: CardContentComponentProps['onReplyFormCancel'];
	onHide: CardContentComponentProps['onReplyErrorHide'];
	onRefresh: CardContentComponentProps['onReplyRefresh'];
	onRemove: CardContentComponentProps['onReplyRemove'];
	onShowEditForm: CardContentComponentProps['onReplyEdit'];
	reply: ReplyType;
	showActionsMenuButton: boolean;
};

export default function Reply({
	reviewAnnotation,
	onCancelRetryRemove,
	onHide,
	onRefresh,
	onRemove,
	onShowEditForm,
	reply,
	showActionsMenuButton,
}: Props) {
	const error = reply.error;
	const isDisabled = reply.isLoading;

	const handleEditButtonClick = React.useCallback(
		() => onShowEditForm(reply.id),
		[onShowEditForm, reply.id]
	);
	const handleCancelRemoveButtonClick = React.useCallback(
		() => onCancelRetryRemove(reply.id),
		[onCancelRetryRemove, reply.id]
	);
	const handleRemoveButtonClick = React.useCallback(
		() => onRemove(reply.id),
		[onRemove, reply.id]
	);

	const handleHideClick = React.useCallback(
		() => onHide(reply.id),
		[onHide, reply.id]
	);
	const handleRefreshLinkClick = React.useCallback(
		() => onRefresh(reply.id),
		[onRefresh, reply.id]
	);

	return (
		<>
			<HorizontalSeparationLine />

			<Block data-test-id="reply">
				<Flex
					alignItems="center"
					flexDirection="row"
					justifyContent="space-between"
					style={{ height: CARD_HEADER_HEIGHT }}
				>
					<Flex flexDirection="row" spaceSize="s">
						<Icon icon="far fa-reply" />

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

				<Block data-test-id="reply-text">
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
					<Flex flexDirection="column" spaceSize="m">
						<ErrorToast
							error={error && typeof error !== 'number' ? error : null}
							onHideLinkClick={handleHideClick}
							onRefreshLinkClick={handleRefreshLinkClick}
							onRetryLinkClick={handleRemoveButtonClick}
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
					</Flex>
				)}

				{error && reply.busyState !== BusyState.REMOVING && (
					<ErrorToast
						error={error && typeof error !== 'number' ? error : null}
						onHideLinkClick={handleHideClick}
						onRefreshLinkClick={handleRefreshLinkClick}
					/>
				)}
			</Block>
		</>
	);
}
