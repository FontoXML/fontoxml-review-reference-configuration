import * as React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager';
import {
	Flex,
	Masthead,
	MastheadAlignRight,
	MastheadContent,
} from 'fontoxml-design-system/src/components';
import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

const configuredScope = configurationManager.get('scope') as {
	user?: {
		displayName?: string,
		id?: string
	}
};

const MastheadForReview = (): JSX.Element => {
	const { id } = configuredScope.user ?? {};
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				<MastheadAlignRight>
					<Flex spaceSize="m">
						{!!id && <FxProfileChip profileId={id} />}
					</Flex>
				</MastheadAlignRight>
			</MastheadContent>
		</Masthead>
	);
};

export default MastheadForReview;
