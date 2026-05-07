import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';

export default function sortByTimestamp(
	rowA: ReviewAnnotationInstance,
	rowB: ReviewAnnotationInstance
): number {
	return (
		new Date(rowA.data.timestamp).getTime() -
		new Date(rowB.data.timestamp).getTime()
	);
}
