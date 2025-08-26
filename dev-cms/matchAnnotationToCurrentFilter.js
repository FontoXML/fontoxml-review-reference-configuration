module.exports = function matchAnnotationToCurrentFilter(
	filterFormValueByName,
	annotation,
	navigatorId
) {
	// The following logic corresponds to the filters configured for the "comments-and-proposals"
	// navigator(Id) registered in this package's install.ts file.
	// If your application supports multiple navigators, use the navigatorId argument to apply the
	// appropriate filtering logic for each navigator.
	// You can also have this inside the configureDevCms file in your dev-cms application folder,
	// which can then conditionally delegate to this function if the navigatorId matches.

	// First make sure annotation.type matches one of the types configured for this navigator.
	if (
		annotation.type !== 'comment' &&
		annotation.type !== 'object-comment' &&
		annotation.type !== 'publication-comment' &&
		annotation.type !== 'proposal' &&
		annotation.type !== 'enabled-selector-comment' &&
		annotation.type !== 'enabled-selector-publication-comment'
	) {
		return false;
	}

	// This function filters "comments-and-proposals" annotations on type AND resolution.

	const isTypeComment =
		annotation.type === 'comment' ||
		annotation.type === 'object-comment' ||
		annotation.type === 'enabled-selector-comment';
	const isTypeCommentTechnical =
		isTypeComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'technical';
	const isTypeCommentGeneral =
		isTypeComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'general';
	const isTypeCommentEditorial =
		isTypeComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'editorial';

	const isTypePublicationComment =
		annotation.type === 'publication-comment' ||
		annotation.type === 'enabled-selector-publication-comment';
	const isTypePublicationCommentTechnical =
		isTypePublicationComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'technical';
	const isTypePublicationCommentGeneral =
		isTypePublicationComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'general';
	const isTypePublicationCommentEditorial =
		isTypePublicationComment &&
		annotation.metadata &&
		annotation.metadata.commentType === 'editorial';

	const isTypeProposal = annotation.type === 'proposal';

	const isResolved = annotation.status === 'ANNOTATION_STATUS_RESOLVED';
	const isResolvedAndAccepted =
		isResolved &&
		annotation.resolvedMetadata &&
		annotation.resolvedMetadata.resolution === 'accepted';
	const isResolvedAndRejected =
		isResolved &&
		annotation.resolvedMetadata &&
		annotation.resolvedMetadata.resolution === 'rejected';
	const isUnresolved = !isResolved;

	const matchesType =
		(filterFormValueByName.typeComment && isTypeComment) ||
		(filterFormValueByName.typeCommentTechnical &&
			isTypeCommentTechnical) ||
		(filterFormValueByName.typeCommentGeneral && isTypeCommentGeneral) ||
		(filterFormValueByName.typeCommentEditorial &&
			isTypeCommentEditorial) ||
		//
		(filterFormValueByName.typePublicationComment &&
			isTypePublicationComment) ||
		(filterFormValueByName.typePublicationCommentTechnical &&
			isTypePublicationCommentTechnical) ||
		(filterFormValueByName.typePublicationCommentGeneral &&
			isTypePublicationCommentGeneral) ||
		(filterFormValueByName.typePublicationCommentEditorial &&
			isTypePublicationCommentEditorial) ||
		//
		(filterFormValueByName.typeProposal && isTypeProposal) ||
		//
		(!filterFormValueByName.typeComment &&
			!filterFormValueByName.typeCommentTechnical &&
			!filterFormValueByName.typeCommentGeneral &&
			!filterFormValueByName.typeCommentEditorial &&
			//
			!filterFormValueByName.typePublicationComment &&
			!filterFormValueByName.typePublicationCommentTechnical &&
			!filterFormValueByName.typePublicationCommentGeneral &&
			!filterFormValueByName.typePublicationCommentEditorial &&
			//
			!filterFormValueByName.typeProposal);

	const matchesResolution =
		(filterFormValueByName.resolutionResolved && isResolved) ||
		(filterFormValueByName.resolutionResolvedAccepted &&
			isResolvedAndAccepted) ||
		(filterFormValueByName.resolutionResolvedRejected &&
			isResolvedAndRejected) ||
		(filterFormValueByName.resolutionUnresolved && isUnresolved) ||
		(!filterFormValueByName.resolutionResolved &&
			!filterFormValueByName.resolutionResolvedAccepted &&
			!filterFormValueByName.resolutionResolvedRejected &&
			!filterFormValueByName.resolutionUnresolved);

	return matchesType && matchesResolution;
};
