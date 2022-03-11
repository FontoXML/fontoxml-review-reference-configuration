import { Block, Flex, Icon, Label } from 'fds/components';
import * as React from 'react';

import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import {
	AnnotationStatus,
	BusyState,
	RecoveryOption,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import commentTypes from '../commentTypes';
import publicationCommentTypes from '../publicationCommentTypes';
import CardErrorFooter from '../shared/CardErrorFooter';
import CardErrors from '../shared/CardErrors';
import CardHeader from '../shared/CardHeader';
import CardRepliesAndResolution from '../shared/CardRepliesAndResolution';
import ErrorStateMessage from '../shared/ErrorStateMessage';
import LoadingStateMessage from '../shared/LoadingStateMessage';
import TruncatedText from '../shared/TruncatedText';
import { CARD_HEADER_HEIGHT } from './../constants';
import CommentAddOrEditForm from './CommentAddOrEditForm';
import CommentCardFooter from './CommentCardFooter';

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
	onProposalMerge: _onProposalMerge,
}) {
	const hasReplyInNonIdleBusyState = React.useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce(
			(hasReplyInNonIdleBusyState, reply) => {
				if (
					!hasReplyInNonIdleBusyState &&
					reply.busyState !== BusyState.IDLE
				) {
					hasReplyInNonIdleBusyState = true;
				}
				return hasReplyInNonIdleBusyState;
			},
			false
		);
	}, [reviewAnnotation.replies]);

	const showReplyButton =
		reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showFooter =
		showReplyButton &&
		(context === FeedbackContextType.EDITOR ||
			context === FeedbackContextType.REVIEW) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.busyState !== BusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	const showErrorFooter =
		reviewAnnotation.error &&
		reviewAnnotation.busyState === BusyState.REMOVING;

	// Replace the whole card if the reviewAnnotation.error is acknowledgeable.
	if (
		reviewAnnotation.error &&
		(reviewAnnotation.error.recovery === RecoveryOption.ACKNOWLEDGEABLE ||
			(reviewAnnotation.busyState === BusyState.IDLE &&
				!hasReplyInNonIdleBusyState))
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
	}
	if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === BusyState.REFRESHING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing comment…')} />
			</Block>
		);
	}
	if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === BusyState.REMOVING
	) {
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
			(commentType) =>
				commentType.value === reviewAnnotation.metadata.commentType
		);
		commentType = commentType
			? commentType.label
			: reviewAnnotation.metadata.commentType;
	}

	let publicationCommentType = null;
	if (
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.type === 'publication-comment'
	) {
		publicationCommentType = publicationCommentTypes.find(
			(publicationCommentType) =>
				publicationCommentType.value ===
				reviewAnnotation.metadata.commentType
		);
		publicationCommentType = publicationCommentType
			? publicationCommentType.label
			: reviewAnnotation.metadata.commentType;
	}

	return (
		<Block
			paddingSize="m"
			data-test-id="fontoxml-review-reference-configuration-comment-card-content"
			data-review-annotation-state={reviewAnnotation.busyState}
			data-review-annotation-type={reviewAnnotation.type}
			data-review-annotation-comment-type={
				reviewAnnotation.metadata.commentType
			}
		>
			<CardHeader
				context={context}
				hasReplyInNonIdleBusyState={hasReplyInNonIdleBusyState}
				isSelectedToShare={isSelectedToShare}
				onReviewAnnotationEdit={onReviewAnnotationEdit}
				onReviewAnnotationRemove={onReviewAnnotationRemove}
				onReviewAnnotationResolve={onReviewAnnotationResolve}
				onReviewAnnotationShare={onReviewAnnotationShare}
				onReviewAnnotationShareAddRemoveToggle={
					onReviewAnnotationShareAddRemoveToggle
				}
				onReviewAnnotationShowInCreatedContext={
					onReviewAnnotationShowInCreatedContext
				}
				onReviewAnnotationShowInResolvedContext={
					onReviewAnnotationShowInResolvedContext
				}
				reviewAnnotation={reviewAnnotation}
			/>

			<Block spaceVerticalSize="m">
				{reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					reviewAnnotation.metadata.comment && (
						<Block>
							<Flex
								style={{ height: CARD_HEADER_HEIGHT }}
								alignItems="center"
								flexDirection="row"
								spaceSize="s"
							>
								{publicationCommentType ? (
									<>
										<Icon
											icon="global-comments-stacked-icons"
											isInline
										/>

										<Label
											data-test-id="comment-type-label"
											isBold
										>
											{` ${publicationCommentType} `}
										</Label>
									</>
								) : (
									<>
										<Icon icon="far fa-comment" />

										<Label
											data-test-id="comment-type-label"
											isBold
										>{` ${commentType} `}</Label>

										{reviewAnnotation.targetFoundForRevision ===
											false && (
											<Icon
												colorName={
													reviewAnnotation.isSelected
														? 'button-warning-background-selected'
														: 'button-warning-background'
												}
												icon="far fa-unlink"
												tooltipContent={t(
													'This comment lost its position in the content'
												)}
											/>
										)}
									</>
								)}
							</Flex>

							{reviewAnnotation.isSelected && (
								<TruncatedText data-test-id="comment">
									{reviewAnnotation.metadata.comment}
								</TruncatedText>
							)}
							{!reviewAnnotation.isSelected && (
								<Label isBlock data-test-id="comment">
									{reviewAnnotation.metadata.comment}
								</Label>
							)}
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

				<CardRepliesAndResolution
					context={context}
					onReplyEdit={onReplyEdit}
					onReplyErrorHide={onReplyErrorHide}
					onReplyFormCancel={onReplyFormCancel}
					onReplyFormSubmit={onReplyFormSubmit}
					onReplyRefresh={onReplyRefresh}
					onReplyRemove={onReplyRemove}
					onReviewAnnotationFormCancel={onReviewAnnotationFormCancel}
					onReviewAnnotationFormSubmit={onReviewAnnotationFormSubmit}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					reviewAnnotation={reviewAnnotation}
				/>

				<CardErrors
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onReviewAnnotationRemove={onReviewAnnotationRemove}
					onReviewAnnotationShare={onReviewAnnotationShare}
					reviewAnnotation={reviewAnnotation}
				/>

				{showFooter && showErrorFooter && (
					<CardErrorFooter
						onReviewAnnotationFormCancel={
							onReviewAnnotationFormCancel
						}
						onReviewAnnotationRemove={onReviewAnnotationRemove}
					/>
				)}

				{showFooter && !showErrorFooter && (
					<CommentCardFooter
						onReplyAdd={onReplyAdd}
						reviewAnnotation={reviewAnnotation}
					/>
				)}
			</Block>
		</Block>
	);
}

export default CommentCardContent;
