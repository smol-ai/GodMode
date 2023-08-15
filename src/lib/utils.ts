import { ProviderInterface } from './types';

export function getEnabledProviders(allProviders: ProviderInterface[]) {
	return allProviders.filter(provider => provider.isEnabled());
}

export function updateSplitSizes(panes: any[], focalIndex = null) {
	// Handle specific pane focus
	if (focalIndex !== null) {
			let sizes = new Array(panes.length).fill(0);
			sizes[focalIndex] = 100 - 0 * (panes.length - 1);
			return sizes;
	}

	// Evenly distribute remaining space among all panes
	let remainingPercentage = 100 / panes.length;
	let sizes = new Array(panes.length).fill(remainingPercentage);
	return sizes;
}