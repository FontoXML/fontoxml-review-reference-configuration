import React from 'react';

import { Block, Label, Text } from 'fds/components';

import t from 'fontoxml-localization/src/t.js';

function ProposalReplyContent({ isReviewAnnotationSelected, metadata }) {
	return (
		<Block>
			<Block>
				<Label isBold>{t('Replied')}</Label>
			</Block>

			{isReviewAnnotationSelected && <Text>{metadata.reply}</Text>}
			{!isReviewAnnotationSelected && <Label isBlock>{metadata.reply}</Label>}
		</Block>
	);
}

export default ProposalReplyContent;
