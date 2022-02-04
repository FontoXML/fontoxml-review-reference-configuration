import {
	Block,
	Flex,
	FormRow,
	Icon,
	TextArea,
	TextAreaWithDiff,
} from 'fds/components';
import * as React from 'react';

import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AddOrEditFormFooter from '../shared/AddOrEditFormFooter';

function validateProposedChangeField(value, originalText) {
	if (value === originalText) {
		return {
			connotation: 'error',
			message: 'Proposed change is required.',
		};
	}

	return null;
}

const rows = { minimum: 2, maximum: 6 };

function ProposalAddOrEditFormContent({
	isSubmitDisabled,
	onFieldChange,
	onFocusableRef,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(error && error.recovery !== RecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === BusyState.EDITING;
	const isLoading = reviewAnnotation.isLoading;

	const originalText = reviewAnnotation.originalText;

	const validate = React.useCallback(
		(value) => validateProposedChangeField(value, originalText),
		[originalText]
	);

	React.useEffect(() => {
		if (!isEditing) {
			onFieldChange({
				name: 'proposedChange',
				value: originalText,
				feedback: validate(originalText),
			});
		}
	}, [isEditing, onFieldChange, originalText, validate]);

	return (
		<>
			<Block spaceVerticalSize="l">
				<FormRow
					label={
						<Flex alignItems="center" isInline spaceSize="s">
							<Icon icon="fal fa-pencil-square-o" isInline />

							<Block data-test-id="comment-type-label" isInline>
									{t('Proposed change')}
							</Block>
						</Flex>
					}
					hasRequiredAsterisk
					isLabelBold
					labelColorName="text-color"
				>
					<TextAreaWithDiff
						isDisabled={isDisabled}
						name="proposedChange"
						originalValue={originalText}
						placeholder={t(
							'Leave empty to propose removing the selected content'
						)}
						ref={onFocusableRef}
						rows={rows}
						validate={validate}
						data-test-id='comment'
					/>
				</FormRow>

				<FormRow
					label={t('Motivation')}
					isLabelBold
					labelColorName="text-color"
				>
					<TextArea
						isDisabled={isDisabled}
						name="comment"
						rows={rows}
						placeholder={t('Motivate your proposal')}
						data-test-id='motivation'
					/>
				</FormRow>
			</Block>

			<AddOrEditFormFooter
				error={error}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isSubmitDisabled={isSubmitDisabled}
				onCancel={onCancel}
				onReviewAnnotationRefresh={onReviewAnnotationRefresh}
				onSubmit={onSubmit}
			/>
		</>
	);
}

function ProposalAddOrEditForm({
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
}) {
	return (
		<ReviewAnnotationForm
			initialValueByName={reviewAnnotation.metadata}
			onSubmit={onSubmit}
		>
			{({
				isSubmitDisabled,
				onFieldChange,
				onFocusableRef,
				onSubmit,
			}) => (
				<ProposalAddOrEditFormContent
					isSubmitDisabled={isSubmitDisabled}
					onFieldChange={onFieldChange}
					onFocusableRef={onFocusableRef}
					onCancel={onCancel}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onSubmit={onSubmit}
					reviewAnnotation={reviewAnnotation}
				/>
			)}
		</ReviewAnnotationForm>
	);
}

export default ProposalAddOrEditForm;
