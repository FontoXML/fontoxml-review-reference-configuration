import React, { useEffect, Fragment } from 'react';

import { Block, Icon, FormRow, TextArea, TextAreaWithDiff } from 'fds/components';

import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm.jsx';
import { BusyState, RecoveryOption } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

import AddOrEditFormFooter from '../shared/AddOrEditFormFooter.jsx';

function validateProposedChangeField(value, originalText) {
	if (value === originalText) {
		return { connotation: 'error', message: 'Proposed change is required.' };
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
	valueByName
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading || (error && error.recovery !== RecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === BusyState.EDITING;
	const isLoading = reviewAnnotation.isLoading;

	const originalText = reviewAnnotation.originalText;

	const proposedChangeIsModified = valueByName.proposedChange !== originalText;

	useEffect(() => {
		if (!isEditing) {
			onFieldChange({
				name: 'proposedChange',
				value: originalText,
				feedback: validateProposedChangeField(originalText, originalText)
			});
		}
	}, [isEditing, onFieldChange, originalText]);

	return (
		<Fragment>
			<FormRow
				label={
					<Block isInline spaceHorizontalSize="s">
						<Block isInline>
							<Icon icon="pencil-square-o" />
						</Block>

						<span>Proposed change</span>
					</Block>
				}
				hasRequiredAsterisk
				isLabelBold
				labelColorName="text-color"
			>
				<TextAreaWithDiff
					isDisabled={isDisabled}
					name="proposedChange"
					originalValue={originalText}
					placeholder={t('Leave empty to propose removing the selected content')}
					ref={onFocusableRef}
					rows={rows}
					validate={value => validateProposedChangeField(value, originalText)}
				/>
			</FormRow>

			<FormRow label="Motivation" isLabelBold labelColorName="text-color">
				<TextArea
					isDisabled={isDisabled}
					name="comment"
					rows={rows}
					placeholder={t('Motivate your proposal')}
				/>
			</FormRow>

			<AddOrEditFormFooter
				error={error}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isSubmitDisabled={!proposedChangeIsModified || isSubmitDisabled}
				onCancel={onCancel}
				onReviewAnnotationRefresh={onReviewAnnotationRefresh}
				onSubmit={onSubmit}
			/>
		</Fragment>
	);
}

function ProposalAddOrEditForm({
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit
}) {
	return (
		<ReviewAnnotationForm initialValueByName={reviewAnnotation.metadata} onSubmit={onSubmit}>
			{({ isSubmitDisabled, onFieldChange, onFocusableRef, onSubmit, valueByName }) => (
				<ProposalAddOrEditFormContent
					isSubmitDisabled={isSubmitDisabled}
					onFieldChange={onFieldChange}
					onFocusableRef={onFocusableRef}
					onCancel={onCancel}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onSubmit={onSubmit}
					reviewAnnotation={reviewAnnotation}
					valueByName={valueByName}
				/>
			)}
		</ReviewAnnotationForm>
	);
}

export default ProposalAddOrEditForm;
