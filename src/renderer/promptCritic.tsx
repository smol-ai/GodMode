import { SparklesIcon } from '@heroicons/react/20/solid';

// @ts-ignore
import vex from 'vex-js';
// Main css
import 'vex-js/dist/css/vex.css';
// Themes (Import all themes you want to use here)
import 'vex-js/dist/css/vex-theme-default.css';
import 'vex-js/dist/css/vex-theme-os.css';
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-os';

function _promptCritic(originalPrompt: string) {
	return `I need to improve the original prompt: 
  
  --- Original Prompt ---
  ${originalPrompt}
  --- End Original Prompt ---

  There are known ways to improve prompts for better LLM performance, for example adding "Let's think step by step to get to the right answer" or adding comments before each line of code.
  Can you please briefly list ways to improve (3 <ol> <li> bullet points with <b>bolded headings</b> per bullet) and then suggest one improved prompt following your criticism?
	Stop at the improved prompt, do not attempt to answer the prompt.
  `;
}

function _promptImprover(originalPrompt: string, modifyInstructions?: string) {
	return `I need to add more detail to the original prompt: 
  
  --- Original Prompt ---
  ${originalPrompt}
  --- End Original Prompt ---

  ${
		modifyInstructions
			? `My modification instructions are: ${modifyInstructions}`
			: ''
	}
  Please suggest a newer, more detailed (still <300 words) version of this prompt that improves LLM performance. 
  Do not preface with any conversation or small talk, only reply with the improved prompt.
  `;

	// For example:
	// - for general knowledge questions, appending "Let's think step by step to get to the right answer." is known to do well.
	// - for creative writing, setting temperature=200 and adding exciting adjectives, writing in the style of Hunter S Thompson and Winston Churchill and other well known authors.
	// - for code generation, first ask for the high level implementation plan in comments, then make sure each non-trivial line of code is preceded by a comment explaining what it does.

	// Do not preface with any conversation or small talk, only reply with the improved prompt.
	// `;
}

export function PromptCritic(props: {
	active: boolean;
	superprompt: string;
	setSuperprompt: (p: string) => void;
}) {
	const { active, superprompt, setSuperprompt } = props;
	async function runPromptCritic() {
		if (superprompt.length < 10) {
			alert(
				'superprompt is too short. write a longer one! e.g. "write a receipe for scrambled eggs"',
			);
			return;
		}
		console.log('promptCritic', superprompt);
		window.electron.browserWindow.promptHiddenChat(_promptCritic(superprompt));
		var promptChangeStr = await new Promise<string>((res) =>
			vex.dialog.prompt({
				unsafeMessage: `
					<div class="title-bar">
							<h1>PromptCritic analysis</h1>
					</div>
					<div id="streamingPromptResponseContainer">
					</div>`,
				placeholder: `what you'd like to change about your prompt`,
				callback: res,
			}),
		);
		if (!promptChangeStr) return;
		console.log('stage 2 response', promptChangeStr);

		console.log('finalPrompt', promptChangeStr);
		if (promptChangeStr != null) {
			setSuperprompt(promptChangeStr);
		}
		// window.electron.browserWindow.promptHiddenChat(_promptImprover(superprompt, promptChangeStr));
		// console.log('stage 3 response', prospectivePrompt);
		// var finalPrompt: string | null = await new Promise((res) =>
		// 	vex.dialog.prompt({
		// 		unsafeMessage: `
		// 			<div class="title-bar">
		// 					<h1>PromptCritic's Improved suggestion</h1>
		// 			</div>
		// 			<div id="streamingPromptResponseContainer">
		// 			</div>`,
		// 		// value: prospectivePrompt.responseText,
		// 		input: `<textarea name="vex" type="text" class="vex-dialog-prompt-input" placeholder="your final prompt"
		// 		value="${textareavalue}" rows="4">
		// 		${textareavalue}
		// 		</textarea>`,
		// 		placeholder: `your final prompt; copy and paste from above if it helps`,
		// 		callback: (data: any) => {
		// 			console.log({ data });
		// 			if (!data) {
		// 				console.log('Cancelled');
		// 			} else {
		// 				res(data);
		// 			}
		// 		},
		// 	}),
		// );

		// const textareavalue = prospectivePrompt.responseText.replace(
		// 	/\r|\n/,
		// 	'<br>'
		// );
		// console.log('finalPrompt', finalPrompt);
		// if (finalPrompt != null) {
		// 	setSuperprompt(finalPrompt);
		// }
	}
	return (
		<button
			className={classNames(
				active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
				'px-4 py-2 text-sm w-full flex items-center justify-start',
			)}
			onClick={runPromptCritic}
		>
			<SparklesIcon className="inline w-4 h-4 mr-2" />
			PromptCritic (alpha)
		</button>
	);
}

// https://tailwindui.com/components/application-ui/elements/dropdowns
function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}
