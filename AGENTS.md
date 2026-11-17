# AI attribution

Planee is a graded school project. The school requires every piece of code an AI helped with to be
marked, so these rules apply to every AI agent working in this repo.

## 1. git-ai tracks authorship

[git-ai](https://github.com/git-ai-project/git-ai) records which lines were written by AI, using
agent hooks and git notes.

- Hooks for Claude Code, OpenCode, Copilot and Gemini are installed by `git-ai install-hooks`.
- If your agent has no hook, run `git-ai checkpoint <preset>` after every file change (presets:
  `git-ai --help`). Before handing back, run `git-ai checkpoint human` for changes the user made
  by hand.
- Do not rewrite history in a way that loses the notes (`refs/notes/ai`). Check with
  `git-ai status` before committing.
- Useful commands: `git-ai stats`, `git-ai log`, `git-ai blame <file>`, `git-ai diff <commit>`.

## 2. Mark code in the source

Above every function, method, class, component or block you create or significantly change,
add a tag comment in the language's comment syntax:

```ts
// @ai/created(Claude Opus 5.5): Wrote the conflict resolution for offline task edits.
// @ai/assisted(Claude Opus 5.5): Fixed the off-by-one in the week range calculation.
// @ai/suggested(Claude Opus 5.5): Proposed splitting sync into pull and push phases; author implemented it.
```

- `created`: the AI wrote the code.
- `assisted`: the author wrote the code and the AI modified, fixed or simplified it.
- `suggested`: the AI proposed the design or approach and the author wrote the code.
- Use your real model name inside the parentheses.
- After the colon, write one short sentence saying what you actually did, specific enough to
  quote in the thesis.
- If you wrote a whole file, put a single tag at the top of the file instead of one per symbol.
- A tag at the top of a file is always followed by one blank line.
- If a tag already exists, update it instead of stacking a second one. Upgrade the level when
  your change is bigger (suggested < assisted < created) and add your model if it is different.
- Leave out trivial edits (renames, formatting, imports). Generated files (Prisma client,
  lockfiles) are not tagged.
- Never remove or downgrade a tag unless the user tells you the code was rewritten by hand.

`git grep -n --untracked "@ai/" -- ":!AGENTS.md"` must always list every AI-touched part of the code.

## 3. Commits

End commit messages with a `Co-Authored-By:` trailer naming the model.
