import * as React from 'react';

import {
	Block,
	CompactStateMessage,
	HorizontalSeparationLine,
	TextLink,
} from 'fds/components';

import {
	AnnotationStatus,
	BusyState,
	ContextType,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import Reply from './Reply';
import ReplyForm from './ReplyForm';

export default function Replies({
	context,
	hasResolution,
	reviewAnnotation,
	onReplyEdit,
	onReplyFormCancel,
	onReplyFormSubmit,
	onReplyErrorHide,
	onReplyRefresh,
	onReplyRemove,
}) {
	const [areRepliesExpanded, setAreRepliesExpanded] = React.useState(false);

	const showActionsMenuButton = React.useMemo(() => {
		if (
			context === ContextType.CREATED_CONTEXT_MODAL ||
			context === ContextType.EDITOR_SHARING_SIDEBAR ||
			context === ContextType.REVIEW_SHARING_SIDEBAR ||
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

	const repliesToShow = React.useMemo(() => {
		if (areRepliesExpanded) {
			return reviewAnnotation.replies;
		}

		// Show 2 if there's no resolution, otherwise show 1 because a resolution is visually
		// similar to a reply.
		let maxNumberOfRepliesToShow = hasResolution ? 1 : 2;

		// If the last reply is a reply which is being added, show the latest 3 replies
		// If there's also a resolution, show 2 replies
		const lastReply =
			reviewAnnotation.replies[reviewAnnotation.replies.length - 1];
		if (lastReply.busyState === BusyState.ADDING) {
			maxNumberOfRepliesToShow = hasResolution ? 2 : 3;
		}

		return reviewAnnotation.replies.slice(
			Math.max(
				reviewAnnotation.replies.length - maxNumberOfRepliesToShow,
				0
			)
		);
	}, [areRepliesExpanded, hasResolution, reviewAnnotation.replies]);

	const collapsedRepliesCount =
		reviewAnnotation.replies.length - repliesToShow.length;

	const handleExpandRepliesTextLinkClick = React.useCallback(
		() => setAreRepliesExpanded(true),
		[]
	);

	return (
		<Block spaceVerticalSize="m">
			{collapsedRepliesCount > 0 && (
				<>
					<HorizontalSeparationLine />

					<TextLink
						label={t(
							'Show {COLLAPSED_REPLIES_COUNT, plural, one {1 more reply} other {# more replies}}',
							{
								COLLAPSED_REPLIES_COUNT: collapsedRepliesCount,
							}
						)}
						onClick={handleExpandRepliesTextLinkClick}
					/>
				</>
			)}

			{repliesToShow.map((reply, index) => {
				const isLast = index === reviewAnnotation.replies.length - 1;

				if (reply.isLoading && reply.busyState === BusyState.IDLE) {
					return (
						<Block
							key={reply.id}
							paddingSize={isLast ? null : { bottom: 'm' }}
							spaceVerticalSize="m"
						>
							<HorizontalSeparationLine />

							<CompactStateMessage
								isSingleLine={false}
								message={t('Refreshing reply…')}
								visual="spinner"
							/>
						</Block>
					);
				} else if (
					reply.isLoading &&
					reply.busyState === BusyState.REMOVING
				) {
					return (
						<Block
							key={reply.id}
							paddingSize={isLast ? null : { bottom: 'm' }}
							spaceVerticalSize="m"
						>
							<HorizontalSeparationLine />

							<CompactStateMessage
								isSingleLine={false}
								message={t('Removing reply…')}
								visual="spinner"
							/>
						</Block>
					);
				}

				const isAddingReply = reply.busyState === BusyState.ADDING;
				const isEditingReply = reply.busyState === BusyState.EDITING;

				if (
					context !== ContextType.CREATED_CONTEXT_MODAL &&
					(isAddingReply || isEditingReply)
				) {
					return (
						<ReplyForm
							key={reply.id}
							reviewAnnotationId={reviewAnnotation.id}
							reply={reply}
							onCancel={onReplyFormCancel}
							onHide={onReplyErrorHide}
							onRefresh={onReplyRefresh}
							onSubmit={onReplyFormSubmit}
						/>
					);
				}

				return (
					<Reply
						key={reply.id}
						reviewAnnotation={reviewAnnotation}
						onCancelRetryRemove={onReplyFormCancel}
						onHide={onReplyErrorHide}
						onRefresh={onReplyRefresh}
						onRemove={onReplyRemove}
						onShowEditForm={onReplyEdit}
						reply={reply}
						showActionsMenuButton={showActionsMenuButton}
					/>
				);
			})}
		</Block>
	);
}
