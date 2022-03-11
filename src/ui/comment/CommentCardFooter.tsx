import { Block, HorizontalSeparationLine, TextInput } from 'fds/components';
import * as React from 'react';

import t from 'fontoxml-localization/src/t';

function CommentCardFooter({ onReplyAdd, reviewAnnotation }) {
	const textInputRef = React.useRef<HTMLElement>(null);
	const handleTextInputRef = React.useCallback(
		(domNode: HTMLElement) => (textInputRef.current = domNode)
	);
	React.useEffect(() => {
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
		<Block spaceVerticalSize="m">
			<HorizontalSeparationLine />

			<TextInput
				onRef={handleTextInputRef}
				isDisabled={
					!!reviewAnnotation.error || reviewAnnotation.isLoading
				}
				placeholder={t('Type your reply')}
			/>
		</Block>
	);
}

export default CommentCardFooter;
