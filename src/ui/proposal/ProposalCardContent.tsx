import React, { useMemo } from 'react';

import {
	Block,
	Button,
	Diff,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
	Text,
} from 'fds/components';

import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton';
import CardErrorFooter from '../shared/CardErrorFooter';
import CardHeader from '../shared/CardHeader';
import ErrorStateMessage from '../shared/ErrorStateMessage';
import LoadingStateMessage from '../shared/LoadingStateMessage';

import ProposalAddOrEditForm from './ProposalAddOrEditForm';
import CardRepliesAndResolution from '../shared/CardRepliesAndResolution';
import TruncatedText from '../shared/TruncatedText';

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
	onProposalMerge,
}) {
	const hasReplyInNonIdleBusyState = useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce(
			(hasReplyInNonIdleBusyState, reply) => {
				if (
					!hasReplyInNonIdleBusyState &&
					reply.busyState !== BusyState.IDLE
				) {
					hasReplyInNonIdleBusyState = true;
				}
				return hasReplyInNonIdleBusyState;
			},
			false
		);
	}, [reviewAnnotation.replies]);

	const showAcceptProposalButton =
		context === ContextType.EDITOR_SIDEBAR &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
		onProposalMerge &&
		!!reviewAnnotation.proposalState;

	const showReplyButton =
		reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showAnyFooterButton = showAcceptProposalButton || showReplyButton;

	const showFooter =
		showAnyFooterButton &&
		(context === ContextType.EDITOR_SIDEBAR ||
			context === ContextType.REVIEW_SIDEBAR) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.busyState !== BusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	const showErrorFooter =
		reviewAnnotation.error &&
		reviewAnnotation.busyState === BusyState.REMOVING;

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
	} else if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === BusyState.REFRESHING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing proposal…')} />
			</Block>
		);
	} else if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === BusyState.REMOVING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Removing proposal…')} />
			</Block>
		);
	}

	const hasProposedChange =
		reviewAnnotation.metadata &&
		reviewAnnotation.metadata.proposedChange !== undefined &&
		reviewAnnotation.metadata.proposedChange !== null;

	const proposalState = reviewAnnotation.proposalState;

	return (
		<Block paddingSize="m">
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
				{reviewAnnotation.busyState !== BusyState.ADDING &&
					reviewAnnotation.busyState !== BusyState.EDITING &&
					(hasProposedChange ||
						reviewAnnotation.metadata.comment) && (
						<Block spaceVerticalSize="m">
							{hasProposedChange && (
								<Block>
									<Flex
										style={{ minHeight: '2rem' }}
										alignItems="center"
										flexDirection="row"
										spaceSize="s"
									>
										<Icon icon="fal fa-pencil-square-o" />

										<Label isBold>
											{t('Proposed change')}
										</Label>
									</Flex>

									<TruncatedText>
										<Diff
											isSingleLine={
												!reviewAnnotation.isSelected
											}
											originalValue={
												reviewAnnotation.originalText
											}
											value={
												reviewAnnotation.metadata
													.proposedChange
											}
										/>
									</TruncatedText>
								</Block>
							)}

							{reviewAnnotation.metadata.comment && (
								<Block spaceVerticalSize="s">
									<Label isBold>{t('Motivation')}</Label>

									{reviewAnnotation.isSelected && (
										<TruncatedText>
											{reviewAnnotation.metadata.comment}
										</TruncatedText>
									)}
									{!reviewAnnotation.isSelected && (
										<Label isBlock>
											{reviewAnnotation.metadata.comment}
										</Label>
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

				<CardRepliesAndResolution
					context={context}
					onProposalMerge={onProposalMerge}
					onReplyEdit={onReplyEdit}
					onReplyErrorHide={onReplyErrorHide}
					onReplyFormCancel={onReplyFormCancel}
					onReplyFormSubmit={onReplyFormSubmit}
					onReplyRefresh={onReplyRefresh}
					onReplyRemove={onReplyRemove}
					onReviewAnnotationFormCancel={onReviewAnnotationFormCancel}
					onReviewAnnotationFormSubmit={onReviewAnnotationFormSubmit}
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
					<Block spaceVerticalSize="m">
						<HorizontalSeparationLine />

						<Flex justifyContent="flex-end" spaceSize="l">
							{showReplyButton && (
								<Block flex="0 1 auto">
									<Button
										icon="fas fa-reply"
										isDisabled={
											!!reviewAnnotation.error ||
											reviewAnnotation.isLoading
										}
										onClick={onReplyAdd}
									/>
								</Block>
							)}

							{showAcceptProposalButton && (
								<Block flex="0 1 auto">
									<ReviewAnnotationAcceptProposalButton
										onProposalMerge={onProposalMerge}
										proposalState={proposalState}
									/>
								</Block>
							)}
						</Flex>
					</Block>
				)}
			</Block>
		</Block>
	);
}

export default ProposalCardContent;
