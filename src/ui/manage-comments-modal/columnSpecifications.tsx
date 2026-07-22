import type { FdsDataTableColumnSpecification } from 'fontoxml-design-system/src/types';
import {
	// TODO: move to this application and remove from fontoxml-feedback
	CellComponentForAuthor,
	CellComponentForHierarchyNodeTitle,
	// TODO: move to this application and remove from fontoxml-feedback
	CellComponentForTimestamp,
	// TODO: move to this application and remove from fontoxml-feedback
	CellComponentForType,
	// TODO: move to this application and remove from fontoxml-feedback
	CellComponentForRepliesCount,
	// TODO: move to this application and remove from fontoxml-feedback
	sortByAuthor,
	// TODO: move to this application and remove from fontoxml-feedback
	sortByTimestamp,
	// TODO: move to this application and remove from fontoxml-feedback
	sortByTypePriority,
	// TODO: move to this application and remove from fontoxml-feedback
	sortByRepliesCount,
} from 'fontoxml-feedback/src/reviewAnnotationsOverviewHelpers';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import CellComponentForComment from './cells/CellComponentForComment';
import sortByComment from './cells/sorters/sortByComment';

const columnSpecifications: FdsDataTableColumnSpecification<ReviewAnnotationsOverviewDataTableRow>[] =
	[
		{
			CellComponent: CellComponentForAuthor,
			column: 'author',
			label: t('Author'),
			maxWidth: 250,
			minWidth: 115,
			sortBy: sortByAuthor,
		},
		{
			CellComponent: CellComponentForTimestamp,
			column: 'date',
			label: t('Date'),
			maxWidth: 250,
			minWidth: 101,
			sortBy: sortByTimestamp,
		},
		{
			CellComponent: CellComponentForHierarchyNodeTitle,
			column: 'topic',
			label: t('Topic'),
			maxWidth: 250,
			minWidth: 113,
			// This effectively means sort it back in the order the rows were given, which is in
			// document order.
			sortBy: () => 0,
		},
		{
			CellComponent: CellComponentForType,
			column: 'type',
			initialWidth: '126px',
			isInitiallyVisible: true,
			label: t('Type'),
			maxWidth: 126,
			minWidth: 126,
			sortBy: sortByTypePriority,
		},
		{
			CellComponent: CellComponentForComment,
			canBeHidden: false,
			column: 'comment',
			label: t('Comment or Proposal'),
			maxWidth: 350,
			minWidth: 135,
			sortBy: sortByComment,
		},
		// {
		// 	CellComponent: CellComponentForProposedChange,
		// 	column: 'proposedChange',
		// 	label: t('Proposed change'),
		// 	maxWidth: 350,
		// 	minWidth: 184,
		// 	sortBy: sortByProposedChange,
		// },
		{
			CellComponent: CellComponentForRepliesCount,
			column: 'replies',
			initialWidth: '148px',
			label: t('Replies'),
			maxWidth: 148,
			minWidth: 148,
			sortBy: sortByRepliesCount,
		},
		// {
		// 	CellComponent: CellComponentForResolution,
		// 	column: 'resolution',
		// 	initialWidth: '139px',
		// 	label: t('Resolution'),
		// 	maxWidth: 139,
		// 	minWidth: 139,
		// 	sortBy: sortByResolution,
		// },
	];

export default columnSpecifications;
