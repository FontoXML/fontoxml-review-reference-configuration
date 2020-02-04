import React from 'react';

import { Button, Flex, HorizontalSeparationLine } from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import { RecoveryOption } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

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

function ReplyFormFooter({
	error,
	isDisabled,
	isEditing,
	isLoading,
	isSubmitDisabled,
	onCancelButtonClick,
	onHideLinkClick,
	onRefreshLinkClick,
	onSubmit,
	reply
}) {
	return (
		<Flex flexDirection="column" spaceSize="m">
			{error && (
				<ErrorToast
					error={error}
					onHideLinkClick={onHideLinkClick}
					onRefreshLinkClick={onRefreshLinkClick}
				/>
			)}

			<HorizontalSeparationLine />

			<Flex justifyContent="flex-end" spaceSize="m">
				<Button isDisabled={isDisabled} label={t('Cancel')} onClick={onCancelButtonClick} />

				<Button
					icon={isLoading ? 'spinner' : null}
					isDisabled={
						isDisabled ||
						isLoading ||
						isSubmitDisabled ||
						(reply.error && reply.error.recovery !== RecoveryOption.RETRYABLE)
					}
					label={determineSaveButtonLabel(error, isEditing, isLoading)}
					onClick={onSubmit}
					type="primary"
				/>
			</Flex>
		</Flex>
	);
}

export default ReplyFormFooter;
