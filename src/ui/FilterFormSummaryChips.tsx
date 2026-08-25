import type { ComponentProps, CSSProperties } from 'react';
import { useCallback, useMemo } from 'react';

import {
	Button,
	Chip,
	ChipGroup,
	CompactStateMessage,
	Flex,
	Icon,
	Label,
	Popover,
	PopoverAnchor,
	PopoverBody,
	SingleLineChipGroup,
} from 'fontoxml-design-system/src/components';
import type { FdsCheckboxValue } from 'fontoxml-design-system/src/types';
import type { ReviewFilterFormSummaryComponent } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

import useNestedCheckboxesForFilterOptions from './useNestedCheckboxesForFilterOptions';

const errorMessage = t('Something went wrong while updating the filter');

const ErrorIconButtonWithPopover = () => {
	const renderAnchor = useCallback<
		ComponentProps<typeof PopoverAnchor>['renderAnchor']
	>(
		({ isPopoverOpened, onRef, setIsPopoverOpened, togglePopover }) => (
			<Button
				ariaLabel={errorMessage}
				// TODO: private API
				icon={
					<Icon
						icon="far fa-exclamation-triangle"
						colorName="icon-s-warning-color"
					/>
				}
				isSelected={isPopoverOpened}
				onClick={togglePopover}
				onRef={onRef}
				tooltipContent={errorMessage}
				type="transparent"
			/>
		),
		[]
	);

	const renderPopover = useCallback<
		ComponentProps<typeof PopoverAnchor>['renderPopover']
	>(
		() => (
			<Popover>
				<PopoverBody>
					<CompactStateMessage
						connotation="warning"
						isSingleLine
						message={errorMessage}
						paddingSize={0}
					/>
				</PopoverBody>
			</Popover>
		),
		[]
	);

	return (
		<PopoverAnchor
			renderAnchor={renderAnchor}
			renderPopover={renderPopover}
		/>
	);
};

// TODO: unfortunately we cannot put this where it is used ...
// This uses vw > viewport width.
// But we want to think about it in terms of the % of width inside the
// ModalContentToolbar of the ManageCommentsModal
const DESIRED_VISUAL_MAX_WIDTH: CSSProperties['maxWidth'] = '50vw';
// So deduct a bunch of things.
// Because the Modal is size="none", see ManageCommentsModal + FDS' Modal.
const MODAL_MARGIN_LEFT: CSSProperties['marginLeft'] = '1rem';
const MODAL_MARGIN_RIGHT: CSSProperties['marginRight'] = '1rem';
// Hardcoded to match FDS' ModalBody.
const MODAL_BODY_PADDING_LEFT: CSSProperties['paddingLeft'] = '1rem';
const MODAL_BODY_PADDING_RIGHT: CSSProperties['paddingLeft'] = '1rem';
// Hardcoded to match FDS' ModalContentToolbar.
const MODAL_TOOLBAR_CONTENT_PADDING_LEFT: CSSProperties['paddingLeft'] =
	'0.5rem';
const MODAL_TOOLBAR_CONTENT_PADDING_RIGHT: CSSProperties['paddingRight'] =
	'0.5rem';
// Hardcoded to match (the manually measured) FxFilterIconButton.
const FILTER_FORM_DROP_ICON_BUTTON_WIDTH: CSSProperties['width'] = '62px';
// Hardcoded to match ReviewAnnotationOverview's Flex spaceSize="m" container
// that is in its ModalContentToolbar around this component and the drop button.
const SPACE_BETWEEN_SUMMARY_AND_DROP_BUTTON: CSSProperties['marginLeft'] =
	'0.5rem';
// From left to right visually, add everything up.
const TOTAL_COMPENSATION: CSSProperties['maxWidth'] = `calc(${
	MODAL_MARGIN_LEFT
} + ${MODAL_BODY_PADDING_LEFT} + ${MODAL_TOOLBAR_CONTENT_PADDING_LEFT} + ${
	SPACE_BETWEEN_SUMMARY_AND_DROP_BUTTON
} + ${FILTER_FORM_DROP_ICON_BUTTON_WIDTH} + ${
	MODAL_TOOLBAR_CONTENT_PADDING_RIGHT
} + ${MODAL_BODY_PADDING_RIGHT} + ${MODAL_MARGIN_RIGHT})`;

const SINGLE_LINE_CHIP_GROUP_MAX_WIDTH: CSSProperties['maxWidth'] = `calc(${
	DESIRED_VISUAL_MAX_WIDTH
} - ${TOTAL_COMPENSATION})`;

const FilterFormSummaryChips = ({
	// This is set if the /review/state endpoint is called (whenever onChange is
	// called while the filter form is not visible) and returned an error.
	// If the filter form is visible, the filter form header already handles and displays the error.
	error,
	// The filter form cannot accept any invalid input, so it is not used by the summary either.
	feedbackByName: _feedbackByName,
	// This is true while an annotation is loading/processing a data call or when an annotation
	// has a non-idle busyState, eg. the edit or reply form is opened.
	isDisabled,
	// When true you should render the summary in a single line, otherwise you can use multiple.
	isSingleLine,
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
}: ReviewFilterFormSummaryComponent) => {
	// This processes the list of changed fields into a changedValueByName mapping which is then
	// combined with the existing data (valueByName) to provide a new (complete) version of the data
	// for the onChange prop.

	const handleFieldsChange = useCallback(
		(changedFields: { name: string; value: FdsCheckboxValue }[]) => {
			onChange(
				{
					...valueByName,
					...changedFields.reduce<{
						[name: string]: boolean;
					}>((changedValueByName, changedField) => {
						changedValueByName[changedField.name] =
							changedField.value === 'indeterminate'
								? false
								: changedField.value;
						return changedValueByName;
					}, {}),
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

	const chips = useMemo(() => {
		const chips = [];

		if (!isSingleLine) {
			chips.push(
				<Flex
					alignItems="center"
					applyCss={{ height: '2.5rem' }}
					flex="none"
					isInline
					key="prefixLabel"
				>
					<Label isBold>{t('Filtered by:')}</Label>
				</Flex>
			);
		}
		if (valueByName.typeCommentTechnical) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typeCommentTechnical"
					label={t('Technical')}
					tooltipContent={t('Only show technical comments.')}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('typeCommentTechnical', false);
					}}
				/>
			);
		}
		if (valueByName.typeCommentGeneral) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typeCommentGeneral"
					label={t('General')}
					tooltipContent={t('Only show general comments.')}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('typeCommentGeneral', false);
					}}
				/>
			);
		}
		if (valueByName.typeCommentEditorial) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typeCommentEditorial"
					label={t('Editorial')}
					tooltipContent={t('Only show editorial comments.')}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('typeCommentEditorial', false);
					}}
				/>
			);
		}
		if (valueByName.typePublicationCommentTechnical) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typePublicationCommentTechnical"
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
			);
		}
		if (valueByName.typePublicationCommentGeneral) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typePublicationCommentGeneral"
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
			);
		}
		if (valueByName.typePublicationCommentEditorial) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typePublicationCommentEditorial"
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
			);
		}
		if (valueByName.typeProposal) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="typeProposal"
					label={t('Proposal')}
					tooltipContent={t('Only show proposals.')}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('typeProposal', false);
					}}
				/>
			);
		}
		if (valueByName.resolutionResolvedAccepted) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="resolutionResolvedAccepted"
					label={t('Accepted')}
					tooltipContent={t(
						'Only show resolved and accepted feedback.'
					)}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('resolutionResolvedAccepted', false);
					}}
				/>
			);
		}
		if (valueByName.resolutionResolvedRejected) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="resolutionResolvedRejected"
					label={t('Rejected')}
					tooltipContent={t(
						'Only show resolved and rejected feedback.'
					)}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('resolutionResolvedRejected', false);
					}}
				/>
			);
		}
		if (valueByName.resolutionUnresolved) {
			chips.push(
				<Chip
					isDisabled={isDisabled || isSubmitting}
					key="resolutionUnresolved"
					label={t('Unresolved')}
					tooltipContent={t('Only show unresolved feedback.')}
					iconAfter="far fa-remove"
					onIconAfterClick={() => {
						onCheckboxChange('resolutionUnresolved', false);
					}}
				/>
			);
		}

		if (
			!valueByName.resolutionResolvedAccepted &&
			!valueByName.resolutionResolvedRejected &&
			!valueByName.resolutionUnresolved &&
			!valueByName.typeCommentTechnical &&
			!valueByName.typeCommentGeneral &&
			!valueByName.typeCommentEditorial &&
			!valueByName.typePublicationCommentTechnical &&
			!valueByName.typePublicationCommentGeneral &&
			!valueByName.typePublicationCommentEditorial &&
			!valueByName.typeProposal
		) {
			chips.push(
				<Chip
					key="any"
					label={t('Any')}
					tooltipContent={t('Show feedback of any type.')}
				/>
			);
		}

		return chips;
	}, [
		isDisabled,
		isSingleLine,
		isSubmitting,
		onCheckboxChange,
		valueByName.resolutionResolvedAccepted,
		valueByName.resolutionResolvedRejected,
		valueByName.resolutionUnresolved,
		valueByName.typeCommentEditorial,
		valueByName.typeCommentGeneral,
		valueByName.typeCommentTechnical,
		valueByName.typeProposal,
		valueByName.typePublicationCommentEditorial,
		valueByName.typePublicationCommentGeneral,
		valueByName.typePublicationCommentTechnical,
	]);

	if (isSingleLine) {
		return (
			<Flex
				alignItems="center"
				dataTestId="FilterFormSummaryChips"
				data-is-single-line
				flex="1"
				flexDirection="row"
				justifyContent="flex-end"
				spaceSize="m"
			>
				<SingleLineChipGroup
					flex="1"
					justifyContent="flex-end"
					maxWidth={SINGLE_LINE_CHIP_GROUP_MAX_WIDTH}
					spaceSize="m"
				>
					{chips}
				</SingleLineChipGroup>

				{isSubmitting && (
					<Icon icon="spinner" colorName="icon-s-info-color" />
				)}
				{error && !isSubmitting && <ErrorIconButtonWithPopover />}
			</Flex>
		);
	}

	return (
		<Flex
			dataTestId="FilterFormSummaryChips"
			flex="none"
			flexDirection="column"
			spaceSize="s"
		>
			<ChipGroup ariaLabel={t('Filter chips')} flex="none">
				{chips}
			</ChipGroup>

			{isSubmitting && (
				<Flex alignItems="center" flex="none" spaceSize="s">
					<Icon icon="spinner" colorName="icon-s-info-color" />

					<Label isBold>{t('Updating filter…')}</Label>
				</Flex>
			)}

			{error && !isSubmitting && (
				<CompactStateMessage
					connotation="warning"
					message={errorMessage}
					paddingSize={0}
				/>
			)}
		</Flex>
	);
};

export default FilterFormSummaryChips;
