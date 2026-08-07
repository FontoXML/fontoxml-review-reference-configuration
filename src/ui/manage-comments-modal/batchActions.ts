import type { FdsDataTableBatchAction } from 'fontoxml-design-system/src/types';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const batchActions: FdsDataTableBatchAction<ReviewAnnotationsOverviewDataTableRow>[] =
	[
		{
			type: 'operation',
			operationName: 'batch-share',
			isAlwaysInMoreMenu: false,
			getApplicability: (row, _formData) => {
				if (row.hasOpenForm) {
					return {
						type: 'problem',
						message: t(
							'Cannot share comment while it is being edited.'
						),
					};
				}

				if (row.data.status === ReviewAnnotationStatus.SHARED) {
					return {
						type: 'problem',
						message: t('Comment is already shared.'),
					};
				}
				if (row.data.status === ReviewAnnotationStatus.RESOLVED) {
					return {
						type: 'problem',
						message: t('Comment is already resolved.'),
					};
				}

				return { type: 'ok' };
			},
			confirmationHeading: t('Share'),
			renderConfirmationMessage: ({ okCount, problemCount }) =>
				t(
					'Are you sure you want to share {OK_COUNT, plural, one {1 comment} other {# comments}}? {PROBLEM_COUNT, plural, one {1 comment} other {# comments}} cannot be shared.',
					{ OK_COUNT: okCount, PROBLEM_COUNT: problemCount }
				),
			confirmationButtonLabel: t('Confirm'),
		},
	];

export default batchActions;
