import React, { useEffect, Fragment } from 'react';

import { Block, Icon, FormRow, RadioButtonGroup, TextArea } from 'fds/components';

import { TargetType } from 'fontoxml-feedback/src/types.js';

import commentTypes from '../commentTypes.jsx';

const rows = { minimum: 2, maximum: 6 };

function validateCommentField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Comment is required.' };
	}

	return null;
}

function CommentAddOrEditFormContent({
	isDisabled,
	isEditing,
	onFieldChange,
	onFocusableRef,
	reviewAnnotation,
	valueByName
}) {
	useEffect(() => {
		if (!isEditing) {
			onFieldChange({
				name: 'commentType',
				value: commentTypes[0].value,
				feedback: null
			});
		}
	}, [isEditing, onFieldChange]);

	const currentCommentType =
		commentTypes.find(commentType => commentType.value === valueByName.commentType) ||
		commentTypes[0];

	let label = currentCommentType.label;

	const isPublicationLevelComment =
		reviewAnnotation.targets[0].type === TargetType.PUBLICATION_SELECTOR;
	if (isPublicationLevelComment) {
		label = 'Global ' + label[0].toLowerCase() + label.substring(1);
	}

	// @ts-ignore
	label = (
		<Block isInline spaceHorizontalSize="s">
			<Block isInline>
				<Icon icon={isPublicationLevelComment ? 'files-o' : 'comment'} />
			</Block>

			<span>{label}</span>
		</Block>
	);

	return (
		<Fragment>
			<FormRow label={label} hasRequiredAsterisk isLabelBold labelColorName="text-color">
				<TextArea
					isDisabled={isDisabled}
					name="comment"
					ref={onFocusableRef}
					rows={rows}
					validate={validateCommentField}
				/>
			</FormRow>

			<FormRow label="Type" hasRequiredAsterisk isLabelBold labelColorName="text-color">
				<RadioButtonGroup isDisabled={isDisabled} items={commentTypes} name="commentType" />
			</FormRow>
		</Fragment>
	);
}

export default CommentAddOrEditFormContent;
