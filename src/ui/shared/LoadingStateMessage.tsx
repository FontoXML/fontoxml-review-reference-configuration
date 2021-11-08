import React from 'react';

import { CompactStateMessage } from 'fds/components';

function LoadingStateMessage({ message }) {
	return <CompactStateMessage isSingleLine={false} message={message} visual="spinner" />;
}

export default LoadingStateMessage;
