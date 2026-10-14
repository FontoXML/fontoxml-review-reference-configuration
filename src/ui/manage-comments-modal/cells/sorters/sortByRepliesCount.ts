import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';

import { determineReviewAnnotationReplies } from '../CellComponentForRepliesCount';

export default function sortByRepliesCount(
	rowA: ReviewAnnotationInstance,
	rowB: ReviewAnnotationInstance
): number {
	return (
		determineReviewAnnotationReplies(rowA.data.replies).length -
		determineReviewAnnotationReplies(rowB.data.replies).length
	);
}
