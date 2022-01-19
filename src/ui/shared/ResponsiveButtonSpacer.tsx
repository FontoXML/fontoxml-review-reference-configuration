import * as React from 'react';

import { Block } from 'fds/components';
import { applyCss } from 'fds/system';

const responsiveSpacerStyles = applyCss({
	flex: '1 0 auto',
	minWidth: '0.5rem',
	maxWidth: '1rem',
});

const ResponsiveButtonSpacer: React.FC = () => {
	return <Block {...responsiveSpacerStyles} />;
};

export default ResponsiveButtonSpacer;
