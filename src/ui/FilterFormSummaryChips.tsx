import * as React from 'react';

import {
	Block,
	Chip,
	ChipGroup,
	CompactStateMessage,
	Flex,
	Icon,
	Label,
} from 'fontoxml-design-system/src/components';
import type { ReviewFilterFormSummaryComponent } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import useNestedCheckboxesForFilterOptions from './useNestedCheckboxesForFilterOptions';

const FilterFormSummaryChips: React.FC<ReviewFilterFormSummaryComponent> = ({
	// This is set if the /review/state endpoint is called (whenever onChange is
	// called while the filter form is not visible) and returned an error.
	// If the filter form is visible, the filter form header already handles and displays the error.
	error,
	// The filter form cannot accept any invalid input, so it is not used by the summary either.
	feedbackByName: _feedbackByName,
	// This is true while an annotation is loading/processing a data call or when an annotation
	// has a non-idle busyState, eg. the edit or reply form is opened.
	isDisabled,
	// This is true while the /review/state endpoint is called (whenever onChange is
	// called while the filter form is not visible).
	// If the filter form is visible, the filter form header already handles and displays the
	// loading/submitting state.
	isSubmitting,
	// Call this with a new version of the given valueByName to update the filter in any way you
	// like from this summary. In this implementation it is called with a null value for the field
	// whose Chip's "remove (X) button" you click: effectively removing the filter option.
	// This should of course match the expectation of your backend and dev-cms implementation of
	// the filter logic in ../matchAnnotationToCurrentFilter.js.
	onChange,
	// Not used by this implementation: the summary can be the same for each product context.
	productContext: _productContext,
	// This contains the exact value by name mapping used by the filter form for the current context.
	valueByName,
}) => {
	// This processes the list of changed fields into a changedValueByName mapping which is then
	// combined with the existing data (valueByName) to provide a new (complete) version of the data
	// for the onChange prop.

	const handleFieldsChange = React.useCallback(
		(changedFields) => {
			onChange(
				{
					...valueByName,
					...changedFields.reduce(
						(changedValueByName, changedField) => {
							changedValueByName[changedField.name] =
								changedField.value ===
								'indeterminate'
									? false
									: changedField.value;
							return changedValueByName;
						},
						{}
					),
				},
				undefined
			);
		},
		[onChange, valueByName]
	);
	const onCheckboxChange = useNestedCheckboxesForFilterOptions(
		valueByName,
		handleFieldsChange
	);

	return (
		<Block>
			<ChipGroup>
				<Flex
					alignItems="center"
					applyCss={{ height: '2.5rem' }}
					flex="none"
					isInline
				>
					<Label isBold>{t('Filtered by:')}</Label>
				</Flex>

				{valueByName.typeCommentTechnical && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Technical')}
						tooltipContent={t('Only show technical comments.')}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange('typeCommentTechnical', false);
						}}
					/>
				)}
				{valueByName.typeCommentGeneral && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('General')}
						tooltipContent={t('Only show general comments.')}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange('typeCommentGeneral', false);
						}}
					/>
				)}
				{valueByName.typeCommentEditorial && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Editorial')}
						tooltipContent={t('Only show editorial comments.')}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange('typeCommentEditorial', false);
						}}
					/>
				)}

				{valueByName.typePublicationCommentTechnical && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Global: Technical')}
						tooltipContent={t(
							'Only show technical publication comments.'
						)}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange(
								'typePublicationCommentTechnical',
								false
							);
						}}
					/>
				)}
				{valueByName.typePublicationCommentGeneral && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Global: General')}
						tooltipContent={t(
							'Only show general publication comments.'
						)}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange(
								'typePublicationCommentGeneral',
								false
							);
						}}
					/>
				)}
				{valueByName.typePublicationCommentEditorial && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Global: Editorial')}
						tooltipContent={t(
							'Only show editorial publication comments.'
						)}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange(
								'typePublicationCommentEditorial',
								false
							);
						}}
					/>
				)}

				{valueByName.typeProposal && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Proposal')}
						tooltipContent={t('Only show proposals.')}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange('typeProposal', false);
						}}
					/>
				)}

				{valueByName.resolutionResolvedAccepted && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Accepted')}
						tooltipContent={t(
							'Only show resolved and accepted feedback.'
						)}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange(
								'resolutionResolvedAccepted',
								false
							);
						}}
					/>
				)}
				{valueByName.resolutionResolvedRejected && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Rejected')}
						tooltipContent={t(
							'Only show resolved and rejected feedback.'
						)}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange(
								'resolutionResolvedRejected',
								false
							);
						}}
					/>
				)}
				{valueByName.resolutionUnresolved && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Unresolved')}
						tooltipContent={t('Only show unresolved feedback.')}
						iconAfter="far fa-remove"
						onIconAfterClick={() => {
							onCheckboxChange('resolutionUnresolved', false);
						}}
					/>
				)}

				{!valueByName.resolutionResolvedAccepted &&
					!valueByName.resolutionResolvedRejected &&
					!valueByName.resolutionUnresolved &&
					!valueByName.typeCommentTechnical &&
					!valueByName.typeCommentGeneral &&
					!valueByName.typeCommentEditorial &&
					!valueByName.typePublicationCommentTechnical &&
					!valueByName.typePublicationCommentGeneral &&
					!valueByName.typePublicationCommentEditorial &&
					!valueByName.typeProposal && (
						<Chip
							label={t('Any')}
							tooltipContent={t('Show feedback of any type.')}
						/>
					)}
			</ChipGroup>

			{isSubmitting && (
				<Flex spaceSize="s">
					<Icon icon="spinner" colorName="icon-s-info-color" />

					<Label isBold>{t('Updating filterâ€¦')}</Label>
				</Flex>
			)}

			{error && !isSubmitting && (
				<CompactStateMessage
					connotation="warning"
					message={t(
						'Something went wrong while updating the filter.'
					)}
					paddingSize={0}
				/>
			)}
		</Block>
	);
}

export default FilterFormSummaryChips;
