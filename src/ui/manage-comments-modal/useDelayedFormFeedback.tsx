import { hasFormFeedback } from 'fds/system';
import type { FdsFormFeedbackByName } from 'fds/types';
import { useState, useCallback, useMemo } from 'react';

/**
 * Delay showing Form feedback until the first form submit attempt.
 *
 * @remarks
 * Returns if the form feedback should be shown, and a submit callback wrapper
 * form submitting the form. If there is Form feedback, the submit callback is
 * not called and the form feedback should be shown. If there is no Form
 * feedback, the callback is called immediately.
 * On the second call the submit callback will be called, so make sure to
 * disable the button if that should not be allowed.
 * The `showFormFeedback`, and `hasAnyFormFeedback` or `hasErrorFormFeedback`
 * can be used for submit disabled state. However if you need more precise
 * control over which feedback blocks form submit, you need to use custom logic.
 */
export default function useDelayedFormFeedback(
	feedbackByName: FdsFormFeedbackByName
): [
	showFormFeedback: boolean,
	hasAnyFormFeedback: boolean,
	hasErrorFormFeedback: boolean,
	onFormSubmitWithDelayedFormFeedback: (submitCallback: () => void) => void,
] {
	const [isFormSubmittedOnce, setIsFormSubmittedOnce] = useState(false);

	const hasAnyFormFeedback = useMemo(() => {
		return hasFormFeedback(feedbackByName);
	}, [feedbackByName]);
	const hasErrorFormFeedback = useMemo(() => {
		return Object.values(feedbackByName).some(
			// TODO: FdsFormFeedbackByName and  should also be typed to
			// expect null.
			(feedback) => feedback?.connotation === 'error'
		);
	}, [feedbackByName]);

	const onFormSubmitWithDelayedFormFeedback = useCallback(
		(submitCallback: () => void) => {
			if (!isFormSubmittedOnce) {
				setIsFormSubmittedOnce(true);
				if (hasAnyFormFeedback) {
					// Block the first form submit if there is form feedback.
					return;
				}
			}
			submitCallback();
		},
		[hasAnyFormFeedback, isFormSubmittedOnce]
	);

	return [
		isFormSubmittedOnce,
		hasAnyFormFeedback,
		hasErrorFormFeedback,
		onFormSubmitWithDelayedFormFeedback,
	];
}
