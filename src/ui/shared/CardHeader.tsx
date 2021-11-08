import React, { useMemo, useCallback } from 'react';

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

import Badge from 'fontoxml-feedback/src/Badge';
import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption,
	TargetType,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import resolutions from '../feedbackResolutions';

import AuthorAndTimestampLabel from '../AuthorAndTimestampLabel';

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
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL &&
		reviewAnnotation.status !== AnnotationStatus.RESOLVED;

	const showRemoveButton =
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL &&
		reviewAnnotation.status === AnnotationStatus.PRIVATE;

	const showCreatedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showResolvedContextButton =
		reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL &&
		reviewAnnotation.status === AnnotationStatus.RESOLVED;

	const showViewInMenuItem =
		(showCreatedContextButton || showResolvedContextButton) &&
		!reviewAnnotation.error &&
		!reviewAnnotation.isLoading;

	const showPopoverButton = useMemo(() => {
		if (
			context === ContextType.CREATED_CONTEXT_MODAL ||
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

	const renderAnchor = useCallback(
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

	const renderViewInDrop = useCallback(
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

	const renderDrop = useCallback(
		({ setIsDropOpened }) => {
			return (
				<Drop>
					<Menu>
						{showEditButton && (
							<MenuItem
								icon="fas fa-pencil"
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
							></MenuItemWithDrop>
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
		context !== ContextType.CREATED_CONTEXT_MODAL &&
		context !== ContextType.RESOLVED_CONTEXT_MODAL;

	const showShareButton =
		!hasReplyInNonIdleBusyState &&
		reviewAnnotation.busyState !== BusyState.EDITING &&
		reviewAnnotation.status === AnnotationStatus.PRIVATE &&
		(context === ContextType.EDITOR_SIDEBAR ||
			context === ContextType.REVIEW_SIDEBAR);

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

	let shareButtonType: 'primary' | 'default' | 'transparent';
	if (
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState !== BusyState.ADDING
	) {
		shareButtonType = 'primary';
	} else if (
		reviewAnnotation.isSelected &&
		reviewAnnotation.busyState === BusyState.ADDING
	) {
		shareButtonType = 'default';
	} else {
		shareButtonType = 'transparent';
	}

	const resolutionBadgeTooltipContent = useMemo(() => {
		if (!reviewAnnotation.resolvedMetadata?.resolution) {
			return undefined;
		}

		let resolution = resolutions
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
		<Flex alignItems="center" justifyContent="space-between" spaceSize="s">
			<AuthorAndTimestampLabel reviewAnnotation={reviewAnnotation} />

			<Flex flex="0 0 auto" spaceSize="m">
				{(context === ContextType.EDITOR_SHARING_SIDEBAR ||
					context === ContextType.REVIEW_SHARING_SIDEBAR) &&
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

				{context !== ContextType.EDITOR_SHARING_SIDEBAR &&
					context !== ContextType.REVIEW_SHARING_SIDEBAR && (
						<Flex
							alignItems="center"
							spaceSize="m"
							// Use minHeight to prevent jumpiness if buttons are mounted/unmounted
							style={{ minHeight: '2rem' }}
						>
							{showShareButton && (
								<Button
									key={shareButtonType}
									icon={
										reviewAnnotation.isLoading
											? 'spinner'
											: 'fas fa-user-lock'
									}
									isDisabled={shareButtonIsDisabled}
									label={shareButtonLabel}
									onClick={onReviewAnnotationShare}
									type={shareButtonType}
									tooltipContent={t(
										'Click to make this change proposal public'
									)}
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
