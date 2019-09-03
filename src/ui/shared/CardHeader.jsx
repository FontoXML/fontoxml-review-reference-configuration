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
		<Flex alignItems="center" justifyContent="space-between">
			<Label colorName="text-muted-color">{authorAndTimestampLabel}</Label>

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
					<Flex spaceSize="m">
						{reviewAnnotation.targetFoundForRevision === false && (
							<Icon colorName="text-warning-color" icon="flag" />
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
