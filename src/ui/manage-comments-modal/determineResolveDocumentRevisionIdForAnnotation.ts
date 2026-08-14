import documentsHierarchy from 'fontoxml-documents/src/documentsHierarchy';
import documentsManager from 'fontoxml-documents/src/documentsManager';
import type { HierarchyNodeId, DocumentId } from 'fontoxml-documents/src/types';
import { GLOBAL_HIERARCHY_NODE_ID } from 'fontoxml-feedback/src/api/constants';
import getDocumentIdOrOverride from 'fontoxml-feedback/src/api/getDocumentIdOrOverride';
import feedbackDataManager from 'fontoxml-feedback/src/feedbackDataManager';
import feedbackTargetsManager from 'fontoxml-feedback/src/feedbackTargetsManager';
import type { ReviewAnnotationId } from 'fontoxml-feedback/src/types';

// Similar to from fontoxml-feedback/src/api/annotationEdits.ts resolveAnnotation()
export default function determineResolvedDocumentRevisionIdForAnnotation(
	hierarchyNodeId: HierarchyNodeId,
	annotationId: ReviewAnnotationId
): string {
	let documentId: DocumentId | undefined;
	if (hierarchyNodeId === GLOBAL_HIERARCHY_NODE_ID) {
		const annotationData =
			feedbackDataManager.getAnnotationData(annotationId);
		if (!annotationData) {
			throw new Error(
				`Could not resolve annotation ${annotationId} because there is no annotationData for it.`
			);
		}
		// TODO: getDocumentIdOrOverride is a deep import, do we even need it?
		documentId =
			getDocumentIdOrOverride(annotationData.documentId) ?? undefined;
	} else {
		documentId =
			documentsHierarchy.get(hierarchyNodeId)?.documentReference
				?.documentId ?? undefined;
	}
	if (!documentId) {
		throw new Error(
			`Could not resolve annotation ${annotationId} because there is no loaded document for the given hierarchyNodeId ${hierarchyNodeId}`
		);
	}
	const documentFile = documentsManager.getDocumentFile(documentId);
	if (!documentFile) {
		throw new Error(
			`Could not resolve annotation ${annotationId} because there is no DocumentFile for document ${documentId}`
		);
	}
	return (
		feedbackTargetsManager.getResolvedDocumentRevisionId(documentId) ??
		documentFile.revisionId
	);
}
