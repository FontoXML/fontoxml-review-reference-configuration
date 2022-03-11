import {
	Block,
	Button,
	Checkbox,
	Drop,
	DropAnchor,
	Flex,
	Icon,
	Menu,
	MenuItem,
	MenuItemWithDrop,
} from 'fds/components';
import * as React from 'react';

import Badge from 'fontoxml-feedback/src/Badge';
import {
	AnnotationStatus,
	BusyState,
	RecoveryOption,
	TargetType,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';
import resolutions from '../feedbackResolutions';
import { CARD_HEADER_HEIGHT } from './../constants';
import FeedbackContextType from 'fontoxml-feedback/src/FeedbackContextType';

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
}) {
	const showEditButton =
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showRemoveButton =
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status === AnnotationStatus.PRIVATE;

	const showCreatedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT;

	const showResolvedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT &&
		reviewAnnotation.status === AnnotationStatus.RESOLVED;

	const showViewInMenuItem =
		(showCreatedContextButton || showResolvedContextButton) &&
		!reviewAnnotation.error &&
		!reviewAnnotation.isLoading;

	const showPopoverButton = React.useMemo(() => {
		if (
			context === FeedbackContextType.CREATED_CONTEXT ||
			reviewAnnotation.busyState !== BusyState.IDLE ||
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
		reviewAnnotation.status,
		showEditButton,
		showRemoveButton,
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
		[]
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
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.status !== AnnotationStatus.PRIVATE &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED &&
		context !== FeedbackContextType.CREATED_CONTEXT &&
		context !== FeedbackContextType.RESOLVED_CONTEXT;

	const showShareButton =
		!hasReplyInNonIdleBusyState &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.status === AnnotationStatus.PRIVATE &&
		(context === FeedbackContextType.EDITOR ||
			context === FeedbackContextType.REVIEW);

	const shareButtonLabel =
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING &&
		determineShareButtonLabel(
			reviewAnnotation,
			reviewAnnotation.error,
			reviewAnnotation.isLoading
		);

	const shareButtonIsDisabled =
		(reviewAnnotation.error &&
			reviewAnnotation.error.recovery !== RecoveryOption.RETRYABLE) ||
		reviewAnnotation.busyState === BusyState.REMOVING ||
		reviewAnnotation.isLoading ||
		reviewAnnotation.busyState === BusyState.ADDING;

	let shareButtonType: 'default' | 'primary' | 'transparent';
	if (
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING
	) {
		shareButtonType = 'primary';
	} else if (reviewAnnotation.busyState === BusyState.ADDING) {
		shareButtonType = 'default';
	} else {
		shareButtonType = 'transparent';
	}

	const resolutionBadgeTooltipContent = React.useMemo(() => {
		if (!reviewAnnotation.resolvedMetadata?.resolution) {
			return undefined;
		}

		const resolution = resolutions
			.find(
				(r) => r.value === reviewAnnotation.resolvedMetadata.resolution
			)
			.displayLabel.toLowerCase();

		return reviewAnnotation.type === 'proposal'
			? t(`This proposal is {RESOLUTION}`, {
					RESOLUTION: resolution,
			  })
			: t(`This comment is {RESOLUTION}`, {
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
						reviewAnnotation.error.recovery ===
							RecoveryOption.RETRYABLE) && (
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
									BusyState.RESOLVING && (
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
								AnnotationStatus.RESOLVED &&
								reviewAnnotation.resolvedMetadata
									?.resolution && (
									<Badge
										label={
											<Flex
												alignItems="center"
												flexDirection="row"
												isInline
											>
												{reviewAnnotation
													.resolvedMetadata
													.resolution ===
													'accepted' && (
													<Icon
														color="inherit"
														icon="check"
														isInline
													/>
												)}
												{reviewAnnotation
													.resolvedMetadata
													.resolution ===
													'rejected' && (
													<Icon
														color="inherit"
														icon="times"
														isInline
													/>
												)}

												{!reviewAnnotation.isSelected &&
													reviewAnnotation
														.resolvedMetadata
														.resolution}
											</Flex>
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
