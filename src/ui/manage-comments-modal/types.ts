export type ReviewAnnotationMetadata = {
	comment: string;
	commentType: 'editorial' | 'general' | 'technical';
	proposedChange?: string;
};

export type ReviewAnnotationResolvedMetadata = {
	resolution: 'accepted' | 'rejected';
	resolutionComment?: string;
};
