import * as React from 'react';

import { Button, Flex } from 'fontoxml-design-system/src/components';
import type { FdsPaddingSize } from 'fontoxml-design-system/src/types';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import ResponsiveButtonSpacer from './ResponsiveButtonSpacer';

function determineSaveButtonLabel(
	error: ReviewAnnotationError,
	isLoading: boolean
): string {
	if (isLoading) {
		return t('Saving…');
	}

	return typeof error !== 'number' &&
		error &&
		error.recovery === ReviewRecoveryOption.RETRYABLE
		? t('Retry save')
		: t('Save');
}

type Props = {
	error: ReviewAnnotationError;
	isDisabled: boolean;
	isLoading: boolean;
	isSubmitDisabled: boolean;
	onCancel: ReviewCardContentComponentProps['onReviewAnnotationFormCancel'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onSubmit: ReviewCardContentComponentProps['onReviewAnnotationFormSubmit'];
};

const paddingSize: FdsPaddingSize = { top: 'l' };

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
