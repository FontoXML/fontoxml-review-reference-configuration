import configureFilters from 'fontoxml-feedback/src/configureFilters';
import registerObjectReviewAnnotationType from 'fontoxml-feedback/src/registerObjectReviewAnnotationType';
import registerPublicationReviewAnnotationType from 'fontoxml-feedback/src/registerPublicationReviewAnnotationType';
import registerTextRangeReviewAnnotationType from 'fontoxml-feedback/src/registerTextRangeReviewAnnotationType';
import t from 'fontoxml-localization/src/t';
import uiManager from 'fontoxml-modular-ui/src/uiManager';

import CommentCardContent from './ui/comment/CommentCardContent';
import FilterForm from './ui/FilterForm';
import FilterFormSummaryChips from './ui/FilterFormSummaryChips';
import globalCommentsStackedIcons from './ui/global-comments-stacked-icons.svg';
import MastheadForReview from './ui/MastheadForReview';
import ProposalCardContent from './ui/proposal/ProposalCardContent';

export default function install(): void {
	registerTextRangeReviewAnnotationType('comment', {
		icon: 'far fa-comment',
		label: 'Comment',
		priority: 3,
		CardContentComponent: CommentCardContent,
		tooltipContent: t('Add comment to selected text.'),
		keyBinding: 'ctrl+alt+m',
		osxKeyBinding: 'cmd+alt+m',
	});

	registerObjectReviewAnnotationType('object-comment', {
		// Use a fancier selector here and/or register multiple different object annotation types.
		enabledSelector: 'self::image',
		// This has the same name and icon as the 'comment' text range annotation.
		// The "Insert comment" dropdown and the popover that shows on selection change on the
		// /review route both only show menu items / buttons for annotation types that are enabled.
		// This together leads to a single "Add comment" option that works for text ranges and
		// objects.
		icon: 'far fa-comment',
		label: 'Comment',
		priority: 3,
		CardContentComponent: CommentCardContent,
		tooltipContent: t('Add comment to selected image.'),
		keyBinding: 'ctrl+alt+m',
		osxKeyBinding: 'cmd+alt+m',
	});

	registerTextRangeReviewAnnotationType('proposal', {
		icon: 'far fa-edit',
		label: 'Proposal',
		priority: 2,
		CardContentComponent: ProposalCardContent,
		tooltipContent: t('Propose a change to selected text.'),
		keyBinding: 'ctrl+alt+e',
		osxKeyBinding: 'cmd+alt+e',
	});

	registerPublicationReviewAnnotationType('publication-comment', {
		icon: 'global-comments-stacked-icons',
		label: 'Global comment',
		priority: 1,
		CardContentComponent: CommentCardContent,
		tooltipContent: t(
			'Add comment that applies to the entire publication.'
		),
		keyBinding: 'ctrl+alt+g',
		osxKeyBinding: 'cmd+alt+g',
	});

	configureFilters({
		FormComponent: FilterForm,
		FormSummaryComponent: FilterFormSummaryChips,
		initialFiltersStateOnEditor: { resolutionUnresolved: true },
		initialFiltersStateOnReview: { resolutionUnresolved: true },
		isAnyFilterActivated: (currentFilterFormValues) => {
			// Take all filter values and check if at least one filter is actived.
			const filterFormValues = Object.values(currentFilterFormValues);
			return filterFormValues.some(filterFormValue => filterFormValue);
		}
	});

	uiManager.registerReactComponent('MastheadForReview', MastheadForReview);

	uiManager.registerCustomIcon(
		'global-comments-stacked-icons',
		globalCommentsStackedIcons
	);
}
