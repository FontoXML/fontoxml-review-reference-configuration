import React from 'react';

import { Block, Label, Text } from 'fds/components';

function CommentReplyContent({ isReviewAnnotationSelected, metadata }) {
	return (
		<Block>
			{isReviewAnnotationSelected && <Text>{metadata.reply}</Text>}
			{!isReviewAnnotationSelected && <Label isBlock>{metadata.reply}</Label>}
		</Block>
	);
}

export default CommentReplyContent;
