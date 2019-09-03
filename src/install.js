import registerReviewAnnotationType from 'fontoxml-feedback/src/registerReviewAnnotationType.js';
import setInitialFilterFormValues from 'fontoxml-feedback/src/setInitialFilterFormValues.js';
import uiManager from 'fontoxml-modular-ui/src/uiManager.js';

import CommentCardContent from './ui/comment/CommentCardContent.jsx';
import ProposalCardContent from './ui/proposal/ProposalCardContent.jsx';

import FilterFormSummaryChips from './ui/FilterFormSummaryChips.jsx';
import FilterForm from './ui/FilterForm.jsx';

import MastheadForReview from './ui/MastheadForReview.jsx';

import SheetFrameHeader from './ui/SheetFrameHeader.jsx';

export default function install() {
	registerReviewAnnotationType('comment', {
		icon: 'comment',
		label: 'Add comment',
		priority: 2,
		CardContentComponent: CommentCardContent
	});

	registerReviewAnnotationType('proposal', {
		icon: 'pencil-square-o',
		label: 'Add proposal',
		priority: 1,
		CardContentComponent: ProposalCardContent
	});

	setInitialFilterFormValues({ resolutionUnresolved: true }, { resolutionUnresolved: true });

	uiManager.registerReactComponent('FilterFormComponent', FilterForm);
	uiManager.registerReactComponent('FilterFormSummaryComponent', FilterFormSummaryChips);

	uiManager.registerReactComponent('MastheadForReview', MastheadForReview);

	uiManager.registerReactComponent('SheetFrameHeader', SheetFrameHeader);
}
