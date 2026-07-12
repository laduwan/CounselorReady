name: pr-hygiene

# Strips Claude attribution footers from PR descriptions.
#
# Why this exists: this repo's squash-merge setting composes the commit message
# from the PR *description*, so anything in a PR body lands in main's git history
# verbatim. CLAUDE.md forbids these footers, but the rule was ignored three
# commits after it shipped (#663). This enforces it server-side rather than
# relying on compliance.
#
# Scope: PR body only. Human `Signed-off-by:` and non-Claude `Co-authored-by:`
# trailers are preserved. Cannot retroactively fix already-merged PRs.
#
# Uses pull_request_target so the token can write to PRs from forks. Safe here
# because this workflow never checks out or executes PR head code — it only
# reads and rewrites the PR body through the API.

on:
  pull_request_target:
    types: [opened, edited, reopened]

permissions:
  pull-requests: write

jobs:
  strip-attribution:
    name: Strip Claude attribution from PR body
    runs-on: ubuntu-latest
    # Skip the no-op re-run triggered by this workflow's own edit.
    if: github.actor != 'github-actions[bot]'
    steps:
      - name: Strip attribution footers
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_NUM: ${{ github.event.pull_request.number }}
          REPO: ${{ github.repository }}
        run: |
          set -euo pipefail

          gh pr view "$PR_NUM" --repo "$REPO" --json body -q .body > /tmp/body.md

          python3 - /tmp/body.md /tmp/stripped.md <<'PY'
          import re, sys

          PATTERNS = [
              # "Generated with/by [Claude Code](url)" — the link text may wrap
              # across lines when GitHub soft-wraps the body. Also eats a
              # preceding "---" separator if present.
              r'(?is)\n*[^\S\n]*(?:---[^\S\n]*\n)?[^\S\n]*[_*]*\s*(?:\U0001F916\s*)?'
              r'Generated\s+(?:with|by)\s+\[?\s*Claude\s+Code\s*\]?\s*\([^)]*\)[_*]*[^\S\n]*(?=\n|$)',
              # same footer as plain text, no markdown link
              r'(?im)^[^\S\n]*(?:\U0001F916\s*)?Generated\s+(?:with|by)\s+Claude\s+Code[^\n]*$\n?',
              # trailers — Claude only; human trailers are left untouched
              r'(?im)^[^\S\n]*Co-authored-by:[^\S\n]*Claude[^\n]*$\n?',
              r'(?im)^[^\S\n]*Claude-Session:[^\n]*$\n?',
          ]

          body = open(sys.argv[1], encoding='utf-8').read()
          out = body
          for p in PATTERNS:
              out = re.sub(p, '', out)
          out = re.sub(r'\n{3,}', '\n\n', out)                    # collapse blank runs
          out = re.sub(r'(?s)\n*[^\S\n]*---[^\S\n]*$', '', out)   # dangling separator
          out = out.rstrip() + '\n' if out.strip() else ''

          open(sys.argv[2], 'w', encoding='utf-8').write(out)
          PY

          if cmp -s /tmp/body.md /tmp/stripped.md; then
            echo "PR #$PR_NUM: clean — no attribution found."
            exit 0
          fi

          gh pr edit "$PR_NUM" --repo "$REPO" --body-file /tmp/stripped.md
          echo "PR #$PR_NUM: stripped Claude attribution from body."
