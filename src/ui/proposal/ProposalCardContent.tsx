import * as React from 'react';

import {
	Block,
	Diff,
	Flex,
	HorizontalSeparationLine,
	Icon,
	Label,
} from 'fontoxml-design-system/src/components';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type { ReviewCardContentComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import CardErrorFooter from '../shared/CardErrorFooter';
import CardErrors from '../shared/CardErrors';
import CardHeader from '../shared/CardHeader';
import CardRepliesAndResolution from '../shared/CardRepliesAndResolution';
import ErrorStateMessage from '../shared/ErrorStateMessage';
import LoadingStateMessage from '../shared/LoadingStateMessage';
import TruncatedText from '../shared/TruncatedText';
import { CARD_HEADER_HEIGHT } from './../constants';
import ProposalAddOrEditForm from './ProposalAddOrEditForm';
import ProposalReplyComponent from './ProposalReplyComponent';

const footerButtonContainerStyles = { height: '32px' };

const ProposalCardContent: React.FC<ReviewCardContentComponentProps> = ({
	context,
	focusableRef,
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
}) => {
	const hasReplyInNonIdleBusyState = React.useMemo(() => {
		if (!reviewAnnotation.replies) {
			return false;
		}
		return reviewAnnotation.replies.reduce(
			(hasReplyInNonIdleBusyState, reply) => {
				if (
					!hasReplyInNonIdleBusyState &&
					reply.busyState !== ReviewBusyState.IDLE
				) {
					hasReplyInNonIdleBusyState = true;
				}
				return hasReplyInNonIdleBusyState;
			},
			false
		);
	}, [reviewAnnotation.replies]);

	const showAcceptProposalButton =
		context === FeedbackContextType.EDITOR &&
		reviewAnnotation.status !== ReviewAnnotationStatus.RESOLVED &&
		onProposalMerge &&
		!!reviewAnnotation.proposalState;

	const showReplyButton =
		reviewAnnotation.status !== ReviewAnnotationStatus.RESOLVED;

	const showAnyFooterButton = showAcceptProposalButton || showReplyButton;

	const showFooter =
		showAnyFooterButton &&
		(context === FeedbackContextType.EDITOR ||
			context === FeedbackContextType.REVIEW) &&
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
		reviewAnnotation.busyState !== ReviewBusyState.RESOLVING &&
		!hasReplyInNonIdleBusyState;

	const showErrorFooter =
		reviewAnnotation.error &&
		reviewAnnotation.busyState === ReviewBusyState.REMOVING;

	React.useEffect(() => {
		if (!showFooter && focusableRef && focusableRef.current !== null) {
			focusableRef.current.focus();
		}
	}, [focusableRef, showFooter]);

	// Replace the whole card if the reviewAnnotation.error is acknowledgeable.
	if (
		typeof reviewAnnotation.error !== 'number' &&
		reviewAnnotation.error &&
		(reviewAnnotation.error.recovery ===
			ReviewRecoveryOption.ACKNOWLEDGEABLE ||
			(reviewAnnotation.busyState === ReviewBusyState.IDLE &&
				!hasReplyInNonIdleBusyState))
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
		reviewAnnotation.busyState === ReviewBusyState.REFRESHING
	) {
		return (
			<Block paddingSize="m">
				<LoadingStateMessage message={t('Refreshing proposal…')} />
			</Block>
		);
	}

	if (
		reviewAnnotation.isLoading &&
		reviewAnnotation.busyState === ReviewBusyState.REMOVING
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
			dataTestId="fontoxml-review-reference-configuration-proposal-card-content"
			data-review-annotation-state={reviewAnnotation.busyState}
			data-review-annotation-type={reviewAnnotation.type}
			paddingSize="m"
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
				{reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
					reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
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
										<Icon icon="far fa-pencil-square-o" />

										<Label
											dataTestId="comment-type-label"
											isBold
										>
											{t('Proposed change')}
										</Label>

										{reviewAnnotation.targetFoundForRevision ===
											false && (
											<Icon
												colorName={
													reviewAnnotation.isSelected
														? 'tombstone-icon-selected-color'
														: 'tombstone-icon-color'
												}
												icon="far fa-unlink"
												tooltipContent={t(
													'This proposed change lost its position in the content'
												)}
											/>
										)}
									</Flex>

									{reviewAnnotation.isSelected && (
										<TruncatedText
											dir={
												reviewAnnotation.metadata[
													'proposedChange.dir'
												]
											}
										>
											<Diff
												dataTestId="comment"
												isSingleLine={
													!reviewAnnotation.isSelected
												}
												originalValue={
													reviewAnnotation.originalText
												}
												value={
													reviewAnnotation.metadata
														.proposedChange as string
												}
											/>
										</TruncatedText>
									)}
									{!reviewAnnotation.isSelected && (
										<Diff
											dataTestId="comment"
											dir={
												reviewAnnotation.metadata[
													'proposedChange.dir'
												]
											}
											isSingleLine={
												!reviewAnnotation.isSelected
											}
											originalValue={
												reviewAnnotation.originalText
											}
											value={
												reviewAnnotation.metadata
													.proposedChange as string
											}
										/>
									)}
								</Block>
							)}

							{reviewAnnotation.metadata.comment && (
								<Block spaceVerticalSize="s">
									<Label isBold>{t('Motivation')}</Label>

									{reviewAnnotation.isSelected && (
										<TruncatedText
											dataTestId="motivation"
											dir={
												reviewAnnotation.metadata[
													'comment.dir'
												]
											}
										>
											{reviewAnnotation.metadata.comment}
										</TruncatedText>
									)}
									{!reviewAnnotation.isSelected && (
										<Label
											dataTestId="motivation"
											dir={
												reviewAnnotation.metadata[
													'comment.dir'
												]
											}
											isBlock
										>
											{reviewAnnotation.metadata.comment}
										</Label>
									)}
								</Block>
							)}
						</Block>
					)}

				{(reviewAnnotation.busyState === ReviewBusyState.ADDING ||
					reviewAnnotation.busyState === ReviewBusyState.EDITING) && (
					<ProposalAddOrEditForm
						focusableRef={focusableRef}
						reviewAnnotation={reviewAnnotation}
						onCancel={onReviewAnnotationFormCancel}
						onReviewAnnotationRefresh={onReviewAnnotationRefresh}
						onSubmit={onReviewAnnotationFormSubmit}
					/>
				)}

				<CardRepliesAndResolution
					context={context}
					focusableRef={focusableRef}
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
					reviewAnnotation={reviewAnnotation}
				/>

				<CardErrors
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

						<Flex
							alignItems="center"
							applyCss={footerButtonContainerStyles}
							justifyContent="flex-end"
							spaceSize="l"
						>
							{showReplyButton && (
								<ProposalReplyComponent
									onReplyAdd={onReplyAdd}
									reviewAnnotation={reviewAnnotation}
								/>
							)}

							{showAcceptProposalButton && (
								<ReviewAnnotationAcceptProposalButton
									onProposalMerge={onProposalMerge}
									proposalState={proposalState}
								/>
							)}
						</Flex>
					</Block>
				)}
			</Block>
		</Block>
	);
}

export default ProposalCardContent;
