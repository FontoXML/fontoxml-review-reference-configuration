import * as React from 'react';

import {
	Block,
	Button,
	Flex,
	HorizontalSeparationLine,
	Icon,
	TextArea,
} from 'fontoxml-design-system/src/components';
import type {
	FdsFormFeedback,
	FdsFormValueByName,
} from 'fontoxml-design-system/src/types';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
	ReviewReply,
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

function validateReplyField(value: string): FdsFormFeedback | null {
	if (!value || value.trim() === '') {
		return { connotation: 'error', message: 'Reply is required.' };
	}

	return null;
}

type ReplyFormContentProps = {
	focusableRef: React.MutableRefObject<HTMLElement>;
	isSubmitDisabled: boolean;
	onFieldChange(...args: unknown[]): void;
	onCancelButtonClick(): void;
	onHideLinkClick: ReviewCardContentComponentProps['onReplyErrorHide'];
	onRefreshLinkClick: ReviewCardContentComponentProps['onReplyRefresh'];
	onSubmit(valueByName?: FdsFormValueByName): void;
	reply: ReviewReply;
	valueByName: FdsFormValueByName;
};

const ReplyFormContent: React.FC<ReplyFormContentProps> = ({
	focusableRef,
	isSubmitDisabled,
	onCancelButtonClick,
	onFieldChange,
	onHideLinkClick,
	onRefreshLinkClick,
	onSubmit,
	reply,
	valueByName,
}) => {
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

	const handleReplyDirChange = React.useCallback(
		(dir) => {
			onFieldChange({ name: 'reply.dir', value: dir, feedback: null });
		},
		[onFieldChange]
	);

	const handleReplyButtonClick = React.useCallback(
		(_event: MouseEvent) => {
			onSubmit(valueByName);
		},
		[onSubmit, valueByName]
	);

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
					dir={valueByName['reply.dir']}
					isDisabled={isDisabled}
					name="reply"
					onDirChange={handleReplyDirChange}
					ref={focusableRef}
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
					onClick={handleReplyButtonClick}
					type="primary"
				/>
			</Flex>
		</Block>
	);
};

type ReplyFormProps = {
	focusableRef: React.MutableRefObject<HTMLElement>;
	onCancel: ReviewCardContentComponentProps['onReplyFormCancel'];
	onHide: ReviewCardContentComponentProps['onReplyErrorHide'];
	onRefresh: ReviewCardContentComponentProps['onReplyRefresh'];
	onSubmit: ReviewCardContentComponentProps['onReplyFormSubmit'];
	reply: ReviewReply;
};

const ReplyForm: React.FC<ReplyFormProps> = ({
	focusableRef,
	onCancel,
	onHide,
	onRefresh,
	onSubmit,
	reply,
}) => {
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
			{({ isSubmitDisabled, onFieldChange, onSubmit, valueByName }) => (
				<ReplyFormContent
					focusableRef={focusableRef}
					isSubmitDisabled={isSubmitDisabled}
					onCancelButtonClick={handleCancelButtonClick}
					onFieldChange={onFieldChange}
					onHideLinkClick={handleHideLinkClick}
					onRefreshLinkClick={handleRefreshLinkClick}
					onSubmit={onSubmit}
					reply={reply}
					valueByName={valueByName}
				/>
			)}
		</ReviewAnnotationForm>
	);
};

export default ReplyForm;
