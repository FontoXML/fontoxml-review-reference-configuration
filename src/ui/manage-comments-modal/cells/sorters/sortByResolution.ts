import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationResolvedMetadata } from '../../types';

export default function sortByComment(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	const resolvedMetadataA = rowA.data
		.resolvedMetadata as ReviewAnnotationResolvedMetadata;
	const resolvedMetadataB = rowB.data
		.resolvedMetadata as ReviewAnnotationResolvedMetadata;

	return resolvedMetadataA.resolution.localeCompare(
		resolvedMetadataB.resolution
	);
}
