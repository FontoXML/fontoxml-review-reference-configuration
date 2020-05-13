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
import { RecoveryOption, TargetType } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

export default function CardFooter({
	reviewAnnotation,
	onProposalMerge = null,
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
	const renderViewInDropAnchor = useCallback(
		({ isDropOpened, isFocused, onRef, toggleDrop }) => (
			<Button
				icon="eye"
				iconAfter={isDropOpened ? 'angle-up' : 'angle-down'}
				isFocused={isFocused}
				isSelected={isDropOpened}
				onClick={toggleDrop}
				onRef={onRef}
			/>
		),
		[]
	);

	const renderViewInDrop = useCallback(
		() => (
			<Drop>
				<Menu>
					<MenuItem
						icon="comment"
						isDisabled={!showCreatedContextButton || reviewAnnotation.isLoading}
						label={t('View in created context')}
						onClick={onReviewAnnotationShowInCreatedContext}
						tooltipContent={t(
							'Open a modal which shows the version of the document of this comment when it was created.'
						)}
					/>

					<MenuItem
						icon="check"
						isDisabled={!showResolvedContextButton || reviewAnnotation.isLoading}
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
			reviewAnnotation.isLoading,
			showCreatedContextButton,
			showResolvedContextButton
		]
	);

	return (
		<Fragment>
			<HorizontalSeparationLine marginSizeBottom="m" />

			<Flex
				alignItems="center"
				justifyContent={
					reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
					(showCreatedContextButton || showResolvedContextButton)
						? 'space-between'
						: 'flex-end'
				}
				paddingSize="m"
			>
				{reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR &&
					(showCreatedContextButton || showResolvedContextButton) && (
						<DropAnchor
							renderAnchor={renderViewInDropAnchor}
							renderDrop={renderViewInDrop}
						/>
					)}

				<Flex alignItems="center" spaceSize="m">
					{showReplyButton && (
						<Button
							icon="reply"
							isDisabled={!!reviewAnnotation.error || reviewAnnotation.isLoading}
							onClick={onReplyAdd}
						/>
					)}

					{showAcceptProposalButton && (
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
								reviewAnnotation.isLoading
							}
							label={reviewAnnotation.isLoading ? t('Sharing…') : t('Share')}
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
