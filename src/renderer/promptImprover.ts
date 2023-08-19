export function promptCritic(originalPrompt: string) {
	return `I need to improve the original prompt: 
  
  --- Original Prompt ---
  ${originalPrompt}
  --- End Original Prompt ---

  There are known ways to improve prompts for better LLM performance.  
  Can you please briefly (in <200 words, mostly <ol> <li> bullet points with <b>bolded headings</b> per bullet) criticize the original prompt?
  `;
	// For example:
	// - for general knowledge questions, appending "Let's think step by step to get to the right answer." is known to do well.
	// - for creative writing, setting temperature=200 and adding exciting adjectives, writing in the style of Hunter S Thompson and Winston Churchill and other well known authors.
	// - for code generation, first ask for the high level implementation plan in comments, then make sure each non-trivial line of code is preceded by a comment explaining what it does.
}

export function promptImprover(
	originalPrompt: string,
	modifyInstructions?: string
) {
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
