import React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager.js';

import { Flex, Icon, Label, Masthead, MastheadAlignRight, MastheadContent } from 'fds/components';

import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo.jsx';

const configuredScope = configurationManager.get('scope');

export default function MastheadForReview() {
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				{configuredScope.user && configuredScope.user.displayName && (
					<MastheadAlignRight>
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
