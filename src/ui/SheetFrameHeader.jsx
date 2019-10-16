import PropTypes from 'prop-types';
import React from 'react';

import documentStateType from 'fontoxml-remote-documents/src/documentStateType.js';
import useRemoteDocumentState from 'fontoxml-remote-documents/src/useRemoteDocumentState.js';

import FxDocumentContextualOperationsWidget from 'fontoxml-fx/src/FxDocumentContextualOperationsWidget.jsx';
import FxDocumentLockStateWidget from 'fontoxml-fx/src/FxDocumentLockStateWidget.jsx';
import FxDocumentMarkupLabel from 'fontoxml-fx/src/FxDocumentMarkupLabel.jsx';
import FxDocumentSaveWidget from 'fontoxml-fx/src/FxDocumentSaveWidget.jsx';
import FxDocumentStateSyncButton from 'fontoxml-fx/src/FxDocumentStateSyncButton.jsx';
import FxSheetFrameHeaderActionArea from 'fontoxml-fx/src/FxSheetFrameHeaderActionArea.jsx';
import FxSheetFrameHeaderContainer from 'fontoxml-fx/src/FxSheetFrameHeaderContainer.jsx';
import FxSheetFrameHeaderDocumentStateLabel from 'fontoxml-fx/src/FxSheetFrameHeaderDocumentStateLabel.jsx';
import FxSheetFrameHeaderInfoArea from 'fontoxml-fx/src/FxSheetFrameHeaderInfoArea.jsx';
import FxSheetFrameHeaderLockArea from 'fontoxml-fx/src/FxSheetFrameHeaderLockArea.jsx';

import { Flex } from 'fds/components';

// Note: all props are set automatically by the SDK, This component is not rendered manually.
function SheetFrameHeader({
	contextNodeId,
	documentId,
	hierarchyNodeId,
	markupLabel,
	productContext
}) {
	const remoteDocumentState = useRemoteDocumentState(documentId);

	return (
		<FxSheetFrameHeaderContainer productContext={productContext}>
			<FxSheetFrameHeaderLockArea productContext={productContext}>
				{productContext === 'editor' && (
					<FxDocumentLockStateWidget
						documentId={documentId}
						remoteDocumentState={remoteDocumentState}
					/>
				)}
			</FxSheetFrameHeaderLockArea>

			<FxSheetFrameHeaderInfoArea productContext={productContext}>
				<FxDocumentMarkupLabel>{markupLabel}</FxDocumentMarkupLabel>

				{productContext === 'editor' ? (
					// In the editor product, always show all document states
					<FxSheetFrameHeaderDocumentStateLabel
						documentId={documentId}
						remoteDocumentState={remoteDocumentState}
					/>
				) : remoteDocumentState.type === documentStateType.DOCUMENT_DIRTY_AND_OUT_OF_SYNC ||
				  remoteDocumentState.type === documentStateType.DOCUMENT_OUT_OF_SYNC ||
				  remoteDocumentState.type ===
						documentStateType.LOCK_UNAVAILABLE_AND_OUT_OF_SYNC ? (
					// On review product, only show out of sync states, lock state is not needed.
					<FxSheetFrameHeaderDocumentStateLabel
						documentId={documentId}
						remoteDocumentState={remoteDocumentState}
					/>
				) : (
					<Flex />
				)}
			</FxSheetFrameHeaderInfoArea>

			<FxSheetFrameHeaderActionArea productContext={productContext}>
				<FxDocumentStateSyncButton
					documentId={documentId}
					remoteDocumentState={remoteDocumentState}
				/>

				{productContext === 'editor' && (
					<FxDocumentSaveWidget
						documentId={documentId}
						hierarchyNodeId={hierarchyNodeId}
						remoteDocumentState={remoteDocumentState}
					/>
				)}

				{productContext === 'editor' && (
					<FxDocumentContextualOperationsWidget contextNodeId={contextNodeId} />
				)}
			</FxSheetFrameHeaderActionArea>
		</FxSheetFrameHeaderContainer>
	);
}
SheetFrameHeader.propTypes = {
	/**
	 * The node id of the node that is configured as a sheet frame.
	 * This is used to retrieve the contextual information such as operations for this node.
	 */
	contextNodeId: PropTypes.string.isRequired,
	/**
	 * The (local) document id of the document of the sheet frame node.
	 * Used to determine contextual information for the document in which the sheet frame node occurs.
	 */
	documentId: PropTypes.string.isRequired,
	/**
	 * The markup label of the sheet frame node.
	 */
	markupLabel: PropTypes.string.isRequired,
	/**
	 * The system name of the product in which the sheet frame (header) is being rendered.
	 * Used to alter the look'n'feel of certain parts and/or to disable certain parts in certain
	 * contexts.
	 * For example, in context of the review product the content is read-only. So the lock widget,
	 * save widget and contextual operations are not used there.
	 *
	 * Can be one of either:
	 * - "editor"
	 * - "review"
	 * - "history"
	 */
	productContext: PropTypes.string.isRequired
};

export default SheetFrameHeader;
