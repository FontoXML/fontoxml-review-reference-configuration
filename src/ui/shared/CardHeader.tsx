import * as React from 'react';

import {
	Block,
	Button,
	Checkbox,
	Drop,
	DropAnchor,
	Flex,
	Menu,
	MenuItem,
	MenuItemWithDrop,
	NewChip,
} from 'fontoxml-design-system/src/components';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import ReviewBusyState from 'fontoxml-feedback/src/ReviewBusyState';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import ReviewTargetType from 'fontoxml-feedback/src/ReviewTargetType';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import resolutions from '../feedbackResolutions';
import { CARD_HEADER_HEIGHT } from './../constants';

function determineShareButtonLabel(
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'],
	error: ReviewAnnotationError,
	isLoading: boolean
): string {
	if (isLoading) {
		return t('Sharing…');
	}

	return reviewAnnotation.busyState === ReviewBusyState.SHARING &&
		typeof error !== 'number' &&
		error &&
		error.recovery === ReviewRecoveryOption.RETRYABLE
		? t('Retry share')
		: t('Share');
}

type Props = {
	context: ReviewCardContentComponentProps['context'];
	hasReplyInNonIdleBusyState: boolean;
	isSelectedToShare: ReviewCardContentComponentProps['isSelectedToShare'];
	onReviewAnnotationEdit: ReviewCardContentComponentProps['onReviewAnnotationEdit'];
	onReviewAnnotationRemove: ReviewCardContentComponentProps['onReviewAnnotationRemove'];
	onReviewAnnotationResolve: ReviewCardContentComponentProps['onReviewAnnotationResolve'];
	onReviewAnnotationShare: ReviewCardContentComponentProps['onReviewAnnotationShare'];
	onReviewAnnotationShareAddRemoveToggle: ReviewCardContentComponentProps['onReviewAnnotationShareAddRemoveToggle'];
	onReviewAnnotationShowInCreatedContext: ReviewCardContentComponentProps['onReviewAnnotationShowInCreatedContext'];
	onReviewAnnotationShowInResolvedContext: ReviewCardContentComponentProps['onReviewAnnotationShowInResolvedContext'];
	reviewAnnotation: ReviewCardContentComponentProps['reviewAnnotation'];
};

export default function CardHeader({
	context,
	hasReplyInNonIdleBusyState,
	isSelectedToShare,
	onReviewAnnotationEdit,
	onReviewAnnotationRemove,
	onReviewAnnotationResolve,
	onReviewAnnotationShare,
	onReviewAnnotationShareAddRemoveToggle,
	onReviewAnnotationShowInCreatedContext,
	onReviewAnnotationShowInResolvedContext,
	reviewAnnotation,
}: Props) {
	const showEditButton =
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status !== ReviewAnnotationStatus.RESOLVED;

	const showRemoveButton =
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status === ReviewAnnotationStatus.PRIVATE;

	const showCreatedContextButton =
		reviewAnnotation.targets[0].type !==
			ReviewTargetType.PUBLICATION_SELECTOR &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT;

	const showResolvedContextButton =
		reviewAnnotation.targets[0].type !==
			ReviewTargetType.PUBLICATION_SELECTOR &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status === ReviewAnnotationStatus.RESOLVED;

	const showViewInMenuItem =
		(showCreatedContextButton || showResolvedContextButton) &&
		!reviewAnnotation.error &&
		!reviewAnnotation.isLoading;

	const showPopoverButton = React.useMemo(() => {
		if (
			context === FeedbackContextType.CREATED_CONTEXT ||
			reviewAnnotation.busyState !== ReviewBusyState.IDLE ||
			!reviewAnnotation.isSelected ||
			hasReplyInNonIdleBusyState ||
			(!showEditButton && !showRemoveButton && !showViewInMenuItem)
		) {
			return false;
		}

		return true;
	}, [
		context,
		hasReplyInNonIdleBusyState,
		reviewAnnotation.busyState,
		reviewAnnotation.isSelected,
		showEditButton,
		showRemoveButton,
		showViewInMenuItem,
	]);

	const renderAnchor = React.useCallback(
		({ isDropOpened, isFocused, onRef, setIsDropOpened }) => {
			return (
				<Button
					icon="ellipsis-h"
					isDisabled={reviewAnnotation.isLoading}
					isFocused={isFocused}
					isSelected={isDropOpened}
					onClick={() =>
						setIsDropOpened((isDropOpened) => !isDropOpened)
					}
					onRef={onRef}
					tooltipContent={t('More actions')}
					type="transparent"
				/>
			);
		},
		[reviewAnnotation.isLoading]
	);

	const renderViewInDrop = React.useCallback(
		({ closeOuterDrop }) => {
			return (
				<Drop>
					<Menu>
						<MenuItem
							isDisabled={!showCreatedContextButton}
							label={t('Created context')}
							onClick={() => {
								onReviewAnnotationShowInCreatedContext();
								closeOuterDrop();
							}}
							tooltipContent={t(
								'Open a modal which shows the version of the document of this comment when it was created.'
							)}
						/>

						<MenuItem
							isDisabled={!showResolvedContextButton}
							label={t('Resolved context')}
							onClick={() => {
								onReviewAnnotationShowInResolvedContext();
								closeOuterDrop();
							}}
							tooltipContent={t(
								'Open a modal which shows the version of the document of this comment when it was resolved.'
							)}
						/>
					</Menu>
				</Drop>
			);
		},
		[
			onReviewAnnotationShowInCreatedContext,
			onReviewAnnotationShowInResolvedContext,
			showCreatedContextButton,
			showResolvedContextButton,
		]
	);

	const renderDrop = React.useCallback(
		({ setIsDropOpened }) => {
			return (
				<Drop>
					<Menu>
						{showEditButton && (
							<MenuItem
								icon="far fa-pencil"
								isDisabled={reviewAnnotation.isLoading}
								label={t('Edit')}
								onClick={() => {
									onReviewAnnotationEdit();
									setIsDropOpened(false);
								}}
							/>
						)}

						{showRemoveButton && (
							<MenuItem
								icon="times"
								isDisabled={reviewAnnotation.isLoading}
								label={t('Remove')}
								onClick={() => {
									onReviewAnnotationRemove();
									setIsDropOpened(false);
								}}
							/>
						)}

						{showViewInMenuItem && (
							<MenuItemWithDrop
								icon="eye"
								label={t('View in...')}
								renderDrop={renderViewInDrop}
								tooltipContent={t('View in another context')}
							/>
						)}
					</Menu>
				</Drop>
			);
		},
		[
			onReviewAnnotationEdit,
			onReviewAnnotationRemove,
			renderViewInDrop,
			reviewAnnotation.isLoading,
			showEditButton,
			showRemoveButton,
			showViewInMenuItem,
		]
	);

	const showResolveButton =
		!hasReplyInNonIdleBusyState &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
		reviewAnnotation.status !== ReviewAnnotationStatus.PRIVATE &&
		reviewAnnotation.status !== ReviewAnnotationStatus.RESOLVED &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT;

	const showShareButton =
		!hasReplyInNonIdleBusyState &&
		reviewAnnotation.busyState !== ReviewBusyState.EDITING &&
		reviewAnnotation.status === ReviewAnnotationStatus.PRIVATE &&
		(context === FeedbackContextType.EDITOR ||
			context === FeedbackContextType.REVIEW);

	const shareButtonLabel =
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== ReviewBusyState.ADDING &&
		determineShareButtonLabel(
			reviewAnnotation,
			reviewAnnotation.error,
			reviewAnnotation.isLoading
		);

	const shareButtonIsDisabled =
		(typeof reviewAnnotation.error !== 'number' &&
			reviewAnnotation.error &&
			reviewAnnotation.error.recovery !==
				ReviewRecoveryOption.RETRYABLE) ||
		reviewAnnotation.busyState === ReviewBusyState.REMOVING ||
		reviewAnnotation.isLoading ||
		reviewAnnotation.busyState === ReviewBusyState.ADDING;

	let shareButtonType: 'default' | 'primary' | 'transparent';
	if (
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== ReviewBusyState.ADDING
	) {
		shareButtonType = 'primary';
	} else if (reviewAnnotation.busyState === ReviewBusyState.ADDING) {
		shareButtonType = 'default';
	} else {
		shareButtonType = 'transparent';
	}

	const resolutionBadgeTooltipContent = React.useMemo(() => {
		if (!reviewAnnotation.resolvedMetadata?.['resolution']) {
			return undefined;
		}

		const resolution = resolutions
			.find(
				(r) =>
					r.value === reviewAnnotation.resolvedMetadata['resolution']
			)
			.displayLabel.toLowerCase();

		return reviewAnnotation.type === 'proposal'
			? t('This proposal is {RESOLUTION}', {
					RESOLUTION: resolution,
			  })
			: t('This comment is {RESOLUTION}', {
					RESOLUTION: resolution,
			  });
	}, [reviewAnnotation]);

	return (
		<Flex
			alignItems="center"
			justifyContent="space-between"
			spaceSize="s"
			style={{ height: CARD_HEADER_HEIGHT }}
		>
			<AuthorAndTimestampLabel reviewAnnotation={reviewAnnotation} />

			<Flex flex="0 0 auto" spaceSize="m">
				{(context === FeedbackContextType.EDITOR_SHARING ||
					context === FeedbackContextType.REVIEW_SHARING) &&
					(!reviewAnnotation.error ||
						(typeof reviewAnnotation.error !== 'number' &&
							reviewAnnotation.error.recovery ===
								ReviewRecoveryOption.RETRYABLE)) && (
						<Block>
							<Checkbox
								isDisabled={reviewAnnotation.isLoading}
								onChange={
									onReviewAnnotationShareAddRemoveToggle
								}
								value={isSelectedToShare}
							/>
						</Block>
					)}

				{context !== FeedbackContextType.EDITOR_SHARING &&
					context !== FeedbackContextType.REVIEW_SHARING && (
						<Flex alignItems="center" spaceSize="m">
							{showShareButton && (
								<Button
									key={shareButtonType}
									icon={
										reviewAnnotation.isLoading
											? 'spinner'
											: 'far fa-user-lock'
									}
									isDisabled={shareButtonIsDisabled}
									label={shareButtonLabel}
									onClick={onReviewAnnotationShare}
									type={shareButtonType}
									tooltipContent={
										reviewAnnotation.type === 'proposal'
											? t(
													'Proposal is private. Click to share.'
											  )
											: t(
													'Comment is private. Click to share.'
											  )
									}
								/>
							)}

							{showResolveButton &&
								reviewAnnotation.busyState !==
									ReviewBusyState.RESOLVING && (
									<Button
										key={
											reviewAnnotation.isSelected
												? 'primary'
												: 'transparent'
										}
										icon="check"
										isDisabled={reviewAnnotation.isLoading}
										label={
											reviewAnnotation.isSelected &&
											t('Resolve')
										}
										onClick={onReviewAnnotationResolve}
										tooltipContent={
											reviewAnnotation.type === 'proposal'
												? t(
														'Proposal is shared. Click to resolve.'
												  )
												: t(
														'Comment is shared. Click to resolve.'
												  )
										}
										type={
											reviewAnnotation.isSelected
												? 'primary'
												: 'transparent'
										}
									/>
								)}

							{reviewAnnotation.status ===
								ReviewAnnotationStatus.RESOLVED &&
								reviewAnnotation.resolvedMetadata?.[
									'resolution'
								] && (
									<NewChip
										iconBefore={
											reviewAnnotation.resolvedMetadata[
												'resolution'
											] === 'accepted'
												? 'far fa-check'
												: reviewAnnotation
														.resolvedMetadata[
														'resolution'
												  ] === 'rejected'
												? 'far fa-times'
												: null
										}
										isCondensed={
											reviewAnnotation.isSelected
										}
										label={
											!reviewAnnotation.isSelected &&
											reviewAnnotation.resolvedMetadata[
												'resolution'
											]
										}
										tooltipContent={
											resolutionBadgeTooltipContent
										}
									/>
								)}

							{showPopoverButton && (
								<DropAnchor
									renderAnchor={renderAnchor}
									renderDrop={renderDrop}
								/>
							)}
						</Flex>
					)}
			</Flex>
		</Flex>
	);
}
