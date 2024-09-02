import * as React from 'react';

import {
	Block,
	Flex,
	FormRow,
	Icon,
	RadioButtonGroup,
	TextArea,
} from 'fontoxml-design-system/src/components';
import type {
	FdsFormFeedback,
	FdsFormValueByName,
} from 'fontoxml-design-system/src/types';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import ReviewTargetType from 'fontoxml-feedback/src/ReviewTargetType';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import commentTypes from '../commentTypes';
import AddOrEditFormFooter from '../shared/AddOrEditFormFooter';

function validateCommentField(value: string): FdsFormFeedback | null {
	if (!value || value.trim() === '') {
		return { connotation: 'error', message: 'Comment is required.' };
	}

	return null;
}

const rows = { minimum: 2, maximum: 6 };

const CommentAddOrEditFormContent: React.FC<Props & {
	focusableRef: React.MutableRefObject<HTMLElement>;
	isSubmitDisabled: boolean;
	onFieldChange(...args: unknown[]): void;
	valueByName: FdsFormValueByName;
}> = ({
	focusableRef,
	isSubmitDisabled,
	onCancel,
	onFieldChange,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
	valueByName,
}) => {
	const error = reviewAnnotation.error || null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(error &&
			typeof error !== 'number' &&
			error.recovery !== ReviewRecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === ReviewBusyState.EDITING;
	const isLoading = reviewAnnotation.isLoading;

	React.useEffect(() => {
		if (!isEditing) {
			onFieldChange({
				name: 'commentType',
				value: commentTypes[0].value,
				feedback: null,
			});
		}
	}, [isEditing, onFieldChange]);

	const currentCommentType =
		commentTypes.find(
			(commentType) => commentType.value === valueByName.commentType
		) || commentTypes[0];

	let label = currentCommentType.label;

	const isPublicationLevelComment =
		reviewAnnotation.targets[0].type ===
		ReviewTargetType.PUBLICATION_SELECTOR;
	if (isPublicationLevelComment) {
		label =  t('Global {LABEL}', {LABEL: `${label[0].toLowerCase()}${label.substring(1)}`});
	}

	const handleCommentDirChange = React.useCallback(
		(dir) => {
			onFieldChange({ name: 'comment.dir', value: dir, feedback: null });
		},
		[onFieldChange]
	);

	return (
		<>
			<FormRow
				hasRequiredAsterisk
				isLabelBold
				label={
					<Flex alignItems="center" flexDirection="row" spaceSize="s">
						<Icon
							icon={
								isPublicationLevelComment
									? 'global-comments-stacked-icons'
									: 'far fa-comment'
							}
						/>

						<Block dataTestId="comment-type-label">{label}</Block>
					</Flex>
				}
				labelColorName="text-color"
			>
				<TextArea
					dataTestId="comment"
					dir={valueByName['comment.dir']}
					isDisabled={isDisabled}
					name="comment"
					onDirChange={handleCommentDirChange}
					placeholder={t('Comment on the selected content')}
					ref={focusableRef}
					rows={rows}
					validate={validateCommentField}
				/>
			</FormRow>

			<FormRow
				label={t('Type')}
				hasRequiredAsterisk
				isLabelBold
				labelColorName="text-color"
			>
				<RadioButtonGroup
					isDisabled={isDisabled}
					items={commentTypes}
					name="commentType"
				/>
			</FormRow>

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

const CommentAddOrEditForm: React.FC<Props> = ({
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
			{({ isSubmitDisabled, onFieldChange, onSubmit, valueByName }) => (
				<CommentAddOrEditFormContent
					focusableRef={focusableRef}
					isSubmitDisabled={isSubmitDisabled}
					onFieldChange={onFieldChange}
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

export default CommentAddOrEditForm;
