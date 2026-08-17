import type { FdsDataTableColumnSpecification } from 'fontoxml-design-system/src/types';
import { CellComponentForHierarchyNodeTitle } from 'fontoxml-feedback/src/reviewAnnotationsOverviewHelpers';
import type { ReviewAnnotationsOverviewDataTableRow } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import CellComponentForAuthor from './cells/CellComponentForAuthor';
import CellComponentForComment from './cells/CellComponentForComment';
import CellComponentForProposedChange from './cells/CellComponentForProposedChange';
import CellComponentForRepliesCount from './cells/CellComponentForRepliesCount';
import CellComponentForStatus from './cells/CellComponentForStatus';
import CellComponentForTimestamp from './cells/CellComponentForTimestamp';
import CellComponentForType from './cells/CellComponentForType';
import sortByAuthor from './cells/sorters/sortByAuthor';
import sortByComment from './cells/sorters/sortByComment';
import sortByProposedChange from './cells/sorters/sortByProposedChange';
import sortByRepliesCount from './cells/sorters/sortByRepliesCount';
import sortByStatus from './cells/sorters/sortByStatus';
import sortByTimestamp from './cells/sorters/sortByTimestamp';
import sortByType from './cells/sorters/sortByType';

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
			initialWidth: '144px',
			isInitiallyVisible: true,
			label: t('Type'),
			maxWidth: 144,
			minWidth: 144,
			sortBy: sortByType,
		},
		{
			CellComponent: CellComponentForComment,
			canBeHidden: false,
			column: 'comment',
			label: t('Comment'),
			maxWidth: 350,
			minWidth: 135,
			sortBy: sortByComment,
		},
		{
			CellComponent: CellComponentForProposedChange,
			column: 'proposedChange',
			label: t('Proposed change'),
			maxWidth: 350,
			minWidth: 184,
			sortBy: sortByProposedChange,
		},
		{
			CellComponent: CellComponentForRepliesCount,
			column: 'replies',
			initialWidth: '148px',
			label: t('Replies'),
			maxWidth: 148,
			minWidth: 148,
			sortBy: sortByRepliesCount,
		},
		{
			CellComponent: CellComponentForStatus,
			column: 'status',
			initialWidth: '115px',
			label: t('Status'),
			maxWidth: 115,
			minWidth: 115,
			sortBy: sortByStatus,
		},
	];

export default columnSpecifications;
