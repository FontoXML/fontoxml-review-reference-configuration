import * as React from 'react';

import {
	Block,
	CompactStateMessage,
	HorizontalSeparationLine,
} from 'fds/components';

import { BusyState } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import { $TSFixMeAny } from '../../types';

import Reply from './Reply';

export type Props = {
	onReplyEdit: $TSFixMeAny;
	onReplyErrorHide: $TSFixMeAny;
	onReplyFormCancel: $TSFixMeAny;
	onReplyRefresh: $TSFixMeAny;
	onReplyRemove: $TSFixMeAny;
	replies: $TSFixMeAny[];
	reviewAnnotation: $TSFixMeAny;
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
