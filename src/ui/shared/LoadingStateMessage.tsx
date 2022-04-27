import { CompactStateMessage } from 'fds/components';
import { Message } from 'fontoxml-design-system/src/types';
import * as React from 'react';

type Props = {
	message: Message;
};

function LoadingStateMessage({ message }: Props) {
	return (
		<CompactStateMessage
			isSingleLine={false}
			message={message}
			visual="spinner"
		/>
	);
}

export default LoadingStateMessage;
