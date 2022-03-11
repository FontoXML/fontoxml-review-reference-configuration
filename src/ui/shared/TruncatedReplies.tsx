import { HorizontalSeparationLine, TextLink } from 'fds/components';
import * as React from 'react';

import t from 'fontoxml-localization/src/t';

import type { Props as RepliesProps } from '../shared/Replies';
import Replies from '../shared/Replies';

const MAX_NUMBER_OF_REPLIES_TO_SHOW = 2;

type Props = RepliesProps & {
	isEditingReply: boolean;
	includeResolutionInTruncatedReplies: boolean;
};

const TruncatedReplies: React.FC<Props> = ({
	replies,
	isEditingReply,
	includeResolutionInTruncatedReplies,
	...repliesProps
}) => {
	const [areRepliesExpanded, setAreRepliesExpanded] = React.useState(false);
	const handleExpandRepliesTextLinkClick = React.useCallback(() => {
		setAreRepliesExpanded(true);
	}, []);

	const wasEditingReplyInitially = React.useRef(isEditingReply);
	const hasTruncatedInitially = React.useRef(false);

	const [collapsedRepliesCount, setCollapsedRepliesCount] = React.useState(0);
	React.useLayoutEffect(() => {
		setCollapsedRepliesCount((previousCollapsedRepliesCount: number) => {
			if (areRepliesExpanded) {
				return 0;
			}

			if (
				(isEditingReply || wasEditingReplyInitially.current) &&
				hasTruncatedInitially.current
			) {
				// Preserve the editing reply positioning (so it won't jump
				// around when starting to edit a reply).
				return previousCollapsedRepliesCount;
			}

			hasTruncatedInitially.current = true;

			// We want to treat resolutions and editing replies in a similar
			// fashion.
			const maxNumberOfRepliesToShow =
				MAX_NUMBER_OF_REPLIES_TO_SHOW +
				(includeResolutionInTruncatedReplies ? -1 : 0) +
				(isEditingReply ? -MAX_NUMBER_OF_REPLIES_TO_SHOW : 0);

			return Math.max(replies.length - maxNumberOfRepliesToShow, 0);
		});
	}, [
		areRepliesExpanded,
		includeResolutionInTruncatedReplies,
		isEditingReply,
		replies,
		setCollapsedRepliesCount,
	]);

	const repliesToShow = React.useMemo(() => {
		if (areRepliesExpanded) {
			return replies;
		}

		return replies.filter((reply, i) => i >= collapsedRepliesCount);
	}, [areRepliesExpanded, collapsedRepliesCount, replies]);

	return (
		<>
			{collapsedRepliesCount > 0 && (
				<>
					<HorizontalSeparationLine />

					<TextLink
						label={t(
							'Show {COLLAPSED_REPLIES_COUNT, plural, one {1 more reply} other {# more replies}}',
							{
								COLLAPSED_REPLIES_COUNT: collapsedRepliesCount,
							}
						)}
						onClick={handleExpandRepliesTextLinkClick}
					/>
				</>
			)}

			{repliesToShow.length > 0 && (
				<Replies {...repliesProps} replies={repliesToShow} />
			)}
		</>
	);
};

export default TruncatedReplies;
