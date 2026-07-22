import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

export default function sortByAuthor(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	return rowA.reviewAnnotation.author.displayName.localeCompare(
		rowB.reviewAnnotation.author.displayName
	);
}
