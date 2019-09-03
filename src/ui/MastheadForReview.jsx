import React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager.js';

import {
	Button,
	Flex,
	Icon,
	Label,
	Masthead,
	MastheadAlignRight,
	MastheadContent
} from 'fds/components';

import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo.jsx';

const configuredScope = configurationManager.get('scope');

export default function MastheadForReview({ isOutlineVisible, onToggleOutline }) {
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				<MastheadAlignRight>
					<Flex alignItems="center" spaceSize="m">
						<Button
							icon="align-right icon-flip-vertical"
							isSelected={isOutlineVisible}
							onClick={onToggleOutline}
						/>

						{configuredScope.user && configuredScope.user.displayName && (
							<Flex flex="none">
								<Icon icon="user" />

								<Label>{configuredScope.user.displayName}</Label>
							</Flex>
						)}
					</Flex>
				</MastheadAlignRight>
			</MastheadContent>
		</Masthead>
	);
}
