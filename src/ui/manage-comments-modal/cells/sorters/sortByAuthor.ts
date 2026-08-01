import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

export default function sortByAuthor(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	return rowA.data.author.displayName.localeCompare(
		rowB.data.author.displayName
	);
}
