import { Block, Button, Flex, HorizontalSeparationLine } from 'fds/components';
import * as React from 'react';

import t from 'fontoxml-localization/src/t';

/**
 * If there was an error while removing the annotation, we show that error in an ErrorToast,
 * see CommentCardContent.tsx and ProposalCardContent.tsx.
 *
 * Instead of showing the regular footer, show something that looks similar to the footer you
 * see when editing/replying to a comment.
 * And make sure to render that footer in the error state (Retry remove label on the primary button).
 */
export default function CardErrorFooter({
	onReviewAnnotationFormCancel,
	onReviewAnnotationRemove,
}) {
	return (
		<Block spaceVerticalSize="m">
			<HorizontalSeparationLine />

			<Flex justifyContent="flex-end" spaceSize="m">
				<Button
					label={t('Cancel')}
					onClick={onReviewAnnotationFormCancel}
				/>

				<Button
					label={t('Retry remove')}
					onClick={onReviewAnnotationRemove}
					type="primary"
				/>
			</Flex>
		</Block>
	);
}
