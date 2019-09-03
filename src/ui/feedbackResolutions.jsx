// These are the possible values for the 'resolution' field in item.resolvedMetadata.
// This does not include the 'unresolved' option because you cannot 'resolve' something by choosing
// and 'unresolved' resolution conceptually.
// The label is used in the form, the displayLabel is used when displaying the resolution in a
// resolved card.

const resolutions = [
	{ value: 'accepted', label: 'accept', displayLabel: 'Accepted' },
	{ value: 'rejected', label: 'reject', displayLabel: 'Rejected' }
];
export default resolutions;
