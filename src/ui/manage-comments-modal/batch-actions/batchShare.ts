import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import reviewNavigatorsManager from 'fontoxml-feedback/src/reviewNavigatorsManager';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import { share } from 'fontoxml-feedback/src/ui/uiActions';
import addAction from 'fontoxml-operations/src/addAction';

import { REVIEW_NAVIGATOR_ID } from '../../constants';

function isRowShareable(row: ReviewAnnotationsOverviewDataTableRow): boolean {
	if (row.hasOpenForm) {
		return false;
	}

	if (
		row.data.status === ReviewAnnotationStatus.SHARED ||
		row.data.status === ReviewAnnotationStatus.RESOLVED ||
		row.data.status === ReviewAnnotationStatus.ARCHIVED
	) {
		return false;
	}

	return true;
}

export function installBatchShareAction(): void {
	const feedbackIdSet =
		reviewNavigatorsManager.getPrimaryFeedbackIdSetByReviewNavigatorId(
			REVIEW_NAVIGATOR_ID
		);

	addAction<{ rows: ReviewAnnotationsOverviewDataTableRow[] }>(
		'batchShare',
		function runBatchShareAction(stepData) {
			if (!stepData.rows?.some(isRowShareable)) {
				return;
			}

			stepData.rows.forEach((row) => {
				share(row.data.id, feedbackIdSet, row.hierarchyNodeId);
			});
		},
		function getStateForBatchShareAction(stepData) {
			const enabled = stepData.rows?.every(isRowShareable) ?? false;

			return { active: false, enabled };
		}
	);
}
