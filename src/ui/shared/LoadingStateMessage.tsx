import * as React from 'react';

import { CompactStateMessage } from 'fontoxml-design-system/src/components';
import type { FdsMessage } from 'fontoxml-design-system/src/types';

type Props = {
	message: FdsMessage;
};

const LoadingStateMessage: React.FC<Props> = ({ message }) => {
	return (
		<CompactStateMessage
			isSingleLine={false}
			message={message}
			visual="spinner"
		/>
	);
}

export default LoadingStateMessage;
