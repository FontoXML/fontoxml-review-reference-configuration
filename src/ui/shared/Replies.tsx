import {
	Block,
	CompactStateMessage,
	HorizontalSeparationLine,
} from 'fds/components';
import * as React from 'react';

import { BusyState, CardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import Reply from './Reply';

export type Props = {
	onReplyEdit: CardContentComponentProps['onReplyEdit'];
	onReplyErrorHide: CardContentComponentProps['onReplyErrorHide'];
	onReplyFormCancel: CardContentComponentProps['onReplyFormCancel'];
	onReplyRefresh: CardContentComponentProps['onReplyRefresh'];
	onReplyRemove: CardContentComponentProps['onReplyRemove'];
	replies: CardContentComponentProps['reviewAnnotation']['replies'];
	reviewAnnotation: CardContentComponentProps['reviewAnnotation'];
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
	showActionsMenuButton
}) => {
	return (
		<Block spaceVerticalSize="m">
			{replies.map((reply, index) => {
				const isLast = index === replies.length - 1;

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
				}
				if (reply.isLoading && reply.busyState === BusyState.REMOVING) {
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
