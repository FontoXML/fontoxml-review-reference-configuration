import {
	Block,
	Button,
	Flex,
	HorizontalSeparationLine,
	Icon,
	TextArea,
} from 'fds/components';
import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import { CARD_HEADER_HEIGHT } from './../constants';
import ResponsiveButtonSpacer from './ResponsiveButtonSpacer';

function determineSaveButtonLabel(error, isEditing, isLoading) {
	if (error && error.recovery === RecoveryOption.RETRYABLE) {
		if (!isEditing && !isLoading) {
			return t('Retry reply');
		}
		if (isEditing && !isLoading) {
			return t('Retry save');
		}
	}

	if (!isEditing && !isLoading) {
		return t('Reply');
	}
	if (!isEditing && isLoading) {
		return t('Replying…');
	}
	if (isEditing && !isLoading) {
		return t('Save');
	}
	if (isEditing && isLoading) {
		return t('Saving…');
	}
}

const rows = { minimum: 2, maximum: 6 };

function validateReplyField(value) {
	if (!value || value.trim() === '') {
		return { connotation: 'error', message: 'Reply is required.' };
	}

	return null;
}

function ReplyFormContent({
	isSubmitDisabled,
	onCancelButtonClick,
	onFocusableRef,
	onHideLinkClick,
	onRefreshLinkClick,
	onSubmit,
	reply,
}) {
	const isAdding = reply.busyState === BusyState.ADDING;
	const isEditing = reply.busyState === BusyState.EDITING;

	const error = reply.error && (isAdding || isEditing) ? reply.error : null;
	const isDisabled =
		reply.isLoading ||
		(error && error.recovery !== RecoveryOption.RETRYABLE);
	const isLoading = reply.isLoading && (isAdding || isEditing);

	return (
		<Block spaceVerticalSize="l">
			<Flex flexDirection="column" spaceSize="m">
				<HorizontalSeparationLine />

				<Flex
					alignItems="center"
					spaceSize="s"
					style={{ height: CARD_HEADER_HEIGHT }}
				>
					<Icon icon="far fa-reply" />

					<AuthorAndTimestampLabel reviewAnnotation={reply} />
				</Flex>

				<TextArea
					isDisabled={isDisabled}
					name="reply"
					ref={onFocusableRef}
					rows={rows}
					validate={validateReplyField}
					placeholder={t('Type your reply')}
				/>

				{error && (
					<ErrorToast
						error={error}
						onHideLinkClick={onHideLinkClick}
						onRefreshLinkClick={onRefreshLinkClick}
						onRetryLinkClick={onSubmit}
					/>
				)}
			</Flex>

			<Flex justifyContent="flex-end">
				<Block flex="0 1 auto">
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancelButtonClick}
					/>
				</Block>

				<ResponsiveButtonSpacer />

				<Block flex="0 1 auto">
					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={isDisabled || isLoading || isSubmitDisabled}
						label={determineSaveButtonLabel(
							error,
							isEditing,
							isLoading
						)}
						onClick={onSubmit}
						type="primary"
					/>
				</Block>
			</Flex>
		</Block>
	);
}

function ReplyForm({ onCancel, onHide, onRefresh, onSubmit, reply }) {
	const handleHideLinkClick = React.useCallback(
		() => onHide(reply.id),
		[onHide, reply.id]
	);
	const handleRefreshLinkClick = React.useCallback(
		() => onRefresh(reply.id),
		[onRefresh, reply.id]
	);

	const handleCancelButtonClick = React.useCallback(
		() => onCancel(reply.id),
		[onCancel, reply.id]
	);
	const handleSubmit = React.useCallback(
		(valueByName) => onSubmit(reply.id, valueByName),
		[onSubmit, reply.id]
	);

	return (
		<ReviewAnnotationForm
			key={reply.id}
			initialValueByName={reply.metadata}
			onSubmit={handleSubmit}
		>
			{({ isSubmitDisabled, onFocusableRef, onSubmit }) => (
				<ReplyFormContent
					isSubmitDisabled={isSubmitDisabled}
					onCancelButtonClick={handleCancelButtonClick}
					onFocusableRef={onFocusableRef}
					onHideLinkClick={handleHideLinkClick}
					onRefreshLinkClick={handleRefreshLinkClick}
					onSubmit={onSubmit}
					reply={reply}
				/>
			)}
		</ReviewAnnotationForm>
	);
}

export default ReplyForm;
