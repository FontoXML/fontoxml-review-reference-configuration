import configurationManager from 'fontoxml-configuration/src/configurationManager';

/**
 * Get the current scope user.
 *
 * Note that it will fall back on the anonymous user if the scope
 * user cannot be retrieved from the configuration.
 *
 * @returns An object containing the identifier and the display name of the
 * current scope user.
 */

function getCurrentScopeUser(): {
	id: string | null;
	displayName: string | null;
} {
	const scope = configurationManager.get('scope');
	const scopeUser = scope?.user;

	const fallbackUser = {
		id: null,
		displayName: null,
	};

	if (
		scopeUser &&
		typeof scopeUser === 'object' &&
		'id' in scopeUser &&
		'displayName' in scopeUser
	) {
		return scopeUser as {
			id: string;
			displayName: string;
		};
	}

	return fallbackUser;
}
export const currentScopeUser = getCurrentScopeUser();

export const CARD_HEADER_HEIGHT = '2rem';
