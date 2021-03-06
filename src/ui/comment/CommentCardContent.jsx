import React, { Fragment, useMemo } from 'react';

import { Block, Flex, HorizontalSeparationLine, Icon, Label, Text } from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption,
	TargetType
} from 'fontoxml-feedback/src/types.js';

import t from 'fontoxml-localization/src/t.js';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel.jsx';
import CardFooter from '../shared/CardFooter.jsx';
import CardHeader from '../shared/CardHeader.jsx';
import ErrorStateMessage from '../shared/ErrorStateMessage.jsx';
import LoadingStateMessage from '../shared/LoadingStateMessage.jsx';
import ResolveForm from '../shared/ResolveForm.jsx';
import Replies from '../shared/Replies.jsx';

import commentTypes from '../commentTypes.jsx';
import publicationCommentTypes from '../publicationCommentTypes.jsx';
import resolutions from '../feedbackResolutions.jsx';

import CommentAddOrEditForm from './CommentAddOrEditForm.jsx';
import CommentReplyContent from './CommentReplyContent.jsx';

// 'outdent' the icon container to align it with other icons above it
const iconContainerStyles = { marginLeft: '-26px' };

function CommentCardContent({
	context,
	isSelectedToShare,
	reviewAnnotation,
	onReviewAnnotationEdit,
	onReviewAnnotationErrorAcknowledge,
	onReviewAnnotationFormCancel,
	onReviewAnnotationFormSubmit,
	onReviewAnnotationRefresh,
	onReviewAnnotationRemove,
	onReviewAnnotationResolve,
	onReviewAnnotationShare,
	onReviewAnnotationShareAddRemoveToggle,
	onReviewAnnotationShowInCreatedContext,
	onReviewAnnotationShowInResolvedContext,
	onReplyAdd,
	onReplyEdit,
	onReplyFormCancel,
	onReplyFormSubmit,
	onReplyErrorHide,
	onReplyRefresh,
	onReplyRemove,
	// These are only used by ProposalCardContent, so alias them to a arg beginning with _ to make eslint happy
	proposalState: _proposalState,
	onProposalMerge: _onProposalMerge
}) {
	const hasReplyInNonIdleBusyState = useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce((hasReplyInNonIdleBusyState, reply) => {
			if (!hasReplyInNonIdleBusyState && reply.busyState !== BusyState.IDLE) {
				hasReplyInNonIdleBusyState = true;
			}
			return hasReplyInNonIdleBusyState;
		}, false);
	}, [reviewAnnotation.replies]);

	const showCreatedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showResolvedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL &&
		reviewAnnotation.status === AnnotationStatus.RESOLVED;

	const showReplyButton = reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showResolveButton =
		reviewAnnotation.status !== AnnotationStatus.PRIVATE &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showShareButton =
		reviewAnnotation.status === AnnotationStatus.PRIVATE &&
		(context === ContextType.EDITOR_SIDEBAR || context === ContextType.REVIEW_SIDEBAR);

	const showAnyFooterButton =
		showCreatedContextButton ||
		showResolvedContextButton ||
		showReplyButton ||
		showResolveButton ||
		showShareButton;

	const showFooter =
		showAnyFooterButton &&
		(context === ContextType.EDITOR_SIDEBAR || context === ContextType.REVIEW_SIDEBAR) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.busyState !== BusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	// Replace the whole card if the reviewAnnotation.error is acknowledgeable.
	if (
		reviewAnnotation.error &&
		(reviewAnnotation.error.recovery === RecoveryOption.ACKNOWLEDGEABLE ||
			(reviewAnnotation.busyState === BusyState.IDLE && !hasReplyInNonIdleBusyState))
	) {
		return (
			<Block paddingSize="m">
				<ErrorStateMessage
					error={reviewAnnotation.error}
					onAcknowledge={onReviewAnnotationErrorAcknowledge}
					onRefresh={onReviewAnnotationRefresh}
				/>
			</Block>
		);
	} else if (reviewAnnotation.isLoading && reviewAnnotation.busyState === BusyState.REFRESHING) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing comment…')} />
			</Block>
		);
	} else if (reviewAnnotation.isLoading && reviewAnnotation.busyState === BusyState.REMOVING) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Removing comment…')} />
			</Block>
		);
	}

	let commentType = null;
	if (
		(reviewAnnotation.busyState !== BusyState.ADDING &&
			reviewAnnotation.busyState !== BusyState.EDITING &&
			reviewAnnotation.type === 'comment') ||
		reviewAnnotation.type === 'object-comment'
	) {
		commentType = commentTypes.find(
			commentType => commentType.value === reviewAnnotation.metadata.commentType
		);
		commentType = commentType ? commentType.label : reviewAnnotation.metadata.commentType;
	}

	let publicationCommentType = null;
	if (
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.type === 'publication-comment'
	) {
		publicationCommentType = publicationCommentTypes.find(
			publicationCommentType =>
				publicationCommentType.value === reviewAnnotation.metadata.commentType
		);
		publicationCommentType = publicationCommentType
			? publicationCommentType.label
			: reviewAnnotation.metadata.commentType;
	}

	const resolution =
		reviewAnnotation.resolvedMetadata &&
		resolutions.find(
			resolution => resolution.value === reviewAnnotation.resolvedMetadata.resolution
		);

	return (
		<>
			<Block paddingSize="m" spaceVerticalSize="m">
				<CardHeader
					context={context}
					hasReplyInNonIdleBusyState={hasReplyInNonIdleBusyState}
					isSelectedToShare={isSelectedToShare}
					reviewAnnotation={reviewAnnotation}
					onReviewAnnotationEdit={onReviewAnnotationEdit}
					onReviewAnnotationRemove={onReviewAnnotationRemove}
					onReviewAnnotationShareAddRemoveToggle={onReviewAnnotationShareAddRemoveToggle}
					showEditButton={
						context !== ContextType.CREATED_CONTEXT_MODAL &&
						context !== ContextType.RESOLVED_CONTEXT_MODAL
					}
					showRemoveButton={
						context !== ContextType.CREATED_CONTEXT_MODAL &&
						context !== ContextType.RESOLVED_CONTEXT_MODAL &&
						reviewAnnotation.status === AnnotationStatus.PRIVATE
					}
				/>

				{reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					reviewAnnotation.metadata.comment && (
						<Block spaceVerticalSize="m">
							<Block spaceVerticalSize="m">
								{publicationCommentType ? (
									<Flex alignItems="center" flexDirection="row" spaceSize="s">
										<Icon icon="files-o" />
										<Label isBold> {publicationCommentType} </Label>
									</Flex>
								) : (
									<Flex alignItems="center" flexDirection="row" spaceSize="s">
										<Icon icon="fas fa-comment" />
										<Label isBold> {commentType} </Label>
									</Flex>
								)}

								{reviewAnnotation.isSelected && (
									<Text>{reviewAnnotation.metadata.comment}</Text>
								)}
								{!reviewAnnotation.isSelected && (
									<Label isBlock>{reviewAnnotation.metadata.comment}</Label>
								)}
							</Block>
						</Block>
					)}

				{(reviewAnnotation.busyState === BusyState.ADDING ||
					reviewAnnotation.busyState === BusyState.EDITING) && (
					<CommentAddOrEditForm
						reviewAnnotation={reviewAnnotation}
						onCancel={onReviewAnnotationFormCancel}
						onReviewAnnotationRefresh={onReviewAnnotationRefresh}
						onSubmit={onReviewAnnotationFormSubmit}
					/>
				)}

				{!reviewAnnotation.isSelected &&
					(reviewAnnotation.replies.length > 0 ||
						reviewAnnotation.status === AnnotationStatus.RESOLVED) && (
						<Block>
							<HorizontalSeparationLine marginSizeBottom="m" />

							<Flex spaceSize="s">
								<Icon icon="fas fa-reply" />
								<Label>
									{t('{REPLIES_COUNT, plural, one {1 reply} other {# replies}}', {
										REPLIES_COUNT:
											reviewAnnotation.replies.length +
											(reviewAnnotation.status === AnnotationStatus.RESOLVED
												? 1
												: 0)
									})}
								</Label>
							</Flex>
						</Block>
					)}

				{reviewAnnotation.isSelected &&
					reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					reviewAnnotation.replies.length > 0 && (
						<Replies
							ContentComponent={CommentReplyContent}
							context={context}
							hasResolution={!!resolution}
							reviewAnnotation={reviewAnnotation}
							onReplyEdit={onReplyEdit}
							onReplyFormCancel={onReplyFormCancel}
							onReplyFormSubmit={onReplyFormSubmit}
							onReplyErrorHide={onReplyErrorHide}
							onReplyRefresh={onReplyRefresh}
							onReplyRemove={onReplyRemove}
						/>
					)}

				{reviewAnnotation.isSelected && resolution && (
					<Fragment>
						<HorizontalSeparationLine />

						<Block applyCss={{ paddingLeft: '26px' }} spaceVerticalSize="m">
							<Flex
								alignItems="center"
								applyCss={iconContainerStyles}
								flex="none"
								spaceSize="s"
							>
								{resolution.value === 'accepted' && <Icon icon="check" />}
								{resolution.value === 'rejected' && <Icon icon="times" />}

								<AuthorAndTimestampLabel
									reviewAnnotation={reviewAnnotation}
									forResolvedReviewAnnotation={true}
								/>
							</Flex>

							<Block spaceVerticalSize="s">
								<Flex spaceSize="s">
									{resolution.value === 'accepted' && (
										<Icon icon="fas fa-check-square" />
									)}

									{resolution.value === 'rejected' && (
										<Icon icon="fas fa-times-square" />
									)}
									<Label isBold isBlock>
										{t(resolution.displayLabel)}
									</Label>
								</Flex>

								<Text>
									{reviewAnnotation.resolvedMetadata &&
										reviewAnnotation.resolvedMetadata.resolutionComment}
								</Text>
							</Block>
						</Block>
					</Fragment>
				)}

				{reviewAnnotation.isSelected &&
					reviewAnnotation.busyState === BusyState.RESOLVING && (
						<ResolveForm
							reviewAnnotation={reviewAnnotation}
							onCancel={onReviewAnnotationFormCancel}
							onReviewAnnotationRefresh={onReviewAnnotationRefresh}
							onSubmit={onReviewAnnotationFormSubmit}
						/>
					)}

				{reviewAnnotation.error && reviewAnnotation.busyState === BusyState.SHARING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}

				{reviewAnnotation.error && reviewAnnotation.busyState === BusyState.REMOVING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
			</Block>

			{showFooter && (
				<CardFooter
					reviewAnnotation={reviewAnnotation}
					onReviewAnnotationFormCancel={onReviewAnnotationFormCancel}
					onReviewAnnotationRemove={onReviewAnnotationRemove}
					onReviewAnnotationResolve={onReviewAnnotationResolve}
					onReviewAnnotationShare={onReviewAnnotationShare}
					onReviewAnnotationShowInCreatedContext={onReviewAnnotationShowInCreatedContext}
					onReviewAnnotationShowInResolvedContext={
						onReviewAnnotationShowInResolvedContext
					}
					onReplyAdd={onReplyAdd}
					showAcceptProposalButton={false}
					showCreatedContextButton={showCreatedContextButton}
					showResolvedContextButton={showResolvedContextButton}
					showReplyButton={showReplyButton}
					showResolveButton={showResolveButton}
					showShareButton={showShareButton}
				/>
			)}
		</>
	);
}

export default CommentCardContent;
