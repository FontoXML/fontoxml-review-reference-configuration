import * as React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager';
import {
	ButtonWithDrop,
	Drop,
	Flex,
	Masthead,
	MastheadAlignRight,
	MastheadContent,
	Menu,
} from 'fontoxml-design-system/src/components';
import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo';
import FxOperationMenuItem from 'fontoxml-fx/src/FxOperationMenuItem';
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
						<ButtonWithDrop
								icon="search-plus"
								label="Zoom"
								renderDrop={() => (
									<Drop>
										<Menu>
											<FxOperationMenuItem operationName="zoom-content-view-to-75%-75%" />
											<FxOperationMenuItem operationName="zoom-content-view-to-100%-100%" />
											<FxOperationMenuItem operationName="zoom-content-view-to-125%-125%" />
											<FxOperationMenuItem operationName="zoom-content-view-to-150%-150%" />
											<FxOperationMenuItem operationName="zoom-content-view-to-200%-200%" />
										</Menu>
									</Drop>
								)}
							/>
						
							{!!id && <FxProfileChip profileId={id} />}
						</Flex>
					</MastheadAlignRight>
			</MastheadContent>
		</Masthead>
	);
};

export default MastheadForReview;
