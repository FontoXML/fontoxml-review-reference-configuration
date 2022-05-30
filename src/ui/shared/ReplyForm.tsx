import * as React from 'react';

import {
	Block,
	Button,
	Flex,
	HorizontalSeparationLine,
	Icon,
	TextArea,
} from 'fontoxml-design-system/src/components';
import type { FormFeedback } from 'fontoxml-design-system/src/types';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
	ReviewReply,
} from 'fontoxml-feedback/src/types';
import {
	ReviewBusyState,
	ReviewRecoveryOption,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import { CARD_HEADER_HEIGHT } from './../constants';
import ResponsiveButtonSpacer from './ResponsiveButtonSpacer';

function determineSaveButtonLabel(
	error: ReviewAnnotationError,
	isEditing: boolean,
	isLoading: boolean
): string {
	if (
		typeof error !== 'number' &&
		error &&
		error.recovery === ReviewRecoveryOption.RETRYABLE
	) {
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

	return t('Save');
}

const rows = { minimum: 2, maximum: 6 };

function validateReplyField(value: string): FormFeedback {
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
}: {
	isSubmitDisabled: boolean;
	onCancelButtonClick(): void;
	onFocusableRef(): void;
	onHideLinkClick: ReviewCardContentComponentProps['onReplyErrorHide'];
	onRefreshLinkClick: ReviewCardContentComponentProps['onReplyRefresh'];
	onSubmit(): void;
	reply: ReviewReply;
}) {
	const isAdding = reply.busyState === ReviewBusyState.ADDING;
	const isEditing = reply.busyState === ReviewBusyState.EDITING;

	const error =
		typeof reply.error !== 'number' &&
		reply.error &&
		(isAdding || isEditing)
			? reply.error
			: null;

	const isDisabled =
		reply.isLoading ||
		(error && error.recovery !== ReviewRecoveryOption.RETRYABLE);
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
				<Button
					isDisabled={isDisabled}
					label={t('Cancel')}
					onClick={onCancelButtonClick}
				/>

				<ResponsiveButtonSpacer />

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
			</Flex>
		</Block>
	);
}

type Props = {
	onCancel: ReviewCardContentComponentProps['onReplyFormCancel'];
	onHide: ReviewCardContentComponentProps['onReplyErrorHide'];
	onRefresh: ReviewCardContentComponentProps['onReplyRefresh'];
	onSubmit: ReviewCardContentComponentProps['onReplyFormSubmit'];
	reply: ReviewReply;
};

function ReplyForm({ onCancel, onHide, onRefresh, onSubmit, reply }: Props) {
	const handleHideLinkClick = React.useCallback(() => {
		onHide(reply.id);
	}, [onHide, reply.id]);
	const handleRefreshLinkClick = React.useCallback(() => {
		onRefresh(reply.id);
	}, [onRefresh, reply.id]);

	const handleCancelButtonClick = React.useCallback(() => {
		onCancel(reply.id);
	}, [onCancel, reply.id]);
	const handleSubmit = React.useCallback(
		(valueByName) => {
			onSubmit(reply.id, valueByName);
		},
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
