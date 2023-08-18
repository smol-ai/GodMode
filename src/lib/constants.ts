import Bard from '../providers/bard';
import Bing from '../providers/bing';
import Claude from '../providers/claude';
import Claude2 from '../providers/claude2';
import HuggingChat from '../providers/huggingchat';
import OobaBooga from '../providers/oobabooga';
import OpenAi from '../providers/openai';
import Perplexity from '../providers/perplexity';
import YouChat from '../providers/you';
import PerplexityLlama from '../providers/perplexity-llama.js';
import Phind from '../providers/phind';
import Smol from '../providers/smol';
import Together from '../providers/together';
import Vercel from 'providers/vercel';
import Poe from 'providers/poe';

export const allProviders = [
	OpenAi,
	Bard,
	Bing,
	// Claude, // Can't Verify
	Claude2,
	Together,
	YouChat,
	Perplexity,
	// Phind, // Broken
	PerplexityLlama,
	HuggingChat,
	// OobaBooga, // Can't Verify
	Smol,
	Vercel,
	Poe,
];
