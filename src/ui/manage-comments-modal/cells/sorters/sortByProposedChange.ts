import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';

import type { ReviewAnnotationMetadata } from '../../types';

export default function sortByProposedChange(
	rowA: ReviewAnnotationsOverviewDataTableRow,
	rowB: ReviewAnnotationsOverviewDataTableRow
): number {
	const metadataA = rowA.data.metadata as ReviewAnnotationMetadata;
	const metadataB = rowB.data.metadata as ReviewAnnotationMetadata;

	const proposedChangeA = metadataA.proposedChange ?? '';
	const proposedChangeB = metadataB.proposedChange ?? '';

	if (proposedChangeA === '' && proposedChangeB === '') {
		return 0;
	}

	const motivationA = metadataA.comment;
	const motivationB = metadataB.comment;

	if (proposedChangeA === proposedChangeB) {
		return motivationA.localeCompare(motivationB);
	}

	return proposedChangeA.localeCompare(proposedChangeB);
}
