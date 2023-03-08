import configureReviewFilters from 'fontoxml-feedback/src/configureReviewFilters';
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

	// This is a test annotation type that is only enabled for a specific document.
	registerTextRangeReviewAnnotationType('enabled-selector-comment', {
		enabledSelector: 'fonto:remote-document-id(fonto:selection-common-ancestor()) = "clogs/sample.xml"',
		icon: 'far fa-comment',
		label: 'EnabledSelector comment',
		priority: -1,
		CardContentComponent: CommentCardContent,
		tooltipContent: t('Add test comment to selected text.'),
		keyBinding: 'ctrl+alt+shift+m',
		osxKeyBinding: 'cmd+alt+shift+m',
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

	// Review annotation type for testing the enabledSelector option.
	registerPublicationReviewAnnotationType('enabled-selector-publication-comment', {
		enabledSelector: 'fonto:remote-document-id(fonto:selection-common-ancestor()) = "clogs/sample.xml"',
		icon: 'global-comments-stacked-icons',
		label: 'EnabledSelector Global comment',
		priority: -2,
		CardContentComponent: CommentCardContent,
		tooltipContent: t(
			'Add a test comment that applies to the entire publication.'
		),
		keyBinding: 'ctrl+alt+shift+g',
		osxKeyBinding: 'cmd+alt+shift+g',
	});

	configureReviewFilters({
		FormComponent: FilterForm,
		FormSummaryComponent: FilterFormSummaryChips,
		initialFilterStateForEditor: { resolutionUnresolved: true },
		initialFilterStateForReview: { resolutionUnresolved: true }
	});

	uiManager.registerReactComponent('MastheadForReview', MastheadForReview);

	uiManager.registerCustomIcon(
		'global-comments-stacked-icons',
		globalCommentsStackedIcons
	);
}
