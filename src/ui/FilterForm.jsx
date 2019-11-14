import React from 'react';

import { Block, Checkbox, Flex, Label } from 'fds/components';

import t from 'fontoxml-localization/src/t.js';

// This file describes a form to filter on all the different conceptual 'properties' of the feedback
// items. These properties are stored in different places of the item. You can filter on whatever
// information you like. See this package's README.md for a detailed list of all the information
// that is stored per feedback item.

// The idea is that you create a UI to gather whatever input you want from your users in this file.
// This input is aggregated in valueByName, and passed to the /review/state endpoint as
// filterFormValueByName.

// These are used by the custom logic to create a dependency between outer and inner checkboxes.
// That is not something FDS currently has out-of-the-box and something we wanted to experiment with
// here, feel free to ignore this.
const typePublicationCommentSubFieldNames = [
	'typePublicationCommentTechnical',
	'typePublicationCommentGeneral',
	'typePublicationCommentEditorial'
];
const typeCommentSubFieldNames = [
	'typeCommentTechnical',
	'typeCommentGeneral',
	'typeCommentEditorial'
];
const resolutionResolvedSubFieldNames = [
	'resolutionResolvedAccepted',
	'resolutionResolvedRejected'
];

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

	// These change handlers implement custom logic to create a dependency between outer and inner
	// checkboxes. Feel free to ignore, its a crude / partially hardcoded implementation anyway.
	const handleTypeFieldChange = (typeFieldName, value) => {
		if (typeFieldName === 'typeComment') {
			typeCommentSubFieldNames.forEach(subFieldName => {
				if (valueByName[subFieldName] !== value) {
					onFieldChange({ name: subFieldName, value, feedback: null });
				}
			});
		} else if (typeCommentSubFieldNames.includes(typeFieldName)) {
			const otherTypeCommentSubFieldNames = typeCommentSubFieldNames.filter(
				subFieldName => subFieldName !== typeFieldName
			);
			if (
				!value ||
				otherTypeCommentSubFieldNames.every(
					subFieldName => valueByName[subFieldName] === value
				)
			) {
				onFieldChange({ name: 'typeComment', value, feedback: null });
			}
		} else if (typeFieldName === 'typePublicationComment') {
			typePublicationCommentSubFieldNames.forEach(subFieldName => {
				if (valueByName[subFieldName] !== value) {
					onFieldChange({ name: subFieldName, value, feedback: null });
				}
			});
		} else if (typePublicationCommentSubFieldNames.includes(typeFieldName)) {
			const otherTypePublicationCommentSubFieldNames = typePublicationCommentSubFieldNames.filter(
				subFieldName => subFieldName !== typeFieldName
			);
			if (
				!value ||
				otherTypePublicationCommentSubFieldNames.every(
					subFieldName => valueByName[subFieldName] === value
				)
			) {
				onFieldChange({ name: 'typePublicationComment', value, feedback: null });
			}
		}

		onFieldChange({ name: typeFieldName, value, feedback: null });
	};
	const handleResolutionFieldChange = (resolutionFieldName, value) => {
		if (resolutionFieldName === 'resolutionResolved') {
			resolutionResolvedSubFieldNames.forEach(subFieldName => {
				if (valueByName[subFieldName] !== value) {
					onFieldChange({ name: subFieldName, value, feedback: null });
				}
			});
		} else if (resolutionResolvedSubFieldNames.includes(resolutionFieldName)) {
			const otherResolutionResolvedSubFieldNames = resolutionResolvedSubFieldNames.filter(
				subFieldName => subFieldName !== resolutionFieldName
			);
			if (
				!value ||
				otherResolutionResolvedSubFieldNames.every(
					subFieldName => valueByName[subFieldName] === value
				)
			) {
				onFieldChange({ name: 'resolutionResolved', value, feedback: null });
			}
		}

		onFieldChange({ name: resolutionFieldName, value, feedback: null });
	};

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
								onChange={value => handleTypeFieldChange('typeComment', value)}
								value={valueByName.typeComment}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Technical')}
									onChange={value =>
										handleTypeFieldChange('typeCommentTechnical', value)
									}
									value={valueByName.typeCommentTechnical}
								/>
								<Checkbox
									label={t('General')}
									onChange={value =>
										handleTypeFieldChange('typeCommentGeneral', value)
									}
									value={valueByName.typeCommentGeneral}
								/>
								<Checkbox
									label={t('Editorial')}
									onChange={value =>
										handleTypeFieldChange('typeCommentEditorial', value)
									}
									value={valueByName.typeCommentEditorial}
								/>
							</Block>
						</Block>

						<Block>
							<Checkbox
								label={t('Global Comment')}
								onChange={value =>
									handleTypeFieldChange('typePublicationComment', value)
								}
								value={valueByName.typePublicationComment}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Technical')}
									onChange={value =>
										handleTypeFieldChange(
											'typePublicationCommentTechnical',
											value
										)
									}
									value={valueByName.typePublicationCommentTechnical}
								/>
								<Checkbox
									label={t('General')}
									onChange={value =>
										handleTypeFieldChange(
											'typePublicationCommentGeneral',
											value
										)
									}
									value={valueByName.typePublicationCommentGeneral}
								/>
								<Checkbox
									label={t('Editorial')}
									onChange={value =>
										handleTypeFieldChange(
											'typePublicationCommentEditorial',
											value
										)
									}
									value={valueByName.typePublicationCommentEditorial}
								/>
							</Block>
						</Block>

						<Checkbox
							label={t('Proposal')}
							onChange={value => handleTypeFieldChange('typeProposal', value)}
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
								onChange={value =>
									handleResolutionFieldChange('resolutionResolved', value)
								}
								value={valueByName.resolutionResolved}
							/>

							<Block applyCss={{ paddingLeft: '22px' }}>
								<Checkbox
									label={t('Accepted')}
									onChange={value =>
										handleResolutionFieldChange(
											'resolutionResolvedAccepted',
											value
										)
									}
									value={valueByName.resolutionResolvedAccepted}
								/>

								<Checkbox
									label={t('Rejected')}
									onChange={value =>
										handleResolutionFieldChange(
											'resolutionResolvedRejected',
											value
										)
									}
									value={valueByName.resolutionResolvedRejected}
								/>
							</Block>
						</Block>

						<Checkbox
							label={t('Unresolved')}
							onChange={value =>
								handleResolutionFieldChange('resolutionUnresolved', value)
							}
							value={valueByName.resolutionUnresolved}
						/>
					</Block>
				</Block>
			</Flex>
		</Block>
	);
}

export default FilterForm;
