import * as React from 'react';

import {
	Block,
	Button,
	Flex,
	HorizontalSeparationLine,
	Icon,
	TextArea,
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';

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
	if (!value) {
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
	valueByName,
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
					style={{ minHeight: '2rem' }}
					spaceSize="s"
				>
					<Icon icon="fal fa-reply" />

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

			<Flex justifyContent="flex-end" spaceSize="l">
				<Block flex="0 1 auto">
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancelButtonClick}
					/>
				</Block>

				<Block flex="0 1 auto">
					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={
							isDisabled ||
							isLoading ||
							!valueByName.reply ||
							isSubmitDisabled ||
							(reply.error &&
								reply.error.recovery !==
									RecoveryOption.RETRYABLE)
						}
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

function ReplyForm({
	onCancel,
	onHide,
	onRefresh,
	onSubmit,
	reply,
	reviewAnnotationId,
}) {
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
			annotationId={reviewAnnotationId}
			initialValueByName={reply.metadata}
			onCancel={handleCancelButtonClick}
			onSubmit={handleSubmit}
		>
			{({ isSubmitDisabled, onFocusableRef, onCancel, onSubmit, valueByName }) => (
				<ReplyFormContent
					isSubmitDisabled={isSubmitDisabled}
					onCancelButtonClick={onCancel}
					onFocusableRef={onFocusableRef}
					onHideLinkClick={handleHideLinkClick}
					onRefreshLinkClick={handleRefreshLinkClick}
					onSubmit={onSubmit}
					reply={reply}
					valueByName={valueByName}
				/>
			)}
		</ReviewAnnotationForm>
	);
}

export default ReplyForm;
