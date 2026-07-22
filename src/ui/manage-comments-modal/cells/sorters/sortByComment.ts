import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../types';

export default function sortByComment(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	const metadataA = rowA.reviewAnnotation
		.metadata as ReviewAnnotationMetadata;
	const metadataB = rowB.reviewAnnotation
		.metadata as ReviewAnnotationMetadata;

	const commentOrProposalA = metadataA.proposedChange
		? `${metadataA.proposedChange} ${metadataA.comment}`
		: metadataA.comment;

	const commentOrProposalB = metadataB.proposedChange
		? `${metadataB.proposedChange} ${metadataB.comment}`
		: metadataB.comment;

	return commentOrProposalA.localeCompare(commentOrProposalB);
}
