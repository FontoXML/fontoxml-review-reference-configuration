import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type {
	ReviewAnnotationsOverviewBatchActionCallback,
	ReviewAnnotationsOverviewBatchActionForm,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import BatchResolveForm from './BatchResolveForm';

const batchActions: (
	| ReviewAnnotationsOverviewBatchActionCallback
	| ReviewAnnotationsOverviewBatchActionForm
)[] = [
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
		icon: 'far fa-users',
		tooltipContent: t('Share the selected comments'),
		isAlwaysInMoreMenu: false,
		getApplicability: (row, _formData) => {
			if (row.data.status === ReviewAnnotationStatus.ARCHIVED) {
				return {
					type: 'problem',
					message: t('This comment is no longer available'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.RESOLVED) {
				return {
					type: 'problem',
					message: t('This comment is already resolved'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('This comment is already shared'),
				};
			}

			return { type: 'ok' };
		},
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for sharing')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for sharing and will be skipped',
						{ PROBLEM_COUNT: problemCount }
					),
		noMoreProblemsMessage: t('All comments are available for sharing'),
	} as ReviewAnnotationsOverviewBatchActionCallback,
	{
		type: 'form',
		Component: BatchResolveForm,
		id: 'resolve-form',
		maxWidth: '42rem',
		label: t('Resolve'),
		icon: 'far fa-check',
		tooltipContent: t('Resolve the selected comments'),
		isAlwaysInMoreMenu: false,
		getApplicability: (row, _formData) => {
			if (row.data.status === ReviewAnnotationStatus.ARCHIVED) {
				return {
					type: 'problem',
					message: t('This comment is no longer available'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.RESOLVED) {
				return {
					type: 'problem',
					message: t('This comment is already resolved'),
				};
			}
			if (row.data.status !== ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('This comment is not shared yet'),
				};
			}

			return { type: 'ok' };
		},
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for resolving')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for resolving and will be skipped',
						{ PROBLEM_COUNT: problemCount }
					),
	} as ReviewAnnotationsOverviewBatchActionForm,
	{
		type: 'callback',
		callback: (applicableRows, { editAnnotation }) => {
			for (const row of applicableRows) {
				editAnnotation(row.data.id, {
					status: ReviewAnnotationStatus.ARCHIVED,
				});
			}
		},
		label: t('Discard'),
		icon: 'far fa-trash-can',
		tooltipContent: t('Discard the selected comments'),
		isAlwaysInMoreMenu: true,
		getApplicability: (row, _formData) => {
			if (row.data.status === ReviewAnnotationStatus.ARCHIVED) {
				return {
					type: 'problem',
					message: t('This comment is no longer available'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.RESOLVED) {
				return {
					type: 'problem',
					message: t('Resolved comments can no longer be discarded'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('Shared comments can no longer be discarded'),
				};
			}

			return { type: 'ok' };
		},
		confirmationMessage: t(
			'This will discard all selected comments and their data. This process cannot be reversed.'
		),
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for discarding')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for discarding and will be skipped',
						{ PROBLEM_COUNT: problemCount }
					),
	} as ReviewAnnotationsOverviewBatchActionCallback,
];

export default batchActions;
