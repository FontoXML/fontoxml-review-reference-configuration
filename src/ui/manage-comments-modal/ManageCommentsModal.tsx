import { useCallback } from 'react';

import {
	Modal,
	ModalHeader,
	ModalBody,
} from 'fontoxml-design-system/src/components';
import type { FdsOnKeyDownCallback } from 'fontoxml-design-system/src/types';
import ReviewAnnotationsOverview from 'fontoxml-feedback/src/ReviewAnnotationsOverview';
import type { ModalProps } from 'fontoxml-fx/src/types';
import t from 'fontoxml-localization/src/t';

import { REVIEW_NAVIGATOR_ID } from '../constants';

import batchActions from './batchActions';
import columnSpecifications from './columnSpecifications';

type Props = ModalProps;

const ManageCommentsModal = ({ cancelModal, submitModal }: Props) => {
	const handleModalKeyDown = useCallback<FdsOnKeyDownCallback>(
		(event) => {
			if (event.key === 'Escape') {
				cancelModal();
			}
		},
		[cancelModal]
	);

	return (
		<Modal size="none" isFullHeight onKeyDown={handleModalKeyDown}>
			<ModalHeader icon="far fa-comments" title={t('Manage comments')} />

			<ModalBody>
				<ReviewAnnotationsOverview
					batchActions={batchActions}
					columnSpecifications={columnSpecifications}
					// initialSelectedReviewAnnotationId={}
					navigatorId={REVIEW_NAVIGATOR_ID}
					// rowActions={rowActions}
					// searchFilterCallback={}
				/>
			</ModalBody>
		</Modal>
	);
};

export default ManageCommentsModal;
