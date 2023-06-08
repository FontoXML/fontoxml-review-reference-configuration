import * as React from 'react';

import { TextInput } from 'fontoxml-design-system/src/components';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

type Props = {
	onReplyAdd: ReviewCardContentComponentProps['onReplyAdd'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const ProposalCardFooter: React.FC<Props> = ({ onReplyAdd, reviewAnnotation }) => {
	const textInputRef = React.useRef<HTMLElement>(null);

	const handleTextInputRef = React.useCallback((domNode: HTMLElement) => {
		textInputRef.current = domNode;
	}, []);

	const handleTextInputFocus = React.useCallback(() => {
		onReplyAdd();
	}, [onReplyAdd]);

	React.useEffect(() => {
		if (textInputRef.current) {
			textInputRef.current.addEventListener(
				'focus',
				handleTextInputFocus
			);
		}

		return () => {
			if (textInputRef.current) {
				textInputRef.current.removeEventListener(
					'focus',
					handleTextInputFocus
				);
			}
		};
	});
	return (
		<TextInput
			onRef={handleTextInputRef}
			isDisabled={!!reviewAnnotation.error || reviewAnnotation.isLoading}
			placeholder={t('Type your reply')}
		/>
	);
}

export default ProposalCardFooter;
