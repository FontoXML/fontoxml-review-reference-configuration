import * as React from 'react';

import {
	Block,
	Flex,
	Icon,
	Label,
} from 'fontoxml-design-system/src/components';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import {
	ReviewAnnotationStatus,
	ReviewBusyState,
	ReviewRecoveryOption,
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
	focusableRef,
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
	rangeVisibility,
}: ReviewCardContentComponentProps) {
	const hasReplyInNonIdleBusyState = React.useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce(
			(hasReplyInNonIdleBusyState, reply) => {
				if (
					!hasReplyInNonIdleBusyState &&
					reply.busyState !== ReviewBusyState.IDLE
				) {
					hasReplyInNonIdleBusyState = true;
				}
				return hasReplyInNonIdleBusyState;
			},
			false
		);
	}, [reviewAnnotation.replies]);

	const showReplyButton =
		reviewAnnotation.status !== ReviewAnnotationStatus.RESOLVED;

	const showFooter =
		showReplyButton &&
		(context === FeedbackContextType.EDITOR ||
			context === FeedbackContextType.REVIEW) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
		reviewAnnotation.busyState !== ReviewBusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	const showErrorFooter =
		reviewAnnotation.error &&
		reviewAnnotation.busyState === ReviewBusyState.REMOVING;

	// Replace the whole card if the reviewAnnotation.error is acknowledgeable.
	if (
		typeof reviewAnnotation.error !== 'number' &&
		reviewAnnotation.error &&
		(reviewAnnotation.error.recovery ===
			ReviewRecoveryOption.ACKNOWLEDGEABLE ||
			(reviewAnnotation.busyState === ReviewBusyState.IDLE &&
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
		reviewAnnotation.busyState === ReviewBusyState.REFRESHING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing comment…')} />
			</Block>
		);
	}
	if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === ReviewBusyState.REMOVING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Removing comment…')} />
			</Block>
		);
	}

	let commentType = null;
	if (
		(reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
			reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
			reviewAnnotation.type === 'comment') ||
		reviewAnnotation.type === 'object-comment'
	) {
		commentType = commentTypes.find(
			(commentType) =>
				commentType.value === reviewAnnotation.metadata['commentType']
		);
		commentType = commentType
			? commentType.label
			: reviewAnnotation.metadata['commentType'];
	}

	let publicationCommentType = null;
	if (
		reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
		reviewAnnotation.type === 'publication-comment'
	) {
		publicationCommentType = publicationCommentTypes.find(
			(publicationCommentType) =>
				publicationCommentType.value ===
				reviewAnnotation.metadata['commentType']
		);
		publicationCommentType = publicationCommentType
			? publicationCommentType.label
			: reviewAnnotation.metadata['commentType'];
	}

	React.useEffect(() => {
		if (!showFooter && focusableRef.current !== null) {
			focusableRef.current.focus();
		}
	}, [showFooter]);

	return (
		<Block
			paddingSize="m"
			data-test-id="fontoxml-review-reference-configuration-comment-card-content"
			data-review-annotation-range-visibility={rangeVisibility.toLowerCase()}
			data-review-annotation-state={reviewAnnotation.busyState}
			data-review-annotation-type={reviewAnnotation.type}
			data-review-annotation-comment-type={
				reviewAnnotation.metadata['commentType']
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
				{reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
					reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
					reviewAnnotation.metadata['comment'] && (
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
									{reviewAnnotation.metadata['comment']}
								</TruncatedText>
							)}
							{!reviewAnnotation.isSelected && (
								<Label isBlock data-test-id="comment">
									{reviewAnnotation.metadata['comment']}
								</Label>
							)}
						</Block>
					)}

				{(reviewAnnotation.busyState === ReviewBusyState.ADDING ||
					reviewAnnotation.busyState === ReviewBusyState.EDITING) && (
					<CommentAddOrEditForm
						focusableRef={focusableRef}
						reviewAnnotation={reviewAnnotation}
						onCancel={onReviewAnnotationFormCancel}
						onReviewAnnotationRefresh={onReviewAnnotationRefresh}
						onSubmit={onReviewAnnotationFormSubmit}
					/>
				)}

				<CardRepliesAndResolution
					context={context}
					focusableRef={focusableRef}
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
