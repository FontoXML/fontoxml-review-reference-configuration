import { Button, Flex } from 'fds/components';
import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { AnnotationError, CardContentComponentProps, RecoveryOption } from 'fontoxml-feedback/src/types';

import t from 'fontoxml-localization/src/t';

import ResponsiveButtonSpacer from './ResponsiveButtonSpacer';
import { PaddingSize } from 'fontoxml-design-system/src/types';

function determineSaveButtonLabel(
	error: AnnotationError,
	isLoading: boolean
): string {
	if (isLoading) {
		return t('Saving…');
	}

	return typeof error !== 'number' && 
		error &&
		error.recovery === RecoveryOption.RETRYABLE
		? t('Retry save')
		: t('Save');
}

type Props = {
	error: AnnotationError;
	isDisabled: boolean;
	isLoading: boolean;
	isSubmitDisabled: boolean;
	onCancel: CardContentComponentProps['onReviewAnnotationFormCancel'];
	onReviewAnnotationRefresh: CardContentComponentProps['onReviewAnnotationRefresh'];
	onSubmit: CardContentComponentProps['onReviewAnnotationFormSubmit'];
};

const paddingSize: PaddingSize = { top: 'l' };

function AddOrEditFormFooter({
	error,
	isDisabled,
	isLoading,
	isSubmitDisabled,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
}: Props) {
	const handleSubmit = React.useCallback(() => {
		onSubmit({});
	}, [onSubmit]);

	const saveButtonLabel = React.useMemo(() => {
		return determineSaveButtonLabel(error, isLoading);
	}, [error, isLoading]);

	return (
		<Flex flexDirection="column" paddingSize={paddingSize} spaceSize="m">
			{error && (
				<ErrorToast
					error={error && typeof error !== 'number' ? error : null}
					onRefreshLinkClick={onReviewAnnotationRefresh}
					onRetryLinkClick={onSubmit}
				/>
			)}

			<Flex justifyContent="flex-end">
				<Button
					isDisabled={isDisabled}
					label={t('Cancel')}
					onClick={onCancel}
				/>

				<ResponsiveButtonSpacer />

				<Button
					icon={isLoading ? 'spinner' : null}
					isDisabled={isDisabled || isLoading || isSubmitDisabled}
					label={saveButtonLabel}
					onClick={handleSubmit}
					type="primary"
				/>
			</Flex>
		</Flex>
	);
}

export default AddOrEditFormFooter;
