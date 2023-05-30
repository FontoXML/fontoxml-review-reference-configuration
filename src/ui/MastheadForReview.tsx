import * as React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager';
import {
	Flex,
	Icon,
	Label,
	Masthead,
	MastheadAlignRight,
	MastheadContent,
} from 'fontoxml-design-system/src/components';
import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo';
import DocumentHistoryShowChangesButton from 'fontoxml-document-history/src/DocumentHistoryShowChangesButton';

const configuredScope = configurationManager.get('scope');

export default function MastheadForReview() {
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				{configuredScope.user && configuredScope.user.displayName && (
					<MastheadAlignRight>
						<DocumentHistoryShowChangesButton
							label="Show document changes"
							mode="single"
						/>
						<DocumentHistoryShowChangesButton
							label="Show changes"
							mode="publication"
						/>
						<Flex flex="none">
							<Icon icon="user" />

							<Label>{configuredScope.user.displayName}</Label>
						</Flex>
					</MastheadAlignRight>
				)}
			</MastheadContent>
		</Masthead>
	);
}
