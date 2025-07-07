module.exports = function matchAnnotationToCurrentFilter(
	filterFormValueByName,
	annotation
) {
	// This function filters annotations on type AND resolution.

	const isTypeComment =
		annotation.type === 'comment' || annotation.type === 'object-comment';
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

	const isTypePublicationComment = annotation.type === 'publication-comment';
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
