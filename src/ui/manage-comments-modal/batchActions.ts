import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type {
	ReviewAnnotationsOverviewBatchAction,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const batchActions: ReviewAnnotationsOverviewBatchAction[] = [
	{
		type: 'callback',
		callback: (applicableRows, { editAnnotation }) => {
			for (const row of applicableRows) {
				editAnnotation(row.data.id, {
					status: ReviewAnnotationStatus.SHARED,
				});
			}
		},
		label: t('Share'),
		icon: 'share',
		tooltipContent: t('Share the selected comments.'),
		isAlwaysInMoreMenu: false,
		getApplicability: (row, _formData) => {
			if (row.hasOpenForm) {
				return {
					type: 'problem',
					message: t(
						'You cannot share a comment while it is being edited.'
					),
				};
			}

			if (row.data.status === ReviewAnnotationStatus.ARCHIVED) {
				return {
					type: 'problem',
					message: t('This comment is no longer available.'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.RESOLVED) {
				return {
					type: 'problem',
					message: t('This comment is already resolved.'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('This comment is already shared.'),
				};
			}

			return { type: 'ok' };
		},
		confirmationMessage: t(
			'This will share all selected comments and their data. This process cannot be reversed.'
		),
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for sharing.')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for sharing and will be skipped.',
						{ PROBLEM_COUNT: problemCount }
					),
	},
];

export default batchActions;
