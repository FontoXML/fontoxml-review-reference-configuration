import * as React from 'react';

import {
	Block,
	Checkbox,
	Flex,
	Label,
} from 'fontoxml-design-system/src/components';
import type { FdsFormValueByName } from 'fontoxml-design-system/src/types';
import type { ReviewFilterFormProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import useNestedCheckboxesForFilterOptions from './useNestedCheckboxesForFilterOptions';

function determineParentFieldValue(
	subFieldNames: string[],
	valueByNameForUI: FdsFormValueByName
): boolean {
	return subFieldNames.reduce<boolean>((value, subFieldName) => {
		if (value === Checkbox.VALUE_INDETERMINATE) {
			return value;
		}

		if (value === true && valueByNameForUI[subFieldName] === true) {
			return true;
		}

		if (value === false && valueByNameForUI[subFieldName] === false) {
			return false;
		}

		if (value === false && valueByNameForUI[subFieldName] === true) {
			return Checkbox.VALUE_INDETERMINATE;
		}

		if (value === true && valueByNameForUI[subFieldName] === false) {
			return Checkbox.VALUE_INDETERMINATE;
		}

		if (value === undefined && valueByNameForUI[subFieldName] === true) {
			return Checkbox.VALUE_INDETERMINATE;
		}

		return valueByNameForUI[subFieldName];
	}, null);
}

// This file describes a form to filter on all the different conceptual 'properties' of the feedback
// items. These properties are stored in different places of the item. You can filter on whatever
// information you like. See this package's README.md for a detailed list of all the information
// that is stored per feedback item.

// The idea is that you create a UI to gather whatever input you want from your users in this file.
// This input is aggregated in valueByName, and passed to the /review/state endpoint as
// filterFormValueByName.

function FilterForm({
	// Not used by this implementation, the error is already visualized in the filter form header
	// by default.
	error: _error,
	// Not used by this implementation: the input can never become invalid (only checkboxes are used,
	// all of which are optional.)
	feedbackByName: _feedbackByName,
	// Not used by this implementation, the loading/submitting state is already visualized in the
	// filter form header by default.
	isSubmitting: _isSubmitting,
	// Called whenever a field changes.
	onFieldChange,
	// Not used by this implementation; each field is tracked separately.
	onInitialize: _onInitialize,
	// Not used by this implementation: the fields can be the same for each product context.
	// productContent: _productContext,
	// Not used by this implementation; the input can never become invalid (only checkboxes are used,
	// all of which are optional.)
	showFeedback: _showFeedback,
	// The current values of the filter form fields.
	valueByName,
}: ReviewFilterFormProps) {
	// If you use your own Form (field) components, make sure to call onFieldChange whenever a field
	// changes. This makes sure the filter form fields update whenever the user edits the form.
	// Submitting the form through "Set filters" submits the filter form values to the CMS via
	// the /review/state endpoint. If successful, the filter form is hidden and the filtered list
	// is shown.
	// In order to make this work, you have to call onFieldChange whenever a field changes.

	// !Important! Make sure to always set the feedback property to null when calling onFieldChange.
	// Otherwise the user cannot submit the filter form (using the "Set filters" button).

	// This processes the list of changed fields by simply calling onFieldChange for each of them,
	// with a value of null for feedback, as explained before.
	const handleFieldsChange = React.useCallback(
		(changedFields) =>
			changedFields.forEach((changedField) => {
				onFieldChange({
					...changedField,
					// Do not send Checkbox.VALUE_INDETERMINATE to the backend.
					value:
						changedField.value === Checkbox.VALUE_INDETERMINATE
							? false
							: changedField.value,
					feedback: null,
				});
			}),
		[onFieldChange]
	);

	// Determine Checkbox.VALUE_INDETERMINATE for the UI based on the valuesByName (from the backend).
	const valueByNameForUI = { ...valueByName };
	valueByNameForUI['typeComment'] = determineParentFieldValue(
		[
			'typeComment',
			'typeCommentTechnical',
			'typeCommentGeneral',
			'typeCommentEditorial',
		],
		valueByNameForUI
	);
	valueByNameForUI['typePublicationComment'] = determineParentFieldValue(
		[
			'typePublicationComment',
			'typePublicationCommentTechnical',
			'typePublicationCommentGeneral',
			'typePublicationCommentEditorial',
		],
		valueByNameForUI
	);
	valueByNameForUI['resolutionResolved'] = determineParentFieldValue(
		[
			'resolutionResolved',
			'resolutionResolvedAccepted',
			'resolutionResolvedRejected',
		],
		valueByNameForUI
	);

	const onCheckboxChange = useNestedCheckboxesForFilterOptions(
		valueByNameForUI,
		handleFieldsChange
	);

	return (
		<Flex spaceSize="l">
			<Block flex="none" spaceVerticalSize="s">
				<Label isBold>{t('Type(s) of feedback')}</Label>

				<Block spaceVerticalSize="l">
					<Block spaceVerticalSize="s">
						<Checkbox
							label={t('Comment')}
							onChange={(value: boolean) => {
								onCheckboxChange('typeComment', value);
							}}
							value={valueByNameForUI['typeComment']}
						/>

						<Block
							applyCss={{ paddingLeft: '22px' }}
							spaceVerticalSize="s"
						>
							<Checkbox
								label={t('Technical')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typeCommentTechnical',
										value
									);
								}}
								value={valueByNameForUI['typeCommentTechnical']}
							/>
							<Checkbox
								label={t('General')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typeCommentGeneral',
										value
									);
								}}
								value={valueByNameForUI['typeCommentGeneral']}
							/>
							<Checkbox
								label={t('Editorial')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typeCommentEditorial',
										value
									);
								}}
								value={valueByNameForUI['typeCommentEditorial']}
							/>
						</Block>
					</Block>

					<Block spaceVerticalSize="s">
						<Checkbox
							label={t('Global Comment')}
							onChange={(value: boolean) => {
								onCheckboxChange(
									'typePublicationComment',
									value
								);
							}}
							value={valueByNameForUI['typePublicationComment']}
						/>

						<Block
							applyCss={{ paddingLeft: '22px' }}
							spaceVerticalSize="s"
						>
							<Checkbox
								label={t('Technical')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typePublicationCommentTechnical',
										value
									);
								}}
								value={
									valueByNameForUI[
										'typePublicationCommentTechnical'
									]
								}
							/>
							<Checkbox
								label={t('General')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typePublicationCommentGeneral',
										value
									);
								}}
								value={
									valueByNameForUI[
										'typePublicationCommentGeneral'
									]
								}
							/>
							<Checkbox
								label={t('Editorial')}
								onChange={(value: boolean) => {
									onCheckboxChange(
										'typePublicationCommentEditorial',
										value
									);
								}}
								value={
									valueByNameForUI[
										'typePublicationCommentEditorial'
									]
								}
							/>
						</Block>
					</Block>

					<Checkbox
						label={t('Proposal')}
						onChange={(value: boolean) => {
							onCheckboxChange('typeProposal', value);
						}}
						value={valueByNameForUI['typeProposal']}
					/>
				</Block>
			</Block>

			<Block flex="none" spaceVerticalSize="s">
				<Label isBold>{t('Resolution')}</Label>

				<Block spaceVerticalSize="s">
					<Checkbox
						label={t('Resolved')}
						onChange={(value: boolean) => {
							onCheckboxChange('resolutionResolved', value);
						}}
						value={valueByNameForUI['resolutionResolved']}
					/>

					<Block
						applyCss={{ paddingLeft: '22px' }}
						spaceVerticalSize="s"
					>
						<Checkbox
							label={t('Accepted')}
							onChange={(value: boolean) => {
								onCheckboxChange(
									'resolutionResolvedAccepted',
									value
								);
							}}
							value={
								valueByNameForUI['resolutionResolvedAccepted']
							}
						/>

						<Checkbox
							label={t('Rejected')}
							onChange={(value: boolean) => {
								onCheckboxChange(
									'resolutionResolvedRejected',
									value
								);
							}}
							value={
								valueByNameForUI['resolutionResolvedRejected']
							}
						/>
					</Block>

					<Checkbox
						label={t('Unresolved')}
						onChange={(value: boolean) => {
							onCheckboxChange('resolutionUnresolved', value);
						}}
						value={valueByNameForUI['resolutionUnresolved']}
					/>
				</Block>
			</Block>
		</Flex>
	);
}

export default FilterForm;
