import * as React from 'react';

import {
	Block,
	Flex,
	HorizontalSeparationLine,
	Icon,
} from 'fontoxml-design-system/src/components';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import resolutions from '../feedbackResolutions';
import Replies from '../shared/Replies';
import ResolveForm from '../shared/ResolveForm';
import RepliesCount from './RepliesCount';
import ReplyForm from './ReplyForm';
import TruncatedReplies from './TruncatedReplies';
import TruncatedText from './TruncatedText';

type Props = {
	context: ReviewCardContentComponentProps['context'];
	focusableRef: HTMLElement;
	onProposalMerge?: ReviewCardContentComponentProps['onProposalMerge'];
	onReplyEdit: ReviewCardContentComponentProps['onReplyEdit'];
	onReplyErrorHide: ReviewCardContentComponentProps['onReplyErrorHide'];
	onReplyFormCancel: ReviewCardContentComponentProps['onReplyFormCancel'];
	onReplyFormSubmit: ReviewCardContentComponentProps['onReplyFormSubmit'];
	onReplyRefresh: ReviewCardContentComponentProps['onReplyRefresh'];
	onReplyRemove: ReviewCardContentComponentProps['onReplyRemove'];
	onReviewAnnotationFormCancel: ReviewCardContentComponentProps['onReviewAnnotationFormCancel'];
	onReviewAnnotationFormSubmit: ReviewCardContentComponentProps['onReviewAnnotationFormSubmit'];
	onReviewAnnotationRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

const CardRepliesAndResolution: React.FC<Props> = ({
	context,
	focusableRef,
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
}: Props) => {
	const resolution = React.useMemo(() => {
		return (
			reviewAnnotation.resolvedMetadata &&
			resolutions.find(
				(resolution) =>
					resolution.value ===
					reviewAnnotation.resolvedMetadata['resolution']
			)
		);
	}, [reviewAnnotation.resolvedMetadata]);

	const resolutionComment =
		reviewAnnotation.resolvedMetadata?.['resolutionComment'];

	const showActionsMenuButton = React.useMemo(() => {
		if (
			context === FeedbackContextType.CREATED_CONTEXT ||
			context === FeedbackContextType.EDITOR_SHARING ||
			context === FeedbackContextType.REVIEW_SHARING ||
			reviewAnnotation.busyState !== ReviewBusyState.IDLE ||
			reviewAnnotation.status === ReviewAnnotationStatus.RESOLVED
		) {
			return false;
		}

		// When no reply is being added or edited, display the button.
		return reviewAnnotation.replies.every(
			(reply) =>
				!(
					reply.busyState === ReviewBusyState.ADDING ||
					reply.busyState === ReviewBusyState.EDITING
				)
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
						reply.busyState === ReviewBusyState.ADDING ||
						reply.busyState === ReviewBusyState.EDITING
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
		(reviewAnnotation.status === ReviewAnnotationStatus.RESOLVED ? 1 : 0);

	const shouldShowReplies =
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING;

	return (
		<>
			{!reviewAnnotation.isSelected && repliesCount > 0 && (
				<RepliesCount count={repliesCount} />
			)}
			{shouldShowReplies && (
				<TruncatedReplies
					hasResolution={!!resolution}
					isEditingReply={
						addingOrEditingReply?.busyState ===
						ReviewBusyState.EDITING
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
						focusableRef={focusableRef}
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
			{reviewAnnotation.busyState === ReviewBusyState.RESOLVING && (
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
