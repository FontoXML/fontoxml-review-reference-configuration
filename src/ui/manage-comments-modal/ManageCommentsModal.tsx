import { useCallback } from 'react';

import {
	Modal,
	ModalHeader,
	ModalBody,
} from 'fontoxml-design-system/src/components';
import type { FdsOnKeyDownCallback } from 'fontoxml-design-system/src/types';
import ReviewAnnotationsOverview from 'fontoxml-feedback/src/ReviewAnnotationsOverview';
import type { ReviewAnnotation, ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import type { ModalProps } from 'fontoxml-fx/src/types';
import t from 'fontoxml-localization/src/t';

import { REVIEW_NAVIGATOR_ID } from '../constants';
import batchActions from '../shared/batchActions';

import columnSpecifications from './columnSpecifications';
import { ReviewAnnotationMetadata } from '../shared/types';

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

	const searchFilterCallback = useCallback(
		(annotation: ReviewAnnotation, query: string): boolean => {
			// How to match an annotation against a search query is up to the
			// application. In this case, we match against the comment or
			// proposed change text.
			const metadata = annotation.metadata as ReviewAnnotationMetadata;
			const text = metadata.comment ?? metadata.proposedChange;
			return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
		},
		[]
	);

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
					searchFilterCallback={searchFilterCallback}
				/>
			</ModalBody>
		</Modal>
	);
};

export default ManageCommentsModal;
