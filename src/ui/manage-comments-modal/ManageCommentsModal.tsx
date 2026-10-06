import { useCallback } from 'react';

import {
	Modal,
	ModalHeader,
	ModalBody,
} from 'fontoxml-design-system/src/components';
import type { FdsOnKeyDownCallback } from 'fontoxml-design-system/src/types';
import ReviewAnnotationsOverview from 'fontoxml-feedback/src/ReviewAnnotationsOverview';
import type {
	ReviewAnnotation,
	ReviewAnnotationId,
} from 'fontoxml-feedback/src/types';
import type { ModalProps } from 'fontoxml-fx/src/types';
import t from 'fontoxml-localization/src/t';

import { REVIEW_NAVIGATOR_ID } from '../constants';
import batchActions from '../shared/batchActions';
import type { ReviewAnnotationMetadata } from '../shared/types';

import columnSpecifications from './columnSpecifications';

const TITLE = t('Manage comments and change proposals');

type Props = ModalProps<{
	initialCheckedAnnotationIds: ReviewAnnotationId[];
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

	const searchFilterCallback = useCallback(
		(annotation: ReviewAnnotation, query: string): boolean => {
			// How to match an annotation against a search query is up to the
			// application. In this case, we match against the proposed change
			// text or comment.
			const metadata = annotation.metadata as ReviewAnnotationMetadata;
			const text = metadata.proposedChange ?? metadata.comment;
			return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
		},
		[]
	);

	return (
		<Modal size="none" isFullHeight onKeyDown={handleModalKeyDown}>
			<ModalHeader icon="far fa-comments" title={TITLE} />

			<ModalBody>
				<ReviewAnnotationsOverview
					instanceId="overview-table"
					batchActions={batchActions}
					columnSpecifications={columnSpecifications}
					initialCheckedAnnotationIds={initialCheckedAnnotationIds}
					navigatorId={REVIEW_NAVIGATOR_ID}
					searchFilterCallback={searchFilterCallback}
				/>
			</ModalBody>
		</Modal>
	);
};

export default ManageCommentsModal;
