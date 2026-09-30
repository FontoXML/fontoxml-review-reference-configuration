import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';

export default function sortByRepliesCount(
	rowA: ReviewAnnotationInstance,
	rowB: ReviewAnnotationInstance
): number {
	return rowA.data.replies.length - rowB.data.replies.length;
}
