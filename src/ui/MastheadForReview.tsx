import * as React from 'react';

import {
	Flex,
	Icon,
	Label,
	Masthead,
	MastheadAlignRight,
	MastheadContent,
} from 'fontoxml-design-system/src/components';
import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo';

import { currentScopeUser } from './constants';

const MastheadForReview = (): JSX.Element => {
	const { displayName } = currentScopeUser;
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
};

export default MastheadForReview;
