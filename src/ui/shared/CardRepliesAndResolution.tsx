import * as React from 'react';

import {
	Block,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast';
import { AnnotationStatus, BusyState } from 'fontoxml-feedback/src/types';

import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import ResolveForm from '../shared/ResolveForm';
import Replies from '../shared/Replies';
import resolutions from '../feedbackResolutions';
import TruncatedText from './TruncatedText';

function CardRepliesAndResolution({
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
	onReviewAnnotationRemove,
	onReviewAnnotationShare,
	reviewAnnotation,
}) {
	const resolution =
		reviewAnnotation.resolvedMetadata &&
		resolutions.find(
			(resolution) =>
				resolution.value ===
				reviewAnnotation.resolvedMetadata.resolution
		);

	const resolutionComment =
		reviewAnnotation.resolvedMetadata?.resolutionComment;

	return (
		<>
			{!reviewAnnotation.isSelected &&
				(reviewAnnotation.replies.length > 0 ||
					reviewAnnotation.status === AnnotationStatus.RESOLVED) && (
					<Block>
						<HorizontalSeparationLine marginSizeBottom="m" />

						<Flex spaceSize="s">
							<Icon icon="fal fa-reply" />
							<Label>
								{t(
									'{REPLIES_COUNT, plural, one {1 reply} other {# replies}}',
									{
										REPLIES_COUNT:
											reviewAnnotation.replies.length +
											(reviewAnnotation.status ===
											AnnotationStatus.RESOLVED
												? 1
												: 0),
									}
								)}
							</Label>
						</Flex>
					</Block>
				)}
			{reviewAnnotation.isSelected &&
				reviewAnnotation.busyState !== BusyState.ADDING &&
				reviewAnnotation.busyState !== BusyState.EDITING &&
				reviewAnnotation.replies.length > 0 && (
					<Replies
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
							forResolvedReviewAnnotation={true}
						/>
					</Flex>

					<TruncatedText>
						{resolutionComment
							? `${resolution.displayLabel} - ${resolutionComment}`
							: resolution.displayLabel}
					</TruncatedText>
				</Block>
			)}
			{reviewAnnotation.isSelected &&
				reviewAnnotation.busyState === BusyState.RESOLVING && (
					<ResolveForm
						onCancel={onReviewAnnotationFormCancel}
						onProposalMerge={onProposalMerge}
						onReviewAnnotationRefresh={onReviewAnnotationRefresh}
						onSubmit={onReviewAnnotationFormSubmit}
						reviewAnnotation={reviewAnnotation}
					/>
				)}
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === BusyState.SHARING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}
			{reviewAnnotation.error &&
				reviewAnnotation.busyState === BusyState.REMOVING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
		</>
	);
}

export default CardRepliesAndResolution;
