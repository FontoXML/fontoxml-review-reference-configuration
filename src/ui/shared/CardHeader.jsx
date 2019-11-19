import React, { useMemo } from 'react';

import {
	Block,
	Checkbox,
	CompactButton,
	Flex,
	Icon,
	Label,
	Menu,
	MenuItem,
	Popover,
	PopoverAnchor,
	PopoverBody
} from 'fds/components';

import Badge from 'fontoxml-feedback/src/Badge.jsx';
import {
	AnnotationStatus,
	BusyState,
	ContextType,
	RecoveryOption
} from 'fontoxml-feedback/src/types.js';
import useAuthorAndTimestampLabel from 'fontoxml-feedback/src/useAuthorAndTimestampLabel.jsx';

import t from 'fontoxml-localization/src/t.js';

export default function CardHeader({
	context,
	hasReplyInNonIdleBusyState,
	isSelectedToShare,
	reviewAnnotation,
	onReviewAnnotationEdit,
	onReviewAnnotationRemove,
	onReviewAnnotationShareAddRemoveToggle,
	showEditButton,
	showRemoveButton
}) {
	const authorAndTimestampLabel = useAuthorAndTimestampLabel(reviewAnnotation);
	// We split the combined label into separate parts so we only truncated the author name and not
	// the timestamp label if the horizontal space is limited.
	// The ' – ' part contains a special "en-dash" symbol: –, which is slightly different than a
	// regular dash: -. This means it will be very unlikely that ' – ' is occuring within the
	// author name; "hyphenated names" such as Jan-Willem all use normal dashes (and don't even use
	// spaces around the dash).
	const [authorLabel, timestampLabel] = authorAndTimestampLabel.split(' – ');

	const showPopoverButton = useMemo(() => {
		if (
			context === ContextType.CREATED_CONTEXT_MODAL ||
			reviewAnnotation.busyState !== BusyState.IDLE ||
			reviewAnnotation.status === AnnotationStatus.RESOLVED ||
			!reviewAnnotation.isSelected ||
			hasReplyInNonIdleBusyState ||
			(!showEditButton && !showRemoveButton)
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
		showRemoveButton
	]);

	return (
		<Flex alignItems="center" justifyContent="space-between" spaceSize="m">
			<Flex spaceSize="s">
				<Label colorName="text-muted-color" tooltipContent={authorLabel}>
					{authorLabel}
				</Label>

				{timestampLabel && (
					<Flex flex="none" spaceSize="s">
						<Label colorName="text-muted-color">–</Label>
						<Label colorName="text-muted-color">{timestampLabel}</Label>
					</Flex>
				)}
			</Flex>

			{(context === ContextType.EDITOR_SHARING_SIDEBAR ||
				context === ContextType.REVIEW_SHARING_SIDEBAR) &&
				(!reviewAnnotation.error ||
					reviewAnnotation.error.recovery === RecoveryOption.RETRYABLE) && (
					<Block>
						<Checkbox
							isDisabled={reviewAnnotation.isLoading}
							onChange={onReviewAnnotationShareAddRemoveToggle}
							value={isSelectedToShare}
						/>
					</Block>
				)}

			{context !== ContextType.EDITOR_SHARING_SIDEBAR &&
				context !== ContextType.REVIEW_SHARING_SIDEBAR && (
					<Flex flex="none" spaceSize="m">
						{reviewAnnotation.targetFoundForRevision === false && (
							<Icon
								colorName="text-warning-color"
								icon="low-vision"
								tooltipContent={t(
									'This comment lost its position in the document.'
								)}
							/>
						)}

						{reviewAnnotation.status === AnnotationStatus.PRIVATE && (
							<Badge label={t('Private')} />
						)}
						{reviewAnnotation.status === AnnotationStatus.RESOLVED && (
							<Badge label={t(reviewAnnotation.resolvedMetadata.resolution)} />
						)}

						{showPopoverButton && (
							<PopoverAnchor
								renderAnchor={({ isPopoverOpened, onRef, togglePopover }) => (
									<CompactButton
										icon="ellipsis-h"
										isDisabled={reviewAnnotation.isLoading}
										isSelected={isPopoverOpened}
										onClick={togglePopover}
										onRef={onRef}
									/>
								)}
								renderPopover={({ togglePopover }) => (
									<Popover maxWidth="250px">
										<PopoverBody paddingSize={0}>
											<Menu>
												{showEditButton && (
													<MenuItem
														icon="pencil"
														isDisabled={reviewAnnotation.isLoading}
														label={t('Edit')}
														onClick={() => {
															onReviewAnnotationEdit();
															togglePopover();
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
															togglePopover();
														}}
													/>
												)}
											</Menu>
										</PopoverBody>
									</Popover>
								)}
							/>
						)}
					</Flex>
				)}
		</Flex>
	);
}
