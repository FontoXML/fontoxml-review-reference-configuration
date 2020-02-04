import React, { useCallback } from 'react';

import { FormRow, Label, TextArea } from 'fds/components';
import useAuthorAndTimestampLabel from 'fontoxml-feedback/src/useAuthorAndTimestampLabel.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types.js';

import ReplyFormContainer from '../shared/ReplyFormContainer.jsx';
import ReplyFormFooter from '../shared/ReplyFormFooter.jsx';

const rows = { minimum: 2, maximum: 6 };

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

	const authorAndTimestampLabel = useAuthorAndTimestampLabel(reply);

	return (
		<ReplyFormContainer isLast={isLast}>
			{isEditing && <Label colorName="text-muted-color">{authorAndTimestampLabel}</Label>}

			<FormRow label="Reply" hasRequiredAsterisk isLabelBold labelColorName="text-color">
				<TextArea
					isDisabled={isDisabled}
					name="reply"
					ref={onFocusableRef}
					rows={rows}
					validate={validateReplyField}
				/>
			</FormRow>

			<ReplyFormFooter
				error={error}
				isDisabled={isDisabled}
				isEditing={isEditing}
				isLoading={isLoading}
				isSubmitDisabled={!valueByName.reply || isSubmitDisabled}
				onCancelButtonClick={onCancelButtonClick}
				onHideLinkClick={onHideLinkClick}
				onRefreshLinkClick={onRefreshLinkClick}
				onSubmit={onSubmit}
				reply={reply}
			/>
		</ReplyFormContainer>
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
