import React, { Fragment, useCallback } from 'react';

import { Block, Button, Flex, HorizontalSeparationLine, Icon, Label } from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types.js';
import useAuthorAndTimestampLabel from 'fontoxml-feedback/src/useAuthorAndTimestampLabel.jsx';

import t from 'fontoxml-localization/src/t.js';

// 2px to visually align the reply icon nicely to the authorLabel
const iconContainerStyles = { marginTop: '2px' };

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

export default function ReplyAddOrEditForm({
	ContentComponent,
	isLast,
	reply,
	onCancel,
	onHide,
	onRefresh,
	onSubmit
}) {
	const isAdding = reply.busyState === BusyState.ADDING;
	const isEditing = reply.busyState === BusyState.EDITING;

	const error = reply.error && (isAdding || isEditing) ? reply.error : null;
	const isDisabled = reply.isLoading || (error && error.recovery !== RecoveryOption.RETRYABLE);
	const isLoading = reply.isLoading && (isAdding || isEditing);

	const handleHideLinkClick = useCallback(() => onHide(reply.id), [onHide, reply.id]);
	const handleRefreshLinkClick = useCallback(() => onRefresh(reply.id), [onRefresh, reply.id]);

	const handleCancelButtonClick = useCallback(() => onCancel(reply.id), [onCancel, reply.id]);
	const handleSubmit = useCallback(valueByName => onSubmit(reply.id, valueByName), [
		onSubmit,
		reply.id
	]);

	const authorAndTimestampLabel = useAuthorAndTimestampLabel(reply);

	return (
		<ReviewAnnotationForm
			key={reply.id}
			initialValueByName={reply.metadata}
			onSubmit={handleSubmit}
		>
			{({ isSubmitDisabled, onFieldChange, onFocusableRef, onSubmit }) => (
				<Fragment>
					<HorizontalSeparationLine />

					<Flex
						flex="none"
						paddingSize={isLast ? { top: 'm' } : { vertical: 'm' }}
						spaceSize="m"
					>
						<Flex alignItems="flex-start" applyCss={iconContainerStyles} flex="none">
							<Icon icon="reply" colorName="icon-s-muted-color" />
						</Flex>

						<Block applyCss={{ marginTop: '-0.25rem' }} flex="1" spaceVerticalSize="m">
							<Block spaceVerticalSize="s">
								{isEditing && (
									<Label colorName="text-muted-color">
										{authorAndTimestampLabel}
									</Label>
								)}

								<ContentComponent
									isDisabled={isDisabled}
									isEditing={isEditing}
									onFieldChange={onFieldChange}
									onFocusableRef={onFocusableRef}
								/>
							</Block>

							{error && (
								<ErrorToast
									error={error}
									onHideLinkClick={handleHideLinkClick}
									onRefreshLinkClick={handleRefreshLinkClick}
								/>
							)}

							<HorizontalSeparationLine />

							<Flex justifyContent="flex-end" spaceSize="m">
								<Button
									isDisabled={isDisabled}
									label={t('Cancel')}
									onClick={handleCancelButtonClick}
								/>

								<Button
									icon={isLoading ? 'spinner' : null}
									isDisabled={
										isDisabled ||
										isLoading ||
										isSubmitDisabled ||
										(reply.error &&
											reply.error.recovery !== RecoveryOption.RETRYABLE)
									}
									label={determineSaveButtonLabel(error, isEditing, isLoading)}
									onClick={onSubmit}
									type="primary"
								/>
							</Flex>
						</Block>
					</Flex>
				</Fragment>
			)}
		</ReviewAnnotationForm>
	);
}
