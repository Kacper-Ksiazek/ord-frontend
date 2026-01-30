---
name: commit
description: Create atomic commits from staged and unstaged changes, following conventional commit style. Use when the user says "commit" and wants to organize changes into logical commits.
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Atomic Commit Workflow

Create atomic commits from staged and unstaged changes, following conventional commit style.

## Workflow

1. **Check git status**
   ```bash
   git status --porcelain
   ```

2. **Analyze changes**
   - For each modified/new file or folder, run `git diff` to understand the changes
   - Group related changes logically (e.g., all files for one feature together)
   - Identify dependencies (files that must be committed before others)

3. **Propose commits**
   - Present a numbered list of proposed commits with:
     - Commit type and message (e.g., `feat: add country flag components`)
     - Brief description of what files/changes are included
   - Order commits by dependency (foundation changes first, consumers last)

4. **Wait for user approval**
   - ALWAYS wait for explicit user approval before creating commits
   - User may say: "commit", "proceed", "go for it", "yes", etc.

5. **Create commits**
   - Use conventional commit format: `type: description`
   - Types: `feat`, `refactor`, `fix`, `chore`, `docs`, `style`, `test`
   - Always use HEREDOC for commit messages:
     ```bash
     git commit -m "$(cat <<'EOF'
     type: commit message here

     Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
     EOF
     )"
     ```

6. **Verify and report**
   ```bash
   git status && git log --oneline -N
   ```
   - Report: commits created, working tree status, how many commits ahead of origin

## Commit Grouping Guidelines

- **New components/files**: Commit together if they form a cohesive unit
- **Refactors**: Group by feature area or purpose
- **Type changes**: Foundation types before consumers
- **Styles**: Can be grouped with related component changes or separate if standalone
- **Config changes**: Usually separate commits

## Example Commit Messages

- `feat: add country flag SVG components`
- `refactor: update language picker to use LanguageName type`
- `fix: correct null check in user validation`
- `chore: bump package version to 1.0.34`
- `style: update feedback card text-box styles`

## Important Rules

- NEVER commit without user approval
- NEVER use `git add -A` or `git add .` - always add specific files
- NEVER skip the Co-Authored-By footer
- ALWAYS verify dependencies and commit order
- Keep commit messages concise (under 72 characters for the first line)
