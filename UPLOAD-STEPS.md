# Upload steps — 2026-11-07 upgrade

The site is on GitHub Pages, so "upload" = push `main`. Nothing goes to cPanel.

1. Review locally (already committed, not pushed):
   `git -C C:\Users\zachw\Sites\advertisingforcontractors.com log -1 --stat`
2. Push:
   `git -C C:\Users\zachw\Sites\advertisingforcontractors.com push origin main`
3. Wait about 1–2 minutes for Pages to build, then check:
   - https://advertisingforcontractors.com/contractor-proof-kit/ returns 200
   - https://advertisingforcontractors.com/UPGRADE-PLAN.md returns 404 (excluded by `_config.yml`)
   - Re-run `node "C:/Users/zachw/.claude/skills/site-security-check/scan.mjs" https://advertisingforcontractors.com/` and confirm 0 blockers.
4. Search Console → URL Inspection → request indexing for `/contractor-proof-kit/` and `/contractor-marketing-tools/`. Resubmit `sitemap.xml`.

Rollback: `git revert <this commit>` and push. Full pre-change zip: `C:\Users\zachw\Sites\_backups\advertisingforcontractors-2026-11-07\afc-main-0012ce0-full.zip` (also git commit 0012ce0).
