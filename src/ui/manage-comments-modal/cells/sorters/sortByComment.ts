import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../types';

export default function sortByComment(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	const metadataA = rowA.data.metadata as ReviewAnnotationMetadata;
	const metadataB = rowB.data.metadata as ReviewAnnotationMetadata;

	const commentA = metadataA.proposedChange ? '' : metadataA.comment;
	const commentB = metadataB.proposedChange ? '' : metadataB.comment;

	return commentA.localeCompare(commentB);
}
