import React, { useCallback, useRef, useEffect } from 'react';

import { TextInput } from 'fontoxml-design-system/src/components';
import t from 'fontoxml-localization/src/t';

function ProposalCardFooter({ onReplyAdd, reviewAnnotation }) {
	const textInputRef = useRef<HTMLElement>(null);
	const handleTextInputRef = useCallback(
		(domNode: HTMLElement) => (textInputRef.current = domNode)
	);

	useEffect(() => {
		if (!textInputRef.current) {
			return;
		}

		const handleFocus = () => {
			onReplyAdd();
		};

		textInputRef.current.addEventListener('focus', handleFocus);
		return () => {
			textInputRef.current.removeEventListener('focus', handleFocus);
		};
	});

	return (
		<TextInput
			onRef={handleTextInputRef}
			isDisabled={
				!!reviewAnnotation.error || reviewAnnotation.isLoading
			}
			placeholder={t('Type your reply')}
		/>
	);
}

export default ProposalCardFooter;
