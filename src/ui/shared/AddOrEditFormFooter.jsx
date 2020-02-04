import React from 'react';

import { Button, Flex, HorizontalSeparationLine } from 'fds/components';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import { RecoveryOption } from 'fontoxml-feedback/src/types.js';

import t from 'fontoxml-localization/src/t.js';

function determineSaveButtonLabel(error, isLoading) {
	if (isLoading) {
		return t('Saving…');
	}

	return error && error.recovery === RecoveryOption.RETRYABLE ? t('Retry save') : t('Save');
}

function AddOrEditFormFooter({
	error,
	isDisabled,
	isLoading,
	isSubmitDisabled,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit
}) {
	return (
		<Flex flexDirection="column" paddingSize={{ top: 'm' }} spaceSize="m">
			{error && (
				<ErrorToast
					error={error}
					onRefreshLinkClick={onReviewAnnotationRefresh}
					onRetryLinkClick={onSubmit}
				/>
			)}

			<HorizontalSeparationLine />

			<Flex justifyContent="flex-end" spaceSize="m">
				<Button isDisabled={isDisabled} label={t('Cancel')} onClick={onCancel} />

				<Button
					icon={isLoading ? 'spinner' : null}
					isDisabled={isDisabled || isSubmitDisabled}
					label={determineSaveButtonLabel(error, isLoading)}
					onClick={onSubmit}
					type="primary"
				/>
			</Flex>
		</Flex>
	);
}

export default AddOrEditFormFooter;
