import React, { useEffect, Fragment } from 'react';

import { FormRow, TextArea, TextAreaWithDiff } from 'fds/components';

function validateProposedChangeField(value, originalText) {
	if (value === originalText) {
		return { connotation: 'error', message: 'Proposed change is required.' };
	}

	return null;
}

const rows = { minimum: 2, maximum: 6 };

function ProposalAddOrEditItemFormContent({
	isDisabled,
	isEditing,
	onFieldChange,
	onFocusableRef,
	originalText
}) {
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
				label="Proposed change"
				hasRequiredAsterisk
				isLabelBold
				labelColorName="text-color"
			>
				<TextAreaWithDiff
					isDisabled={isDisabled}
					name="proposedChange"
					originalValue={originalText}
					ref={onFocusableRef}
					rows={rows}
					validate={value => validateProposedChangeField(value, originalText)}
				/>
			</FormRow>

			<FormRow label="Motivation" isLabelBold labelColorName="text-color">
				<TextArea isDisabled={isDisabled} name="comment" rows={rows} />
			</FormRow>
		</Fragment>
	);
}

export default ProposalAddOrEditItemFormContent;
