import * as React from 'react';

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
} from 'fontoxml-design-system/src/components';
import type {
	FdsFormFeedback,
	FdsFormValueByName,
} from 'fontoxml-design-system/src/types';
import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import ReviewProposalState from 'fontoxml-feedback/src/ReviewProposalState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import resolutions from '../feedbackResolutions';

const footerButtonContainerStyles = { height: '32px' };

const rows = { minimum: 2, maximum: 6 };

function determineSaveButtonLabel(
	error: ReviewAnnotationError,
	isLoading: boolean
): string {
	if (isLoading) {
		return t('Resolving…');
	}

	return typeof error !== 'number' &&
		error &&
		error.recovery === ReviewRecoveryOption.RETRYABLE
		? t('Retry resolve')
		: t('Resolve');
}

function validateResolutionField(value: unknown): FdsFormFeedback | null {
	if (!value) {
		return { connotation: 'error', message: 'Resolution is required.' };
	}

	return null;
}

function ResolveFormContent({
	context,
	isSubmitDisabled,
	onCancel,
	onProposalMerge,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
	valueByName,
}: Props & {
	isSubmitDisabled: boolean;
	valueByName: FdsFormValueByName;
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(typeof error !== 'number' &&
			error &&
			error.recovery !== ReviewRecoveryOption.RETRYABLE);
	const isLoading = reviewAnnotation.isLoading;

	const proposalState = reviewAnnotation.proposalState;

	const isRejectingMergedProposal =
		reviewAnnotation.type === 'proposal' &&
		proposalState === ReviewProposalState.MERGED &&
		valueByName.resolution === 'rejected';
	const isAcceptingUnmergedProposal =
		reviewAnnotation.type === 'proposal' &&
		proposalState === ReviewProposalState.ENABLED &&
		valueByName.resolution === 'accepted';
	const isAcceptingChangedProposal =
		reviewAnnotation.type === 'proposal' &&
		proposalState !== ReviewProposalState.ENABLED &&
		proposalState !== ReviewProposalState.MERGING &&
		proposalState !== ReviewProposalState.MERGED &&
		valueByName.resolution === 'accepted';

	const isInReview =
		context === FeedbackContextType.REVIEW ||
		context === FeedbackContextType.REVIEW_SHARING;

	const handleResolveButtonClick = React.useCallback(
		(_event: MouseEvent) => {
			onSubmit(valueByName);
		},
		[onSubmit, valueByName]
	);

	return (
		<Block dataTestId="resolve-form" spaceVerticalSize="m">
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
						validate={validateResolutionField}
					/>
				</Flex>

				<TextArea
					dataTestId="resolve-form-text"
					isDisabled={isDisabled}
					name="resolutionComment"
					placeholder={t(
						'Optionally describe how or why you resolved this comment'
					)}
					rows={rows}
				/>

				{error && (
					<ErrorToast
						error={typeof error !== 'number' ? error : null}
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

				<Flex
					alignItems="center"
					applyCss={footerButtonContainerStyles}
					justifyContent="flex-end"
					spaceSize="m"
				>
					<Button
						isDisabled={isDisabled}
						label={t('Cancel')}
						onClick={onCancel}
					/>

					{!isInReview &&
						reviewAnnotation.type === 'proposal' &&
						reviewAnnotation.status !==
							ReviewAnnotationStatus.RESOLVED &&
						onProposalMerge &&
						proposalState && (
							<ReviewAnnotationAcceptProposalButton
								onProposalMerge={onProposalMerge}
								proposalState={proposalState}
							/>
						)}

					<Button
						icon={isLoading ? 'spinner' : null}
						isDisabled={isDisabled || isLoading || isSubmitDisabled}
						label={determineSaveButtonLabel(error, isLoading)}
						onClick={handleResolveButtonClick}
						type="primary"
					/>
				</Flex>
			</Block>
		</Block>
	);
}

type Props = {
	context: ReviewCardContentComponentProps['context'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
	onCancel: ReviewCardContentComponentProps['onReviewAnnotationFormCancel'];
	onProposalMerge: ReviewCardContentComponentProps['onProposalMerge'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onSubmit(valueByName: FdsFormValueByName): void;
};

const ResolveForm: React.FC<Props> = ({
	context,
	reviewAnnotation,
	onCancel,
	onProposalMerge = null,
	onReviewAnnotationRefresh,
	onSubmit,
}) => {
	return (
		<ReviewAnnotationForm
			initialValueByName={reviewAnnotation.resolvedMetadata}
			key={reviewAnnotation.id}
			onSubmit={onSubmit}
		>
			{({ isSubmitDisabled, onSubmit, valueByName }) => (
				<ResolveFormContent
					context={context}
					isSubmitDisabled={isSubmitDisabled}
					onCancel={onCancel}
					onProposalMerge={onProposalMerge}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onSubmit={onSubmit}
					reviewAnnotation={reviewAnnotation}
					valueByName={valueByName}
				/>
			)}
		</ReviewAnnotationForm>
	);
};

export default ResolveForm;
