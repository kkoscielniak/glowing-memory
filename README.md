# aidevs.pl micro framework

A tool for interacting with both aidevs.pl and OpenAI APIs + answers to the home assignments. Use at your own peril.

> ⚠️ It's far from finished. I publish it only because it might be useful for fellow students. PRs are welcome.

## Installation and usage

1. `bun install`
2. Create `.env` from `.env.template`
3. For each task create a `task-name.ts`
4. To run the task: `bun [--watch] path/to/task-file.ts`

Refer to [`inpromt.ts`](./inprompt.ts) to see how to automate GPT calls.
