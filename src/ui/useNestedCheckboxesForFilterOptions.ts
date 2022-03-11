import { Checkbox } from 'fds/components';
import * as React from 'react';

function useNestedCheckboxesForFilterOptions(valueByName, onFieldsChange) {
	// This hook automatically updates parent/child checkboxes, including the
	// indeterminate state based on the configured nesting (1st parameter).
	//
	// Whenever all the children of one parent have the same value (true/false), that will be the
	// value of the parent. Otherwise the parent will be indeterminate.
	// When toggling a parent checkbox, all of the children checkboxes will use the same value
	// as the parent checkbox (true/false).
	// (When clicking on an indeterminate checkbox, it will become true.)

	// This object describes how the data is nested.
	const checkboxForest = React.useMemo(
		() => [
			{
				name: 'typeComment',
				value: valueByName.typeComment,
				children: [
					{
						name: 'typeCommentTechnical',
						value: valueByName.typeCommentTechnical,
					},
					{
						name: 'typeCommentGeneral',
						value: valueByName.typeCommentGeneral,
					},
					{
						name: 'typeCommentEditorial',
						value: valueByName.typeCommentEditorial,
					},
				],
			},
			{
				name: 'typePublicationComment',
				value: valueByName.typePublicationComment,
				children: [
					{
						name: 'typePublicationCommentTechnical',
						value: valueByName.typePublicationCommentTechnical,
					},
					{
						name: 'typePublicationCommentGeneral',
						value: valueByName.typePublicationCommentGeneral,
					},
					{
						name: 'typePublicationCommentEditorial',
						value: valueByName.typePublicationCommentEditorial,
					},
				],
			},
			{ name: 'typeProposal', value: valueByName.typeProposal },
			{
				name: 'resolutionResolved',
				value: valueByName.resolutionResolved,
				children: [
					{
						name: 'resolutionResolvedAccepted',
						value: valueByName.resolutionResolvedAccepted,
					},
					{
						name: 'resolutionResolvedRejected',
						value: valueByName.resolutionResolvedRejected,
					},
				],
			},
			{
				name: 'resolutionUnresolved',
				value: valueByName.resolutionUnresolved,
			},
		],
		// This is just a derivative of valueByName (which is not nested in this case).
		// So it will also change whenever one of the referenced properties in valueByName changes.
		[
			valueByName.resolutionResolved,
			valueByName.resolutionResolvedAccepted,
			valueByName.resolutionResolvedRejected,
			valueByName.resolutionUnresolved,
			valueByName.typeComment,
			valueByName.typeCommentEditorial,
			valueByName.typeCommentGeneral,
			valueByName.typeCommentTechnical,
			valueByName.typeProposal,
			valueByName.typePublicationComment,
			valueByName.typePublicationCommentEditorial,
			valueByName.typePublicationCommentGeneral,
			valueByName.typePublicationCommentTechnical,
		]
	);

	// This callback collects a list of all changed fields (checkboxes; an object with name +
	// value) that you need to apply to the actual values.
	// They will be applied to the valueByName mapping, this is done in the onFieldsChange
	// callback provided by FilterForm and FilterFormSummaryChips.
	// onFieldsChange is called at the end of this callback with the list of changed fields.
	const onCheckboxChange = React.useCallback(
		(name, value) => {
			const changedCheckboxes = [];

			const walkTree = (node, parentNode) => {
				if (node.name === name) {
					// set node to value
					// This is always a different value than the current value, this was the
					// item/node which the user toggled which resulted in the first call to
					// this handleCheckboxChange callback.
					changedCheckboxes.push({ name, value });

					if (parentNode) {
						// update the parent based on the new values of all siblings
						const someSiblingWillHaveDifferentValue =
							parentNode.children.some((childNode) => {
								if (childNode.name === name) {
									// The node were are currently changing will of course have the
									// correct (same) value were currently setting.
									return false;
								}

								// child checkboxes whose value is not initialized yet (undefined)
								// or is set to null is also considered the same as false.
								if (value === false) {
									return (
										childNode.value !== false &&
										childNode.value !== undefined &&
										childNode.value !== null
									);
								}

								return childNode.value !== value;
							});
						const newValueForParent =
							someSiblingWillHaveDifferentValue
								? Checkbox.VALUE_INDETERMINATE
								: value;
						if (newValueForParent !== parentNode.value) {
							changedCheckboxes.push({
								name: parentNode.name,
								value: newValueForParent,
							});
						}
					}

					if (Array.isArray(node.children)) {
						// set each childNode to same value
						node.children.forEach((childNode) => {
							if (childNode.value !== value) {
								changedCheckboxes.push({
									name: childNode.name,
									value,
								});
							}
						});
					}
				} else if (Array.isArray(node.children)) {
					// recurse until we find a node.name that matches the name were looking for
					node.children.forEach((childNode) => {
						walkTree(childNode, node);
					});
				}
			};
			// start by looping through each tree in the forest and walking each tree
			checkboxForest.forEach((childNode) => {
				walkTree(childNode, null);
			});

			if (changedCheckboxes.length > 0) {
				onFieldsChange(changedCheckboxes);
			}
		},
		[checkboxForest, onFieldsChange]
	);

	// You get an onCheckboxChange callback back, that you should call whenever a checkbox value
	// changes initially (because a user toggled it):
	// so for each rendered Checkbox's onChange callback.
	// Which is done by FilterForm and FilterFormSummaryChips that use this hook.
	return onCheckboxChange;
}

export default useNestedCheckboxesForFilterOptions;
