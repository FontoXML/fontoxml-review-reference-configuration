import * as React from 'react';

import {
	Button,
	CompactStateMessage,
	Flex,
} from 'fontoxml-design-system/src/components';
import ReviewRecoveryOption from 'fontoxml-feedback/src/ReviewRecoveryOption';
import type {
	ReviewAnnotationError,
	ReviewCardContentComponentProps,
} from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const iconByConnotation = {
	error: 'times-circle',
	warning: 'exclamation-triangle',
};

type Props = {
	error: ReviewAnnotationError;
	onAcknowledge: ReviewCardContentComponentProps['onReviewAnnotationErrorAcknowledge'];
	onRefresh: ReviewCardContentComponentProps['onReviewAnnotationRefresh'];
};

const ErrorStateMessage: React.FC<Props> = ({ error, onAcknowledge, onRefresh }) =>{
	const isAnnotationError = typeof error !== 'number';

	const connotation =
		isAnnotationError &&
		error.recovery === ReviewRecoveryOption.ACKNOWLEDGEABLE
			? 'error'
			: 'warning';

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
				error.recovery === ReviewRecoveryOption.ACKNOWLEDGEABLE && (
					<Button
						label={t('Hide message')}
						onClick={onAcknowledge}
						type="primary"
					/>
				)}

			{isAnnotationError &&
				error.recovery === ReviewRecoveryOption.REFRESHABLE && (
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
