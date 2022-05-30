import * as React from 'react';

import { Block } from 'fontoxml-design-system/src/components';
import { applyCss } from 'fontoxml-design-system/src/system';

const responsiveSpacerStyles = applyCss({
	flex: '1 0 auto',
	minWidth: '0.5rem',
	maxWidth: '1rem',
});

const ResponsiveButtonSpacer: React.FC = () => {
	return <Block {...responsiveSpacerStyles} />;
};

export default ResponsiveButtonSpacer;
