import React, { useMemo } from 'react';

import { Block, CompactStateMessage, HorizontalSeparationLine } from 'fds/components';

import { AnnotationStatus, BusyState, ContextType } from 'fontoxml-feedback/src/types.js';

import t from 'fontoxml-localization/src/t.js';

import Reply from './Reply.jsx';
import ReplyAddOrEditForm from './ReplyAddOrEditForm.jsx';

export default function Replies({
	ContentComponent,
	FormContentComponent,
	context,
	reviewAnnotation,
	onReplyEdit,
	onReplyFormCancel,
	onReplyFormSubmit,
	onReplyErrorHide,
	onReplyRefresh,
	onReplyRemove
}) {
	const showActionsMenuButton = useMemo(() => {
		if (
			context === ContextType.CREATED_CONTEXT_MODAL ||
			context === ContextType.EDITOR_SHARING_SIDEBAR ||
			context === ContextType.REVIEW_SHARING_SIDEBAR ||
			reviewAnnotation.busyState !== BusyState.IDLE ||
			reviewAnnotation.status === AnnotationStatus.RESOLVED
		) {
			return false;
		}

		return reviewAnnotation.replies.reduce((showActionsMenuButton, reply) => {
			if (!showActionsMenuButton) {
				return showActionsMenuButton;
			}

			return reply.busyState !== BusyState.ADDING && reply.busyState !== BusyState.EDITING;
		}, reviewAnnotation.busyState !== BusyState.RESOLVING);
	}, [context, reviewAnnotation.busyState, reviewAnnotation.replies, reviewAnnotation.status]);

	return (
		<Block>
			{reviewAnnotation.replies.map((reply, index) => {
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
				} else if (reply.isLoading && reply.busyState === BusyState.REMOVING) {
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
						<ReplyAddOrEditForm
							key={reply.id}
							ContentComponent={FormContentComponent}
							isLast={isLast}
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
						ContentComponent={ContentComponent}
						isLast={isLast}
						reviewAnnotation={reviewAnnotation}
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
