import {
	Block,
	Button,
	Diff,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fds/components';
import * as React from 'react';

import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton';
import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import CardErrorFooter from '../shared/CardErrorFooter';
import CardHeader from '../shared/CardHeader';
import CardRepliesAndResolution from '../shared/CardRepliesAndResolution';
import ErrorStateMessage from '../shared/ErrorStateMessage';
import LoadingStateMessage from '../shared/LoadingStateMessage';
import TruncatedText from '../shared/TruncatedText';
import { CARD_HEADER_HEIGHT } from './../constants';
import ProposalAddOrEditForm from './ProposalAddOrEditForm';

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
	const hasReplyInNonIdleBusyState = React.useMemo(() => {
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
	}

	if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === BusyState.REFRESHING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing proposal…')} />
			</Block>
		);
	}

	if (
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
		<Block
			paddingSize="m"
			data-test-id="fontoxml-review-reference-configuration-proposal-card-content"
			data-review-annotation-state={reviewAnnotation.busyState}
			data-review-annotation-type={reviewAnnotation.type}
		>
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
										style={{ height: CARD_HEADER_HEIGHT }}
										alignItems="center"
										flexDirection="row"
										spaceSize="s"
									>
										<Icon icon="fal fa-pencil-square-o" />

										<Label
											data-test-id="comment-type-label"
											isBold
										>
											{t('Proposed change')}
										</Label>

										{reviewAnnotation.targetFoundForRevision ===
											false && (
											<Icon
												colorName={
													reviewAnnotation.isSelected
														? 'button-warning-background-selected'
														: 'button-warning-background'
												}
												icon="fas fa-unlink"
												tooltipContent={t(
													'This proposed change lost its position in the content'
												)}
											/>
										)}
									</Flex>

									{reviewAnnotation.isSelected && (
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
												data-test-id="comment"
											/>
										</TruncatedText>
									)}
									{!reviewAnnotation.isSelected && (
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
											data-test-id="comment"
										/>
									)}
								</Block>
							)}

							{reviewAnnotation.metadata.comment && (
								<Block spaceVerticalSize="s">
									<Label isBold>{t('Motivation')}</Label>

									{reviewAnnotation.isSelected && (
										<TruncatedText data-test-id="motivation">
											{reviewAnnotation.metadata.comment}
										</TruncatedText>
									)}
									{!reviewAnnotation.isSelected && (
										<Label
											isBlock
											data-test-id="motivation"
										>
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
