import { Button, CompactStateMessage, Flex } from 'fds/components';
import * as React from 'react';

import { AnnotationError, CardContentComponentProps, RecoveryOption } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const iconByConnotation = {
	error: 'times-circle',
	warning: 'exclamation-triangle',
};

type Props = {
	error: AnnotationError;
	onAcknowledge: CardContentComponentProps['onReviewAnnotationErrorAcknowledge'];
	onRefresh: CardContentComponentProps['onReviewAnnotationRefresh'];
};

function ErrorStateMessage({ error, onAcknowledge, onRefresh }: Props) {
	const isAnnotationError = typeof error !== 'number';

	const connotation =
		isAnnotationError &&
		error.recovery === RecoveryOption.ACKNOWLEDGEABLE ? 'error' : 'warning';

	return (
		<Flex alignItems="center" flexDirection="column">
			<CompactStateMessage
				connotation={connotation}
				isSingleLine={false}
				message={isAnnotationError ? error.message : ''}
				visual={iconByConnotation[connotation]}
			/>

			{isAnnotationError &&
				typeof error !== 'number' &&
				error &&
				error.recovery === RecoveryOption.ACKNOWLEDGEABLE && (
				<Button
					label={t('Hide message')}
					onClick={onAcknowledge}
					type="primary"
				/>
			)}

			{isAnnotationError && error.recovery === RecoveryOption.REFRESHABLE && (
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
