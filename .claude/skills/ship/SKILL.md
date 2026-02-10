# Ship Workflow
1. Stage all changes with `git add .`
2. Create a conventional commit (feat:/fix:/docs:/chore:) with a descriptive message
3. Push the current branch to origin
4. Create a PR with `gh pr create --fill`
5. If user asks to merge, use `gh pr merge --admin --squash`
6. After merge, switch to main, pull, and create a new feature branch if requested
