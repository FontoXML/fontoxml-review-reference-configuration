import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';

export default function sortByAuthor(
	rowA: ReviewAnnotationInstance,
	rowB: ReviewAnnotationInstance
): number {
	return rowA.data.author.displayName.localeCompare(
		rowB.data.author.displayName
	);
}
