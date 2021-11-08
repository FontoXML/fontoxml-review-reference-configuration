import React from 'react';

import { Button, CompactStateMessage, Flex } from 'fds/components';

import { RecoveryOption } from 'fontoxml-feedback/src/types';

import t from 'fontoxml-localization/src/t';

const iconByConnotation = {
	error: 'times-circle',
	warning: 'exclamation-triangle',
};

function ErrorStateMessage({ error, onAcknowledge, onRefresh }) {
	const connotation =
		error.recovery === RecoveryOption.ACKNOWLEDGEABLE ? 'error' : 'warning';

	return (
		<Flex alignItems="center" flexDirection="column">
			<CompactStateMessage
				connotation={connotation}
				isSingleLine={false}
				message={error.message}
				visual={iconByConnotation[connotation]}
			/>

			{error.recovery === RecoveryOption.ACKNOWLEDGEABLE && (
				<Button
					label={t('Hide message')}
					onClick={onAcknowledge}
					type="primary"
				/>
			)}

			{error.recovery === RecoveryOption.REFRESHABLE && (
				<Button
					label={t('Refresh')}
					onClick={onRefresh}
					type="primary"
				/>
			)}
		</Flex>
	);
}

export default ErrorStateMessage;
