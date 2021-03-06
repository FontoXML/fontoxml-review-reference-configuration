import React, { Fragment, useMemo } from 'react';

import { Block, Diff, Flex, HorizontalSeparationLine, Icon, Label, Text } from 'fds/components';

import ErrorToast from 'fontoxml-feedback/src/ErrorToast.jsx';
import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption,
	TargetType
} from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel.jsx';
import CardFooter from '../shared/CardFooter.jsx';
import CardHeader from '../shared/CardHeader.jsx';
import ErrorStateMessage from '../shared/ErrorStateMessage.jsx';
import LoadingStateMessage from '../shared/LoadingStateMessage.jsx';
import ResolveForm from '../shared/ResolveForm.jsx';
import Replies from '../shared/Replies.jsx';

import resolutions from '../feedbackResolutions.jsx';

import ProposalAddOrEditForm from './ProposalAddOrEditForm.jsx';
import ProposalReplyContent from './ProposalReplyContent.jsx';

// 'outdent' the icon container to align it with other icons above it
const iconContainerStyles = { marginLeft: '-26px' };

function ProposalCardContent({
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
	onProposalMerge
}) {
	const hasReplyInNonIdleBusyState = useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce((hasReplyInNonIdleBusyState, reply) => {
			if (!hasReplyInNonIdleBusyState && reply.busyState !== BusyState.IDLE) {
				hasReplyInNonIdleBusyState = true;
			}
			return hasReplyInNonIdleBusyState;
		}, false);
	}, [reviewAnnotation.replies]);

	const showAcceptProposalButton =
		context === ContextType.EDITOR_SIDEBAR && onProposalMerge && reviewAnnotation.proposalState;

	const showCreatedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showResolvedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL &&
		reviewAnnotation.status === AnnotationStatus.RESOLVED;

	const showReplyButton = reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showResolveButton =
		reviewAnnotation.status !== AnnotationStatus.PRIVATE &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showShareButton =
		reviewAnnotation.status === AnnotationStatus.PRIVATE &&
		(context === ContextType.EDITOR_SIDEBAR || context === ContextType.REVIEW_SIDEBAR);

	const showAnyFooterButton =
		showAcceptProposalButton ||
		showCreatedContextButton ||
		showResolvedContextButton ||
		showReplyButton ||
		showResolveButton ||
		showShareButton;

	const showFooter =
		showAnyFooterButton &&
		(context === ContextType.EDITOR_SIDEBAR || context === ContextType.REVIEW_SIDEBAR) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.busyState !== BusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	// Replace the whole card if the reviewAnnotation.error is acknowledgeable.
	if (
		reviewAnnotation.error &&
		reviewAnnotation.error.recovery === RecoveryOption.ACKNOWLEDGEABLE
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
	} else if (reviewAnnotation.isLoading && reviewAnnotation.busyState === BusyState.REFRESHING) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing proposal…')} />
			</Block>
		);
	} else if (reviewAnnotation.isLoading && reviewAnnotation.busyState === BusyState.REMOVING) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Removing proposal…')} />
			</Block>
		);
	}

	const resolution =
		reviewAnnotation.resolvedMetadata &&
		resolutions.find(
			resolution => resolution.value === reviewAnnotation.resolvedMetadata.resolution
		);

	const hasProposedChange =
		reviewAnnotation.metadata &&
		reviewAnnotation.metadata.proposedChange !== undefined &&
		reviewAnnotation.metadata.proposedChange !== null;

	const proposalState = reviewAnnotation.proposalState;

	return (
		<>
			<Block paddingSize="m" spaceVerticalSize="m">
				<CardHeader
					context={context}
					hasReplyInNonIdleBusyState={hasReplyInNonIdleBusyState}
					isSelectedToShare={isSelectedToShare}
					reviewAnnotation={reviewAnnotation}
					onReviewAnnotationEdit={onReviewAnnotationEdit}
					onReviewAnnotationRemove={onReviewAnnotationRemove}
					onReviewAnnotationShareAddRemoveToggle={onReviewAnnotationShareAddRemoveToggle}
					showEditButton={
						context !== ContextType.CREATED_CONTEXT_MODAL &&
						context !== ContextType.RESOLVED_CONTEXT_MODAL
					}
					showRemoveButton={
						context !== ContextType.CREATED_CONTEXT_MODAL &&
						context !== ContextType.RESOLVED_CONTEXT_MODAL &&
						reviewAnnotation.status === AnnotationStatus.PRIVATE
					}
				/>

				{reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					(hasProposedChange || reviewAnnotation.metadata.comment) && (
						<Block spaceVerticalSize="l">
							{hasProposedChange && (
								<Block>
									<Flex flexDirection="column" spaceSize="m">
										<Flex alignItems="center" flexDirection="row" spaceSize="s">
											<Icon icon="fas fa-pencil-square-o" />
											<Label isBold>{t('Proposed change')}</Label>
										</Flex>

										<Diff
											isSingleLine={!reviewAnnotation.isSelected}
											originalValue={reviewAnnotation.originalText}
											value={reviewAnnotation.metadata.proposedChange}
										/>
									</Flex>
								</Block>
							)}

							{reviewAnnotation.metadata.comment && (
								<Block spaceVerticalSize="m">
									<Label isBold>{t('Motivation')}</Label>

									{reviewAnnotation.isSelected && (
										<Text>{reviewAnnotation.metadata.comment}</Text>
									)}
									{!reviewAnnotation.isSelected && (
										<Label isBlock>{reviewAnnotation.metadata.comment}</Label>
									)}
								</Block>
							)}
						</Block>
					)}

				{(reviewAnnotation.busyState === BusyState.ADDING ||
					reviewAnnotation.busyState === BusyState.EDITING) && (
					<ProposalAddOrEditForm
						reviewAnnotation={reviewAnnotation}
						onCancel={onReviewAnnotationFormCancel}
						onReviewAnnotationRefresh={onReviewAnnotationRefresh}
						onSubmit={onReviewAnnotationFormSubmit}
					/>
				)}

				{!reviewAnnotation.isSelected &&
					(reviewAnnotation.replies.length > 0 ||
						reviewAnnotation.status === AnnotationStatus.RESOLVED) && (
						<Block>
							<HorizontalSeparationLine marginSizeBottom="m" />

							<Flex spaceSize="s">
								<Icon icon="fas fa-reply" />
								<Label>
									{t('{REPLIES_COUNT, plural, one {1 reply} other {# replies}}', {
										REPLIES_COUNT:
											reviewAnnotation.replies.length +
											(reviewAnnotation.status === AnnotationStatus.RESOLVED
												? 1
												: 0)
									})}
								</Label>
							</Flex>
						</Block>
					)}

				{reviewAnnotation.isSelected &&
					reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					reviewAnnotation.replies.length > 0 && (
						<Replies
							ContentComponent={ProposalReplyContent}
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
					<Fragment>
						<HorizontalSeparationLine />

						<Block applyCss={{ paddingLeft: '26px' }} spaceVerticalSize="m">
							<Flex
								alignItems="center"
								applyCss={iconContainerStyles}
								flex="none"
								spaceSize="m"
							>
								{resolution.value === 'accepted' && <Icon icon="check" />}
								{resolution.value === 'rejected' && <Icon icon="times" />}

								<AuthorAndTimestampLabel
									reviewAnnotation={reviewAnnotation}
									forResolvedReviewAnnotation={true}
								/>
							</Flex>

							<Block>
								<Flex spaceSize="s">
									{resolution.value === 'accepted' && (
										<Icon icon="fas fa-check-square" />
									)}

									{resolution.value === 'rejected' && (
										<Icon icon="fas fa-times-square" />
									)}
									<Label isBold isBlock>
										{t(resolution.displayLabel)}
									</Label>
								</Flex>

								<Text>
									{reviewAnnotation.resolvedMetadata &&
										reviewAnnotation.resolvedMetadata.resolutionComment}
								</Text>
							</Block>
						</Block>
					</Fragment>
				)}

				{reviewAnnotation.isSelected &&
					reviewAnnotation.busyState === BusyState.RESOLVING && (
						<ResolveForm
							reviewAnnotation={reviewAnnotation}
							onCancel={onReviewAnnotationFormCancel}
							onProposalMerge={showAcceptProposalButton && onProposalMerge}
							onReviewAnnotationRefresh={onReviewAnnotationRefresh}
							onSubmit={onReviewAnnotationFormSubmit}
							proposalState={proposalState}
						/>
					)}

				{reviewAnnotation.error && reviewAnnotation.busyState === BusyState.SHARING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationShare}
					/>
				)}

				{reviewAnnotation.error && reviewAnnotation.busyState === BusyState.REMOVING && (
					<ErrorToast
						error={reviewAnnotation.error}
						onRefreshLinkClick={onReviewAnnotationRefresh}
						onRetryLinkClick={onReviewAnnotationRemove}
					/>
				)}
			</Block>

			{showFooter && (
				<CardFooter
					reviewAnnotation={reviewAnnotation}
					onProposalMerge={onProposalMerge}
					onReviewAnnotationFormCancel={onReviewAnnotationFormCancel}
					onReviewAnnotationRemove={onReviewAnnotationRemove}
					onReviewAnnotationResolve={onReviewAnnotationResolve}
					onReviewAnnotationShare={onReviewAnnotationShare}
					onReviewAnnotationShowInCreatedContext={onReviewAnnotationShowInCreatedContext}
					onReviewAnnotationShowInResolvedContext={
						onReviewAnnotationShowInResolvedContext
					}
					onReplyAdd={onReplyAdd}
					proposalState={proposalState}
					showAcceptProposalButton={showAcceptProposalButton}
					showCreatedContextButton={showCreatedContextButton}
					showResolvedContextButton={showResolvedContextButton}
					showReplyButton={showReplyButton}
					showResolveButton={showResolveButton}
					showShareButton={showShareButton}
				/>
			)}
		</>
	);
}

export default ProposalCardContent;
