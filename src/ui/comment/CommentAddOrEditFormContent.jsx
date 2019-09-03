import React, { useEffect, Fragment } from 'react';

import { FormRow, RadioButtonGroup, TextArea } from 'fds/components';

import commentTypes from '../commentTypes.jsx';

const rows = { minimum: 2, maximum: 6 };

function validateCommentField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Comment is required.' };
	}

	return null;
}

function CommentAddOrEditFormContent({ isDisabled, isEditing, onFieldChange, onFocusableRef }) {
	useEffect(() => {
		if (!isEditing) {
			onFieldChange({
				name: 'commentType',
				value: commentTypes[0].value,
				feedback: null
			});
		}
	}, [isEditing, onFieldChange]);

	return (
		<Fragment>
			<FormRow label="Comment" hasRequiredAsterisk isLabelBold labelColorName="text-color">
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
