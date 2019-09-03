// These 'types' are 'subtypes' of the registered feedback type 'comment'.
// In the filter form and logic you'll see these grouped together with the other registered
// feedback type 'proposal'.
// Doing it this way results in a UX where you can choose between 'Comment' and 'Proposal' while
// creating a feedback item. If you choose 'Comment', you'll get the choice of these 'subtypes' in
// the add item form.
// The choice between 'comment' and 'proposal' is stored on the item.type (different registered
// feedback types, see install.js).
// The choice between the comment types is stored on item.metadata.type.
// As you'll see in the FilterForm.jsx, this information is combined into a choice between 4 radio
// buttons.

const commentTypes = [
	{ value: 'technical', label: 'Technical comment' },
	{ value: 'general', label: 'General comment' },
	{ value: 'editorial', label: 'Editorial comment' }
];
export default commentTypes;
