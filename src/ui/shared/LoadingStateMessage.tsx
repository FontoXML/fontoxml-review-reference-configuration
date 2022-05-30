import * as React from 'react';

import { CompactStateMessage } from 'fontoxml-design-system/src/components';
import type { Message } from 'fontoxml-design-system/src/types';

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
