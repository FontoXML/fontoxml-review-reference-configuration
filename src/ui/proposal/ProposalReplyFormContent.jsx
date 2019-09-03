import React, { Fragment } from 'react';

import { FormRow, TextArea } from 'fds/components';

const rows = { minimum: 2, maximum: 6 };

function validateReplyField(value) {
	if (!value) {
		return { connotation: 'error', message: 'Reply is required.' };
	}

	return null;
}

function ProposalReplyFormContent({ isDisabled, onFocusableRef }) {
	return (
		<Fragment>
			<FormRow label="Reply" hasRequiredAsterisk isLabelBold labelColorName="text-color">
				<TextArea
					isDisabled={isDisabled}
					name="reply"
					ref={onFocusableRef}
					rows={rows}
					validate={validateReplyField}
				/>
			</FormRow>
		</Fragment>
	);
}

export default ProposalReplyFormContent;
