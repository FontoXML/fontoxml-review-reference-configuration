import {
	Block,
	Flex,
	FormRow,
	Icon,
	RadioButtonGroup,
	TextArea,
} from 'fds/components';
import * as React from 'react';

import ReviewAnnotationForm from 'fontoxml-feedback/src/ReviewAnnotationForm';
import {
	BusyState,
	RecoveryOption,
	TargetType,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import commentTypes from '../commentTypes';
import AddOrEditFormFooter from '../shared/AddOrEditFormFooter';

function validateCommentField(value) {
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
}) {
	const error = reviewAnnotation.error ? reviewAnnotation.error : null;
	const isDisabled =
		reviewAnnotation.isLoading ||
		(error && error.recovery !== RecoveryOption.RETRYABLE);
	const isEditing = reviewAnnotation.busyState === BusyState.EDITING;
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
		reviewAnnotation.targets[0].type === TargetType.PUBLICATION_SELECTOR;
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
									: 'fal fa-comment'
							}
						/>

						<Block>{label}</Block>
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

function CommentAddOrEditForm({
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
