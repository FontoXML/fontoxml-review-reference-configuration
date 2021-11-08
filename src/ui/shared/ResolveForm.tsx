import React, { Fragment } from 'react';

import {
	Block,
	Button,
	Flex,
	FormRow,
	HorizontalSeparationLine,
	Icon,
	RadioButtonGroup,
	Text,
	TextArea,
	Toast
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton.jsx';
import {
	AnnotationStatus,
	ProposalState as ProposalStateTypes,
	RecoveryOption
} from 'fontoxml-feedback/src/types.js';
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
	onProposalMerge = null,
	onReviewAnnotationRefresh,
	onSubmit,
	proposalState = null
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
			{({ isSubmitDisabled, onFocusableRef, onSubmit, valueByName }) => {
				const isRejectingMergedProposal =
					reviewAnnotation.type === 'proposal' &&
					proposalState === ProposalStateTypes.MERGED &&
					valueByName.resolution === 'rejected';
				const isAcceptingUnmergedProposal =
					reviewAnnotation.type === 'proposal' &&
					proposalState === ProposalStateTypes.ENABLED &&
					valueByName.resolution === 'accepted';
				const isAcceptingChangedProposal =
					reviewAnnotation.type === 'proposal' &&
					proposalState !== ProposalStateTypes.ENABLED &&
					proposalState !== ProposalStateTypes.MERGING &&
					proposalState !== ProposalStateTypes.MERGED &&
					valueByName.resolution === 'accepted';

				return (
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
									<Icon icon="check" />
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

									<TextArea
										isDisabled={isDisabled}
										name="resolutionComment"
										placeholder={t(
											'Optionally describe how or why you resolved this comment'
										)}
										rows={rows}
									/>

									{error && (
										<ErrorToast
											error={error}
											onRefreshLinkClick={onReviewAnnotationRefresh}
											onRetryLinkClick={onSubmit}
										/>
									)}

									{isRejectingMergedProposal && (
										<Toast
											icon="info-circle"
											connotation="info"
											content={
												<Text colorName="text-info-color">
													{t(
														'Are you sure you want to mark this as rejected? The proposed change was applied.'
													)}
												</Text>
											}
										/>
									)}
									{isAcceptingUnmergedProposal && (
										<Toast
											icon="info-circle"
											connotation="info"
											content={
												<Text colorName="text-info-color">
													{t(
														'Are you sure you want to mark this as accepted? The proposed change was not applied.'
													)}
												</Text>
											}
										/>
									)}
									{isAcceptingChangedProposal && (
										<Toast
											icon="info-circle"
											connotation="info"
											content={
												<Text colorName="text-info-color">
													{t(
														'Please check if the proposed change has been applied to the text before accepting.'
													)}
												</Text>
											}
										/>
									)}
								</FormRow>
							</Flex>
						</Block>

						<Flex flexDirection="column">
							<HorizontalSeparationLine marginSizeBottom="m" marginSizeTop="m" />

							<Flex justifyContent="flex-end" spaceSize="l">
								<Button
									isDisabled={isDisabled}
									label={t('Cancel')}
									onClick={onCancel}
								/>

								{reviewAnnotation.type === 'proposal' &&
									reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
									onProposalMerge && (
										<ReviewAnnotationAcceptProposalButton
											onProposalMerge={onProposalMerge}
											proposalState={proposalState}
										/>
									)}

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
					</Fragment>
				);
			}}
		</ReviewAnnotationForm>
	);
}
