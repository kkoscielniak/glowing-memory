# aidevs.pl micro framework

A tool for interacting with both aidevs.pl and OpenAI APIs + answers to the home assignments. Use at your own peril.

> ⚠️ It's far from finished. I publish it only because it might be useful for fellow students. PRs are welcome.

## Installation and usage

1. `npm i`
2. Create `.env` from `.env.template`
3. For each task create a `task-name.ts`
4. To run the task: `npm start path/to/task-file.ts`

Refer to [`inpromt.ts`](./inprompt.ts) to see how to automate GPT calls.

## FAQ

Q: Why not use some existing Node.js package for GPT interaction?  
A: I didn't think of it and writting my own Apisauce client is simple as fuck. Also, GPT itself helped me to write most of it.
