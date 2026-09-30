import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../../shared/types';

export default function sortByComment(
	rowA: ReviewAnnotationInstance,
	rowB: ReviewAnnotationInstance
): number {
	const metadataA = rowA.data.metadata as ReviewAnnotationMetadata;
	const metadataB = rowB.data.metadata as ReviewAnnotationMetadata;

	const commentA = metadataA.proposedChange ? '' : metadataA.comment;
	const commentB = metadataB.proposedChange ? '' : metadataB.comment;

	return commentA.localeCompare(commentB);
}
