import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

export default function sortByRepliesCount(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	return (
		rowA.reviewAnnotation.replies.length -
		rowB.reviewAnnotation.replies.length
	);
}
