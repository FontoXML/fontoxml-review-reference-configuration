import * as React from 'react';

import {
	Block,
	CompactStateMessage,
	HorizontalSeparationLine,
} from 'fontoxml-design-system/src/components';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import Reply from './Reply';

export type Props = {
	onReplyEdit: ReviewCardContentComponentProps['onReplyEdit'];
	onReplyErrorHide: ReviewCardContentComponentProps['onReplyErrorHide'];
	onReplyFormCancel: ReviewCardContentComponentProps['onReplyFormCancel'];
	onReplyRefresh: ReviewCardContentComponentProps['onReplyRefresh'];
	onReplyRemove: ReviewCardContentComponentProps['onReplyRemove'];
	replies: ReviewCardContentComponentProps['reviewAnnotation']['replies'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
	showActionsMenuButton: boolean;
};

const Replies: React.FC<Props> = ({
	onReplyEdit,
	onReplyErrorHide,
	onReplyFormCancel,
	onReplyRefresh,
	onReplyRemove,
	replies,
	reviewAnnotation,
	showActionsMenuButton,
}) => {
	return (
		<Block spaceVerticalSize="m">
			{replies.map((reply, index) => {
				const isLast = index === replies.length - 1;

				if (
					reply.isLoading &&
					reply.busyState === ReviewBusyState.IDLE
				) {
					return (
						<Block
							key={reply.id}
							paddingSize={isLast ? undefined : { bottom: 'm' }}
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
				}
				if (
					reply.isLoading &&
					reply.busyState === ReviewBusyState.REMOVING
				) {
					return (
						<Block
							key={reply.id}
							paddingSize={isLast ? undefined : { bottom: 'm' }}
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
};

export default Replies;
