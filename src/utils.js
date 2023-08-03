// Function to get the enabled providers from the providers object
function getEnabledProviders(providers) {
	const allProviders = Object.values(providers);
	return allProviders.filter((provider) => provider.isEnabled());
}

// Get all providers regardless of enabled status
function getAllProviders(providers) {
	return Object.values(providers);
}

module.exports = {
	getEnabledProviders,
	getAllProviders,
};
