# AI attribution

Planee is a graded school project. The school requires every piece of code an AI helped with to be
marked, so these rules apply to every AI agent working in this repo.

## 1. git-ai tracks authorship

[git-ai](https://github.com/git-ai-project/git-ai) records which lines were written by AI, using
agent hooks and git notes.

- Hooks for Claude Code, OpenCode, Copilot and Gemini are installed by `git-ai install-hooks`.
- If your agent has no hook, run `git-ai checkpoint <preset>` for your agent after every file
  change (presets: `git-ai --help`).
- The user's own edits are recorded by the git-ai plugin in WebStorm. Do not checkpoint them for
  the user.
- Do not rewrite history in a way that loses the notes (`refs/notes/ai`).
- Useful commands: `git-ai status`, `git-ai stats <commit>`, `git-ai show <commit>`,
  `git-ai blame <file>`, `git-ai diff <commit>`.

### How git-ai credits lines

These were all observed in this repo. Each one has already credited code to the wrong author.

- **The last change to a line owns it.** Whoever changes a line, even only its quotes,
  wrapping, indentation or import order, becomes its author. When the user edits a line you
  wrote, it becomes theirs, and when you touch theirs, it becomes yours.
- **Everything your tools change is credited to you.** The agent hook credits every change made
  during your tool call, whether through an edit tool, `sed`, a script, a formatter, a codemod
  or a code generator, to the agent, including lines in files you did not mean to touch.
- **`git-ai checkpoint human` does not credit the user.** It marks lines as untracked, with no
  author. Never use it to hand lines back to the user.
- **Untracked lines committed from an agent session are credited to the agent.** If a commit
  you make contains untracked lines, git-ai assigns them to your session. Before you commit,
  make sure the diff contains only lines you wrote, or lines the user wrote and that are already
  recorded as theirs.
- **Do not fake authorship.** Do not re-edit a line just to make it yours again (for example,
  deleting and re-adding it). That is a rewrite and credits the line to you whether or not you
  wrote it.

### Rules that follow from this

- Only change lines you need to change for the task. Never run a tool that rewrites files in
  bulk (formatter, `biome check --write` on a directory, `sed` across files, codemods, lint
  autofix) on code you did not write. If such a run is needed, ask the user first.
- The code is kept in Biome style and WebStorm runs Biome on save, so a format pass only changes
  lines that are not formatted yet. Biome is the only formatter: never run Prettier. After
  editing, run `pnpm exec biome check --write <files>` from the package directory (Biome is
  installed in `apps/api`) on exactly the files you changed, so the user's save does not
  reformat your lines and take them over. Then check with `git diff` that it changed only your
  lines.
- Commit only when the user asks. Right after committing, run `git-ai stats <commit>` and
  `git-ai show <commit>` and check that every line belongs to the right author. If not, tell
  the user.
- If credit went wrong, stop and tell the user what happened and which lines are affected.
  Repair `.git/ai` or `refs/notes/ai` only when the user asks, and verify the repair in a
  throwaway copy of the repo before applying it to the real one.
- `git-ai status` shows "you 0%" even when lines are credited to the user. Judge by
  `git-ai stats <commit>` or `git-ai show <commit>` after a commit, not by that bar.

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
