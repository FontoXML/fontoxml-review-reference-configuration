import type { ComponentProps } from 'react';
import { useCallback, useEffect, useState } from 'react';

import {
	Block,
	Flex,
	Icon,
	FormRow,
	RadioButtonGroup,
	TextArea,
	Form,
} from 'fontoxml-design-system/src/components';
import { applyCss } from 'fontoxml-design-system/src/system';
import type {
	FdsDataTableBatchActionFormComponentProps,
	FdsFormValueByName,
} from 'fontoxml-design-system/src/types';
import type {
	FdsFormFeedback,
	FdsValidateCallback,
	FdsFormFeedbackByName,
} from 'fontoxml-design-system/src/types';
import type { ReviewAnnotationInstance } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import resolutions from '../feedbackResolutions';

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

type Props =
	FdsDataTableBatchActionFormComponentProps<ReviewAnnotationInstance>;

const BatchResolveForm = ({
	rows,
	applicabilityByRows,
	applicableRows,
	nonApplicableRows,
	okCount,
	problemCount,
	onDataChange,
	showFeedback,
}: Props) => {
	const [feedbackByName, setFeedbackByName] =
		useState<FeedbackByName>(EMPTY_FEEDBACK);
	const [valueByName, setValueByName] = useState<ValueByName>({});

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
		onDataChange(feedbackByName, valueByName);
	}, [feedbackByName, onDataChange, valueByName]);

	const validateResolutionField = useCallback<FdsValidateCallback>(
		(value: unknown) => {
			if (!value) {
				return {
					connotation: 'error',
					message: 'Resolution is required.',
				} as FdsFormFeedback;
			}

			return null;
		},
		[]
	);

	return (
		<Form
			feedbackByName={showFeedback ? feedbackByName : EMPTY_FEEDBACK}
			onFieldChange={handleFormFieldChange}
			valueByName={valueByName}
		>
			<Block dataTestId="BatchResolveForm" spaceVerticalSize="m">
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
			</Block>
		</Form>
	);
};

export default BatchResolveForm;
