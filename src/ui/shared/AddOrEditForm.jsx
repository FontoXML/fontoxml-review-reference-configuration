import React, { Fragment } from 'react';

import { Button, Flex, HorizontalSeparationLine } from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types.js';

import t from 'fontoxml-localization/src/t.js';

function determineSaveButtonLabel(error, isLoading) {
	if (isLoading) {
		return t('Saving…');
	}

	return error && error.recovery === RecoveryOption.RETRYABLE ? t('Retry save') : t('Save');
}

export default function AddOrEditForm({
	ContentComponent,
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading || (error && error.recovery !== RecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === BusyState.EDITING;
	const isLoading = reviewAnnotation.isLoading;

	return (
		<ReviewAnnotationForm initialValueByName={reviewAnnotation.metadata} onSubmit={onSubmit}>
			{({ isSubmitDisabled, onFieldChange, onFocusableRef, onSubmit, valueByName }) => (
				<Fragment>
					<ContentComponent
						isDisabled={isDisabled}
						isEditing={isEditing}
						onFieldChange={onFieldChange}
						onFocusableRef={onFocusableRef}
						originalText={reviewAnnotation.originalText}
						reviewAnnotation={reviewAnnotation}
						valueByName={valueByName}
					/>

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
							<Button
								isDisabled={isDisabled}
								label={t('Cancel')}
								onClick={onCancel}
							/>

							<Button
								icon={isLoading ? 'spinner' : null}
								isDisabled={isDisabled || isSubmitDisabled}
								label={determineSaveButtonLabel(error, isLoading)}
								onClick={onSubmit}
								type="primary"
							/>
						</Flex>
					</Flex>
				</Fragment>
			)}
		</ReviewAnnotationForm>
	);
}
