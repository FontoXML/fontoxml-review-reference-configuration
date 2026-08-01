import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import commentTypes from '../../../commentTypes';
import type { ReviewAnnotationMetadata } from '../../types';

export default function sortByType(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	if (rowA.data.type === 'proposal') {
		if (rowB.data.type === 'proposal') {
			return 0;
		}
		// Let proposals come second.
		return 1;
	}
	if (rowB.data.type === 'proposal') {
		// Let proposals come second.
		return -1;
	}

	const commentTypeValueA = rowA.data.metadata
		.commentType as ReviewAnnotationMetadata['commentType'];
	const commentTypeA = commentTypes.find(
		(commentType) => commentType.value === commentTypeValueA
	);
	const typeLabelA = commentTypeA ? commentTypeA.label : commentTypeValueA;

	const commentTypeValueB = rowB.data.metadata
		.commentType as ReviewAnnotationMetadata['commentType'];
	const commentTypeB = commentTypes.find(
		(commentType) => commentType.value === commentTypeValueB
	);
	const typeLabelB = commentTypeB ? commentTypeB.label : commentTypeValueB;

	return typeLabelA.localeCompare(typeLabelB);
}
