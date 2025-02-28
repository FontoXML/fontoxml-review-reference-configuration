import type { FC } from 'react';

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
import FxOperationButton from 'fontoxml-fx/src/FxOperationButton';
import FxOperationMenuItem from 'fontoxml-fx/src/FxOperationMenuItem';
import FxProfileChip from 'fontoxml-fx/src/FxProfileChip';

const configuredScope = configurationManager.get('scope');

const MastheadForReview: FC = () => {
	const { id } = configuredScope.user ?? {};
	return (
		<Masthead>
			<MastheadContent>
				<ReviewLogo />

				<MastheadAlignRight>
					<Flex spaceSize="m">
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

						{!!id && <FxProfileChip profileId={id} />}
					</Flex>
				</MastheadAlignRight>
			</MastheadContent>
		</Masthead>
	);
};

export default MastheadForReview;
