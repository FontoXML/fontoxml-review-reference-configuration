import * as React from 'react';

import { Block, Button, Flex } from 'fds/components';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { RecoveryOption } from 'fontoxml-feedback/src/types';

import t from 'fontoxml-localization/src/t';

function determineSaveButtonLabel(error, isLoading) {
	if (isLoading) {
		return t('Saving…');
	}

	return error && error.recovery === RecoveryOption.RETRYABLE
		? t('Retry save')
		: t('Save');
}

function AddOrEditFormFooter({
	error,
	isDisabled,
	isLoading,
	isSubmitDisabled,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
}) {
	return (
		<Flex flexDirection="column" paddingSize={{ top: 'l' }} spaceSize="m">
			{error && (
				<ErrorToast
					error={error}
					onRefreshLinkClick={onReviewAnnotationRefresh}
					onRetryLinkClick={onSubmit}
				/>
			)}

			<Flex justifyContent="flex-end" spaceSize="l">
				<Block flex="0 1 auto">
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancel}
					/>
				</Block>

				<Block flex="0 1 auto">
					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={isDisabled || isSubmitDisabled}
						label={determineSaveButtonLabel(error, isLoading)}
						onClick={onSubmit}
						type="primary"
					/>
				</Block>
			</Flex>
		</Flex>
	);
}

export default AddOrEditFormFooter;
