import * as React from 'react';

import {
	Block,
	HorizontalSeparationLine,
	TextInput,
} from 'fontoxml-design-system/src/components';
import { applyCss } from 'fontoxml-design-system/src/system';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const stickyStyles = applyCss({
	position: 'sticky',
	bottom: 0,
	backgroundColor: 'white',
});

type Props = {
	context: ReviewCardContentComponentProps['context'];
	onReplyAdd: ReviewCardContentComponentProps['onReplyAdd'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const CommentCardFooter: React.FC<Props> = ({
	context,
	onReplyAdd,
	reviewAnnotation,
}) => {
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
		<Block
			{...(context === FeedbackContextType.OVERVIEW_DETAILS
				? stickyStyles
				: {})}
			spaceVerticalSize="m"
		>
			<HorizontalSeparationLine />

			<TextInput
				ariaLabel={t('Reply')}
				onRef={handleTextInputRef}
				isDisabled={
					!!reviewAnnotation.error || reviewAnnotation.isLoading
				}
				placeholder={t('Type your reply')}
			/>
		</Block>
	);
};

export default CommentCardFooter;
