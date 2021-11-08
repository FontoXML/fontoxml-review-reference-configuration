import React, { Fragment, useCallback } from 'react';

import {
	Block,
	Button,
	Flex,
	FormRow,
	HorizontalSeparationLine,
	Icon,
	Label,
	TextArea
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel.jsx';

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

// 2px to visually align the reply icon nicely to the authorLabel
const iconContainerStyles = { marginTop: '2px' };

function validateReplyField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Reply is required.' };
	}

	return null;
}

function ReplyFormContent({
	isLast,
	isSubmitDisabled,
	onCancelButtonClick,
	onFocusableRef,
	onHideLinkClick,
	onRefreshLinkClick,
	onSubmit,
	reply,
	valueByName
}) {
	const isAdding = reply.busyState === BusyState.ADDING;
	const isEditing = reply.busyState === BusyState.EDITING;

	const error = reply.error && (isAdding || isEditing) ? reply.error : null;
	const isDisabled = reply.isLoading || (error && error.recovery !== RecoveryOption.RETRYABLE);
	const isLoading = reply.isLoading && (isAdding || isEditing);

	return (
		<Fragment>
			<HorizontalSeparationLine />

			<Flex flex="none" paddingSize={{ top: 'm' }} spaceSize="m">
				<Flex alignItems="flex-start" applyCss={iconContainerStyles} flex="none">
					<Icon icon="fas fa-reply" />
				</Flex>

				<Block applyCss={{ marginTop: 0 }} flex="1" spaceVerticalSize="m">
					<AuthorAndTimestampLabel reviewAnnotation={reply} />

					<TextArea
						isDisabled={isDisabled}
						name="reply"
						ref={onFocusableRef}
						rows={rows}
						validate={validateReplyField}
					/>

					{error && (
						<ErrorToast
							error={error}
							onHideLinkClick={onHideLinkClick}
							onRefreshLinkClick={onRefreshLinkClick}
							onRetryLinkClick={onSubmit}
						/>
					)}
				</Block>
			</Flex>

			<Flex flexDirection="column" paddingSize={{ bottom: isLast ? 0 : 'm' }}>
				<HorizontalSeparationLine marginSizeBottom="m" marginSizeTop="m" />

				<Flex justifyContent="flex-end" spaceSize="l">
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancelButtonClick}
					/>

					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={
							isDisabled ||
							isLoading ||
							!valueByName.reply ||
							isSubmitDisabled ||
							(reply.error && reply.error.recovery !== RecoveryOption.RETRYABLE)
						}
						label={determineSaveButtonLabel(error, isEditing, isLoading)}
						onClick={onSubmit}
						type="primary"
					/>
				</Flex>
			</Flex>
		</Fragment>
	);
}

function ReplyForm({ isLast, reply, onCancel, onHide, onRefresh, onSubmit }) {
	const handleHideLinkClick = useCallback(() => onHide(reply.id), [onHide, reply.id]);
	const handleRefreshLinkClick = useCallback(() => onRefresh(reply.id), [onRefresh, reply.id]);

	const handleCancelButtonClick = useCallback(() => onCancel(reply.id), [onCancel, reply.id]);
	const handleSubmit = useCallback(valueByName => onSubmit(reply.id, valueByName), [
		onSubmit,
		reply.id
	]);

	return (
		<ReviewAnnotationForm
			key={reply.id}
			initialValueByName={reply.metadata}
			onSubmit={handleSubmit}
		>
			{({ isSubmitDisabled, onFocusableRef, onSubmit, valueByName }) => (
				<ReplyFormContent
					isLast={isLast}
					isSubmitDisabled={isSubmitDisabled}
					onCancelButtonClick={handleCancelButtonClick}
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
