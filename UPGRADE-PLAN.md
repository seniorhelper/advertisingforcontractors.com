# advertisingforcontractors.com — Upgrade Plan (2026-11-07)

Owner: Zach Wennstedt (Search Converts LLC / Eye To Ad Media). Hosting: **GitHub Pages** (repo `seniorhelper/advertisingforcontractors.com`, CNAME). "Upload" = `git push` to `main`. Live site matched local `main` byte-for-byte on 2026-11-07 (CRLF-normalized).

## 1. Audit summary (what is there today)

| Area | State | Verdict |
|---|---|---|
| Pages | 41 HTML pages: home, 10 trade pages, 7 service pages, 5 free tools, 9 blog posts, about/contact/pricing/results/etc. | Good breadth |
| Content depth | Money pages 3,100–4,400 words; blog 1,100–1,900; each trade page cites trade-specific sources (NRCA, ACCA, PHCC, NFPA, EPA…) | Strong, not doorway pages |
| Internal links | 0 broken internal links (script check). Every money page has 41 inbound links. Blog posts only 4–8 inbound; `/free-contractor-chatbot/` only 3 | Blog + chatbot under-linked |
| Titles | All 1 H1, canonical set. 15 titles 61–66 chars (slight truncation risk) | Minor |
| Meta descriptions | 38 of 41 over 155 chars; 9 over 200 | Fix worst 9 now |
| Schema | Organization, WebPage, BreadcrumbList, Service/Offer, FAQPage, BlogPosting on every relevant page | Good; no self-serving review stars found |
| Claims | No fake testimonials, no "#1" claims, no review stars. Ads pages are audits + management; eyetoad.com lists Google Ads among its services. | PASS. `[CONFIRM]` Facebook/Meta ads management is not listed on eyetoad.com — confirm Eye To Ad runs Meta ads before pushing that page harder |
| Lead capture | `afcForm` on every page posts via FormSubmit AJAX to info@eyetoad.com (address assembled in JS, not in HTML). This is the network inbox, so the form is already wired to Zach's lead flow | PASS — no change |
| Analytics | GA4 G-9L0VX8T163 with generate_lead / phone_click / A/B events; GSC verification file | PASS |
| Design | Custom "jobsite" system: Barlow Condensed display, IBM Plex Mono labels, dark ink + safety yellow. Distinctive — **except body font Inter**, the most overused web font | Swap Inter |
| Speed | Logos are 200 KB PNG on every page (LCP element on mobile header); favicon 64 KB; 6 unused 1.7–2.4 MB PNG originals (12 MB) sit in /images; hero video already gated to ≥900px | Optimize logo, delete unused |
| ProveHound | No mention anywhere | Add one contextual nofollow link via new free resource |
| llms.txt / sitemap.xml / robots | Present and current; robots allows AI crawlers | Update for new page |

## 2. Ranked fixes (highest expected lead impact first)

1. **New free resource: Contractor Proof Kit** (`/contractor-proof-kit/`). Builds a copy-ready "proof block" (license number + issuing agency + lookup link, insurance, warranty, review links) from the contractor's own facts, in the browser, plus a 12-point proof self-check. Answers a gap the top results leave open (see research): they say "show your license" but give no tool and no wording. One contextual `rel="nofollow"` link to ProveHound's free badge toolkit. Gets nav, footer, tools hub and 2 contextual links in.
2. **Logo + favicon to WebP/small PNG** — cuts ~250 KB from every page load.
3. **Body font Inter → Schibsted Grotesk** sitewide (41 pages + rivet.js). Keeps the system, removes the generic look.
4. **Rewrite the 9 meta descriptions over 200 chars** to ≤155.
5. **Remove 6 unused PNG originals** (12 MB; backed up outside the repo first).
6. **Sitemap.xml, sitemap.html, llms.txt** updated for the new page.

## 3. Not doing (and why)

- **Full visual rebuild of 41 pages:** the current design is custom, accessible and already distinctive; a rebuild risks rankings and conversion with no evidence it would win more leads. Font swap + speed is the honest upgrade.
- **New trade or city landing pages:** the 10 trade pages already have real substance; adding thin trades (e.g. landscaping) without real content would be scaled-content risk.
- **Case studies:** no real, documented AFC client case studies were found in the repo or notes. `/results/` stays as "realistic expectations by channel". `[CONFIRM]` If Zach has a contractor client willing to be named with real numbers, that is the single biggest trust upgrade available.
- **Lead form changes:** already wired to info@eyetoad.com.

## 4. Next (after this push)

- Trim the remaining 29 meta descriptions in the 156–199 range.
- Add 2–3 contextual links into each blog post from the matching service page (blog posts have only 4–8 inbound).
- Link `/free-contractor-chatbot/` from the tools nav and footer (3 inbound today).
- Convert trade hero JPGs (116–304 KB) to WebP with `<picture>`.
- Get real keyword volumes (Google Ads Keyword Planner) for the terms in `RESEARCH-advertisingforcontractors-2026-11-07.md` — none were measured this round.
- Request indexing for `/contractor-proof-kit/` in Search Console after push.
