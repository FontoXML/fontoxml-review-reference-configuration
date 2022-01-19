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
	Toast,
} from 'fds/components';
import * as React from 'react';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import {
	AnnotationStatus,
	ProposalState as ProposalStateTypes,
	RecoveryOption,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import resolutions from '../feedbackResolutions';
import ResponsiveButtonSpacer from './ResponsiveButtonSpacer';

const rows = { minimum: 2, maximum: 6 };

function determineSaveButtonLabel(error, isLoading) {
	if (isLoading) {
		return t('Resolving…');
	}

	return error && error.recovery === RecoveryOption.RETRYABLE
		? t('Retry resolve')
		: t('Resolve');
}

function validateResolutionField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Resolution is required.' };
	}

	return null;
}

function ResolveFormContent({
	isSubmitDisabled,
	onCancel,
	onFocusableRef,
	onProposalMerge,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
	valueByName,
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(error && error.recovery !== RecoveryOption.RETRYABLE);
	const isLoading = reviewAnnotation.isLoading;

	const proposalState = reviewAnnotation.proposalState;

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
		<Block spaceVerticalSize="m">
			<HorizontalSeparationLine />

			<Block spaceVerticalSize="l">
				<Flex flexDirection="column" spaceSize="s">
					<Flex
						alignItems="center"
						flexDirection="row"
						justifyContent="flex-start"
						spaceSize="s"
					>
						<Icon icon="check" />

						<FormRow
							label={t('Resolve and')}
							hasRequiredAsterisk
							labelColorName="text-color"
							isLabelBold
						/>
					</Flex>

					<RadioButtonGroup
						isDisabled={isDisabled}
						items={resolutions}
						name="resolution"
						ref={onFocusableRef}
						validate={validateResolutionField}
					/>
				</Flex>

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

				<Flex justifyContent="flex-end">
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancel}
					/>

					<ResponsiveButtonSpacer />

					{reviewAnnotation.type === 'proposal' &&
						reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
						onProposalMerge &&
						proposalState && (
							<Block flex="0 1 auto">
								<ReviewAnnotationAcceptProposalButton
									onProposalMerge={onProposalMerge}
									proposalState={proposalState}
								/>
							</Block>
						)}

					<ResponsiveButtonSpacer />

					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={isDisabled || isLoading || isSubmitDisabled}
						label={determineSaveButtonLabel(error, isLoading)}
						onClick={onSubmit}
						type="primary"
					/>
				</Flex>
			</Block>
		</Block>
	);
}

export default function ResolveForm({
	reviewAnnotation,
	onCancel,
	onProposalMerge = null,
	onReviewAnnotationRefresh,
	onSubmit,
}) {
	return (
		<ReviewAnnotationForm
			initialValueByName={reviewAnnotation.resolvedMetadata}
			key={reviewAnnotation.id}
			onSubmit={onSubmit}
		>
			{({ isSubmitDisabled, onFocusableRef, onSubmit, valueByName }) => (
				<ResolveFormContent
					isSubmitDisabled={isSubmitDisabled}
					onCancel={onCancel}
					onFocusableRef={onFocusableRef}
					onProposalMerge={onProposalMerge}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onSubmit={onSubmit}
					reviewAnnotation={reviewAnnotation}
					valueByName={valueByName}
				/>
			)}
		</ReviewAnnotationForm>
	);
}
