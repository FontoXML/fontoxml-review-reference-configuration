import * as React from 'react';

import {
	Block,
	Flex,
	FormRow,
	Icon,
	TextArea,
	TextAreaWithDiff,
} from 'fontoxml-design-system/src/components';
import type { FdsFormFeedback } from 'fontoxml-design-system/src/types';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AddOrEditFormFooter from '../shared/AddOrEditFormFooter';

function validateProposedChangeField(
	value: string,
	originalText: string
): FdsFormFeedback {
	if (value === originalText) {
		return {
			connotation: 'error',
			message: 'Proposed change is required.',
		};
	}

	return null;
}

const rows = { minimum: 2, maximum: 6 };

const ProposalAddOrEditFormContent: React.FC<Props & {
	focusableRef: React.MutableRefObject<HTMLElement>;
	isSubmitDisabled: boolean;
	onFieldChange(...args: unknown[]): void;
}> = ({
	focusableRef,
	isSubmitDisabled,
	onCancel,
	onFieldChange,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
}) => {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(typeof error !== 'number' &&
			error &&
			error.recovery !== ReviewRecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === ReviewBusyState.EDITING;
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

	const handleProposalDirChange = React.useCallback(
		(dir) => {
			onFieldChange({
				name: 'proposedChange.dir',
				value: dir,
				feedback: null,
			});
		},
		[onFieldChange]
	);

	const handleCommentDirChange = React.useCallback(
		(dir) => {
			onFieldChange({ name: 'comment.dir', value: dir, feedback: null });
		},
		[onFieldChange]
	);

	return (
		<>
			<Block spaceVerticalSize="l">
				<FormRow
					label={
						<Flex alignItems="center" isInline spaceSize="s">
							<Icon icon="far fa-pencil-square-o" isInline />

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
						dir={reviewAnnotation.metadata['proposedChange.dir']}
						isDisabled={isDisabled}
						name="proposedChange"
						onDirChange={handleProposalDirChange}
						originalValue={originalText}
						placeholder={t(
							'Leave empty to propose removing the selected content'
						)}
						ref={focusableRef}
						rows={rows}
						validate={validate}
						data-test-id="comment"
					/>
				</FormRow>

				<FormRow
					label={t('Motivation')}
					isLabelBold
					labelColorName="text-color"
				>
					<TextArea
						dir={reviewAnnotation.metadata['comment.dir']}
						isDisabled={isDisabled}
						name="comment"
						onDirChange={handleCommentDirChange}
						rows={rows}
						placeholder={t('Motivate your proposal')}
						data-test-id="motivation"
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

type Props = {
	focusableRef: React.MutableRefObject<HTMLElement>;
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
	onCancel: ReviewCardContentComponentProps['onReviewAnnotationFormCancel'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onSubmit: ReviewCardContentComponentProps['onReviewAnnotationFormSubmit'];
};

const ProposalAddOrEditForm: React.FC<Props> = ({
	focusableRef,
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
}) => {
	return (
		<ReviewAnnotationForm
			initialValueByName={reviewAnnotation.metadata}
			onSubmit={onSubmit}
		>
			{({ isSubmitDisabled, onFieldChange, onSubmit }) => (
				<ProposalAddOrEditFormContent
					focusableRef={focusableRef}
					isSubmitDisabled={isSubmitDisabled}
					onFieldChange={onFieldChange}
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
