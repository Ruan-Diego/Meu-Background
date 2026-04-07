<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Git: branch per feature, commit when done

- **Before** starting work on a new feature or roadmap item: create a branch from `main` (e.g. `feature/m1-f02-design-system`). Avoid committing new feature work directly on `main` first.
- **After** the implementation is complete: commit on that branch with a Conventional Commit subject; include the roadmap ID when relevant (e.g. `feat(M1-F02): …`).
- **Then merge the feature branch into `main`** (`git checkout main && git merge <branch>`) so `main` always contains finished work. Push `main` and/or the branch as needed; use a PR when that is the team workflow.

Project rules also live in `.cursor/rules/` (see `git-workflow.mdc`).
