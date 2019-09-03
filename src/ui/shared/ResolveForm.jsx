import React, { Fragment } from 'react';

import {
	Block,
	Button,
	Flex,
	FormRow,
	HorizontalSeparationLine,
	Icon,
	RadioButtonGroup,
	TextArea
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { RecoveryOption } from 'fontoxml-feedback/src/types.js';

import t from 'fontoxml-localization/src/t.js';

import resolutions from '../feedbackResolutions.jsx';

const rows = { minimum: 2, maximum: 6 };

function determineSaveButtonLabel(error, isLoading) {
	if (isLoading) {
		return t('Resolving…');
	}

	return error && error.recovery === RecoveryOption.RETRYABLE ? t('Retry resolve') : t('Resolve');
}

function validateResolutionField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Resolution is required.' };
	}

	return null;
}

// negative margin to align the icon with the reply icons above (if any)
const iconContainerStyles = { marginLeft: '-26px' };

export default function ResolveForm({
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading || (error && error.recovery !== RecoveryOption.RETRYABLE);
	const isLoading = reviewAnnotation.isLoading;

	return (
		<ReviewAnnotationForm
			key={reviewAnnotation.id}
			initialValueByName={reviewAnnotation.resolvedMetadata}
			onSubmit={onSubmit}
		>
			{({ isSubmitDisabled, onFocusableRef, onSubmit }) => (
				<Fragment>
					<HorizontalSeparationLine />

					<Block applyCss={{ paddingLeft: '26px', paddingTop: '4px' }}>
						<Flex
							alignItems="flex-start"
							applyCss={iconContainerStyles}
							flex="none"
							spaceSize="m"
						>
							<Block applyCss={{ marginTop: '6px' }}>
								<Icon icon="check" colorName="icon-s-muted-color" />
							</Block>

							<FormRow
								label="Resolve and:"
								hasRequiredAsterisk
								isLabelBold
								labelColorName="text-color"
							>
								<RadioButtonGroup
									isDisabled={isDisabled}
									items={resolutions}
									name="resolution"
									ref={onFocusableRef}
									validate={validateResolutionField}
								/>
							</FormRow>
						</Flex>

						<Block applyCss={{ marginTop: '.25rem' }}>
							<TextArea
								isDisabled={isDisabled}
								name="resolutionComment"
								placeholder={t(
									'Optionally describe how or why you resolved this comment…'
								)}
								rows={rows}
							/>
						</Block>

						<Flex flexDirection="column" paddingSize={{ top: 'm' }} spaceSize="m">
							{error && (
								<ErrorToast
									error={error}
									onRefreshLinkClick={onReviewAnnotationRefresh}
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
									isDisabled={
										isDisabled ||
										isLoading ||
										isSubmitDisabled ||
										(reviewAnnotation.error &&
											reviewAnnotation.error.recovery !==
												RecoveryOption.RETRYABLE)
									}
									label={determineSaveButtonLabel(error, isLoading)}
									onClick={onSubmit}
									type="primary"
								/>
							</Flex>
						</Flex>
					</Block>
				</Fragment>
			)}
		</ReviewAnnotationForm>
	);
}
