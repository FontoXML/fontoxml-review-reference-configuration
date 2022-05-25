import { Block, Text, TextLink } from 'fds/components';
import { applyCss } from 'fds/system';
import * as React from 'react';

import t from 'fontoxml-localization/src/t';

const styles = applyCss([
	{
		userSelect: 'text',
	},
	{
		// Combined with '-webkit-line-clamp' this clamps the text to two lines and
		// truncates it if longer. '-webkit-line-clamp' is set via the style prop
		// because Glamor thinks the value should be px value. Which is wrong!
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
	},
]);

enum TruncationState {
	CAN_TRUNCATE = 'CAN_TRUNCATE',
	IS_FULLY_VISIBLE = 'IS_FULLY_VISIBLE',
	IS_TRUNCATED = 'IS_TRUNCATED',
}

function useTruncation(): {
	handleShowMoreClick(this: void): void;
	selectedCommentRef: HTMLElement;
	state: TruncationState;
} {
	const [truncationState, setTruncationState] =
		React.useState<TruncationState>(TruncationState.CAN_TRUNCATE);

	const selectedCommentRef = React.useRef<HTMLElement>(null);

	React.useLayoutEffect(() => {
		if (
			selectedCommentRef.current?.scrollHeight >
			selectedCommentRef.current?.clientHeight
		) {
			setTruncationState(TruncationState.IS_TRUNCATED);
		}
	}, []);

	const handleShowMoreClick = React.useCallback(() => {
		setTruncationState(TruncationState.IS_FULLY_VISIBLE);
	}, []);

	return {
		handleShowMoreClick,
		selectedCommentRef,
		state: truncationState,
	};
}

const TruncatedText: React.FC = (props) => {
	const {
		state: truncationState,
		handleShowMoreClick,
		selectedCommentRef,
	} = useTruncation();

	return (
		<>
			<Text data-test-id={props['data-test-id']}>
				<Block
					{...styles}
					style={{
						WebkitLineClamp:
							truncationState !==
								TruncationState.IS_FULLY_VISIBLE && '7',
					}}
					ref={selectedCommentRef}
				>
					{props.children}
				</Block>
			</Text>

			{truncationState === TruncationState.IS_TRUNCATED && (
				<TextLink
					onClick={handleShowMoreClick}
					label={t('Show more')}
				/>
			)}
		</>
	);
};

export default TruncatedText;
