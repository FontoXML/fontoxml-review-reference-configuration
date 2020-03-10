import React, { useCallback } from 'react';

import { Block, Checkbox, Flex, Label } from 'fds/components';

import t from 'fontoxml-localization/src/t.js';

import useNestedCheckboxesForFilterOptions from './useNestedCheckboxesForFilterOptions.js';

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
	productContent: _productContext,
	// Not used by this implementation; the input can never become invalid (only checkboxes are used,
	// all of which are optional.)
	showFeedback: _showFeedback,
	// The current values of the filter form fields.
	valueByName
}) {
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
	const handleFieldsChange = useCallback(
		changedFields =>
			changedFields.forEach(changedField =>
				onFieldChange({ ...changedField, feedback: null })
			),
		[onFieldChange]
	);

	const onCheckboxChange = useNestedCheckboxesForFilterOptions(valueByName, handleFieldsChange);

	return (
		<Block spaceVerticalSize="l">
			<Flex>
				<Block flex="1">
					<Label colorName="text-muted-color" isBlock>
						{t('Type(s)')}
					</Label>

					<Block spaceVerticalSize="m">
						<Block>
							<Checkbox
								label={t('Comment')}
								onChange={value => onCheckboxChange('typeComment', value)}
								value={valueByName.typeComment}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Technical')}
									onChange={value =>
										onCheckboxChange('typeCommentTechnical', value)
									}
									value={valueByName.typeCommentTechnical}
								/>
								<Checkbox
									label={t('General')}
									onChange={value =>
										onCheckboxChange('typeCommentGeneral', value)
									}
									value={valueByName.typeCommentGeneral}
								/>
								<Checkbox
									label={t('Editorial')}
									onChange={value =>
										onCheckboxChange('typeCommentEditorial', value)
									}
									value={valueByName.typeCommentEditorial}
								/>
							</Block>
						</Block>

						<Block>
							<Checkbox
								label={t('Global Comment')}
								onChange={value =>
									onCheckboxChange('typePublicationComment', value)
								}
								value={valueByName.typePublicationComment}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Technical')}
									onChange={value =>
										onCheckboxChange('typePublicationCommentTechnical', value)
									}
									value={valueByName.typePublicationCommentTechnical}
								/>
								<Checkbox
									label={t('General')}
									onChange={value =>
										onCheckboxChange('typePublicationCommentGeneral', value)
									}
									value={valueByName.typePublicationCommentGeneral}
								/>
								<Checkbox
									label={t('Editorial')}
									onChange={value =>
										onCheckboxChange('typePublicationCommentEditorial', value)
									}
									value={valueByName.typePublicationCommentEditorial}
								/>
							</Block>
						</Block>

						<Checkbox
							label={t('Proposal')}
							onChange={value => onCheckboxChange('typeProposal', value)}
							value={valueByName.typeProposal}
						/>
					</Block>
				</Block>

				<Block flex="1">
					<Label colorName="text-muted-color" isBlock>
						{t('Resolution(s)')}
					</Label>

					<Block spaceVerticalSize="m">
						<Block>
							<Checkbox
								label={t('Resolved')}
								onChange={value => onCheckboxChange('resolutionResolved', value)}
								value={valueByName.resolutionResolved}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Accepted')}
									onChange={value =>
										onCheckboxChange('resolutionResolvedAccepted', value)
									}
									value={valueByName.resolutionResolvedAccepted}
								/>

								<Checkbox
									label={t('Rejected')}
									onChange={value =>
										onCheckboxChange('resolutionResolvedRejected', value)
									}
									value={valueByName.resolutionResolvedRejected}
								/>
							</Block>
						</Block>

						<Checkbox
							label={t('Unresolved')}
							onChange={value => onCheckboxChange('resolutionUnresolved', value)}
							value={valueByName.resolutionUnresolved}
						/>
					</Block>
				</Block>
			</Flex>
		</Block>
	);
}

export default FilterForm;
