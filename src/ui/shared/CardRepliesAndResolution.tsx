import { Block, Flex, HorizontalSeparationLine, Icon } from 'fds/components';
import * as React from 'react';

import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import { AnnotationStatus, BusyState } from 'fontoxml-feedback/src/types';

import type { $TSFixMeAny } from '../../types';
import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import resolutions from '../feedbackResolutions';
import Replies from '../shared/Replies';
import ResolveForm from '../shared/ResolveForm';
import RepliesCount from './RepliesCount';
import ReplyForm from './ReplyForm';
import TruncatedReplies from './TruncatedReplies';
import TruncatedText from './TruncatedText';

type Props = {
	context: FeedbackContextType;
	onProposalMerge: $TSFixMeAny;
	onReplyEdit: $TSFixMeAny;
	onReplyErrorHide: $TSFixMeAny;
	onReplyFormCancel: $TSFixMeAny;
	onReplyFormSubmit: $TSFixMeAny;
	onReplyRefresh: $TSFixMeAny;
	onReplyRemove: $TSFixMeAny;
	onReviewAnnotationFormCancel: $TSFixMeAny;
	onReviewAnnotationFormSubmit: $TSFixMeAny;
	onReviewAnnotationRefresh: $TSFixMeAny;
	reviewAnnotation: $TSFixMeAny;
};

const CardRepliesAndResolution: React.FC<Props> = ({
	context,
	onProposalMerge = null,
	onReplyEdit,
	onReplyErrorHide,
	onReplyFormCancel,
	onReplyFormSubmit,
	onReplyRefresh,
	onReplyRemove,
	onReviewAnnotationFormCancel,
	onReviewAnnotationFormSubmit,
	onReviewAnnotationRefresh,
	reviewAnnotation,
}) => {
	const resolution = React.useMemo(() => {
		return (
			reviewAnnotation.resolvedMetadata &&
			resolutions.find(
				(resolution) =>
					resolution.value ===
					reviewAnnotation.resolvedMetadata.resolution
			)
		);
	}, [reviewAnnotation.resolvedMetadata]);

	const resolutionComment =
		reviewAnnotation.resolvedMetadata?.resolutionComment;

	const showActionsMenuButton = React.useMemo(() => {
		if (
			context === FeedbackContextType.CREATED_CONTEXT ||
			context === FeedbackContextType.EDITOR_SHARING ||
			context === FeedbackContextType.REVIEW_SHARING ||
			reviewAnnotation.busyState !== BusyState.IDLE ||
			reviewAnnotation.status === AnnotationStatus.RESOLVED
		) {
			return false;
		}

		return reviewAnnotation.replies.reduce(
			(showActionsMenuButton, reply) => {
				if (!showActionsMenuButton) {
					return showActionsMenuButton;
				}

				return (
					reply.busyState !== BusyState.ADDING &&
					reply.busyState !== BusyState.EDITING
				);
			},
			reviewAnnotation.busyState !== BusyState.RESOLVING
		);
	}, [
		context,
		reviewAnnotation.busyState,
		reviewAnnotation.replies,
		reviewAnnotation.status,
	]);

	const [repliesBefore, addingOrEditingReply, repliesAfter] =
		React.useMemo(() => {
			const addingOrEditingReplyIndex =
				reviewAnnotation.replies.findIndex(
					(reply) =>
						reply.busyState === BusyState.ADDING ||
						reply.busyState === BusyState.EDITING
				);

			if (addingOrEditingReplyIndex !== -1) {
				// Split the adding or editing reply off. We need the reply form
				// to be open even if the comment is not selected to prevent the
				// contents from disappearing.
				const addingOrEditingReply =
					reviewAnnotation.replies[addingOrEditingReplyIndex];

				const repliesBefore = [
					...reviewAnnotation.replies.slice(
						0,
						addingOrEditingReplyIndex
					),
				];

				const repliesAfter = [
					...reviewAnnotation.replies.slice(
						addingOrEditingReplyIndex + 1
					),
				];

				return [repliesBefore, addingOrEditingReply, repliesAfter];
			}

			return [reviewAnnotation.replies, null, []];
		}, [reviewAnnotation.replies]);

	const repliesCount =
		repliesBefore.length +
		repliesAfter.length +
		// Resolution comments are visually similar to replies. Therefore, we
		// take them into account too.
		(reviewAnnotation.status === AnnotationStatus.RESOLVED ? 1 : 0);

	const shouldShowReplies =
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING;

	return (
		<>
			{!reviewAnnotation.isSelected && repliesCount > 0 && (
				<RepliesCount count={repliesCount} />
			)}
			{shouldShowReplies && (
				<TruncatedReplies
					hasResolution={!!resolution}
					isEditingReply={
						addingOrEditingReply?.busyState === BusyState.EDITING
					}
					onReplyEdit={onReplyEdit}
					onReplyErrorHide={onReplyErrorHide}
					onReplyFormCancel={onReplyFormCancel}
					onReplyRefresh={onReplyRefresh}
					onReplyRemove={onReplyRemove}
					replies={repliesBefore}
					reviewAnnotation={reviewAnnotation}
					showActionsMenuButton={showActionsMenuButton}
				/>
			)}
			{addingOrEditingReply &&
				context !== FeedbackContextType.CREATED_CONTEXT && (
					<ReplyForm
						onCancel={onReplyFormCancel}
						onHide={onReplyErrorHide}
						onRefresh={onReplyRefresh}
						onSubmit={onReplyFormSubmit}
						reply={addingOrEditingReply}
					/>
				)}
			{shouldShowReplies && repliesAfter.length > 0 && (
				<Replies
					onReplyEdit={onReplyEdit}
					onReplyErrorHide={onReplyErrorHide}
					onReplyFormCancel={onReplyFormCancel}
					onReplyRefresh={onReplyRefresh}
					onReplyRemove={onReplyRemove}
					replies={repliesAfter}
					reviewAnnotation={reviewAnnotation}
					showActionsMenuButton={showActionsMenuButton}
				/>
			)}

			{reviewAnnotation.isSelected && resolution && (
				<Block spaceVerticalSize="s">
					<HorizontalSeparationLine />

					<Flex alignItems="center" flex="none" spaceSize="s">
						{resolution.value === 'accepted' && (
							<Icon icon="check" />
						)}
						{resolution.value === 'rejected' && (
							<Icon icon="times" />
						)}

						<AuthorAndTimestampLabel
							reviewAnnotation={reviewAnnotation}
							isReviewAnnotationResolved={true}
						/>
					</Flex>

					<TruncatedText>
						{resolutionComment
							? `${resolution.displayLabel} - ${resolutionComment}`
							: resolution.displayLabel}
					</TruncatedText>
				</Block>
			)}
			{reviewAnnotation.busyState === BusyState.RESOLVING && (
				<ResolveForm
					context={context}
					onCancel={onReviewAnnotationFormCancel}
					onProposalMerge={onProposalMerge}
					onReviewAnnotationRefresh={onReviewAnnotationRefresh}
					onSubmit={onReviewAnnotationFormSubmit}
					reviewAnnotation={reviewAnnotation}
				/>
			)}
		</>
	);
};

export default CardRepliesAndResolution;
