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

const configuredScope = configurationManager.get('scope') as {
	user: {
		displayName: string,
		id: string
	}
}

const MastheadForReview = (): JSX.Element => {
	const { displayName } = configuredScope?.user ?? {};
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				{displayName && (
					<MastheadAlignRight>
						<Flex flex="none">
							<Icon icon="user" />

							<Label>{displayName}</Label>
						</Flex>
					</MastheadAlignRight>
				)}
			</MastheadContent>
		</Masthead>
	);
}

export default MastheadForReview
