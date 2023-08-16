import { ProviderInterface } from './types';

export function getEnabledProviders(allProviders: ProviderInterface[]) {
	return allProviders.filter((provider) => provider.isEnabled());
}
