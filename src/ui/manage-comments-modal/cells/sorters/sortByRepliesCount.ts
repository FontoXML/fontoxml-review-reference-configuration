import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

export default function sortByRepliesCount(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	return rowA.data.replies.length - rowB.data.replies.length;
}
