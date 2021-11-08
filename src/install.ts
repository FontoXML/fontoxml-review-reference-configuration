import registerTextRangeReviewAnnotationType from 'fontoxml-feedback/src/registerTextRangeReviewAnnotationType';
import registerPublicationReviewAnnotationType from 'fontoxml-feedback/src/registerPublicationReviewAnnotationType';
import registerObjectReviewAnnotationType from 'fontoxml-feedback/src/registerObjectReviewAnnotationType';
import setInitialFilterFormValues from 'fontoxml-feedback/src/setInitialFilterFormValues';
import uiManager from 'fontoxml-modular-ui/src/uiManager';

import CommentCardContent from './ui/comment/CommentCardContent';
import ProposalCardContent from './ui/proposal/ProposalCardContent';

import FilterFormSummaryChips from './ui/FilterFormSummaryChips';
import FilterForm from './ui/FilterForm';

import MastheadForReview from './ui/MastheadForReview';

export default function install() {
	registerTextRangeReviewAnnotationType('comment', {
		icon: 'fas fa-comment',
		label: 'Comment',
		priority: 3,
		CardContentComponent: CommentCardContent,
	});

	registerObjectReviewAnnotationType('object-comment', {
		// Use a fancier selector here and/or register multiple different object annotation types.
		enabledSelector: 'self::image',
		// This has the same name and icon as the 'comment' text range annotation.
		// The "Insert comment" dropdown and the popover that shows on selection change on the
		// /review route both only show menu items / buttons for annotation types that are enabled.
		// This together leads to a single "Add comment" option that works for text ranges and
		// objects.
		icon: 'fas fa-comment',
		label: 'Comment',
		priority: 3,
		CardContentComponent: CommentCardContent,
	});

	registerTextRangeReviewAnnotationType('proposal', {
		icon: 'fas fa-pencil-square-o',
		label: 'Proposal',
		priority: 2,
		CardContentComponent: ProposalCardContent,
	});

	registerPublicationReviewAnnotationType('publication-comment', {
		icon: 'global-comments-stacked-icons',
		label: 'Global comment',
		priority: 1,
		CardContentComponent: CommentCardContent,
	});

	setInitialFilterFormValues(
		{ resolutionUnresolved: true },
		{ resolutionUnresolved: true }
	);

	uiManager.registerReactComponent('FilterFormComponent', FilterForm);
	uiManager.registerReactComponent(
		'FilterFormSummaryComponent',
		FilterFormSummaryChips
	);

	uiManager.registerReactComponent('MastheadForReview', MastheadForReview);
}
