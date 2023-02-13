import * as React from 'react';

import configurationManager from 'fontoxml-configuration/src/configurationManager';
import {
	ButtonWithDrop,
	Drop,
	Flex,
	Icon,
	Label,
	Masthead,
	MastheadAlignRight,
	MastheadContent,
	Menu,
} from 'fontoxml-design-system/src/components';
import ReviewLogo from 'fontoxml-feedback/src/ReviewLogo';
import FxOperationButton from 'fontoxml-fx/src/FxOperationButton';
import FxOperationMenuItem from 'fontoxml-fx/src/FxOperationMenuItem';

const configuredScope = configurationManager.get('scope');

export default function MastheadForReview(): JSX.Element {
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				{configuredScope.user && configuredScope.user.displayName && (
					<MastheadAlignRight>
						<Flex flex="none">
							<Icon icon="user" />

							<Label>{configuredScope.user.displayName}</Label>
							<FxOperationButton operationName=":toggle-wide-canvas" />
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
						</Flex>
					</MastheadAlignRight>
				)}
			</MastheadContent>
		</Masthead>
	);
}
