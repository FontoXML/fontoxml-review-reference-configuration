import type { ComponentProps } from 'react';
import { useCallback, useEffect, useState } from 'react';

import {
	RadioButtonGroup,
	TextArea,
	Form,
	Flex,
	Button,
	Block,
} from 'fontoxml-design-system/src/components';
import { applyCss } from 'fontoxml-design-system/src/system';
import type { FdsFormValueByName } from 'fontoxml-design-system/src/types';
import type {
	FdsFormFeedback,
	FdsValidateCallback,
	FdsFormFeedbackByName,
} from 'fontoxml-design-system/src/types';
import ReviewAnnotationStatus from 'fontoxml-feedback/src/ReviewAnnotationStatus';
import type { ReviewAnnotationsOverviewBatchActionFormComponentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import resolutions from '../feedbackResolutions';

import determineResolvedDocumentRevisionIdForAnnotation from './determineResolveDocumentRevisionIdForAnnotation';
import type { ReviewAnnotationResolvedMetadata } from './types';
import useDelayedFormFeedback from './useDelayedFormFeedback';

// NOTE: for every field (name) in the form,
// there should be a key with the same name and a value of null here.
const EMPTY_FEEDBACK: FdsFormFeedbackByName = {
	// TODO: FdsFormFeedbackByName is badly typed (but public):
	// it should also accept null instead of only FdsFormFeedback as a value.
	resolution: null,
};

const ROWS = { minimum: 1, maximum: 2 };

type FeedbackByName = FdsFormFeedbackByName & {
	resolution?: FdsFormFeedback;
};

type ValueByName = FdsFormValueByName & {
	resolution?: string;
	resolutionComment?: string;
};

type OnFieldChange = Exclude<
	ComponentProps<typeof Form>['onFieldChange'],
	undefined
>;

type Props = ReviewAnnotationsOverviewBatchActionFormComponentProps;

const BatchResolveForm = ({
	rows,
	applicabilityByRow,
	applicableRows,
	nonApplicableRows,
	okCount,
	problemCount,

	updateApplicability,

	closeForm,
	onSubmit,
}: Props) => {
	const [feedbackByName, setFeedbackByName] =
		useState<FeedbackByName>(EMPTY_FEEDBACK);
	const [valueByName, setValueByName] = useState<ValueByName>({});

	const [
		showFormFeedback,
		_hasAnyFormFeedback,
		hasErrorFormFeedback,
		onFormSubmitWithDelayedFormFeedback,
	] = useDelayedFormFeedback(feedbackByName);

	const handleFormFieldChange = useCallback<OnFieldChange>(
		({ feedback, name, value }) => {
			setFeedbackByName((prevFeedbackByName) => ({
				...prevFeedbackByName,
				[name]: feedback,
			}));
			setValueByName((prevValueByName) => ({
				...prevValueByName,
				[name]: value,
			}));
		},
		[]
	);

	useEffect(() => {
		updateApplicability(valueByName);
	}, [updateApplicability, valueByName]);

	const validateResolutionField = useCallback<FdsValidateCallback>(
		(value: unknown) => {
			if (!value) {
				return {
					connotation: 'error',
					message: 'Resolution is required',
				} as FdsFormFeedback;
			}

			return null;
		},
		[]
	);

	const handleSubmitButtonClick = useCallback(() => {
		onFormSubmitWithDelayedFormFeedback(() => {
			onSubmit(({ editAnnotation }) => {
				for (const row of applicableRows) {
					const hierarchyNodeId = row.hierarchyNodeId;
					const resolvedDocumentRevisionId =
						determineResolvedDocumentRevisionIdForAnnotation(
							hierarchyNodeId,
							row.data.id
						);

					editAnnotation(row.data.id, {
						resolvedDocumentRevisionId,
						resolvedMetadata: {
							resolution: valueByName.resolution,
							resolutionComment: valueByName.resolutionComment,
						} as ReviewAnnotationResolvedMetadata,
						status: ReviewAnnotationStatus.RESOLVED,
					});
				}
			});
		});
	}, [
		applicableRows,
		onFormSubmitWithDelayedFormFeedback,
		onSubmit,
		valueByName.resolution,
		valueByName.resolutionComment,
	]);

	return (
		<Form
			feedbackByName={showFormFeedback ? feedbackByName : EMPTY_FEEDBACK}
			onFieldChange={handleFormFieldChange}
			spaceVerticalSize="m"
			valueByName={valueByName}
		>
			<RadioButtonGroup
				items={resolutions}
				name="resolution"
				validate={validateResolutionField}
			/>

			<TextArea
				ariaLabel={t('Resolution message')}
				name="resolutionComment"
				placeholder={t(
					'Optionally describe how or why you resolved these comments'
				)}
				rows={ROWS}
			/>

			<Flex
				flexDirection="row"
				justifyContent="space-between"
				spaceSize="l"
			>
				<Button label={t('Cancel')} onClick={closeForm} />

				<Button
					isDisabled={
						okCount === 0 ||
						(showFormFeedback && hasErrorFormFeedback)
					}
					label={
						problemCount === 0
							? t('Resolve')
							: t('Resolve ({OK_COUNT} of {TOTAL_COUNT})', {
									OK_COUNT: okCount,
									TOTAL_COUNT: rows.length,
								})
					}
					onClick={handleSubmitButtonClick}
					type="primary"
				/>
			</Flex>
		</Form>
	);
};

export default BatchResolveForm;
