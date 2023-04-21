import * as React from 'react';

import {
	Block,
	Button,
	DropAnchor,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fontoxml-design-system/src/components';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import type {
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import { CARD_HEADER_HEIGHT } from './../constants';
import ReplyActionsDrop from './ReplyActionsDrop';
import TruncatedText from './TruncatedText';

type Props = {
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
	onCancelRetryRemove: ReviewCardContentComponentProps['onReplyFormCancel'];
	onHide: ReviewCardContentComponentProps['onReplyErrorHide'];
	onRefresh: ReviewCardContentComponentProps['onReplyRefresh'];
	onRemove: ReviewCardContentComponentProps['onReplyRemove'];
	onShowEditForm: ReviewCardContentComponentProps['onReplyEdit'];
	reply: ReviewReply;
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

	const handleEditButtonClick = React.useCallback(() => {
		onShowEditForm(reply.id);
	}, [onShowEditForm, reply.id]);
	const handleCancelRemoveButtonClick = React.useCallback(() => {
		onCancelRetryRemove(reply.id);
	}, [onCancelRetryRemove, reply.id]);
	const handleRemoveButtonClick = React.useCallback(() => {
		onRemove(reply.id);
	}, [onRemove, reply.id]);

	const handleHideClick = React.useCallback(() => {
		onHide(reply.id);
	}, [onHide, reply.id]);
	const handleRefreshLinkClick = React.useCallback(() => {
		onRefresh(reply.id);
	}, [onRefresh, reply.id]);

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
								onRef,
								setIsDropOpened,
							}) => (
								<Button
									icon="ellipsis-h"
									isDisabled={isDisabled}
									isSelected={isDropOpened}
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
						<TruncatedText dir={reply.metadata['reply.dir']}>
							{reply.metadata.reply}
						</TruncatedText>
					)}
					{!reviewAnnotation.isSelected && (
						<Label dir={reply.metadata['reply.dir']} isBlock>
							{reply.metadata.reply}
						</Label>
					)}
				</Block>

				{/* If there was an error while removing the annotation, we show that error in an ErrorToast.
				Instead of showing the regular footer, show something that looks similar to the footer you
				see when editing a reply.
				And make sure to render that footer in the error state (Retry remove label on the primary button).*/}
				{error && reply.busyState === ReviewBusyState.REMOVING && (
					<Flex flexDirection="column" spaceSize="m">
						<ErrorToast
							error={
								error && typeof error !== 'number'
									? error
									: null
							}
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

				{error && reply.busyState !== ReviewBusyState.REMOVING && (
					<ErrorToast
						error={
							error && typeof error !== 'number' ? error : null
						}
						onHideLinkClick={handleHideClick}
						onRefreshLinkClick={handleRefreshLinkClick}
					/>
				)}
			</Block>
		</>
	);
}
