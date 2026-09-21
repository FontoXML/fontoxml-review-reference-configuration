import { useCallback } from 'react';

import {
	Modal,
	ModalHeader,
	ModalBody,
} from 'fontoxml-design-system/src/components';
import type { FdsOnKeyDownCallback } from 'fontoxml-design-system/src/types';
import ReviewAnnotationsOverview from 'fontoxml-feedback/src/ReviewAnnotationsOverview';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import type { ModalProps } from 'fontoxml-fx/src/types';
import t from 'fontoxml-localization/src/t';

import { REVIEW_NAVIGATOR_ID } from '../constants';
import batchActions from '../shared/batchActions';

import columnSpecifications from './columnSpecifications';

const TITLE = t('Manage comments and change proposals');

type Props = ModalProps<{
	initialCheckedAnnotationIds: ReviewAnnotationsOverviewDataTableRow['id'][];
}>;

const ManageCommentsModal = ({
	cancelModal,
	data: { initialCheckedAnnotationIds },
}: Props) => {
	const handleModalKeyDown = useCallback<FdsOnKeyDownCallback>(
		(event) => {
			if (event.key === 'Escape') {
				cancelModal();
			}
		},
		[cancelModal]
	);
	const tableId = 'overview-table';

	return (
		<Modal size="none" isFullHeight onKeyDown={handleModalKeyDown}>
			<ModalHeader icon="far fa-comments" title={TITLE} />

			<ModalBody>
				<ReviewAnnotationsOverview
					tableId={tableId}
					batchActions={batchActions}
					columnSpecifications={columnSpecifications}
					initialCheckedAnnotationIds={initialCheckedAnnotationIds}
					modalName="ManageCommentsModal"
					navigatorId={REVIEW_NAVIGATOR_ID}
					// searchFilterCallback={}
				/>
			</ModalBody>
		</Modal>
	);
};

export default ManageCommentsModal;
