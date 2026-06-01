# Branch Protection — main

The `main` branch is protected. All changes require review by @drconnoroliveri-14.

To enforce this via GitHub Settings:
1. Go to Settings → Branches → Add branch protection rule
2. Branch name pattern: `main`
3. Enable: Require a pull request before merging
4. Enable: Require approvals (1) — from @drconnoroliveri-14
5. Enable: Require review from Code Owners (uses CODEOWNERS file)
6. Enable: Restrict who can push to matching branches → add only trusted users
7. Enable: Do not allow bypassing the above settings
