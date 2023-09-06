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
import LeptonLlama from '../providers/lepton-llama.js';
import Phind from '../providers/phind';
import Smol from '../providers/smol';
import Together from '../providers/together';
import Vercel from 'providers/vercel';
import OpenRouter from '../providers/openrouter';
import Poe from 'providers/poe';
import InflectionPi from 'providers/inflection';
import StableChat from 'providers/stablechat';
import Falcon180BSpace from 'providers/falcon180bspace';

export const allProviders = [
	OpenAi,
	Bard,
	Bing,
	Claude,
	Claude2,
	YouChat,
	Perplexity,
	Phind,
	Poe,
	InflectionPi,
	HuggingChat,
	StableChat,
	Falcon180BSpace,
	OobaBooga,
	Together,
	OpenRouter,
	PerplexityLlama,
	LeptonLlama,
	Vercel,
	Smol,
];
