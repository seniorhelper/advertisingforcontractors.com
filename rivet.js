/* ═══════════════════════════════════════════════════════════════════════
   RIVET — Advertising For Contractors
   Shared chat assistant. One file, every page.

   Usage: <script src="/js/rivet.js" defer></script> before </body>.
   No dependencies. No cookies, no localStorage, no tracking — state lives
   in memory for the session only, which keeps it clear of consent banners.

   Engine ported from Iris v5.4:
     - weighted keyword scoring with negative terms and phrase bonuses
     - PAGE_MAP for page-aware opening lines
     - two-stage FormSubmit transport (AJAX, hidden-iframe fallback)
     - honest confirmed / unconfirmed / failed states — never claims a send
       it cannot verify
     - partial lead flush on pagehide
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

if (window.__RIVET_LOADED__) return;
window.__RIVET_LOADED__ = true;

var PHONE      = '1-800-481-8638';
var PHONE_HREF = 'tel:18004818638';
var MAILUSER   = 'info';
var MAILHOST   = 'eyetoad' + '.' + 'com';

/* ─────────────────────────────────────────────────────────────────────
   PAGE MAP — label drives the opening line, ind drives trade context
   ───────────────────────────────────────────────────────────────────── */
var PAGE_MAP = {
  '/':                                        { label: 'Home',                 ind: null },
  '/about/':                                  { label: 'About',                ind: null },
  '/who-we-work-with/':                       { label: 'Who We Work With',     ind: null },
  '/contact/':                                { label: 'Contact',              ind: null },
  '/roofing-marketing/':                      { label: 'Roofing',              ind: 'roofing' },
  '/plumbing-marketing/':                     { label: 'Plumbing',             ind: 'plumbing' },
  '/hvac-marketing/':                         { label: 'HVAC',                 ind: 'hvac' },
  '/electrical-contractor-marketing/':        { label: 'Electrical',           ind: 'electrical' },
  '/solar-contractor-marketing/':             { label: 'Solar',                ind: 'solar' },
  '/general-contractor-marketing/':           { label: 'General Contracting',  ind: 'general' },
  '/painting-contractor-marketing/':          { label: 'Painting',             ind: 'painting' },
  '/remodeling-marketing/':                   { label: 'Remodeling',           ind: 'remodeling' },
  '/pool-builder-marketing/':                 { label: 'Pool Building',        ind: 'pool' },
  '/fence-company-advertising/':              { label: 'Fencing',              ind: 'fencing' },
  '/contractor-seo/':                         { label: 'Contractor SEO',       ind: null },
  '/local-seo-contractors/':                  { label: 'Local SEO',            ind: null },
  '/google-ads-contractors/':                 { label: 'Google Ads',           ind: null },
  '/contractor-facebook-ads/':                { label: 'Facebook Ads',         ind: null },
  '/contractor-lead-generation/':             { label: 'Lead Generation',      ind: null },
  '/ai-search-optimization-contractors/':     { label: 'AI Search',            ind: null },
  '/results/':                                { label: 'Results',              ind: null },
  '/pricing/':                                { label: 'Pricing',              ind: null },
  '/industries-beyond-contracting/':          { label: 'Beyond Contracting',   ind: null },
  '/free-contractor-marketing-audit/':        { label: 'Free Audit',           ind: null },
  '/contractor-marketing-glossary/':          { label: 'Glossary',             ind: null },
  '/contractor-marketing-tools/':             { label: 'Free Tools',           ind: null },
  '/contractor-marketing-plan-builder/':      { label: 'Plan Builder',         ind: null },
  '/contractor-website-scorecard/':           { label: 'Website Scorecard',    ind: null },
  '/blog/':                                   { label: 'Blog',                 ind: null },
  '/accessibility/':                          { label: 'Accessibility',        ind: null }
};

var path = location.pathname.replace(/index\.html$/, '');
if (path.length > 1 && path.charAt(path.length - 1) !== '/') path += '/';
var PAGE = PAGE_MAP[path] || { label: null, ind: null };

/* ─────────────────────────────────────────────────────────────────────
   BENCHMARK DATA — every figure carries its source. This is the whole
   reason to answer numerically instead of vaguely.
   ───────────────────────────────────────────────────────────────────── */
var SRC_LSA = 'SearchLight Digital, February 2026 — $6.72M tracked across 888 contractors';
var SRC_ADS = 'SearchLight Digital, January 2026 — $14.9M tracked across 816 contractors';

var CPL = {
  electrical: { lsa: 39,  note: 'the cheapest LSA leads of any trade we track' },
  hvac:       { lsa: 51,  ads: 149, ticket: 2110, book: 44,   roas: 9.55 },
  plumbing:   { lsa: 57,  ads: 183, ticket: 1714, book: 44.5, roas: 6.85, cpc: 8.45 },
  drain:      { lsa: 59 },
  roofing:    { ads: 124, lsaLow: 50, lsaHigh: 130 }
};

/* ─────────────────────────────────────────────────────────────────────
   INTENTS
   Matching is weighted: `k` terms score 1, `strong` terms score 2.5,
   any `not` term disqualifies outright. Highest total wins; ties break
   toward the earlier entry, so put specific intents above general ones.
   ───────────────────────────────────────────────────────────────────── */
var INTENTS = [

/* — greeting & meta ————————————————————————————————— */
{ id:'greeting', k:['hi','hey','hello','howdy','morning','afternoon','good morning'],
  a:"Hey — Rivet here, AFC's estimator. Ask me anything about getting your phone ringing: what leads cost in your trade, whether Angi is worth it, how long SEO takes, what we charge. I'll give you the real number, including when it's bad news.",
  c:['What do leads cost?','What do you charge?','Is Angi worth it?'] },

{ id:'who_are_you', k:['who are you','what are you','are you a bot','are you human','your name','rivet'],
  a:"I'm Rivet, the assistant on this site. I'm software, not a person — worth saying plainly so you know what you're talking to. I can answer most questions about contractor advertising using real 2026 benchmark data. When you want an actual human, call "+PHONE+" and one answers.",
  c:['What do leads cost?','Talk to a human'] },

{ id:'thanks', k:['thanks','thank you','thx','appreciate it','cheers','got it','helpful'],
  a:"Anytime. If you want someone to look at your specific market, the free audit is the fastest way in — or just call "+PHONE+".",
  c:['Book my free audit','What do you charge?'] },

/* — pricing ——————————————————————————————————————— */
{ id:'pricing', k:['cost','price','pricing','charge','expensive','budget','afford','fee','rate','how much'],
  strong:['how much do you charge','what do you cost','your pricing','what does it cost'],
  not:['lead cost','leads cost','cost per lead','cpl','per lead'],
  a:"Campaigns run from about $50 a month up to several thousand, scoped to your market. No tier chart and no long-term contract — we quote what it takes to win where you operate.\n\nFor context: industry guidance in 2026 puts typical contractor SEO budgets at $2,500–$7,500/month. We deliberately go lower than that, because a one-truck painter with a good Google Business Profile can beat the guy down the road who has neither.\n\nHonest caveat: at $50/month you're buying profile and review work, not a paid search campaign. We'll tell you which one your goal actually needs.",
  c:['See pricing page','Book my free audit','What do leads cost?'] },

{ id:'cheap', k:['cheapest','cheap','lowest price','discount','deal','bargain','free work','do it free'],
  a:"Cheapest option is the $50/month tier, and I'd rather be straight about what that is: Google Business Profile work, review systems, a tight local footprint. It's genuinely effective for a single-town operator. It is not a paid campaign and won't fill a slow month by itself.\n\nIf price is the deciding factor, use the free tools on this site and never call us. That's a real option and it costs nothing.",
  c:['Free tools','See pricing page'] },

{ id:'contract', k:['contract','commitment','locked in','lock me in','cancel','month to month','term','agreement','quit'],
  a:"Everything is month to month. No long-term agreement.\n\nThe honest caveat: SEO compounds, so leaving at month two guarantees you get nothing from it. We tell you the realistic runway before you spend a dollar — usually four to eight months for competitive organic terms. If you need work faster than that, we start with paid search instead.",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'vip', k:['vip','membership','member','subscription','69.99','monthly membership'],
  a:"That's the Eye To Ad Media VIP Marketing Subscription — $69.99/month, cancel anytime. It works like a warehouse club: membership unlocks member pricing across everything, SEO through logo design, video, print, landing pages and NFC. Details are on eyetoad.com under VIP Marketing.",
  c:['What do you charge?','Talk to a human'] },

/* — cost per lead by trade ——————————————————————————— */
{ id:'cpl_roofing',
  strong:['roofing','roofer','shingle','storm damage','roof replacement'],
  k:['roof','storm','hail'],
  a:"Roofing is the most expensive trade we track on paid search. Non-branded Google Ads averages $124 per lead; branded terms — people searching your company name — drop to about $44. Local Services Ads run roughly $50–$130 depending on market.\n\nSource: "+SRC_ADS+".\n\nRoofing lives and dies on storm response speed and review velocity. If a hailstorm hits and you're not visible within 48 hours, the out-of-state crews take that neighborhood.",
  c:['Roofing marketing page','Run my break-even'] },

{ id:'cpl_hvac',
  strong:['hvac','heating','cooling','air conditioning','furnace','condenser'],
  k:['heat pump','ductwork','mini split'],
  a:"HVAC on Local Services Ads: about $51 per lead, 44% book rate, $2,110 average ticket, 9.55x return on ad spend — the strongest ROAS of any trade in the data. Non-branded Google Ads is much dearer at $149; branded is $34. Performance Max sits around $72.\n\nSource: "+SRC_LSA+" and "+SRC_ADS+".\n\nHVAC is brutally seasonal, so the real skill is budget pacing — spending hard in the two shoulder weeks before demand spikes rather than during.",
  c:['HVAC marketing page','Run my break-even'] },

{ id:'cpl_plumbing',
  strong:['plumber','plumbing','drain','sewer','water heater','burst pipe'],
  k:['plumb','pipe','burst','leak'],
  a:"Plumbing on Local Services Ads: about $57 per lead, 44.5% book rate, $1,714 average ticket, 6.85x ROAS. Drain and sewer runs $59. Non-branded Google Ads is $183 — the highest of any trade. Average CPC is $8.45, but emergency terms hit $25–$45 a click.\n\nSource: "+SRC_LSA+" and "+SRC_ADS+".\n\nPlumbing is emergency intent. Somebody with water on the floor calls whoever appears first and answers. Response time matters more than ad copy.",
  c:['Plumbing marketing page','Run my break-even'] },

{ id:'cpl_electrical',
  strong:['electrician','electrical','panel upgrade','ev charger','rewire'],
  k:['electric','panel','wiring'],
  a:"Electrical has the cheapest Local Services Ads leads we track — about $39 each. Panel upgrades and EV charger installs are the growth categories, and both are high-ticket searches with far less competition than HVAC or roofing.\n\nSource: "+SRC_LSA+".",
  c:['Electrical marketing page','Run my break-even'] },

{ id:'cpl_other',
  strong:['solar','fencing','painting','painter','remodel','remodeling','drywall',
          'general contractor','landscap','concrete','flooring','pool builder'],
  k:['pool','fence','deck','siding','gutter'],
  a:"Straight answer: there's no published trade-specific 2026 benchmark for that trade, and I'm not going to invent one. The blended home-services figure is about $53 per lead on Local Services Ads.\n\nWhat I can tell you is the shape of it. Long-cycle trades — solar, pools, big remodels — carry higher lead costs but much higher tickets, so the break-even ceiling is far higher too. Fast-close trades like fencing and painting run cheaper leads and thinner margins per job.\n\nRun your own numbers on the break-even worksheet; that beats any national average.",
  c:['Run my break-even','Book my free audit'] },

{ id:'cpl_general', k:['cpl','good cost per lead','pay per lead','average lead'],
  strong:['cost per lead','lead cost','leads cost','per lead','what do leads cost'],
  a:"Depends on trade and channel. Google Local Services Ads, 2026: electrical $39, HVAC $51, plumbing $57, drain and sewer $59 — blended about $53, with 43.9% of those leads booking. Non-branded Google Ads runs higher: roofing $124, HVAC $149, plumbing $183.\n\nSource: "+SRC_LSA+".\n\nBut the number that actually matters is your own break-even, and it's simple: profit per job × close rate. The worksheet on the homepage does it in three inputs.",
  c:['Run my break-even','Roofing lead costs','HVAC lead costs'] },

/* — channels ——————————————————————————————————————— */
{ id:'seo_time', k:['how long','how soon','timeline','when will','take to work','results take','fast','quick'],
  strong:['how long does seo take','when will i see results'],
  a:"Google Business Profile and map pack movement: 30–90 days. Competitive organic terms: four to eight months. Compounding lead flow: months six to twelve.\n\nAnyone promising page one in thirty days is selling you something.\n\nIf you need the phone ringing this month, we start with paid search or Local Services Ads and build organic underneath it. Paid moves in days.",
  c:['What do you charge?','Book my free audit'] },

{ id:'seo_what', k:['seo','search engine','rank','ranking','organic','google rank','first page'],
  not:['how long','ai search','chatgpt'],
  a:"Contractor SEO means ranking for searches that produce jobs, not searches that produce traffic. The distinction matters: \"roof replacement cost\" and \"emergency roof repair near me\" are two different customers with two different budgets, and they need different pages.\n\nThe work is technical health, service and location pages built on real intent, review velocity, and the structured data that makes you machine-readable. It compounds — month twelve costs less per lead than month three.",
  c:['Contractor SEO page','How long does SEO take?'] },

{ id:'lsa', k:['lsa','lsas','local services','google guaranteed','google verified','google screened',
     'pay per lead ads','local service ad'],
  a:"Local Services Ads sit above everything else on the page and you pay per lead rather than per click. For most home-services trades they're the single best-value channel — $53 blended, 43.9% book rate.\n\nTwo things most contractors miss. First, Google Guaranteed was renamed Google Verified in October 2025, so older guides use the wrong name. Second, you can dispute junk leads and get refunded — most contractors never file, which is precisely why their effective cost per lead is higher than the benchmark.",
  c:['Google Ads page','What do leads cost?'] },

{ id:'google_ads',
  strong:['google ads','adwords','paid search','performance max','pmax'],
  k:['ppc','cpc','click cost','search ads'],
  a:"Google Ads gets the phone ringing in days rather than months, which makes it the right first move when you have nothing built.\n\n2026 non-branded costs: roofing $124, HVAC $149, plumbing $183 per lead. Branded terms are far cheaper — roofing $44, HVAC $34 — which is the quiet argument for building a brand people search by name. Performance Max lands between: HVAC $72, plumbing $82.\n\nSource: "+SRC_ADS+".",
  c:['Google Ads page','What about LSAs?'] },

{ id:'facebook', k:['facebook','meta','instagram','social','social media','fb ads','retarget'],
  a:"Paid social works for contractors in specific situations, not as a default. It earns its place for seasonal pushes, storm response, financing offers, and remodeling work where the decision takes weeks.\n\nWhat it does best is retargeting — the homeowner who visited your site, didn't call, and needs to see you three more times. What it does badly is emergency demand. Nobody with a burst pipe is scrolling Instagram.",
  c:['Facebook ads page','What do leads cost?'] },

{ id:'local_seo', k:['map pack','google maps','gbp','business profile','google my business','gmb','local pack','near me'],
  a:"The map pack is where home-services jobs are actually won — it sits above the blue links on nearly every local search.\n\nWhat moves it: category selection (more contractors get this wrong than you'd think), review velocity rather than raw review count, service area pages with real content, and profile completeness. It's also the highest-leverage thing you can fix cheaply. A complete profile with steady reviews beats a beautiful website with neither.",
  c:['Local SEO page','Book my free audit'] },

{ id:'ai_search', k:['ai','chatgpt','gpt','perplexity','gemini','claude','ai search','aio','geo','llm','ai overview'],
  a:"Homeowners increasingly ask ChatGPT or Gemini to recommend a contractor instead of scrolling results. Research in 2026 estimates only about 1.2% of local businesses get surfaced in those answers — so the field is wide open, for now.\n\nTwo numbers worth knowing: ChatGPT drives roughly 77% of AI search traffic, and visitors arriving from AI convert at about 14.2% versus 2.8% from traditional search. Far fewer visitors, far better ones.\n\nThe work overlaps heavily with local SEO — structured data, entity consistency, quotable content — so it isn't a separate budget line.",
  c:['AI search page','Book my free audit'] },

/* — the Angi question ——————————————————————————————— */
{ id:'angi', k:['angi','angies','angie','thumbtack','homeadvisor','home advisor','porch','houzz','buy leads','lead marketplace','shared leads','yelp'],
  a:"Straight answer: marketplace leads fill a slow week. They never build anything.\n\nThe structural problem is that the same homeowner gets sold to several contractors at once, so the first call is a price fight before you've said a word about quality. Stop paying and the leads stop the same day. You end up with no ranking, no brand recall, no asset.\n\nMy actual advice — if you need work in the next two weeks and have nothing built, buy the leads. Cash flow beats theory. But start building the owned side in parallel, because a business whose entire pipeline lives on someone else's platform is one pricing change from a very bad quarter.",
  c:['Lead generation page','Book my free audit'] },

{ id:'exclusive', k:['exclusive','shared','my own leads','own the leads','belong to me','sold to others'],
  a:"Every lead we generate is yours alone. That's the whole difference between owning and renting.\n\nWhen a homeowner finds you through your own ranking or your own ad, you're the expert they sought out — not the fourth quote on a list. Same person, completely different conversation, and it shows up in your close rate before it shows up anywhere else.",
  c:['Lead generation page','Is Angi worth it?'] },

/* — objections ——————————————————————————————————— */
{ id:'guarantee', k:['guarantee','guaranteed','promise','assure','certain','number one','#1','top spot'],
  a:"No, and be careful with anyone who says otherwise. Nobody controls Google's ranking algorithm, so a page-one guarantee is either meaningless fine print or a promise on a keyword so obscure nobody searches it.\n\nWhat we do commit to: you'll know exactly which channel produced which customer, you can leave any month, and if we think your money is better spent on a second truck we'll say so. We've told people that before.",
  c:['How do you report?','Book my free audit'] },

{ id:'burned', k:['burned','scammed','ripped off','waste of money','last agency','previous company','didnt work','did not work','bad experience','fired'],
  a:"Heard that more times than I can count, and it's the reason AFC exists. Our founder ran a bath remodeling company from 2012, hired marketers the way most contractors do, and got back reports full of impressions and rankings. Nobody ever asked what his average job was worth or whether he closed anything.\n\nSo the first thing we ask is what a job is worth to you and what you close. If we can't build to a cost per lead that works against those numbers, we say so rather than selling you a package anyway.",
  c:['About AFC','Book my free audit'] },

{ id:'diy', k:['do it myself','myself','in house','my nephew','my son','learn it','on my own','diy'],
  a:"Honestly? For a single-town operator, a lot of it is doable. Claim and complete your Google Business Profile, ask every happy customer for a review, answer the phone fast. That's most of the local game and it costs nothing but discipline.\n\nThe free tools on this site are built for exactly that — no email wall, no unlock step. Where it gets hard is paid search, where you're bidding against people who do this full-time and a mistake costs real money weekly.",
  c:['Free tools','What do you charge?'] },

{ id:'too_busy', k:['too busy','no time','swamped','backed up','booked out','dont need','do not need leads','enough work'],
  a:"Then don't buy marketing right now — buy it about six weeks before you're not busy.\n\nThat's the actual play. SEO takes four to eight months to compound, so if you start when the phone goes quiet you're already four months late. Contractors who stay busy year-round are the ones who built during the good stretch.\n\nIf your slow season is January, September is when to start.",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'small', k:['one truck','small','just me','solo','starting out','new business','small operation','two guys'],
  a:"That's fine, and the $50/month tier exists for exactly that. Profile work, reviews, a tight local footprint — slow, cheap, and genuinely effective when you're working one town.\n\nWhat we'd be honest about: a one-truck operation usually shouldn't be buying paid search yet. Get the free channels working first. Come back for paid when you have crew capacity to absorb the volume.",
  c:['What do you charge?','Free tools'] },

{ id:'not_fit',
  strong:['good fit','right fit','a good match','are we a fit','right for me','take me on'],
  k:['good match','work with me','qualify','fit for'],
  a:"We're a strong fit if you want to grow rather than just fill next week, you roughly know your job value and close rate, and somebody answers the phone fast.\n\nWe're a poor fit if you want a page-one guarantee, if leads sit two days before anyone calls back, or if you're shopping purely on price. Marketing can't fix a voicemail box — that's the honest failure mode, and it's the most common one.",
  c:['Who we work with','Book my free audit'] },

/* — service & operations ————————————————————————————— */
{ id:'reporting', k:['report','reporting','track','tracking','attribution','measure','roi','prove','dashboard','analytics'],
  a:"Call tracking and conversion tracking go in before we spend a dollar on traffic, so every call and form is tagged to its source.\n\nMonthly you get ranking and map movement, calls and forms with attribution, traffic by channel and what it did, AI search visibility, and a plain-language note on what changed. No forty-page PDF.\n\nThe uncomfortable part of real attribution is that it sometimes shows the channel you love producing nothing. We'd rather hand you a true number with a caveat than a flattering one that's fiction.",
  c:['See results page','Book my free audit'] },

{ id:'process', k:['process','how does it work','what happens','steps','get started','start','onboard','first'],
  a:"Four steps. One: the audit — your site, profile, reviews, rankings, and the three competitors beating you in the map pack. You keep it whether you hire us or not.\n\nTwo: the numbers — your break-even cost per lead against what channels actually cost in your market.\n\nThree: build and launch — first thirty days is tracking, profile, conversion path, and whichever channel rings fastest for your trade.\n\nFour: report and scale — monthly, with attribution. Cut what isn't working.",
  c:['Book my free audit','How do you report?'] },

{ id:'audit', k:['audit','free audit','review my site','look at my website','check my site','analysis','assessment'],
  a:"Free, no contract, no card. We look at your website, your Google Business Profile, your review profile, and the competitors currently outranking you. Takes us about a day, and a real person calls you back — usually same day.\n\nYou keep the findings whether you hire us or not. Want me to take your details now?",
  c:['Book my free audit','Talk to a human'] },

{ id:'who_works', k:['who will work','account manager','my rep','the owner','founder','zach','team','junior'],
  a:"Zach works directly with clients, and the roster is deliberately kept small so that stays true. You'll know who's on your account and be able to reach them — which isn't the case at most agencies once the pitch is over.",
  c:['About AFC','Talk to a human'] },

{ id:'location', k:['where are you','location','based','denver','colorado','local to me','my area','my state','my city','nationwide','national'],
  a:"Denver, Colorado — but we work with contractors across the US and internationally. What matters is fit, not geography: whether we can realistically win in your market and whether the economics work for your business.\n\nWe've never needed to be in the same city as a client to rank them in it.",
  c:['Who we work with','Talk to a human'] },

{ id:'trades', k:['what trades','which trades','do you work with','industries','my trade','my industry','type of business'],
  a:"Roofing, plumbing, HVAC, electrical, solar, general contracting, painting, remodeling, pool building and fencing.\n\nEach gets its own strategy, because the customer behaves differently. A burst pipe is a five-minute decision at eleven at night. A pool build is a six-month conversation with a spouse. One playbook across every trade is why a lot of contractors think marketing doesn't work.\n\nOutside the trades, Eye To Ad Media handles dentists, law firms, med spas and more.",
  c:['Who we work with','What do leads cost?'] },

{ id:'website', k:['website','web site','build a site','new site','redesign','my site is old','wordpress','site speed','landing page'],
  a:"Your website is where every channel eventually sends people, so if it doesn't convert, everything upstream is wasted money.\n\nThe free Website Scorecard on this site runs 25 weighted checks — speed, conversion path, trust signals, local SEO, AI readiness — and gives you a letter grade plus a fix list sorted by what's free versus what's worth paying for. Start there before you pay anyone, including us.",
  c:['Score my website','Free tools'] },

{ id:'reviews', k:['review','reviews','stars','rating','google reviews','reputation','bad review'],
  a:"Review velocity — how steadily they arrive — matters more than raw count for map pack ranking, and it's also one of the strongest signals AI systems use when deciding who to recommend.\n\nThe practical version: ask every satisfied customer, same day, with a direct link. A contractor with 40 reviews earned steadily over a year outranks one with 120 collected in a single burst two years ago.",
  c:['Local SEO page','Book my free audit'] },

{ id:'tools', k:['tool','tools','free tool','calculator','worksheet','spreadsheet','tracker','plan builder','scorecard'],
  a:"Four, all free, none gated behind a form.\n\nBreak-Even Lead Cost Worksheet — three inputs, tells you the most you can pay for a lead.\nMarketing Plan Builder — seven questions, gives back a twelve-month plan.\nWebsite Scorecard — 25 checks, letter grade, prioritized fixes.\nLead & Job Tracker — spreadsheet with the formulas already written.\n\nUse them and never call us. That's genuinely fine.",
  c:['Free tools','Run my break-even'] },

{ id:'breakeven', k:['break even','breakeven','break-even','what can i afford','my ceiling','max per lead','worth paying'],
  a:"The formula: profit per job × close rate = the most you can pay for a lead.\n\nSay your average job is $8,500 at 30% margin, and you close one in four real leads. That's $2,550 profit per job × 25% = $638 per lead before you lose money on the first job — never mind the referrals and repeat work behind it.\n\nAgainst that ceiling, a $57 plumbing lead isn't expensive. It's a rounding error. The worksheet on the homepage runs it live against 2026 benchmarks.",
  c:['Run my break-even','What do leads cost?'] },

{ id:'seasonal',
  strong:['slow season','busy season','off season','winter','summer','seasonal','shoulder season'],
  k:['season','when to start','time of year','spring','fall'],
  a:"Budget pacing is where most seasonal trades leak money. The instinct is to spend hardest during peak demand — but that's when your competitors are bidding hardest too, so costs spike exactly when you're spending most.\n\nBetter: spend in the two or three weeks before demand arrives, when clicks are cheap and you're capturing people in the research phase. And start SEO about six months ahead of the season you want to own, because it won't arrive faster than that.",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'response_time',
  strong:['nobody answers','answers our phone','answer our phone','answer the phone',
          'missed calls','miss calls','response time','call them back','slow to respond'],
  k:['voicemail','follow up','after hours','leads go cold','no one answers'],
  a:"This is the one nobody wants to hear: the most common reason marketing \"doesn't work\" is response time, not the marketing.\n\nA lead that sits until tomorrow is usually gone — they called the next contractor. And with Google's agentic booking rolling out through 2026, in some categories the AI phones the business on the customer's behalf. If nobody picks up, it moves to the next provider. No ranking survives an unanswered phone.\n\nIf your intake is the leak, we'd rather help you fix that than sell you more traffic pouring into the same gap.",
  c:['Book my free audit','How do you report?'] },

/* — handoff ——————————————————————————————————————— */
{ id:'human', k:['human','person','real person','talk to someone','speak to','call you','phone','sales','rep','representative','contact'],
  a:"Call "+PHONE+" — a person answers, no phone tree. Or email "+MAILUSER+'@'+MAILHOST+".\n\nIf it's easier, leave your details here and someone calls you back, usually the same day.",
  c:['Book my free audit'] },

{ id:'email_addr', k:['email','e-mail','address','write to you','send you'],
  a:"We're at "+MAILUSER+'@'+MAILHOST+", or "+PHONE+" if you'd rather talk. Leaving your details here works too — it lands in the same inbox.",
  c:['Book my free audit','Talk to a human'] },

{ id:'hours',
  strong:['hours','what time','weekend','saturday','sunday','open on'],
  k:['open','when are you','available'],
  a:"Business hours are Monday to Friday, 8am to 6pm Mountain Time. Leave details outside those hours and you'll hear back the next business day.",
  c:['Book my free audit','Talk to a human'] },

{ id:'lead_start', k:['book','sign up','get started with you','yes','interested','lets do it','ready','send my info','callback','call me'],
  a:"Good. Three quick things and someone calls you back — usually same day.",
  c:[], action:'lead' }
];

/* ─────────────────────────────────────────────────────────────────────
   GUARDRAILS — checked before intent matching. Order matters.
   ───────────────────────────────────────────────────────────────────── */
var GUARDS = [
  { t:['legal advice','sue','lawsuit','lawyer','attorney','contract dispute','court','liability','osha'],
    a:"That's outside what I can help with — I'd be guessing, and guessing about legal exposure is worse than saying nothing. Talk to an attorney licensed in your state." },

  { t:['medical','injury','hurt','doctor','hospital','workers comp','injured'],
    a:"I can't help with that one, and you wouldn't want marketing software trying. If someone's hurt, that's a doctor and your insurance carrier." },

  { t:['guarantee my ranking','guarantee ranking','guaranteed ranking','guarantee results',
     'promise me','guarantee page one','guarantee first','guarantee top','guarantee me'],
    a:"I won't promise that, because nobody can. Google's algorithm isn't ours to control, and any agency guaranteeing a ranking is either using fine print or picking a keyword nobody searches. What we'll commit to is honest attribution and no lock-in." },

  { t:['black hat','trick google','game the system','fake review','buy review','buy me review',
     'purchase review','paid review','write reviews for me','spam','cloaking','pbn',
     'private blog network'],
    a:"We don't do that, and I'd push back on anyone offering it. Fake reviews violate Google's terms and get profiles suspended — that's a business-ending outcome for a contractor, not a slap on the wrist. Everything we build is designed to survive an algorithm update, which by definition rules that out." },

  { t:['sabotage','negative seo','report my competitor','take down their','hack their',
     'hurt my competitor','damage my competitor','fake reviews on','ddos','attack their site'],
    a:"Happy to talk about outranking a competitor — that's the job. Not going to help with anything aimed at damaging them. It's against Google's terms, and it tends to rebound on whoever tried it." },

  { t:['crypto','bitcoin','nft','forex','adult','gambling','casino','cbd','vape','firearm'],
    a:"That's outside our lane — we build for trade contractors and adjacent local service businesses. You'd want a specialist with actual experience in that category." },

  { t:['discrimin','only hire','no women','race','religion','immigrant','illegal worker'],
    a:"Not something I'll help with, and targeting like that violates advertising policy on every major platform besides being unlawful in most places." }
];

/* ─────────────────────────────────────────────────────────────────────
   LINK TARGETS for quick-reply chips
   ───────────────────────────────────────────────────────────────────── */
var CHIP_LINKS = {
  'See pricing page':        '/pricing/',
  'Free tools':              '/contractor-marketing-tools/',
  'Run my break-even':       '/#calculator',
  'Score my website':        '/contractor-website-scorecard/',
  'Roofing marketing page':  '/roofing-marketing/',
  'HVAC marketing page':     '/hvac-marketing/',
  'Plumbing marketing page': '/plumbing-marketing/',
  'Electrical marketing page':'/electrical-contractor-marketing/',
  'Contractor SEO page':     '/contractor-seo/',
  'Local SEO page':          '/local-seo-contractors/',
  'Google Ads page':         '/google-ads-contractors/',
  'Facebook ads page':       '/contractor-facebook-ads/',
  'AI search page':          '/ai-search-optimization-contractors/',
  'Lead generation page':    '/contractor-lead-generation/',
  'See results page':        '/results/',
  'Who we work with':        '/who-we-work-with/',
  'About AFC':               '/about/'
};

/* ─────────────────────────────────────────────────────────────────────
   MATCHER
   ───────────────────────────────────────────────────────────────────── */
function norm(s){
  return (' ' + String(s).toLowerCase()
    .replace(/[''`]/g,'')
    .replace(/[^a-z0-9\s]/g,' ')
    .replace(/\s+/g,' ') + ' ');
}
function has(hay, term){
  var t = ' ' + term.replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  /* Short terms must be whole words. Without this, 'yo' matches inside
     "you" and 'ac' inside "account", dragging unrelated questions into
     the wrong intent. Longer terms match at a word start, so 'plumb'
     still catches 'plumbing'. */
  if (t.length <= 4) return hay.indexOf(t + ' ') !== -1;
  return hay.indexOf(t) !== -1;
}
function guard(text){
  var t = norm(text);
  for (var i=0;i<GUARDS.length;i++){
    for (var j=0;j<GUARDS[i].t.length;j++){
      if (has(t, GUARDS[i].t[j])) return GUARDS[i].a;
    }
  }
  return null;
}
function match(text){
  var t = norm(text), best = null, bestScore = 0;
  for (var i=0;i<INTENTS.length;i++){
    var it = INTENTS[i], score = 0, dq = false, j;
    if (it.not){
      for (j=0;j<it.not.length;j++){ if (has(t,it.not[j])) { dq = true; break; } }
    }
    if (dq) continue;
    if (it.strong){
      for (j=0;j<it.strong.length;j++){ if (has(t,it.strong[j])) score += 2.5; }
    }
    for (j=0;j<it.k.length;j++){ if (has(t,it.k[j])) score += 1; }
    if (score > bestScore){ bestScore = score; best = it; }
  }
  return bestScore >= 1 ? best : null;
}
function fallback(){
  var extra = PAGE.ind ? " Since you're on the "+PAGE.label+" page, I can give you real 2026 lead costs for that trade." : '';
  return {
    a: "Not sure I caught that one." + extra + " Try me on lead costs, pricing, how long SEO takes, whether Angi is worth it, or how we report. Or call "+PHONE+" and skip me entirely — a person answers.",
    c: ['What do leads cost?','What do you charge?','Talk to a human']
  };
}
function opener(){
  var base = "Rivet here — AFC's estimator. ";
  if (PAGE.ind && CPL[PAGE.ind]){
    var d = CPL[PAGE.ind];
    var n = d.lsa ? "$"+d.lsa+" per lead on Local Services Ads" : "$"+d.ads+" per lead on non-branded Google Ads";
    return base + "You're reading about "+PAGE.label.toLowerCase()+", so here's the headline number: "+n+" in 2026. Ask me what that means against your own margins.";
  }
  if (PAGE.ind){
    return base + "You're on the "+PAGE.label+" page. Ask me about lead costs, budgets, or what actually moves the phone for that trade.";
  }
  return base + "Ask me what leads cost in your trade, what we charge, or whether Angi is worth it. I'll give you the real number — including when it's bad news.";
}

/* ─────────────────────────────────────────────────────────────────────
   LEAD CAPTURE
   ───────────────────────────────────────────────────────────────────── */
var LEAD_STEPS = [
  { key:'Name',    q:"What's your name?",                              v:function(x){ return x.trim().length >= 2; },
    e:"Need at least a first name." },
  { key:'Phone',   q:"Best number to reach you?",                      v:function(x){ var d=x.replace(/\D/g,''); return d.length>=10 && d.length<=15; },
    e:"That's not landing on ten digits — mind checking it?" },
  { key:'Trade',   q:"What trade are you in, and what's the biggest problem right now?", v:function(x){ return x.trim().length >= 3; },
    e:"Even a couple of words helps." }
];
var lead = { active:false, step:0, data:{}, sent:false };

function endpoint(ajax){
  return 'https://formsubmit.co/' + (ajax ? 'ajax/' : '') + MAILUSER + '@' + MAILHOST;
}
function payload(partial){
  var d = {
    Name:    lead.data.Name    || '(not given)',
    Phone:   lead.data.Phone   || '(not given)',
    Trade:   lead.data.Trade   || '(not given)',
    Source:  'RIVET chatbot — ' + (PAGE.label || path),
    PageURL: location.href,
    _subject: (partial ? 'AFC RIVET partial lead — ' : 'AFC RIVET lead — ') + (PAGE.label || path),
    _template: 'table',
    _captcha: 'false',
    _honey: ''
  };
  if (partial) d.Note = 'Visitor started the chat form but did not finish. Partial details only.';
  return d;
}
function params(o){
  var out=[],k;
  for (k in o){ if (Object.prototype.hasOwnProperty.call(o,k))
    out.push(encodeURIComponent(k)+'='+encodeURIComponent(o[k]==null?'':String(o[k]))); }
  return out.join('&');
}
function iframePost(data, done){
  var settled=false;
  function fin(s){ if(settled) return; settled=true; if(done) done(s); }
  var nm='rivet-sink-'+Date.now();
  var ifr=document.createElement('iframe');
  ifr.name=nm; ifr.setAttribute('aria-hidden','true');
  ifr.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;border:0';
  ifr.addEventListener('load', function(){ fin('unconfirmed'); });
  document.body.appendChild(ifr);
  var f=document.createElement('form');
  f.method='POST'; f.action=endpoint(false); f.target=nm;
  f.style.display='none'; f.setAttribute('accept-charset','UTF-8');
  for (var k in data){
    if(!Object.prototype.hasOwnProperty.call(data,k)) continue;
    var i=document.createElement('input');
    i.type='hidden'; i.name=k; i.value=data[k]==null?'':String(data[k]);
    f.appendChild(i);
  }
  document.body.appendChild(f);
  setTimeout(function(){ fin('unconfirmed'); }, 12000);
  try { f.submit(); } catch(e){ fin('failed'); }
}
function send(data, done){
  var settled=false;
  function fin(s){ if(settled) return; settled=true; done(s); }
  if (typeof fetch !== 'function'){ iframePost(data, fin); return; }
  fetch(endpoint(true), {
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: params(data)
  }).then(function(r){ return r.ok ? r.json().catch(function(){return null;}) : null; })
    .then(function(j){
      if (j && String(j.success) === 'true') fin('confirmed');
      else iframePost(data, fin);
    })
    .catch(function(){ iframePost(data, fin); });
  setTimeout(function(){ if(!settled) iframePost(data, fin); }, 9000);
}
/* Partial flush: if they gave a usable phone and then left, that's still a
   lead worth having. Fires once, only when we have something real. */
function flushPartial(){
  if (lead.sent || !lead.active) return;
  if (!lead.data.Phone) return;
  lead.sent = true;
  var d = payload(true);
  try {
    if (navigator.sendBeacon){
      navigator.sendBeacon(endpoint(false),
        new Blob([params(d)], {type:'application/x-www-form-urlencoded'}));
    } else { iframePost(d, null); }
  } catch(e){ /* nothing useful to do here */ }
}
window.addEventListener('pagehide', flushPartial);

/* ─────────────────────────────────────────────────────────────────────
   UI
   ───────────────────────────────────────────────────────────────────── */
var CSS = [
'.rvt,.rvt *{box-sizing:border-box}',
'.rvt-fab{position:fixed;right:20px;bottom:20px;z-index:9990;width:66px;height:66px;',
'border-radius:50%;background:#A6CE39;border:3px solid #0D1117;cursor:pointer;',
'box-shadow:0 10px 30px rgba(13,17,23,.34);display:flex;align-items:center;',
'justify-content:center;padding:0;transition:transform .18s,box-shadow .18s}',
'.rvt-fab:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 16px 38px rgba(13,17,23,.42)}',
'.rvt-fab:focus-visible{outline:3px solid #0D1117;outline-offset:3px}',
'.rvt-fab svg{width:40px;height:40px;display:block}',
'.rvt-dot{position:absolute;top:-3px;right:-3px;width:17px;height:17px;border-radius:50%;',
'background:#B4763C;border:2.5px solid #fff}',
'.rvt-nudge{position:fixed;right:96px;bottom:34px;z-index:9989;background:#0D1117;color:#fff;',
'padding:11px 15px;border-radius:9px;max-width:216px;font:500 13.5px/1.5 Inter,system-ui,sans-serif;',
'box-shadow:0 10px 30px rgba(13,17,23,.3)}',
'.rvt-nudge::after{content:"";position:absolute;right:-7px;bottom:17px;width:0;height:0;',
'border-left:8px solid #0D1117;border-top:7px solid transparent;border-bottom:7px solid transparent}',
'.rvt-nudge b{color:#C9F04B}',
'.rvt-nudge button{position:absolute;top:-8px;left:-8px;width:22px;height:22px;border-radius:50%;',
'border:none;background:#5C6672;color:#fff;font-size:13px;line-height:1;cursor:pointer;padding:0}',
'.rvt-panel{position:fixed;right:20px;bottom:96px;z-index:9991;width:382px;max-width:calc(100vw - 32px);',
'height:592px;max-height:calc(100vh - 128px);background:#fff;border-radius:13px;',
'box-shadow:0 26px 74px rgba(13,17,23,.4);display:none;flex-direction:column;overflow:hidden;',
'border:1px solid rgba(13,17,23,.1)}',
'.rvt-panel.open{display:flex}',
'.rvt-hd{background:#0D1117;color:#fff;padding:13px 15px;display:flex;align-items:center;gap:11px;flex-shrink:0}',
'.rvt-hd-ic{width:41px;height:41px;flex-shrink:0}',
'.rvt-hd-t{font:800 18px/1.1 "Barlow Condensed",Impact,sans-serif;letter-spacing:.05em;text-transform:uppercase}',
'.rvt-hd-s{font:400 11px/1.4 "IBM Plex Mono",monospace;color:#A6CE39;letter-spacing:.07em}',
'.rvt-x{margin-left:auto;background:none;border:none;color:#8A939E;font-size:22px;cursor:pointer;',
'padding:4px 7px;line-height:1;border-radius:4px}',
'.rvt-x:hover{color:#fff;background:rgba(255,255,255,.1)}',
'.rvt-log{flex:1;overflow-y:auto;padding:15px;background:#F4F4F1;display:flex;flex-direction:column;gap:11px}',
'.rvt-m{max-width:88%;padding:11px 14px;border-radius:12px;font:400 14.5px/1.62 Inter,system-ui,sans-serif;',
'white-space:pre-wrap;word-wrap:break-word;overflow-wrap:anywhere}',
'.rvt-b{align-self:flex-start;background:#fff;color:#232A33;border:1px solid #DDDDD6;border-bottom-left-radius:4px}',
'.rvt-u{align-self:flex-end;background:#0D1117;color:#fff;border-bottom-right-radius:4px}',
'.rvt-b a{color:#5B7A0F;font-weight:600}',
'.rvt-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 15px 11px;background:#F4F4F1;flex-shrink:0}',
'.rvt-chip{background:#fff;border:1.5px solid #A6CE39;color:#0D1117;border-radius:99px;',
'padding:7px 13px;font:600 12.5px/1 Inter,system-ui,sans-serif;cursor:pointer;transition:background .14s}',
'.rvt-chip:hover{background:#A6CE39}',
'.rvt-typing{align-self:flex-start;display:flex;gap:4px;padding:13px 15px;background:#fff;',
'border:1px solid #DDDDD6;border-radius:12px;border-bottom-left-radius:4px}',
'.rvt-typing i{width:7px;height:7px;border-radius:50%;background:#8A939E;animation:rvtB 1.3s infinite}',
'.rvt-typing i:nth-child(2){animation-delay:.18s}.rvt-typing i:nth-child(3){animation-delay:.36s}',
'@keyframes rvtB{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}',
'.rvt-ft{border-top:1px solid #DDDDD6;background:#fff;padding:11px;flex-shrink:0}',
'.rvt-row{display:flex;gap:8px}',
'.rvt-in{flex:1;border:2px solid #DDDDD6;border-radius:7px;padding:11px 13px;',
'font:400 14.5px Inter,system-ui,sans-serif;color:#0D1117;min-width:0}',
'.rvt-in:focus{outline:none;border-color:#A6CE39}',
'.rvt-go{background:#A6CE39;border:none;border-radius:7px;width:46px;cursor:pointer;',
'display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.rvt-go:hover{background:#C9F04B}',
'.rvt-go:disabled{opacity:.45;cursor:default}',
'.rvt-go svg{width:19px;height:19px}',
'.rvt-legal{font:400 10.5px/1.5 "IBM Plex Mono",monospace;color:#8A939E;margin-top:8px;text-align:center}',
'.rvt-legal a{color:#5C6672}',
'@media(max-width:560px){',
'.rvt-panel{right:8px;left:8px;bottom:88px;width:auto;height:calc(100vh - 108px)}',
'.rvt-fab{width:58px;height:58px;right:15px;bottom:15px}.rvt-fab svg{width:34px;height:34px}',
'.rvt-nudge{display:none}}',
'@media(prefers-reduced-motion:reduce){.rvt-typing i{animation:none}.rvt-fab{transition:none}}'
].join('');

/* Yellow hard hat mascot — inline SVG so it scales sharp and costs no request */
function hat(scale){
  return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
    + '<ellipse cx="32" cy="45" rx="27" ry="6.5" fill="#0D1117" opacity=".14"/>'
    + '<path d="M6 44c0-3 2-5 5-5h42c3 0 5 2 5 5v1c0 1.4-1.2 2.5-2.6 2.5H8.6C7.2 47.5 6 46.4 6 45z" fill="#F5B722"/>'
    + '<path d="M12 39c0-12 9-21 20-21s20 9 20 21z" fill="#FBCB3E"/>'
    + '<path d="M27 19.5c0-1.7 2.2-3 5-3s5 1.3 5 3v19.5H27z" fill="#F5B722"/>'
    + '<path d="M31 18h2v21h-2z" fill="#E5A417"/>'
    + '<path d="M18 39c0-9 3-16 6-19-5 3-9 10-9 19z" fill="#FFDD7A"/>'
    + '<rect x="14" y="39" width="36" height="3" rx="1.5" fill="#A6CE39"/>'
    + '<circle cx="24" cy="30" r="2.6" fill="#0D1117"/>'
    + '<circle cx="40" cy="30" r="2.6" fill="#0D1117"/>'
    + '<circle cx="24.9" cy="29.2" r=".9" fill="#fff"/>'
    + '<circle cx="40.9" cy="29.2" r=".9" fill="#fff"/>'
    + '<path d="M26 35.5c1.8 1.6 4.2 2.4 6 2.4s4.2-.8 6-2.4" stroke="#0D1117" stroke-width="2"'
    + ' stroke-linecap="round" fill="none"/></svg>';
}

var style = document.createElement('style');
style.setAttribute('data-rivet','');
style.textContent = CSS;
document.head.appendChild(style);

var root = document.createElement('div');
root.className = 'rvt';
root.innerHTML =
  '<button class="rvt-fab" id="rvtFab" type="button" aria-expanded="false" aria-controls="rvtPanel"'
+ ' aria-label="Open Rivet, the AFC chat assistant">' + hat() + '<span class="rvt-dot"></span></button>'
+ '<div class="rvt-panel" id="rvtPanel" role="dialog" aria-modal="false" aria-label="Rivet chat assistant">'
+ '  <div class="rvt-hd"><span class="rvt-hd-ic">'+hat()+'</span>'
+ '    <span><span class="rvt-hd-t">Rivet</span><br><span class="rvt-hd-s">AFC &middot; Estimator</span></span>'
+ '    <button class="rvt-x" id="rvtX" type="button" aria-label="Close chat">&times;</button></div>'
+ '  <div class="rvt-log" id="rvtLog" role="log" aria-live="polite" aria-atomic="false"></div>'
+ '  <div class="rvt-chips" id="rvtChips"></div>'
+ '  <div class="rvt-ft"><div class="rvt-row">'
+ '    <label class="rvt-sr" for="rvtIn" style="position:absolute;left:-9999px">Message Rivet</label>'
+ '    <input class="rvt-in" id="rvtIn" type="text" autocomplete="off" maxlength="500"'
+ '      placeholder="Ask about lead costs, pricing, timelines\u2026">'
+ '    <button class="rvt-go" id="rvtGo" type="button" aria-label="Send message">'
+ '      <svg viewBox="0 0 24 24" fill="none" stroke="#0D1117" stroke-width="2.6" stroke-linecap="round"'
+ '        stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button>'
+ '  </div><div class="rvt-legal">Rivet is automated and can be wrong. '
+ '    <a href="'+PHONE_HREF+'">Call '+PHONE+'</a> for a person.</div></div></div>';
document.body.appendChild(root);

var fab   = document.getElementById('rvtFab'),
    panel = document.getElementById('rvtPanel'),
    log   = document.getElementById('rvtLog'),
    chips = document.getElementById('rvtChips'),
    input = document.getElementById('rvtIn'),
    go    = document.getElementById('rvtGo'),
    xBtn  = document.getElementById('rvtX');

var opened = false;
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function linkify(s){
  return esc(s)
    .replace(/\b(1-800-481-8638)\b/g, '<a href="'+PHONE_HREF+'">$1</a>')
    .replace(/\b([a-z]+@[a-z]+\.com)\b/g, '<a href="mailto:$1">$1</a>');
}
function bubble(text, who){
  var d = document.createElement('div');
  d.className = 'rvt-m ' + (who === 'u' ? 'rvt-u' : 'rvt-b');
  d.innerHTML = who === 'u' ? esc(text) : linkify(text);
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}
function typing(){
  var d = document.createElement('div');
  d.className = 'rvt-typing';
  d.innerHTML = '<i></i><i></i><i></i>';
  log.appendChild(d);
  log.scrollTop = log.scrollHeight;
  return d;
}
function setChips(list){
  chips.innerHTML = '';
  if (!list || !list.length) return;
  for (var i=0;i<list.length;i++){
    (function(label){
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rvt-chip'; b.textContent = label;
      b.addEventListener('click', function(){
        if (CHIP_LINKS[label]){ location.href = CHIP_LINKS[label]; return; }
        send_user(label);
      });
      chips.appendChild(b);
    })(list[i]);
  }
}
function say(text, chipList, delay){
  var t = typing();
  setTimeout(function(){
    if (t.parentNode) t.parentNode.removeChild(t);
    bubble(text, 'b');
    setChips(chipList);
  }, reduce ? 60 : (delay || Math.min(1050, 340 + text.length * 3.4)));
}

/* — lead flow ————————————————————————————————————— */
function askLead(){
  setChips([]);
  say(LEAD_STEPS[lead.step].q, []);
}
function handleLead(text){
  var step = LEAD_STEPS[lead.step];
  if (!step.v(text)){ say(step.e, []); return; }
  lead.data[step.key] = text.trim();
  lead.step++;
  if (lead.step < LEAD_STEPS.length){ askLead(); return; }

  say("Sending that over\u2026", []);
  send(payload(false), function(state){
    lead.sent = true;
    lead.active = false;
    if (state === 'confirmed'){
      say("Confirmed on our end. Someone will call you back within one business day, usually sooner. If you'd rather not wait, "+PHONE+" gets you a person now.",
          ['Free tools','What do leads cost?']);
    } else if (state === 'unconfirmed'){
      say("Sent \u2014 with one honest caveat. Your details went through but no delivery receipt came back, so I can't confirm it landed. If you haven't heard from us within one business day, please call "+PHONE+" rather than waiting on us.",
          ['Free tools']);
    } else {
      say("That didn't send, and I'd rather tell you than let it disappear. Please call "+PHONE+" or email "+MAILUSER+'@'+MAILHOST+" directly.",
          ['Free tools']);
    }
  });
}

/* — main turn ——————————————————————————————————— */
function send_user(text){
  text = String(text || '').trim();
  if (!text) return;
  bubble(text, 'u');
  input.value = '';
  setChips([]);

  if (lead.active){ handleLead(text); return; }

  var g = guard(text);
  if (g){ say(g, ['Talk to a human','What do leads cost?']); return; }

  var hit = match(text);
  if (!hit){ var f = fallback(); say(f.a, f.c); return; }

  if (hit.action === 'lead'){
    lead.active = true; lead.step = 0; lead.data = {};
    say(hit.a, []);
    setTimeout(askLead, reduce ? 120 : 1000);
    return;
  }
  say(hit.a, hit.c);
}

function openPanel(){
  panel.classList.add('open');
  fab.setAttribute('aria-expanded','true');
  var n = document.getElementById('rvtNudge');
  if (n && n.parentNode) n.parentNode.removeChild(n);
  var dot = fab.querySelector('.rvt-dot');
  if (dot) dot.style.display = 'none';
  if (!opened){
    opened = true;
    say(opener(), ['What do leads cost?','What do you charge?','Is Angi worth it?'], reduce ? 60 : 520);
  }
  setTimeout(function(){ input.focus(); }, 90);
}
function closePanel(){
  panel.classList.remove('open');
  fab.setAttribute('aria-expanded','false');
  fab.focus();
}

fab.addEventListener('click', function(){
  panel.classList.contains('open') ? closePanel() : openPanel();
});
xBtn.addEventListener('click', closePanel);
go.addEventListener('click', function(){ send_user(input.value); });
input.addEventListener('keydown', function(e){
  if (e.key === 'Enter'){ e.preventDefault(); send_user(input.value); }
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
});

/* Nudge after a pause — once per page view, desktop only, dismissible */
setTimeout(function(){
  if (opened || window.innerWidth < 560) return;
  var n = document.createElement('div');
  n.className = 'rvt-nudge'; n.id = 'rvtNudge';
  n.innerHTML = 'Want to know what leads <b>actually cost</b> in your trade? Ask me.'
    + '<button type="button" aria-label="Dismiss">&times;</button>';
  n.addEventListener('click', function(e){
    if (e.target.tagName === 'BUTTON'){ n.parentNode.removeChild(n); return; }
    openPanel();
  });
  root.appendChild(n);
  setTimeout(function(){ if (n.parentNode && !opened) n.parentNode.removeChild(n); }, 14000);
}, 9000);

})();
