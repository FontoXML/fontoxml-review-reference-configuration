import React from 'react';

import { Block, Chip, ChipGroup, Flex, Icon, Label } from 'fds/components';

import t from 'fontoxml-localization/src/t.js';

function FilterFormSummaryChips({
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
	valueByName
}) {
	return (
		<Block flex="none" paddingSize={{ top: 's', bottom: 'm' }}>
			{!error && !isSubmitting && <Label isBold>{t('Filtered by:')}</Label>}

			{isSubmitting && (
				<Flex spaceSize="s">
					<Icon icon="spinner" colorName="icon-s-info-color" />

					<Label isBold>{t('Updating filter…')}</Label>
				</Flex>
			)}

			{error && !isSubmitting && (
				<Label colorName="text-error-color" isBold>
					{t('Something went wrong while updating the filter.')}
				</Label>
			)}

			<ChipGroup>
				<Label colorName="text-muted-color">{t('Type(s)')}</Label>

				{valueByName.typeCommentTechnical && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Technical')}
						tooltipContent={t('Only show technical comments.')}
						onRemove={() =>
							onChange({
								...valueByName,
								typeComment: null,
								typeCommentTechnical: null
							})
						}
						useHoverStyles={false}
					/>
				)}
				{valueByName.typeCommentGeneral && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('General')}
						tooltipContent={t('Only show general comments.')}
						onRemove={() =>
							onChange({
								...valueByName,
								typeComment: null,
								typeCommentGeneral: null
							})
						}
						useHoverStyles={false}
					/>
				)}
				{valueByName.typeCommentEditorial && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Editorial')}
						tooltipContent={t('Only show editorial comments.')}
						onRemove={() =>
							onChange({
								...valueByName,
								typeComment: null,
								typeCommentEditorial: null
							})
						}
						useHoverStyles={false}
					/>
				)}
				{valueByName.typeProposal && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Proposal')}
						tooltipContent={t('Only show proposals.')}
						onRemove={() => onChange({ ...valueByName, typeProposal: null })}
						useHoverStyles={false}
					/>
				)}
				{!valueByName.typeCommentTechnical &&
					!valueByName.typeCommentGeneral &&
					!valueByName.typeCommentEditorial &&
					!valueByName.typeProposal && (
						<Chip
							isDisabled
							label={t('Any')}
							tooltipContent={t('Show feedback of any type.')}
						/>
					)}
			</ChipGroup>

			<ChipGroup>
				<Label colorName="text-muted-color">{t('Resolution(s)')}</Label>

				{valueByName.resolutionResolvedAccepted && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Accepted')}
						tooltipContent={t('Only show resolved and accepted feedback.')}
						onRemove={() =>
							onChange({
								...valueByName,
								resolutionResolved: null,
								resolutionResolvedAccepted: null
							})
						}
						useHoverStyles={false}
					/>
				)}
				{valueByName.resolutionResolvedRejected && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Rejected')}
						tooltipContent={t('Only show resolved and rejected feedback.')}
						onRemove={() =>
							onChange({
								...valueByName,
								resolutionResolved: null,
								resolutionResolvedRejected: null
							})
						}
						useHoverStyles={false}
					/>
				)}
				{valueByName.resolutionUnresolved && (
					<Chip
						isDisabled={isDisabled || isSubmitting}
						label={t('Unresolved')}
						tooltipContent={t('Only show unresolved feedback.')}
						onRemove={() => onChange({ ...valueByName, resolutionUnresolved: null })}
						useHoverStyles={false}
					/>
				)}
				{!valueByName.resolutionResolvedAccepted &&
					!valueByName.resolutionResolvedRejected &&
					!valueByName.resolutionUnresolved && (
						<Chip
							isDisabled
							label={t('Any')}
							tooltipContent={t('Show feedback with any resolution.')}
						/>
					)}
			</ChipGroup>
		</Block>
	);
}

export default FilterFormSummaryChips;
