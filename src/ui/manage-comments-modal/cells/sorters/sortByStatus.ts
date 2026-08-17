import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationResolvedMetadata } from '../../types';

export default function sortByStatus(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	const rowAIsPrivate = rowA.data.status === ReviewAnnotationStatus.PRIVATE;
	const rowBIsPrivate = rowB.data.status === ReviewAnnotationStatus.PRIVATE;

	if (rowAIsPrivate && !rowBIsPrivate) {
		return 1;
	}
	if (!rowAIsPrivate && rowBIsPrivate) {
		return -1;
	}
	if (rowAIsPrivate && rowBIsPrivate) {
		return 0;
	}

	const resolvedMetadataA = rowA.data.resolvedMetadata as
		| ReviewAnnotationResolvedMetadata
		| undefined;
	const resolvedMetadataB = rowB.data.resolvedMetadata as
		| ReviewAnnotationResolvedMetadata
		| undefined;

	return (resolvedMetadataA?.resolution ?? '').localeCompare(
		resolvedMetadataB?.resolution ?? ''
	);
}
