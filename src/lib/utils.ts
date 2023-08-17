import { ProviderInterface } from './types';
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function getEnabledProviders(allProviders: ProviderInterface[]) {
	return allProviders.filter((provider) => provider.isEnabled());
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function convertKeyCode(code: string) {
	return code
		.toUpperCase()
		.replace('KEY', '')
		.replace('DIGIT', '')
		.replace('NUMPAD', 'NUM')
		.replace('COMMA', ',');
}