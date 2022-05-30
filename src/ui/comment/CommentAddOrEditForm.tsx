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
	FormFeedback,
	FormValueByName,
} from 'fontoxml-design-system/src/types';
import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import {
	ReviewBusyState,
	ReviewRecoveryOption,
	ReviewTargetType,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import commentTypes from '../commentTypes';
import AddOrEditFormFooter from '../shared/AddOrEditFormFooter';

function validateCommentField(value: string): FormFeedback {
	if (!value || value.trim() === '') {
		return { connotation: 'error', message: 'Comment is required.' };
	}

	return null;
}

const rows = { minimum: 2, maximum: 6 };

function CommentAddOrEditFormContent({
	isSubmitDisabled,
	onFieldChange,
	onFocusableRef,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
	reviewAnnotation,
	valueByName,
}: Props & {
	isSubmitDisabled: boolean;
	onFieldChange(...args: unknown[]): void;
	onFocusableRef(): void;
	valueByName: FormValueByName;
}) {
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
			(commentType) => commentType.value === valueByName['commentType']
		) || commentTypes[0];

	let label = currentCommentType.label;

	const isPublicationLevelComment =
		reviewAnnotation.targets[0].type ===
		ReviewTargetType.PUBLICATION_SELECTOR;
	if (isPublicationLevelComment) {
		label = `Global ${label[0].toLowerCase()}${label.substring(1)}`;
	}

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

						<Block data-test-id="comment-type-label">{label}</Block>
					</Flex>
				}
				labelColorName="text-color"
			>
				<TextArea
					isDisabled={isDisabled}
					name="comment"
					placeholder={t('Comment on the selected content')}
					ref={onFocusableRef}
					rows={rows}
					validate={validateCommentField}
					data-test-id="comment"
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
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
	onCancel: ReviewCardContentComponentProps['onReviewAnnotationFormCancel'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	onSubmit: ReviewCardContentComponentProps['onReviewAnnotationFormSubmit'];
};

function CommentAddOrEditForm({
	reviewAnnotation,
	onCancel,
	onReviewAnnotationRefresh,
	onSubmit,
}: Props) {
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
				valueByName,
			}) => (
				<CommentAddOrEditFormContent
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

export default CommentAddOrEditForm;
