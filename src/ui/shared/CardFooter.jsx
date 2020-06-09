import React, { Fragment, useCallback } from 'react';

import {
	Button,
	Flex,
	HorizontalSeparationLine,
	Menu,
	MenuItem,
	Drop,
	DropAnchor
} from 'fds/components';

import ReviewAnnotationAcceptProposalButton from 'fontoxml-feedback/src/ReviewAnnotationAcceptProposalButton.jsx';
import {
	AnnotationStatus,
	BusyState,
	RecoveryOption,
	TargetType
} from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

export default function CardFooter({
	reviewAnnotation,
	onProposalMerge = null,
	onReviewAnnotationFormCancel,
	onReviewAnnotationRemove,
	onReviewAnnotationResolve,
	onReviewAnnotationShare,
	onReviewAnnotationShowInCreatedContext,
	onReviewAnnotationShowInResolvedContext,
	onReplyAdd,
	proposalState = null,
	showAcceptProposalButton,
	showCreatedContextButton,
	showResolvedContextButton,
	showReplyButton,
	showResolveButton,
	showShareButton
}) {
	function determineShareButtonLabel(reviewAnnotation, error, isLoading) {
		if (isLoading) {
			return t('Sharing…');
		}

		return reviewAnnotation.busyState === BusyState.SHARING &&
			error &&
			error.recovery === RecoveryOption.RETRYABLE
			? t('Retry share')
			: t('Share');
	}

	const renderViewInDropAnchor = useCallback(
		({ isDropOpened, isFocused, onRef, toggleDrop }) => (
			<Button
				icon="eye"
				iconAfter={isDropOpened ? 'angle-up' : 'angle-down'}
				isDisabled={
					(!showCreatedContextButton && !showResolvedContextButton) ||
					!!reviewAnnotation.error ||
					reviewAnnotation.isLoading
				}
				isFocused={isFocused}
				isSelected={isDropOpened}
				onClick={toggleDrop}
				onRef={onRef}
			/>
		),
		[
			reviewAnnotation.error,
			reviewAnnotation.isLoading,
			showCreatedContextButton,
			showResolvedContextButton
		]
	);

	const renderViewInDrop = useCallback(
		() => (
			<Drop>
				<Menu>
					<MenuItem
						icon="comment"
						isDisabled={!showCreatedContextButton}
						label={t('View in created context')}
						onClick={onReviewAnnotationShowInCreatedContext}
						tooltipContent={t(
							'Open a modal which shows the version of the document of this comment when it was created.'
						)}
					/>

					<MenuItem
						icon="check"
						isDisabled={!showResolvedContextButton}
						label={t('View in resolved context')}
						onClick={onReviewAnnotationShowInResolvedContext}
						tooltipContent={t(
							'Open a modal which shows the version of the document of this comment when it was resolved.'
						)}
					/>
				</Menu>
			</Drop>
		),
		[
			onReviewAnnotationShowInCreatedContext,
			onReviewAnnotationShowInResolvedContext,
			showCreatedContextButton,
			showResolvedContextButton
		]
	);

	// If there was an error while removing the annotation, we show that error in an ErrorToast,
	// see CommentCardContent.jsx and ProposalCardContent.jsx, just above where this <CardFooter ../>
	// is rendered.
	// Instead of showing the regular footer, show something that looks similar to the footer you
	// see when editing/replying to a comment.
	// And make sure to render that footer in the error state (Retry remove label on the primary button).
	if (reviewAnnotation.error && reviewAnnotation.busyState === BusyState.REMOVING) {
		return (
			<Fragment>
				<HorizontalSeparationLine marginSizeBottom="m" />

				<Flex justifyContent="flex-end" spaceSize="m" paddingSize="m">
					<Button label={t('Cancel')} onClick={onReviewAnnotationFormCancel} />

					<Button
						label={t('Retry remove')}
						onClick={onReviewAnnotationRemove}
						type="primary"
					/>
				</Flex>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<HorizontalSeparationLine marginSizeBottom="m" />

			<Flex
				alignItems="center"
				justifyContent={
					showCreatedContextButton || showResolvedContextButton
						? 'space-between'
						: 'flex-end'
				}
				paddingSize="m"
			>
				{(showCreatedContextButton || showResolvedContextButton) && (
					<DropAnchor
						renderAnchor={renderViewInDropAnchor}
						renderDrop={renderViewInDrop}
					/>
				)}

				<Flex alignItems="center" spaceSize="m">
					{showReplyButton && (
						<Button
							icon="fas fa-reply"
							isDisabled={!!reviewAnnotation.error || reviewAnnotation.isLoading}
							onClick={onReplyAdd}
						/>
					)}

					{showAcceptProposalButton &&
						reviewAnnotation.status !== AnnotationStatus.RESOLVED && (
							<ReviewAnnotationAcceptProposalButton
								onProposalMerge={onProposalMerge}
								proposalState={proposalState}
							/>
						)}

					{showShareButton && (
						<Button
							icon={reviewAnnotation.isLoading ? 'spinner' : 'users'}
							isDisabled={
								(reviewAnnotation.error &&
									reviewAnnotation.error.recovery !== RecoveryOption.RETRYABLE) ||
								reviewAnnotation.busyState === BusyState.REMOVING ||
								reviewAnnotation.isLoading
							}
							label={determineShareButtonLabel(
								reviewAnnotation,
								reviewAnnotation.error,
								reviewAnnotation.isLoading
							)}
							onClick={onReviewAnnotationShare}
							type="primary"
						/>
					)}

					{showResolveButton && (
						<Button
							icon="check"
							isDisabled={reviewAnnotation.isLoading}
							label={t('Resolve')}
							onClick={onReviewAnnotationResolve}
							type="primary"
						/>
					)}
				</Flex>
			</Flex>
		</Fragment>
	);
}
