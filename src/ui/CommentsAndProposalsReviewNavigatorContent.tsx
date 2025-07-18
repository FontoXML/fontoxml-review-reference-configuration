import type { FC } from 'react';
import { useMemo } from 'react';

import { Block, Flex, Text } from 'fontoxml-design-system/src/components';
import type {
	FdsJustifyContent,
	FdsPaddingSize,
} from 'fontoxml-design-system/src/types';
import NavigatorBatchShareButton from 'fontoxml-feedback/src/NavigatorBatchShareButton';
import NavigatorFilterFormSummary from 'fontoxml-feedback/src/NavigatorFilterFormSummary';
import NavigatorHeading from 'fontoxml-feedback/src/NavigatorHeading';
import NavigatorShowBalloonsCheckbox from 'fontoxml-feedback/src/NavigatorShowBalloonsCheckbox';
import NavigatorStateIndicators from 'fontoxml-feedback/src/NavigatorStateIndicators';
import NavigatorToolbar from 'fontoxml-feedback/src/NavigatorToolbar';
import type { ReviewNavigatorContentProps } from 'fontoxml-feedback/src/types';
import t from 'fontoxml-localization/src/t';

const topContainerPaddingSize: FdsPaddingSize = { top: 'l', horizontal: 'l' };

const NavigatorToolbarWithMessages = () => (
	<NavigatorToolbar
		dataTestId="feedback-navigator-toolbar"
		filterDropButtonAriaLabel={t('Filter comments')}
		filterDropButtonTooltipContent={t('Filter comments')}
		insertButtonAriaLabel={t('Add comment')}
		insertButtonIsDisabledTooltipContent={t(
			'Cannot create a comment right now. Your selection might be invalid or creating comments is not allowed.'
		)}
		insertButtonTooltipContent={t('Create comment')}
		nextButtonTooltipContent={t('Navigate to the next comment')}
		previousButtonTooltipContent={t('Navigate to the previous comment')}
	/>
);

const NavigatorStateIndicatorsWithMessages: FC<{ withPadding: boolean }> = ({
	withPadding,
}) => (
	<NavigatorStateIndicators
		multipleErroredBalloonsMessage={t('Some comments could not be loaded')}
		openFormsSingleLinkTooltipContent={t('Navigate to the unsaved comment')}
		openFormsNextLinkTooltipContent={t(
			'Navigate to the next unsaved comment'
		)}
		openFormsFirstLinkTooltipContent={t(
			'Navigate to the first unsaved comment'
		)}
		renderOpenFormsMessage={(openFormsCount) =>
			t(
				'You have {UNSAVED_COMMENTS_COUNT, plural, one {1 unsaved comment} other {# unsaved comments}}.',
				{ UNSAVED_COMMENTS_COUNT: openFormsCount }
			)
		}
		withPadding={withPadding}
	/>
);

const CommentsAndProposalsReviewNavigatorContent: FC<
	ReviewNavigatorContentProps
> = ({ balloonsAreVisible, isExpanded }) => {
	const bottomContainerJustifyContent = useMemo<FdsJustifyContent>(
		() => (balloonsAreVisible ? 'space-between' : 'flex-end'),
		[balloonsAreVisible]
	);
	const bottomContainerPaddingSize = useMemo<FdsPaddingSize>(
		() => ({
			top: balloonsAreVisible ? 'l' : 'm',
			horizontal: 'l',
		}),
		[balloonsAreVisible]
	);

	if (!isExpanded) {
		return (
			<>
				<NavigatorToolbarWithMessages />
				<NavigatorStateIndicatorsWithMessages withPadding={true} />
			</>
		);
	}

	return (
		<>
			<NavigatorToolbarWithMessages />

			<Block
				dataTestId="comments-and-proposals-navigator-content-top-container"
				paddingSize={topContainerPaddingSize}
			>
				<NavigatorHeading heading={t('Comments')} />

				{balloonsAreVisible && (
					<>
						<NavigatorStateIndicatorsWithMessages
							withPadding={false}
						/>

						<NavigatorFilterFormSummary />
					</>
				)}
				{!balloonsAreVisible && (
					<Text>
						{t('Show comments to use the navigation arrows.')}
					</Text>
				)}
			</Block>

			<Flex
				alignItems="center"
				dataTestId="comments-and-proposals-navigator-content-bottom-container"
				flexDirection="row"
				justifyContent={bottomContainerJustifyContent}
				paddingSize={bottomContainerPaddingSize}
			>
				<NavigatorShowBalloonsCheckbox
					label={t('Show comment balloons')}
				/>

				{balloonsAreVisible && (
					<NavigatorBatchShareButton
						globalAnnotationHeader={t('Global comments')}
						modalTitle={t('Sharing comments')}
						tooltipContent={t('Share multiple private comments')}
					/>
				)}
			</Flex>
		</>
	);
};

export default CommentsAndProposalsReviewNavigatorContent;
