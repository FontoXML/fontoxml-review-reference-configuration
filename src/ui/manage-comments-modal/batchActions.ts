import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type { ReviewAnnotationsOverviewBatchAction } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import BatchResolveForm from './BatchResolveForm';
import determineResolvedDocumentRevisionIdForAnnotation from './determineResolveDocumentRevisionIdForAnnotation';
import type { ReviewAnnotationResolvedMetadata } from './types';

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
		icon: 'far fa-users',
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
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for sharing.')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for sharing and will be skipped.',
						{ PROBLEM_COUNT: problemCount }
					),
		noMoreProblemsMessage: t('All comments are available for sharing.'),
	},
	{
		type: 'callback-with-form',
		Component: BatchResolveForm,
		id: 'resolve-form',
		maxWidth: '42rem',
		callback: (applicableRows, data, { editAnnotation }) => {
			for (const row of applicableRows) {
				const hierarchyNodeId = row.hierarchyNodeId;
				const resolvedDocumentRevisionId =
					determineResolvedDocumentRevisionIdForAnnotation(
						hierarchyNodeId,
						row.data.id
					);

				editAnnotation(row.data.id, {
					resolvedDocumentRevisionId,
					resolvedMetadata: {
						resolution: data.resolution,
						resolutionComment: data.resolutionComment,
					} as ReviewAnnotationResolvedMetadata,
					status: ReviewAnnotationStatus.RESOLVED,
				});
			}
		},
		label: t('Resolve'),
		icon: 'far fa-check',
		tooltipContent: t('Resolve the selected comments.'),
		isAlwaysInMoreMenu: false,
		getApplicability: (row, _formData) => {
			if (row.hasOpenForm) {
				return {
					type: 'problem',
					message: t(
						'You cannot resolve a comment while it is being edited.'
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
			if (row.data.status !== ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('This comment is not shared yet.'),
				};
			}

			return { type: 'ok' };
		},
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for resolving.')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for resolving and will be skipped.',
						{ PROBLEM_COUNT: problemCount }
					),
	},
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
		tooltipContent: t('Discard the selected comments.'),
		isAlwaysInMoreMenu: true,
		getApplicability: (row, _formData) => {
			if (row.hasOpenForm) {
				return {
					type: 'problem',
					message: t(
						'You cannot discard a comment while it is being edited.'
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
					message: t('Resolved comments can no longer be discarded.'),
				};
			}
			if (row.data.status === ReviewAnnotationStatus.SHARED) {
				return {
					type: 'problem',
					message: t('Shared comments can no longer be discarded.'),
				};
			}

			return { type: 'ok' };
		},
		confirmationMessage: t(
			'This will discard all selected comments and their data. This process cannot be reversed.'
		),
		renderProblemWarningMessage: ({ okCount, problemCount }) =>
			okCount === 0
				? t('No selected comments are available for discarding.')
				: t(
						'{PROBLEM_COUNT, plural, one {1 comment is} other {# comments are}} not available for discarding and will be skipped.',
						{ PROBLEM_COUNT: problemCount }
					),
	},
];

export default batchActions;
