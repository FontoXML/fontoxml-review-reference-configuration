import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

export default function sortByTimestamp(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	return (
		new Date(rowA.data.timestamp).getTime() -
		new Date(rowB.data.timestamp).getTime()
	);
}
