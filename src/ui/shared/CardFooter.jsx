import React, { Fragment } from 'react';

import { Button, Flex, HorizontalSeparationLine, Label, TextLink } from 'fds/components';

import { RecoveryOption, TargetType } from 'fontoxml-feedback/src/types.js';
import t from 'fontoxml-localization/src/t.js';

export default function CardFooter({
	reviewAnnotation,
	onReviewAnnotationResolve,
	onReviewAnnotationShare,
	onReviewAnnotationShowInCreatedContext,
	onReviewAnnotationShowInResolvedContext,
	onReplyAdd,
	showCreatedContextButton,
	showResolvedContextButton,
	showReplyButton,
	showResolveButton,
	showShareButton
}) {
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
				{reviewAnnotation.targets[0].type !== TargetType.PUBLICATION_SELECTOR && (
					<Flex alignItems="center" spaceSize="s">
						{(showCreatedContextButton || showResolvedContextButton) && (
							<Label>View in:</Label>
						)}

						{showCreatedContextButton && (
							<TextLink
								isDisabled={reviewAnnotation.isLoading}
								label={t('created context')}
								onClick={onReviewAnnotationShowInCreatedContext}
								tooltipContent={t(
									'Open a modal which shows the version of the document of this comment when it was created.'
								)}
							/>
						)}

						{showCreatedContextButton && showResolvedContextButton && <Label>|</Label>}

						{showResolvedContextButton && (
							<TextLink
								isDisabled={reviewAnnotation.isLoading}
								label={t('resolved context')}
								onClick={onReviewAnnotationShowInResolvedContext}
								tooltipContent={t(
									'Open a modal which shows the version of the document of this comment when it was resolved.'
								)}
							/>
						)}
					</Flex>
				)}

				<Flex alignItems="center" spaceSize="m">
					{showReplyButton && (
						<Button
							icon="reply"
							isDisabled={!!reviewAnnotation.error || reviewAnnotation.isLoading}
							label={t('Reply')}
							onClick={onReplyAdd}
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
