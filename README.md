# Review Reference Configuration

# Notice

We offer this repository to get you started with Fonto Review. We do not accept PRs on this repository right now.
Contact your Fonto Support agent for feature requests and/or bug reports.

# Table of contents

- [Understanding the review (fontoxml-feedback) customization options](#understanding-the-review-fontoxml-feedback-customization-options)
- [(API 1) Adding new types of review annotations with registerReviewAnnotation](#api-1-adding-new-types-of-review-annotations-with-registerreviewannotation)
	- [Creating your own CardContentComponent](#creating-your-own-cardcontentcomponent)
		- [Props for the reviewAnnotation object](#props-for-the-reviewannotation-object)
		- [Props for the reply objects (inside `reviewAnnotation.replies`)](#props-for-the-reply-objects-inside-reviewannotationreplies)
- [(API 2) Customizing the filters](#api-2-customizing-the-filters)
	- [Customize the filter logic used by FDT (and its dev-cms)](#customize-the-filter-logic-used-by-fdt-and-its-dev-cms)
	- [FilterFormComponent](#filterformcomponent)
	- [FilterFormSummaryComponent](#filterformsummarycomponent)
	- [Setting the initial values for your custom FilterForm.](#setting-the-initial-values-for-your-custom-filterform)
- [(API 3) Using InsertReviewAnnotationDropButton in your editor](#using-insertreviewannotationdropbutton-in-your-editor)
- [(API 4) Customizing the masthead on the /review route with MastheadComponent](#api-4-customizing-the-masthead-on-the-review-route-with-mastheadcomponent)
- [(API 5) Using a custom SheetFrameHeader component on the /review route.](#api-5-using-a-custom-sheetframeheader-component-on-the-review-route)

## Understanding the review (fontoxml-feedback) customization options

Customizing the `fontoxml-feedback` addon is done by making a custom editor application package like 
this package.  
The actual customization is done through the APIs listed below.

Note: "comment" and "(review-)annotation" are all synonyms for the same thing:  
a single piece of feedback displayed as a single card in the sidebar, and as a single squiggle 
under the affected text.  
In this guide (and most of the code) we use "(review-)annotation". "Comment" is used in human 
friendly labels. For example, the fontoxml-feedback addon provides a sidebar tab with a "Comments" label and 
an `InsertReviewAnnotationDropButton` for inclusion in your Masthead that has a "Comments" label.

FYI: `fontoxml-annotations` is a much simpler free addon that provides a small subset of the 
features this `fontoxml-feedback` addon provides.  
Its biggest limitation is that it requires a lock on the document before being able to place an 
annotation in the document.  
Nor does it provide a dedicated review app under the /review route as this addon does.

### (API 1) Adding new types of review annotations with register*ReviewAnnotationType

You can add new types of annotations through the different registration methods.  
The fontoxml-feedback add-on provides the following functions:

- `fontoxml-feedback/src/registerObjectReviewAnnotationType.js`.
- `fontoxml-feedback/src/registerPublicationReviewAnnotationType.js`.
- `fontoxml-feedback/src/registerTextRangeReviewAnnotationType.js`.

You can call these functions inside an `install.js` of your editor application package. You can call
these functions as many times as you like; once for each annotation type you want to register.

#### Creating your own CardContentComponent

Note: because you can customize everything about the contents of a card for an annotation, you can 
decide for yourself how each of the states of an annotation and each of the states of a reply should 
be visualized.  
Note: The review sharing sidebar CANNOT be turned off or customized.  
Make sure to also implement something for this context similar to the included implementation to 
support batch sharing of annotations. Use `reviewAnnotation.context` and 
`reviewAnnotation.isSelectedToShare` as appropriate.

Inside the source code you can read about the UX choices we made and how we implemented them.  
The API comments below were written based on the UX choices we made but with other options in mind.

A custom CardContentComponent is injected with the following props:

- `context {ContextType}`  
Where is the card rendered. Can be one of:  
`ContextType.EDITOR_SIDEBAR`,  
`ContextType.EDITOR_SHARING_SIDEBAR`,  
`ContextType.REVIEW_SIDEBAR`,  
`ContextType.REVIEW_SHARING_SIDEBAR`,  
`ContextType.CREATED_CONTEXT_MODAL` or  
`ContextType.RESOLVED_CONTEXT_MODAL`.  
Use this to change which information is shown in the card based on where it is used.  
`ContextType` can be imported as `import { ContextType } from 'fontoxml-feedback/src/types.js'`.

- `isSelectedToShare {boolean}`  
Whether or not the annotation is included in the batch of annotations to share. This is used as the 
value of the checkbox displayed in the card when the 
`context === ContextType.EDITOR_SHARING_SIDEBAR || context === ContextType.REVIEW_SHARING_SIDEBAR`.

- `reviewAnnotation {object}`  
A collection of data and states for one annotation and its replies.  
its properties are described below:

##### Props for the reviewAnnotation object

- `reviewAnnotation.id {string}`  
The unique identifier of this annotation, set by the backend after creating it.  
Which happens after calling onReviewAnnotationFormSubmit in the annotation add/create form.

- `reviewAnnotation.author {object}`  

- `reviewAnnotation.author.id {string}`  
The id of the user who was logged in while creating the annotation, as determined by the backend 
when an annotation is created. This should match the id of the logged in user (at the time) as 
seen in the scope URL query variable. It can be used by the UI to show a special "You" label instead
of the author's `displayName`.

- `reviewAnnotation.author.displayName {string}`  
The human readable name of the user who was logged in while creating the annotation, as determined 
by the backend when it is created.

- `reviewAnnotation.busyState {BusyState}`  
The state of the card. Can be one of:  
`BusyState.ADDING`,  
`BusyState.EDITING`,  
`BusyState.IDLE`,  
`BusyState.REMOVING`,  
`BusyState.RESOLVING`,  
`BusyState.REFRESHING` or  
`BusyState.SHARING`.  
Whenever this is set to something other that `BusyState.IDLE`, this means either an appropriate form
should be shown for the current annotation. Or, if `reviewAnnotation.isLoading` is also true, the 
form is being submitted and a loading state visualization is needed (like a spinner).  
Note: some states do not use a form, like `BusyState.REFRESHING`, in that case busyState is used to
detect which state message to show in the loading visualization.  
See the source of `CommentCardContent.jsx` and/or `ProposalCardContent.jsx` for more information.  
Also disable any other state change / data submission UI during a non-idle busyState, to prevent 
race conditions together with the backend. See the source code for more information.  
`BusyState` can be imported as a named `import { BusyState } from 'fontoxml-feedback/src/types.js'`.

- `reviewAnnotation.error {object|null}`  
Errors occur either as a result of a form submission or when the latest annotations are periodically
retrieved from the backend (this happens automatically). In the second case the user might not be
engaged with that particular annotation, therefore a more prominent error state might be considered.  
If `reviewAnnotation.error` is set and `reviewAnnotation.busyState !== BusyState.IDLE`, consider 
displaying the error inline with the appropriate form for the busyState.  
If `reviewAnnotation.error` is set and the `reviewAnnotation.busyState === BusyState.IDLE`, consider 
displaying the error state instead of the normal content, drawing more attention to it.  

- `reviewAnnotation.error.message {string|null}`  
An error message provided by the fontoxml-feedback addon (can be translated with 
fontoxml-localization).

- `reviewAnnotation.error.recovery {RecoveryOption}`  
What recovery options are available. Can be one of:  
`RecoveryOption.ACKNOWLEDGEABLE`,  
`RecoveryOption.RETRYABLE`,  
`RecoveryOption.REFRESHABLE` or  
`RecoveryOption.NONE`.  
Use this to determine what buttons to render (and couple to the appropriate callbacks, 
onReviewAnnotation*, see below).  
`RecoveryOption` can be imported as `import { RecoveryOption } from 'fontoxml-feedback/src/types.js'`.

- `reviewAnnotation.isLoading {boolean}`  
True while data is being submitted to the backend, use this to indicate loading states (spinners 
etc.).  
This works together with `reviewAnnotation.busyState`.

- `reviewAnnotation.isCreatedDocumentRevisionLoaded  {boolean}`  
If this is false, display a text link (or a button) to call 
`reviewAnnotation.onReviewAnnotationShowInCreatedContext()` to display the revision of the document 
when the current annotation was created, inside a Modal.

- `reviewAnnotation.isSelected {boolean}`  
Whether or not the annotation is selected.  
If this is true, the matching squiggle will also be displayed in its selected state.
Note: The (FDS) `Card` is rendered by default and is also automatically displayed in its selected 
state (yellow background and border) based on this property, this cannot be customized.

- `reviewAnnotation.metadata {object}`  
A mapping of a form component id/name to its current value or default value.  
This starts out as an empty object for (the first render of) an annotation that is newly added.  
It is filled by initializing the annotation (add) form. See the source code for more information.  
It is pre-filled when editing a pre-existing annotation.  
Whatever you put in here while submitting the annotation form (using 
`onReviewAnnotationFormSubmit()`, see below), is send to the backend as-is.

- `reviewAnnotation.originalText {string}`  
The text contained in the original selection that was made while creating the annotation.  
This is useful to create some sort of a diff between the original content and proposed new content,
see the example "proposal" annotation type in the source code.

- `reviewAnnotation.targetFoundForRevision {boolean}`  
Whether or not a target is found in the (currently displayed revision of the) document in which 
this annotation was created.  
A target means the location of the text that was selected while creating the annotation.

- `reviewAnnotation.replies {Reply[]}`  
The list of replies on this annotation. The properties of a reply are described below under
"Props for the reply objects".

- `reviewAnnotation.resolvedMetadata {object}`  
A mapping of a form component id/name to its current value or default value.  
This starts out as an empty object for (the first render of) an annotation that is not resolved yet.  
It is filled by initializing the annotation (resolve) form. See the source code for more information.  
Whatever you put in here while submitting the annotation resolve form (using 
`onReviewAnnotationFormSubmit()`, see below), is send to the backend as-is.

- `reviewAnnotation.resolvedAuthor {object}`  

  - `reviewAnnotation.resolvedAuthor.id {string}`  
The id of the user who was logged in while resolving the annotation, as determined by the backend 
when an annotation is edited with a `status === AnnotationStatus.RESOLVED`.  
Usually this matches the id of the logged in user (at the time) as seen in the scope URL query 
variable.

  - `reviewAnnotation.resolvedAuthor.displayName {string}`  
The human readable name of the user who was logged in while resolving the annotation, as determined 
by the backend when an annotation is edited to be resolved.

- `reviewAnnotation.resolvedTimestamp {string}`  
A ISO-8601 timestamp indicating when this annotation was resolved.  
This can be passed to a JavaScript Date object directly or used with fontoxml-localization to make 
the timestamp translatable and format it at the same time.

- `reviewAnnotation.status {AnnotationStatus}`  
The status of the annotation. Can be one of:  
`AnnotationStatus.ARCHIVED`,  
`AnnotationStatus.PRIVATE`,  
`AnnotationStatus.SHARED` or  
`AnnotationStatus.RESOLVED`.  
Note: The status of an annotation is set to `AnnotationStatus.ARCHIVED` when the user presses the "Remove" menu item. An edit request is send to the backend to set the annotation's status to `AnnotationStatus.ARCHIVED`. This is for auditing purposes; data should never be deleted from the backend.  
These are displayed as a Badge on the card and indicate a basic 'workflow' step/state.  
Currently, an annotation has to be shared before the "Resolve" button is shown.  
The "Remove" menu item is only shown if it is still private.  
This can be changed in your own custom card UI/UX.  
It's an (optional) responsibility of the backend to filter out any archived annotations or private 
annotations that do not belong to the currently logged in user (which is implemented as such by 
Fonto's dev-cms).  
`AnnotationStatus` can be imported as `import { AnnotationStatus } from 'fontoxml-feedback/src/types.js'`.

- `reviewAnnotation.timestamp {string}`  
A ISO-8601 timestamp indicating when this annotation was created.  
This can be passed to a JavaScript Date object directly or used with fontoxml-localization to make 
the timestamp translatable and format it at the same time.

- `reviewAnnotation.type {string}`  
When an annotation is created, this is set to the id of the registered annotation type.

All props below are callbacks. You can call them whenever you want to change the state / submit some 
data within an annotation.  
The callbacks have already been bound to the specific annotation.  

- `onReviewAnnotationEdit {function()}`  
When pressing the "Edit" button, call this callback;  
this sets `reviewAnnotation.busyState = BusyState.EDITING` which should trigger your card to display 
the edit form.

- `onReviewAnnotationErrorAcknowledge {function()}`  
When pressing the "Ok" button in an error state of an error with `error.recovery === 
RecoveryOption.ACKNOWLEDGEABLE`, call this callback;  
this removes the annotation from the list of cards in the frontend, in the backend the annotation is
usually already "removed" (actually, "archived") whenever this type or error occurs.

- `onReviewAnnotationFormCancel {function()}`  
When pressing the "Cancel" button in an annotation (add, edit or resolve) form, call this callback;  
this sets `reviewAnnotation.busyState = BusyState.IDLE` which should trigger your card to display 
the annotation content instead of the annotation (add, edit or resolve) form.

- `onReviewAnnotationFormSubmit {function(valueByName)}`  
When pressing the "Save" button in an annotation (add, edit or resolve) form, call this callback
with the `valueByName` mapping directly from your (FDS) Form. The given `valueByName` mapping will 
be stored as-is on `reviewAnnotation.metadata` or `reviewAnnotation.resolvedMetadata` in case of the 
resolve form;  
this submits the data of the form to the backend.  
While the data is submitted, `reviewAnnotation.isLoading = true` and afterwards 
`reviewAnnotation.busyState = BusyState.IDLE` again.

- `onReviewAnnotationRefresh {function()}`  
When pressing the "Refresh" button in an error state of an error with `error.recovery === 
RecoveryOption.REFRESHABLE`, call this callback;  
this gets new data from the backend with could potentially solve the current error state.  

- `onReviewAnnotationRemove {function()}`  
When pressing the "Remove" menu item, call this callback;  
this send an edit request to the backend to set `annotation.status = AnnotationStatus.ARCHIVED`.

- `onReviewAnnotationResolve {function()}`  
When pressing the "Resolve" button, call this callback;  
this sets `reviewAnnotation.busyState = BusyState.RESOLVING` which should trigger your card to display the 
resolve form.

- `onReviewAnnotationShare {function()}`  
When pressing the "Share" button, call this callback;  
this sets the `reviewAnnotation.status = AnnotationStatus.SHARED` and sends it to the backend.  
While the data is submitted, `reviewAnnotation.isLoading = true` and afterwards 
`reviewAnnotation.busyState = BusyState.IDLE` again.

- `onReviewAnnotationShareAddRemoveToggle {function()}`  
When toggling the share checkbox for batch sharing on the /review route, call this callback;  
this toggles the "isSelectedToShare" prop and does not update the backend yet (the backend is 
updated when the user presses the "Share comments" button in the sharing sidebar).

- `onReviewAnnotationShowInCreatedContext {function()}`  
When pressing the "created context" text link, call this callback;  
this opens a modal with the revision of the document when the annotation was created and a card for
the annotation in its current state with its current data.

- `onReviewAnnotationShowInResolvedContext {function()}`  
When pressing the "resolved context" text link, call this callback;  
this opens a modal with the revision of the document when the current card was resolved and a card 
for the annotation in its current state with its current data.

##### Props for the reply objects (inside `reviewAnnotation.replies`)
- `reply.id  {string}`  
The unique identifier of this reply, set by the backend after creating the reply.  
Which happens after calling onReplyFormSubmit in the reply add form.

- `reply.busyState {BusyState}`  
The state of the reply. Can be one of: 
`BusyState.ADDING`,  
`BusyState.EDITING`,  
`BusyState.IDLE` or  
`BusyState.REMOVING`  
for a reply.  
Whenever this is set to something other that `BusyState.IDLE`, this means either an appropriate form
should be shown for the current reply. Or, if `reply.isLoading` is also true, the form is being 
submitted and a loading state visualization is needed (like a spinner).  
Note: some states do not use a form, like `BusyState.REMOVING`, in that case busyState is used to
detect which state message to show in the loading visualization.  
See the source of `Replies.jsx` for more information.  
Also disable any other state change / data submission UI during a non-idle busyState, to prevent 
race conditions together with the backend. See the source code for more information.  
`BusyState` can be imported as a named `import { BusyState } from 'fontoxml-feedback/src/types.js'`.

- `reply.error {object|null}`  
Errors occur either as a result of a form submission or when the latest annotations and replies are 
periodically retrieved from the backend (this happens automatically). In the second case the user 
might not be engaged with that particular annotation reply, therefore a more prominent error state 
might be considered.  
If `reply.error` is set and `reply.busyState !== BusyState.IDLE`, consider displaying the error 
inline with the appropriate form for the busyState.  
If `reply.error` is set and the `reply.busyState === BusyState.IDLE`, consider displaying the error 
state instead of the normal content, drawing more attention to it.  

- `reply.error.message {string|null}`  
An error message provided by the fontoxml-feedback addon (can be translated with 
fontoxml-localization).

- `reply.error.recovery {RecoveryOption}`  
What recovery options are available. Can be one of:  
`RecoveryOption.ACKNOWLEDGEABLE`,  
`RecoveryOption.RETRYABLE`,  
`RecoveryOption.REFRESHABLE` or  
`RecoveryOption.NONE`.  
Use this to determine what buttons to render (and couple to the appropriate callbacks, 
onReply*, see below).  
`RecoveryOption` can be imported as `import { RecoveryOption } from 'fontoxml-feedback/src/types.js'`.

- `reply.isLoading {boolean}`  
True while data is being submitted to the backend, use this to indicate loading states (spinners 
etc.).  
This works together with `reply.busyState`.

- `reply.metadata {object}`  
A mapping of a form component id/name to its current value or default value.  
This starts out as an empty object for (the first render of) a reply that is newly added.  
It is filled by initializing the reply (add) form. See the source code for more information.  
It is pre-filled when editing a pre-existing reply.  
Whatever you put in here while submitting the reply form (using `onReplyFormSubmit()`, see below), 
is send to the backend as-is.

- `reply.status  {string}`  
The status of the reply. Can be one of: 
`ReplyStatus.ARCHIVED`  
(We set the reply to this status when the user presses the "Remove" menu item. We send an edit
request to the backend to edit the reply's status to this value.  
This is for auditing purposes; data should never be actually deleted from the backend.)
`ReplyStatus.SHARED`
(Replies are shared by default and cannot be drafted privately, yet.)
These are displayed as a Badge on the card and indicate a basic 'workflow' step/state.  
It's an (optional) responsibility of the backend to filter out any archived replies (which is 
implemented as such by Fonto's dev-cms).  
`ReplyStatus` can be imported as `import { ReplyStatus } from 'fontoxml-feedback/src/types.js'`.

- `reply.timestamp {number}`  
A ISO-8601 timestamp indicating when this reply was created.  
This can be passed to a JavaScript Date object directly or used with fontoxml-localization to make 
the timestamp translatable and format it at the same time.

All props below are callbacks. You can call them whenever you want to change the state / submit some 
data within a specific reply of an annotation.  
The callbacks have already been bound to the specific annotation, but the specific reply (id) needs 
to be passed manually. See the source code for more details.  

- `onReplyAdd {function(replyId)}`  
When pressing the "Reply" button, call this callback;
this creates a new stub reply at the end (bottom) of the `reviewAnnotation.replies` array with its 
`busyState = BusyState.ADDING`, which should trigger the card to display the (add) reply form.

- `onReplyEdit {function(replyId)}`  
When pressing the "Edit" menu item, call this callback;
this sets `reply.busyState = BusyState.EDITING`, which should trigger the card to display the 
(edit) reply form.

- `onReplyFormCancel {function(replyId)}`  
When pressing the "Cancel" button of the reply (add or edit) form, call this callback;
this resets `reply.busyState back = BusyState.IDLE`, which should trigger your card to display 
the reply content instead of the reply (add or edit) form for the current reply.

- `onReplyFormSubmit {function(replyId, valueByName)}`  
When pressing the "Save" button in an annotation (add, edit or resolve) form, call this callback
with the `valueByName` mapping directly from your (FDS) Form. The given `valueByName` mapping will 
be stored as-is on `reply.metadata`;  
this submits the data of the form to the backend.  
While the data is submitted, `reply.isLoading = true` and afterwards 
`reply.busyState = BusyState.IDLE` again.

- `onReplyErrorHide {function(replyId)}`  
When pressing the "Hide" button in an error state of an error with `error.recovery === 
RecoveryOption.ACKNOWLEDGEABLE`, call this callback;  
this removes the reply from the list of replies in the frontend, in the backend the reply is usually 
already "removed" (actually, "archived") whenever this type or error occurs.

- `onReplyRefresh {function(replyId)}`  
When pressing the "Refresh" button in an error state of an error with `error.recovery === 
RecoveryOption.REFRESHABLE`, call this callback;  
this gets new data from the backend with could potentially solve the current error state.  

- `onReplyRemove {function(replyId)}`  
When pressing the "Remove" menu item, call this callback;  
this send an edit request to the backend to set `reply.status = ReplyStatus.ARCHIVED`.

### (API 2) Customizing the filters

You can also create your own form UI for filtering the list of annotations (serverside). You can 
create a component to use for the /editor and /review routes. You could change the form if desired
by checking for the value of the injected `productContext` prop, which can be one of:
"editor",  
"history" or  
"review".

Whatever input you've given in the form is summarized as a horizontal list of FDS Chip components.
These chips are shown directly above the cards list in the editor sidebar after the user has set a filter 
value. You can choose to implement a different summary or a component that renders nothing at all,
and you can change things based on `productContext` just like for the filter form.

Filtering is done on the backend, by the CMS, via the /review/state endpoint.  
This endpoint receives the current filter form value by name mapping from the frontend, which comes 
from your custom filter form component:  
whatever fields you render in the filter form, will determine what is sent to the backend.
If you run your editor locally with FDT, and therefore you are using our dev-cms, you need to 
customize the filter logic used by the dev-cms as well.  
Our dev-cms is implemented in NodeJS so it needs a JavaScript implementation of the filter logic.  

#### Customize the filter logic used by FDT (and its dev-cms)

You have to create a JS file at ./dev-cms/configureDevCms.js (if you haven't done so already to
customize the dev-cms routes).  
This file should look like this:
```js
'use strict';

// Replace the path below with the path to your version of this package and your version of the
// matchAnnotationToCurrentFilter.js file.
const matchAnnotationToCurrentFilter = require('../packages/%this-or-your-custom-package-name%/src/matchAnnotationToCurrentFilter');

module.exports = (router, config) => {
	return {
		// This key is required, the name and path of your function can be anything you like.
		reviewAnnotationFilter: matchAnnotationToCurrentFilter
		// This key could also be here to customize the dev-cms routes.
		// routes: myCustomRoutes
	};
};
```
In it we've now registered a custom function that is used to implement the filter logic based on
your registered annotation types and your custom filter form UI.

The matchAnnotationToCurrentFilter.js file should implement a function like this:
```js
module.exports = function matchAnnotationToCurrentFilter(filterFormValueByName, annotation) {
	return true;
}
```

It should return true if the given "annotation" (and its properties like / status / metadata / 
resolvedMetadata) match the given "filterFormValueByName" mapping.  
Given an annotation that records a "resolution" field in its "resolvedMetadata" and a filter form 
UI that uses checkboxes to represent different possible resolution values, this package provides an
example implementation that works together with that UI. You can find it in this package under:
`./src/matchAnnotationToCurrentFilter.js`

#### FilterFormComponent

This component should render some sort of form to the user to allow them to filter the cards list.  

A FilterForm component is designed to work well with an FDS Form and FDS form fields, however, 
you can also use your own form/UI components.  
Note: If you use your own form, take care to still correctly implement/respect all the given props.  
These help your form integrate with the rest of the /review UI. For example, there is no cancel or 
submit callback because that is standardized as the "Cancel" + "Set filters" buttons displayed above 
the filter form, which cannot be customized. They also handle the actual filtering by posting the
filter form values to the /review/state endpoint and they pass the values to (your custom) 
FilterFormSummaryChipsComponent(s) for each route.

The example in this package uses an FDS Form and as you'll see in the code, the props described
below (almost) all translate directly towards props on FDS Form.  
More details are in the annotated source code of this package.

Your `FilterFormComponent` receives the following props:
- `error {object}`
Errors occur as a result of a submitting the filter form (which also happens when removing one of
the summary chips, see the source code for more details).  

- `error.message {string|null}`  
An error message provided by the fontoxml-feedback addon (can be translated with 
fontoxml-localization).

- `error.recovery {RecoveryOption}`  
What recovery options are available. Can be one of:  
`RecoveryOption.ACKNOWLEDGEABLE`,  
`RecoveryOption.RETRYABLE`,  
`RecoveryOption.REFRESHABLE` or  
`RecoveryOption.NONE`.  
`RecoveryOption` can be imported as `import { RecoveryOption } from 'fontoxml-feedback/src/types.js'`.

- `feedbackByName {object}`  
A mapping of a form component id/name to its current feedback or null.
This starts out as an empty object and will be filled after onInitialize is called and change 
whenever onFieldChange is called. (see below)

- `isDisabled {boolean}`  
This is true while an annotation is loading/processing a data call or when an annotation has a 
non-idle busyState, eg. the edit or reply form is opened.

- `isSubmitting {boolean}`  
This is true when the filter form is being submitted, use this do display a loading/submitting state.

- `onFieldChange {function({ name, value, feedback })`  
A callback that should be called whenever the value inside your form component changes.  
Make sure it receives all 3 properties; name must be a string but value and feedback can contain 
whatever you like.  
Important: set feedback to null if there is no feedback, otherwise you cannot submit the form.

- `onInitialize {function({ feedbackByName, valueByName })`  
A callback that can be called to initialize an (FDS) Form in one go (as opposed to separately for
each field via `onFieldChange`.
Make sure it receives either null or an object mapping for both keys.  
Important: set feedbackByName to null, or to a mapping only containing null values, if there is no 
feedback, otherwise the user cannot submit the form (via the submit button in the filter form header).

- `productContext {string}`  
Can be one of:  
`"editor"`,  
`"history"` or
`"review"`  
Optionally use this to make anything specific to a specific route/product/app context.

- `showFeedback {boolean}`  
Whether or not you should display form feedback at this point.  
Note: By default, an FDS form shows form feedback as a field changes (while the user changes it).  
For the fontoxml-feedback addon, we chose to only display feedback after submitting a form.  
Which is achieved by stripping any feedback from the given feedbackValueByName unless showFeedback 
is set to true; which only happens after the form is submitted.

- `valueByName {object}`  
A mapping of a form component id/name to its current value or default value.  
This starts out as an empty object and will be filled after onInitialize is called and change 
whenever onFieldChange is called. (see below)

#### FilterFormSummaryComponent

This component should render some sort of summary to the user to allow them to quickly see what
filter values are active without showing the full filter form UI.
It could also quickly make edits to the filter form (as shown in this example by providing a remove
"x" button for each chip to remove the corresponding filter form value.)  
See the source code for more details.

Your `FilterFormSummaryComponent` receives the following props:
- `error {object}`
Errors occur as a result of a submitting the filter form (which also happens when removing one of
the summary chips, see the source code for more details).  

- `error.message {string|null}`  
An error message provided by the fontoxml-feedback addon (can be translated with 
fontoxml-localization).

- `error.recovery {RecoveryOption}`  
What recovery options are available. Can be one of:  
`RecoveryOption.ACKNOWLEDGEABLE`,  
`RecoveryOption.RETRYABLE`,  
`RecoveryOption.REFRESHABLE` or  
`RecoveryOption.NONE`.  
`RecoveryOption` can be imported as `import { RecoveryOption } from 'fontoxml-feedback/src/types.js'`.

- `feedbackByName {object}`  
A mapping of a form component id/name to its current feedback or null.
This starts out as an empty object and will be filled after `onInitialize` is called and change 
whenever `onFieldChange` is called. (see below).

- `isSubmitting {boolean}`  
This is true when the filter form is being submitted or when a chip is removed, use this to 
display a loading/submitting state.

- `onChange {function(valueByName, feedbackByName)`  
A callback that should be called whenever you want to change a filter form value from within the 
summary.  
Make sure it receives an object mapping for valueByName containing all the other values, you have
to copy (...spread) them from the given `valueByName` prop.  
Important: omit feedbackByName or set it to null, or to a mapping only containing null values, if 
there is no feedback, otherwise the user cannot submit the form (via the submit button in the filter form header).

- `productContext {string}`  
Can be one of:  
`"editor"`,  
`"history"` or
`"review"`  
Optionally use this to make anything specific to a specific route/product/app context.

- `showFeedback {boolean}`  
Whether or not you should display form feedback at this point.  
Note: By default, an FDS form shows form feedback as a field changes (while the user changes it).  
For the fontoxml-feedback addon, we chose to only display feedback after submitting a form.  
Which is achieved by stripping any feedback from the given feedbackValueByName unless showFeedback 
is set to true; which only happens after the form is submitted.

- `valueByName {object}`  
A mapping of a form component id/name to its current value or default value.  
This starts out as an empty object and will be filled after the filter form's `onInitialize` is 
called and change whenever it's `onFieldChange` or the summary's `onChange` is called (see above).

#### Setting the initial values for your custom FilterForm.

Call `setInitialFilterFormValues` in your
install.js file. Give it a valueByName object for each of the filter forms (/editor and /review).  
Note: Make sure the keys match the names of the form fields (onFieldChange({ name: 'X' ... })).  
This package provides an example that initializes the filter to only show unresolved annotations.  
This works together with the example FilterForm(Summary) and example reviewAnnotationFilter.  
You can`import setInitialFilterFormValues from 'fontoxml-feedback/src/setInitialFilterFormValues.js'`.

### (API 3) Using InsertReviewAnnotationDropButton in your editor
  
InsertReviewAnnotationDropButton is a React component that uses FDS/Fx to create a Button which
opens a Drop with MenuItems in it to create an annotation of each of the registered annotation types 
(see the chapter above).

You can `import InsertReviewAnnotationDropButton from fontoxml-feedback/src/InsertReviewAnnotationDropButton.jsx`.

You can render this component anywhere you like (we recommend something like the "Start" and/or
"Tools" tab of the editor masthead).  
It is rendered by default on the "Comments" sidebar provided by the fontoxml-feedback addon, this
cannot be customized.

Clicking one of the menu items will also open the "Comments" sidebar if it isn't open already.

### (API 4) Customizing the masthead on the /review route with MastheadComponent

Register a custom component under the name "MastheadForReview" that renders an FDS Masthead and 
(optionally) uses the ReviewLogo from fontoxml-feedback.  
You can use any other components as you see fit. 

If you do not register a custom component, a default masthead is used. (Which is the same as the one
used by this package.)

Feel free to customize the masthead with whatever FDS component you see fit.

### (API 5) Using a custom SheetFrameHeader component on the /review route.

Lastly this package also registers a custom `SheetFrameHeader` component as an example.  
The component itself is not changed in any way from the default sheet frame header. It's included
as an example to highlight how the `productContext` prop is used to conditionally render UI that
only makes sense if the content can be edited (only if the `productContext === 'editor'`).

Conversely, you could use UI that is only relevant for the new "review" product context and 
conditionally render that in a similar manner.
