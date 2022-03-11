import { CompactStateMessage } from 'fds/components';
import * as React from 'react';

function LoadingStateMessage({ message }) {
	return (
		<CompactStateMessage
			isSingleLine={false}
			message={message}
			visual="spinner"
		/>
	);
}

export default LoadingStateMessage;
