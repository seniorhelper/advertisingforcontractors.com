/* ═══════════════════════════════════════════════════════════════════════
   RIVET v2 — Advertising For Contractors
   Shared chat assistant + in-chat estimator. One file, every page.

   Usage: <script src="/js/rivet.js" defer></script> before </body>.
   No dependencies. No cookies, no localStorage, no tracking — state lives
   in memory for the session only, which keeps it clear of consent banners.

   WHAT'S NEW IN v2
     - Mascot: full hard-hat character with safety glasses, hi-vis vest,
       tape-measure arms and boots. Idle bob, wave, blink, lens glint.
     - Knowledge base roughly tripled: ~75 intents covering every trade,
       every channel, ownership, recruiting, financing, commercial work,
       and the eleven objections that actually kill contractor deals.
     - Closing engine: rotating trial closes, buying-signal detection,
       objection → reframe → ask structure, escalating CTAs by turn count.
     - In-chat break-even estimator. Three questions, live math against
       2026 benchmarks, then the ask. Results ride along on the lead email.
     - Lead emails now carry the transcript and the visitor's own numbers,
       so the callback starts warm instead of cold.
     - Still honest: confirmed / unconfirmed / failed send states, partial
       lead flush on pagehide, no invented statistics.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

if (window.__RIVET_LOADED__) return;
window.__RIVET_LOADED__ = true;

var PHONE      = '1-800-481-8638';
var PHONE_HREF = 'tel:18004818638';
var MAILUSER   = 'info';
var MAILHOST   = 'eyetoad' + '.' + 'com';
var MAIL       = MAILUSER + '@' + MAILHOST;

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
   BENCHMARK DATA — every figure carries its source. Nothing is invented:
   where no published trade figure exists, Rivet says so out loud.
   ───────────────────────────────────────────────────────────────────── */
var SRC_LSA = 'SearchLight Digital, February 2026 — $6.72M tracked across 888 contractors';
var SRC_ADS = 'SearchLight Digital, January 2026 — $14.9M tracked across 816 contractors';

var CPL = {
  electrical: { name:'electrical', lsa: 39 },
  hvac:       { name:'HVAC',       lsa: 51,  ads: 149, ticket: 2110, book: 44,   roas: 9.55 },
  plumbing:   { name:'plumbing',   lsa: 57,  ads: 183, ticket: 1714, book: 44.5, roas: 6.85, cpc: 8.45 },
  drain:      { name:'drain & sewer', lsa: 59 },
  roofing:    { name:'roofing',    ads: 124, lsaLow: 50, lsaHigh: 130 }
};
var BLENDED = 53; /* blended home-services LSA cost per lead, 2026 */

/* Trades with no published 2026 benchmark. Rivet quotes the blended
   figure and the shape of the economics rather than making one up. */
var SHAPE = {
  solar:      'long sales cycle, high ticket, heavy comparison shopping',
  pool:       'six-month decision, very high ticket, seasonal inquiry spikes',
  remodeling: 'weeks-long decision, high ticket, design and trust driven',
  painting:   'fast close, thinner margin per job, volume game',
  fencing:    'fast close, mid ticket, storm and property-line driven',
  general:    'referral-heavy, long cycle, reputation does the selling'
};

/* ─────────────────────────────────────────────────────────────────────
   SESSION CONTEXT — drives personalization and the closing cadence
   ───────────────────────────────────────────────────────────────────── */
var ctx = {
  turns: 0,          /* substantive answers given */
  trade: PAGE.ind,   /* remembered trade, from page or from conversation */
  lastClose: -9,     /* turn index of the last trial close */
  closeIdx: 0,
  fallbacks: 0,
  history: [],       /* {who,text} — rides along on the lead email */
  started: Date.now(),
  calc: null,        /* break-even results once run */
  asked: {}          /* intents already answered, so we vary the close */
};

/* Rotating trial closes. Appended to answers once the visitor is engaged,
   never twice in a row, never inside the lead or estimator flows. */
var CLOSES = [
  "Want me to run your break-even? Three questions and you'll know the most you can pay for a lead.",
  "Want a person to look at your actual market? The audit's free and you keep it either way.",
  "If you'd rather skip me, " + PHONE + " gets you a human on the first ring.",
  "Want me to take your details and have someone call you back today?",
  "Worth knowing where you stand before you spend anything — want the free audit?"
];

/* ─────────────────────────────────────────────────────────────────────
   INTENTS
   Matching is weighted: `k` terms score 1, `strong` terms score 2.5,
   any `not` term disqualifies outright. Highest total wins; ties break
   toward the earlier entry, so put specific intents above general ones.

   Fields:
     a       string, or function returning a string (for trade-aware copy)
     c       quick-reply chips
     trade   sets ctx.trade when this intent fires
     noclose true = never append a trial close (greetings, handoffs)
     action  'lead' | 'calc' — hands off to a guided flow
   ───────────────────────────────────────────────────────────────────── */
var INTENTS = [

/* — greeting & meta ————————————————————————————————— */
{ id:'greeting', k:['hi','hey','hello','howdy','yo','morning','afternoon','good morning','sup'],
  noclose:true,
  a:"Hey — Rivet here, AFC's estimator. Ask me anything about getting your phone ringing: what leads cost in your trade, whether Angi is worth it, how long SEO takes, what we charge. I'll give you the real number, including when it's bad news.",
  c:['What do leads cost?','Run my break-even','What do you charge?'] },

{ id:'who_are_you', k:['who are you','what are you','are you a bot','are you human','your name','rivet','are you ai'],
  noclose:true,
  a:"I'm Rivet — software, not a person, and worth saying plainly so you know what you're talking to. I run on real 2026 contractor benchmark data and I can do live math on your numbers. What I can't do is sign anything or bend the truth to win you over. When you want a human, "+PHONE+" gets one.",
  c:['What do leads cost?','Run my break-even','Talk to a human'] },

{ id:'thanks', k:['thanks','thank you','thx','appreciate it','cheers','got it','helpful','nice one'],
  noclose:true,
  a:"Anytime. If you want someone to look at your specific market, the free audit is the fastest way in — or just call "+PHONE+".",
  c:['Book my free audit','Run my break-even'] },

{ id:'bye', k:['bye','goodbye','later','see ya','im done','that is all','nothing else','no thanks'],
  noclose:true,
  a:"Fair enough. The free tools stay free and there's no email wall on any of them, so use what's useful. If it ever gets to the point where you want a second opinion on your market, "+PHONE+".",
  c:['Free tools'] },

{ id:'menu', k:['help','what can you do','options','menu','topics','what do you know','questions'],
  noclose:true,
  a:"Things I'm actually good at:\n\n• Real 2026 lead costs by trade — LSAs, Google Ads, Performance Max\n• Your break-even per lead, calculated live from three numbers\n• Whether Angi, Thumbtack or HomeAdvisor are worth it\n• How long SEO takes and when paid search is the smarter first move\n• What we charge, what's included, and where we're the wrong call\n\nPick one or just type the question.",
  c:['Run my break-even','What do leads cost?','What do you charge?'] },

{ id:'joke', k:['joke','funny','make me laugh','tell me something funny'],
  noclose:true,
  a:function(){
    var j = [
      "A contractor's three-week estimate and a marketer's \"page one soon\" are the same lie in different boots. I'm trying to be neither.",
      "Why do hard hats never get promoted? Too much overhead.\n\nI'll see myself out. Ask me something with numbers in it — I'm better at those.",
      "The most honest quote in this industry is \"it depends,\" which is why I'd rather just run your break-even and give you a real ceiling."
    ];
    return j[Math.floor(Math.random()*j.length)];
  },
  c:['Run my break-even','What do leads cost?'] },

/* — pricing ——————————————————————————————————————— */
{ id:'pricing', k:['cost','price','pricing','charge','expensive','budget','afford','fee','rate','how much','retainer'],
  strong:['how much do you charge','what do you cost','your pricing','what does it cost','what do you charge'],
  not:['lead cost','leads cost','cost per lead','cpl','per lead','cost per click'],
  a:"Campaigns run from about $50 a month up to several thousand, scoped to your market. No tier chart and no long-term contract — we quote what it takes to win where you operate.\n\nFor context: industry guidance in 2026 puts typical contractor SEO budgets at $2,500–$7,500/month. We deliberately go lower than that, because a one-truck painter with a good Google Business Profile can beat the guy down the road who has neither.\n\nHonest caveat: at $50/month you're buying profile and review work, not a paid search campaign. We'll tell you which one your goal actually needs.",
  c:['See pricing page','What is included?','Run my break-even'] },

{ id:'included', k:['what is included','whats included','what do i get','deliverables','included in that','what comes with'],
  a:"Depends on the scope, but every engagement starts with the same non-negotiables: call tracking and conversion tracking before we spend a dollar on traffic, Google Business Profile cleanup, and a conversion path on your site that doesn't leak.\n\nFrom there it's whichever channel rings fastest for your trade — LSAs, paid search, or organic underneath both. Monthly you get rankings and map movement, calls and forms with attribution, AI search visibility, and a plain-language note on what changed.\n\nWhat you never get: a forty-page PDF designed to look like work.",
  c:['How do you report?','See pricing page'] },

{ id:'setup_fee', k:['setup fee','set up fee','onboarding fee','upfront','deposit','first month','startup cost'],
  a:"Ask us on the call and get it in writing before you agree to anything — that's the right habit with any agency, not just this one.\n\nWhat I can tell you is the shape: the first thirty days is the heaviest lift on our side, because tracking, profile work and conversion path all get built before traffic arrives. If someone quotes you a big build fee with no tracking in it, that's the part to push back on.",
  c:['Talk to a human','What do you charge?'] },

{ id:'cheap', k:['cheapest','cheap','lowest price','discount','deal','bargain','free work','do it free','broke','no money'],
  a:"Cheapest option is the $50/month tier, and I'd rather be straight about what that is: Google Business Profile work, review systems, a tight local footprint. Genuinely effective for a single-town operator. It is not a paid campaign and won't fill a slow month by itself.\n\nIf price is the deciding factor, use the free tools on this site and never call us. That's a real option and it costs nothing.",
  c:['Free tools','See pricing page'] },

{ id:'contract', k:['contract','commitment','locked in','lock me in','cancel','month to month','term','agreement','quit','get out'],
  a:"Everything is month to month. No long-term agreement.\n\nThe honest caveat: SEO compounds, so leaving at month two guarantees you get nothing from it. We tell you the realistic runway before you spend a dollar — usually four to eight months for competitive organic terms. If you need work faster than that, we start with paid search instead.",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'catch', k:['whats the catch','what is the catch','too good','sounds too good','gimmick','fine print','hidden fee'],
  a:"The catch is that no contract cuts both ways: we have to earn the month, every month, and you can leave the second we stop earning it. That's a harder business to run than a twelve-month lock-in. It's also the only version I'd sign up for myself.\n\nThe other catch is the one most people don't like hearing — if your intake is broken, we'll tell you to fix that before you buy traffic. That conversation loses us deals regularly.",
  c:['Book my free audit','What do you charge?'] },

{ id:'vip', k:['vip','membership','member','subscription','69.99','monthly membership'],
  a:"That's the Eye To Ad Media VIP Marketing Subscription — $69.99/month, cancel anytime. It works like a warehouse club: membership unlocks member pricing across everything, SEO through logo design, video, print, landing pages and NFC. Details are on eyetoad.com under VIP Marketing.",
  c:['What do you charge?','Talk to a human'] },

{ id:'roi_question', k:['worth it','worth the money','return','payback','will it pay','justify','make my money back'],
  strong:['is it worth it','will it pay for itself'],
  a:function(){
    var t = ctx.trade && CPL[ctx.trade] ? CPL[ctx.trade] : null;
    var line = t && t.roas ? "\n\nFor reference, "+t.name+" on Local Services Ads returned "+t.roas+"x on ad spend in the 2026 data — but that's an average across "+"hundreds of contractors, not a promise about you." : "";
    return "The only honest answer runs through your own numbers, so let's use them instead of mine.\n\nProfit per job × close rate = the most you can pay for a lead. If that ceiling sits well above what leads cost in your trade, marketing is arithmetic. If it sits below, no agency on earth can fix that and you should hear it now."+line+"\n\nThree questions and I'll do the math live.";
  },
  c:['Run my break-even','What do leads cost?'] },

/* — cost per lead by trade ——————————————————————————— */
{ id:'cpl_roofing', trade:'roofing',
  strong:['roofing','roofer','shingle','storm damage','roof replacement'],
  k:['roof','storm','hail'],
  a:"Roofing is the most expensive trade we track on paid search. Non-branded Google Ads averages $124 per lead; branded terms — people searching your company name — drop to about $44. Local Services Ads run roughly $50–$130 depending on market.\n\nSource: "+SRC_ADS+".\n\nRoofing lives and dies on storm response speed and review velocity. If hail hits and you're not visible within 48 hours, the out-of-state crews take that neighborhood. The contractors who win storms are the ones who were already ranking in August.",
  c:['Roofing marketing page','Run my break-even'] },

{ id:'cpl_hvac', trade:'hvac',
  strong:['hvac','heating','cooling','air conditioning','furnace','condenser'],
  k:['heat pump','ductwork','mini split','ac unit'],
  a:"HVAC on Local Services Ads: about $51 per lead, 44% book rate, $2,110 average ticket, 9.55x return on ad spend — the strongest ROAS of any trade in the data. Non-branded Google Ads is much dearer at $149; branded is $34. Performance Max sits around $72.\n\nSource: "+SRC_LSA+" and "+SRC_ADS+".\n\nHVAC is brutally seasonal, so the real skill is budget pacing — spending hard in the two shoulder weeks before demand spikes rather than during, when every competitor is bidding at once.",
  c:['HVAC marketing page','Run my break-even'] },

{ id:'cpl_plumbing', trade:'plumbing',
  strong:['plumber','plumbing','drain','sewer','water heater','burst pipe'],
  k:['plumb','pipe','burst','leak','clog','repipe'],
  a:"Plumbing on Local Services Ads: about $57 per lead, 44.5% book rate, $1,714 average ticket, 6.85x ROAS. Drain and sewer runs $59. Non-branded Google Ads is $183 — the highest of any trade. Average CPC is $8.45, but emergency terms hit $25–$45 a click.\n\nSource: "+SRC_LSA+" and "+SRC_ADS+".\n\nPlumbing is emergency intent. Somebody with water on the floor calls whoever appears first and answers. Response time beats ad copy every time.",
  c:['Plumbing marketing page','Run my break-even'] },

{ id:'cpl_electrical', trade:'electrical',
  strong:['electrician','electrical','panel upgrade','ev charger','rewire'],
  k:['electric','panel','wiring','breaker'],
  a:"Electrical has the cheapest Local Services Ads leads we track — about $39 each.\n\nSource: "+SRC_LSA+".\n\nPanel upgrades and EV charger installs are the growth categories, and both are high-ticket searches with far less competition than HVAC or roofing. If you install chargers and don't have a page built for it, that's free money sitting on the table.",
  c:['Electrical marketing page','Run my break-even'] },

{ id:'cpl_solar', trade:'solar',
  strong:['solar','photovoltaic','pv install','solar panel'],
  k:['panels','battery storage','net metering'],
  a:"No published 2026 trade benchmark for solar, and I'm not going to invent one. Blended home services runs about $"+BLENDED+" per lead on LSAs.\n\nWhat I can tell you is the shape: long cycle, high ticket, heavy comparison shopping. Solar leads cost more and close slower than emergency trades — but the break-even ceiling is enormous, so a $200 lead can still be cheap for you and brutal for a drain cleaner.\n\nWhere solar campaigns leak is the gap between inquiry and consult. Speed to contact matters more than the ad.",
  c:['Solar marketing page','Run my break-even'] },

{ id:'cpl_painting', trade:'painting',
  strong:['painting','painter','paint contractor','exterior paint'],
  k:['paint','repaint','cabinet refinish'],
  a:"No published 2026 painting benchmark — blended home services is about $"+BLENDED+" per lead on LSAs.\n\nThe economics: fast close, thinner margin per job, volume game. That means your break-even ceiling per lead is lower than a roofer's, so cheap channels matter more. A complete Google Business Profile with steady reviews does disproportionate work in painting, because homeowners shortlist visually and locally.\n\nRun your own ceiling before you buy anything — for painting it's usually the deciding number.",
  c:['Painting marketing page','Run my break-even'] },

{ id:'cpl_remodel', trade:'remodeling',
  strong:['remodel','remodeling','kitchen remodel','bath remodel','bathroom remodel','renovation'],
  k:['renovate','gut','addition'],
  a:"No published 2026 remodeling benchmark; blended home services sits near $"+BLENDED+" on LSAs.\n\nRemodeling is a weeks-long decision, high ticket, driven by trust and design. That means the site does more selling than the ad does — galleries, real project pages, financing, and reviews that mention the specific room type.\n\nOur founder ran a bath remodeling company from 2012, so this is the trade AFC's opinions are most expensive in. Ask the hard questions on the call.",
  c:['Remodeling marketing page','Run my break-even'] },

{ id:'cpl_pool', trade:'pool',
  strong:['pool builder','pool company','pool construction','swimming pool'],
  k:['pool','spa install','hardscape'],
  a:"No published 2026 pool benchmark; blended is about $"+BLENDED+" per lead on LSAs.\n\nPools are a six-month conversation with a spouse and a very high ticket. Lead cost is close to irrelevant compared to nurture — most pool leads are lost in the eight weeks after the first call, not at the ad.\n\nSo the money goes to retargeting, financing clarity and a follow-up sequence, not just more traffic.",
  c:['Pool builder page','Run my break-even'] },

{ id:'cpl_fencing', trade:'fencing',
  strong:['fence','fencing','fence company','gate install'],
  k:['deck','railing','privacy fence'],
  a:"No published 2026 fencing benchmark; blended home services is roughly $"+BLENDED+" per lead on LSAs.\n\nFencing closes fast on a mid ticket, and demand spikes after wind and storm events. The winners are set up to be visible the same week rather than reacting a month later.\n\nMaps and reviews carry more weight here than most contractors expect — a lot of fence buyers never leave the map pack.",
  c:['Fencing page','Run my break-even'] },

{ id:'cpl_general', trade:'general',
  strong:['general contractor','gc','custom home','home builder'],
  k:['builder','construction company','build out'],
  a:"No published 2026 GC benchmark; blended home services is about $"+BLENDED+" per lead on LSAs.\n\nGeneral contracting is referral-heavy and long-cycle, so the honest strategy is different: your reputation footprint does the selling, and marketing's job is to make sure you exist when somebody checks you out. That means reviews, real project pages, and being findable by name.\n\nBuying cold leads into a GC pipeline is usually the worst-performing thing a builder can do with a budget.",
  c:['General contracting page','Run my break-even'] },

{ id:'cpl_other',
  strong:['landscap','concrete','flooring','garage door','gutter','siding','window install',
          'tree service','septic','masonry','junk removal','pressure washing','chimney','handyman'],
  k:['excavat','asphalt','driveway','stucco','insulation'],
  a:"Straight answer: there's no published trade-specific 2026 benchmark for that trade, and I'm not going to invent one. The blended home-services figure is about $"+BLENDED+" per lead on Local Services Ads.\n\nWhat I can tell you is the shape. Long-cycle, high-ticket work carries higher lead costs but a far higher break-even ceiling. Fast-close, mid-ticket work runs cheaper leads and thinner margins per job, so channel choice matters more.\n\nYour own break-even beats any national average. Three questions and I'll run it.",
  c:['Run my break-even','Book my free audit'] },

{ id:'cpl_query', k:['cpl','good cost per lead','pay per lead','average lead','lead price'],
  strong:['cost per lead','lead cost','leads cost','per lead','what do leads cost','how much are leads'],
  a:function(){
    var t = ctx.trade && CPL[ctx.trade] ? CPL[ctx.trade] : null;
    var head = "Depends on trade and channel. Google Local Services Ads, 2026: electrical $39, HVAC $51, plumbing $57, drain and sewer $59 — blended about $"+BLENDED+", with 43.9% of those leads booking. Non-branded Google Ads runs higher: roofing $124, HVAC $149, plumbing $183.\n\nSource: "+SRC_LSA+".";
    if (t) head += "\n\nSince you're in "+t.name+": "+(t.lsa ? "$"+t.lsa+" per lead on LSAs" : "$"+t.ads+" per lead on non-branded Google Ads")+" is your reference point.";
    return head + "\n\nBut the number that actually decides everything is your own break-even: profit per job × close rate. Want me to run it? Takes three answers.";
  },
  c:['Run my break-even','Roofing lead costs','HVAC lead costs'] },

{ id:'how_many_leads', k:['how many leads','lead volume','leads per month','how many calls','enough leads'],
  a:"Work backwards from jobs, never forwards from leads. Jobs you want ÷ your close rate = leads you need. Ten jobs at a 25% close rate is forty real leads, and \"real\" is doing work in that sentence — a form fill from someone comparing five quotes isn't a lead in the same sense a Local Services call is.\n\nThen multiply by cost per lead in your trade and you have a budget instead of a guess. That's the whole exercise, and it takes ninety seconds.",
  c:['Run my break-even','What do leads cost?'] },

{ id:'budget_percent', k:['percent of revenue','percentage of revenue','how much should i spend','marketing budget','budget should be','rule of thumb'],
  a:"The common rule of thumb is 5–10% of revenue for a growing home-services business, less if you're coasting on referrals, more if you're entering a new market or opening a second location.\n\nHonestly though, percentage rules are a lazy way to budget. The better version: what's a job worth, what do you close, what does a lead cost — spend up to the point where the last dollar still returns more than a dollar. Percentages are what you tell your accountant; break-even is what you run the business on.",
  c:['Run my break-even','What do you charge?'] },

/* — channels ——————————————————————————————————————— */
{ id:'seo_time', k:['how long','how soon','timeline','when will','take to work','results take','fast','quick','overnight'],
  strong:['how long does seo take','when will i see results','how fast'],
  a:"Google Business Profile and map pack movement: 30–90 days. Competitive organic terms: four to eight months. Compounding lead flow: months six to twelve.\n\nAnyone promising page one in thirty days is selling you something.\n\nIf you need the phone ringing this month, we start with paid search or Local Services Ads and build organic underneath it. Paid moves in days — it just never stops costing what it costs, which is why you want both.",
  c:['What do you charge?','Book my free audit'] },

{ id:'seo_what', k:['seo','search engine','rank','ranking','organic','google rank','first page','keywords'],
  not:['how long','ai search','chatgpt','local seo','map pack'],
  a:"Contractor SEO means ranking for searches that produce jobs, not searches that produce traffic. The distinction matters: \"roof replacement cost\" and \"emergency roof repair near me\" are two different customers with two different budgets, and they need different pages.\n\nThe work is technical health, service and location pages built on real intent, review velocity, and the structured data that makes you machine-readable. It compounds — month twelve costs less per lead than month three, which is the opposite of every paid channel.",
  c:['Contractor SEO page','How long does SEO take?'] },

{ id:'lsa', k:['lsa','lsas','local services','google guaranteed','google verified','google screened',
     'pay per lead ads','local service ad'],
  a:"Local Services Ads sit above everything else on the page and you pay per lead rather than per click. For most home-services trades they're the single best-value channel — $"+BLENDED+" blended, 43.9% book rate.\n\nTwo things most contractors miss. First, Google Guaranteed was renamed Google Verified in October 2025, so older guides use the wrong name. Second, you can dispute junk leads and get refunded — most contractors never file, which is precisely why their effective cost per lead runs higher than the benchmark.\n\nBackground check and license verification take time, so start that paperwork before you need the leads.",
  c:['Google Ads page','What do leads cost?'] },

{ id:'google_ads',
  strong:['google ads','adwords','paid search','performance max','pmax'],
  k:['ppc','cpc','click cost','search ads','bidding'],
  a:"Google Ads gets the phone ringing in days rather than months, which makes it the right first move when you have nothing built.\n\n2026 non-branded costs: roofing $124, HVAC $149, plumbing $183 per lead. Branded terms are far cheaper — roofing $44, HVAC $34 — which is the quiet argument for building a brand people search by name. Performance Max lands between: HVAC $72, plumbing $82.\n\nSource: "+SRC_ADS+".\n\nThe fastest way to waste money here is broad match with no negative keyword list. \"Cheap\" and \"DIY\" and \"jobs\" and \"salary\" should never cost you a click.",
  c:['Google Ads page','What about LSAs?'] },

{ id:'facebook', k:['facebook','meta','instagram','social','social media','fb ads','retarget','tiktok'],
  a:"Paid social works for contractors in specific situations, not as a default. It earns its place for seasonal pushes, storm response, financing offers, and remodeling work where the decision takes weeks.\n\nWhat it does best is retargeting — the homeowner who visited your site, didn't call, and needs to see you three more times. What it does badly is emergency demand. Nobody with a burst pipe is scrolling Instagram.\n\nIf you're picking one channel and your work is urgent, it isn't this one.",
  c:['Facebook ads page','What do leads cost?'] },

{ id:'local_seo', k:['map pack','google maps','gbp','business profile','google my business','gmb','local pack','near me','local seo'],
  a:"The map pack is where home-services jobs are actually won — it sits above the blue links on nearly every local search.\n\nWhat moves it: category selection (more contractors get this wrong than you'd think), review velocity rather than raw review count, service area pages with real content, and profile completeness. Proximity to the searcher is weighted heavily too, which is why one location can't own a whole metro.\n\nIt's also the highest-leverage thing you can fix cheaply. A complete profile with steady reviews beats a beautiful website with neither.",
  c:['Local SEO page','Book my free audit'] },

{ id:'ai_search', k:['ai','chatgpt','gpt','perplexity','gemini','claude','ai search','aio','geo','llm','ai overview','copilot'],
  not:['ai chatbot for my site','chatbot on my website'],
  a:"Homeowners increasingly ask ChatGPT or Gemini to recommend a contractor instead of scrolling results. Research in 2026 estimates only about 1.2% of local businesses get surfaced in those answers — so the field is wide open, for now.\n\nTwo numbers worth knowing: ChatGPT drives roughly 77% of AI search traffic, and visitors arriving from AI convert at about 14.2% versus 2.8% from traditional search. Far fewer visitors, far better ones.\n\nThe work overlaps heavily with local SEO — structured data, entity consistency, quotable content — so it isn't a separate budget line. It's mostly doing the existing job properly.",
  c:['AI search page','Book my free audit'] },

{ id:'chatbot_own', k:['chatbot for my site','bot on my website','ai assistant for my business','build me a bot','chat widget'],
  strong:['can i get one of you','bot like you','chatbot for my website'],
  a:"You're talking to the demo. This is a custom-built assistant — no monthly platform fee, no third-party script slowing the page down, and the answers are written rather than scraped, which is why I can tell you when something's a bad idea.\n\nIt captures leads straight to email with the conversation attached, so your callback starts warm. Ask about it on the call — it's not a standard line item, it's built per site.",
  c:['Talk to a human','Book my free audit'] },

{ id:'video', k:['video','youtube','reels','shorts','drone footage','tiktok video'],
  a:"Video earns its keep in two specific places for contractors: proof and trust. Job-site walkthroughs, before-and-afters, and the owner talking straight to camera outperform anything polished.\n\nYouTube also functions as a search engine — \"how much does a roof replacement cost\" style content pulls people early. It's slow, though, and it isn't the move if you need calls this month.\n\nThe cheapest version that works: film on a phone at real job sites, post consistently, use the footage in retargeting.",
  c:['Facebook ads page','What do leads cost?'] },

{ id:'offline', k:['direct mail','postcards','truck wrap','yard sign','door hanger','flyer','billboard','radio','tv','print'],
  a:"Offline still works in home services, and I'd never tell a contractor to drop what's producing.\n\nThe ranking, roughly: yard signs and truck wraps are the best dollar-for-dollar because they're neighborhood proof, and they cost you nothing recurring. Direct mail works for storm response and dense, targeted neighborhoods. Radio and TV build recall but are hard to attribute honestly, so they're the last thing to buy, not the first.\n\nThe fix that makes all of them measurable: a separate tracking number on each. Most contractors run offline blind and then argue about what worked.",
  c:['How do you report?','Book my free audit'] },

{ id:'nextdoor_yelp', k:['nextdoor','yelp','bbb','better business bureau','houzz profile'],
  not:['yelp ads worth'],
  a:"Nextdoor is genuinely useful for neighborhood trades — recommendations there carry weight because they come from a name and an address. Claim the business page, don't spam the feed.\n\nYelp's organic profile is worth keeping accurate. Yelp's sales calls are a different question, and the honest answer is that a lot of contractors report the same thing: expensive, aggressive to cancel, and hard to attribute. Get the terms in writing before agreeing to anything.",
  c:['Is Angi worth it?','Local SEO page'] },

{ id:'email_db', k:['email marketing','newsletter','database','past customers','reactivation','crm list','stay in touch'],
  a:"Your past-customer list is the cheapest lead source you own and the most neglected. A furnace you installed six years ago is a replacement conversation. A bathroom you did is a kitchen someone's thinking about.\n\nTwo emails and two texts a year to your own database will usually out-earn an equivalent spend on cold traffic, and it costs almost nothing. If you don't have the list organized, that's the first thing to fix — before any ad budget.",
  c:['Free tools','Book my free audit'] },

{ id:'referrals', k:['referral','word of mouth','repeat customers','referral program'],
  a:"Referrals are the best leads you'll ever get and the worst growth plan you can rely on, because volume isn't yours to control.\n\nThe practical move is to make referrals findable: when someone's neighbor says your name, the next thing that happens is a Google search. If what they find is a thin profile with four old reviews, you just lost a warm lead to your own web presence. Marketing's first job for a referral-driven contractor is protecting the referrals you already earn.",
  c:['Local SEO page','Book my free audit'] },

{ id:'backlinks', k:['backlink','link building','citations','nap','directories','domain authority'],
  a:"Citations — your name, address and phone consistent across directories — are table stakes, not a strategy. Get them right once, fix duplicates, move on.\n\nLinks matter less for local contractors than most agencies imply. Supplier pages, local sponsorships, trade associations, chamber listings and real press do the job. Buying links from a package deal is how profiles get burned. Nothing on your site should be something you'd have to undo after an algorithm update.",
  c:['Contractor SEO page','Book my free audit'] },

/* — the marketplace question ————————————————————————— */
{ id:'angi',
  strong:['angi','thumbtack','homeadvisor','home advisor','angies list','lead marketplace','buy leads'],
  k:['angie','porch','houzz','shared leads','networx','modernize','lead service'],
  a:"Straight answer: marketplace leads fill a slow week. They never build anything.\n\nThe structural problem is that the same homeowner gets sold to several contractors at once, so the first call is a price fight before you've said a word about quality. Stop paying and the leads stop the same day. No ranking, no brand recall, no asset.\n\nMy actual advice — if you need work in the next two weeks and have nothing built, buy the leads. Cash flow beats theory. But start building the owned side in parallel, because a business whose entire pipeline lives on someone else's platform is one pricing change from a very bad quarter.",
  c:['Lead generation page','Run my break-even'] },

{ id:'exclusive', k:['exclusive','shared','my own leads','own the leads','belong to me','sold to others','resold'],
  a:"Every lead we generate is yours alone. That's the whole difference between owning and renting.\n\nWhen a homeowner finds you through your own ranking or your own ad, you're the expert they sought out — not the fourth quote on a list. Same person, completely different conversation, and it shows up in your close rate before it shows up anywhere else.",
  c:['Lead generation page','Is Angi worth it?'] },

/* — objections ——————————————————————————————————— */
{ id:'guarantee', k:['guarantee','guaranteed','promise','assure','certain','number one','#1','top spot'],
  a:"No, and be careful with anyone who says otherwise. Nobody controls Google's ranking algorithm, so a page-one guarantee is either meaningless fine print or a promise on a keyword so obscure nobody searches it.\n\nWhat we do commit to: you'll know exactly which channel produced which customer, you can leave any month, and if we think your money is better spent on a second truck we'll say so. We've told people that before.",
  c:['How do you report?','Book my free audit'] },

{ id:'burned', k:['burned','scammed','ripped off','waste of money','last agency','previous company','didnt work','did not work','bad experience','fired','wasted'],
  a:"Heard that more times than I can count, and it's the reason AFC exists. Our founder ran a bath remodeling company from 2012, hired marketers the way most contractors do, and got back reports full of impressions and rankings. Nobody ever asked what his average job was worth or whether he closed anything.\n\nSo the first thing we ask is what a job is worth to you and what you close. If we can't build to a cost per lead that works against those numbers, we say so rather than selling you a package anyway.\n\nWant to start there? It's the question your last agency skipped.",
  c:['Run my break-even','About AFC'] },

{ id:'tried_seo', k:['tried seo','tried that','did seo before','didnt rank','never worked for me','doesnt work for my industry'],
  a:"Usually one of four things went wrong, and they're diagnosable: the pages targeted traffic keywords instead of buying keywords, the Google Business Profile was never properly worked, nothing was tracked so nobody could tell what did work, or it got cancelled at month three — right before the part where it pays.\n\nThe audit tells you which one it was in your case. Free, and you keep it whether you hire us or not. That's a more useful thing to have than my opinion.",
  c:['Book my free audit','Contractor SEO page'] },

{ id:'think_about_it', k:['think about it','need to think','let me think','not sure yet','consider it','sleep on it','maybe later'],
  a:"Fair. Worth asking yourself which one it actually is — price, timing, or whether it'll work at all. Those are three different conversations and I can settle two of them right now.\n\nThe asymmetry is worth naming: there's no contract, so the cost of starting is one month. The cost of waiting is usually a season. Contractors who start in the busy stretch are the ones who stay busy in the slow one.",
  c:['Run my break-even','Book my free audit'] },

{ id:'spouse', k:['my wife','my husband','my partner','my business partner','talk to my','run it by','check with'],
  a:"Smart, and most contractors I talk to do exactly that.\n\nGive them something better than a pitch to react to. The free audit is specific to your market — your site, your profile, your reviews, and the three competitors currently outranking you. That's a document two people can actually make a decision on.\n\nWant me to get that started? Takes about a day and costs nothing.",
  c:['Book my free audit','Talk to a human'] },

{ id:'send_info',
  strong:['send me info','send me some info','send information','send a proposal','email me something'],
  k:['brochure','pricing sheet','packet','more info','some info','send over','send me'],
  a:"I can do better than a brochure. The free tools on this site are the actual math — break-even worksheet, website scorecard, plan builder — no email wall, no unlock step.\n\nIf you want something specific to your market rather than generic, the audit is the version worth reading. Real person, about a day, yours to keep. Want me to take your details?",
  c:['Book my free audit','Free tools'] },

{ id:'diy', k:['do it myself','myself','in house','my nephew','my son','learn it','on my own','diy','hire someone internal'],
  a:"Honestly? For a single-town operator, a lot of it is doable. Claim and complete your Google Business Profile, ask every happy customer for a review, answer the phone fast. That's most of the local game and it costs nothing but discipline.\n\nThe free tools on this site are built for exactly that — no email wall. Where it gets hard is paid search, where you're bidding against people who do this full-time and a mistake costs real money weekly.\n\nAlso worth pricing your own hours honestly. Four hours a week on this is a hundred billable hours a year.",
  c:['Free tools','What do you charge?'] },

{ id:'too_busy', k:['too busy','no time','swamped','backed up','booked out','dont need','do not need leads','enough work','fully booked'],
  a:"Then don't buy marketing right now — buy it about six weeks before you're not busy.\n\nThat's the actual play. SEO takes four to eight months to compound, so if you start when the phone goes quiet you're already four months late. Contractors who stay busy year-round are the ones who built during the good stretch.\n\nIf your slow season is January, September is when to start. What's yours?",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'small', k:['one truck','small','just me','solo','starting out','new business','small operation','two guys','one man'],
  a:"That's fine, and the $50/month tier exists for exactly that. Profile work, reviews, a tight local footprint — slow, cheap, and genuinely effective when you're working one town.\n\nWhat we'd be honest about: a one-truck operation usually shouldn't be buying paid search yet. Get the free channels working first. Come back for paid when you have crew capacity to absorb the volume, because leads you can't service are worse than no leads.",
  c:['What do you charge?','Free tools'] },

{ id:'not_fit',
  strong:['good fit','right fit','a good match','are we a fit','right for me','take me on'],
  k:['good match','work with me','qualify','fit for'],
  a:"We're a strong fit if you want to grow rather than just fill next week, you roughly know your job value and close rate, and somebody answers the phone fast.\n\nWe're a poor fit if you want a page-one guarantee, if leads sit two days before anyone calls back, or if you're shopping purely on price. Marketing can't fix a voicemail box — that's the honest failure mode, and it's the most common one.",
  c:['Who we work with','Book my free audit'] },

{ id:'competitor_client', k:['work with my competitor','competitor in my area','someone in my market','same city as me','exclusivity','territory'],
  a:"Ask this on the call and get the answer in writing — running two clients against each other for the same keywords in the same market makes both campaigns worse, and it's a fair thing to settle before money moves.\n\nChecking whether your market is open takes about a minute. Worth doing early rather than after you've made plans.",
  c:['Talk to a human','Book my free audit'] },

{ id:'big_agency', k:['how big are you','how many clients','team size','small agency','why you','why not a big agency','are you legit'],
  a:"Small on purpose. Zach works directly with clients and the roster is kept short so that stays true — which means you'll know who's on your account and be able to reach them.\n\nThe honest trade-off: a big agency has more hands and a nicer dashboard. What they usually don't have is the owner on your call in month seven. Pick whichever of those matters more to you; both are legitimate answers.\n\nEye To Ad Media has been at this since 2012 and carries 60 reviews.",
  c:['About AFC','Talk to a human'] },

{ id:'references', k:['references','case study','case studies','proof','examples','portfolio','who have you worked with','testimonial'],
  a:"The results page walks through realistic channel expectations rather than cherry-picked wins, which is a deliberate choice — a screenshot of somebody else's best month tells you nothing about your market.\n\nAsk on the call for work in your trade and your market size. That's the comparison that actually predicts anything.",
  c:['See results page','Talk to a human'] },

/* — service & operations ————————————————————————————— */
{ id:'reporting', k:['report','reporting','track','tracking','attribution','measure','roi','prove','dashboard','analytics'],
  a:"Call tracking and conversion tracking go in before we spend a dollar on traffic, so every call and form is tagged to its source.\n\nMonthly you get ranking and map movement, calls and forms with attribution, traffic by channel and what it did, AI search visibility, and a plain-language note on what changed. No forty-page PDF.\n\nThe uncomfortable part of real attribution is that it sometimes shows the channel you love producing nothing. We'd rather hand you a true number with a caveat than a flattering one that's fiction.",
  c:['See results page','Book my free audit'] },

{ id:'call_tracking', k:['call tracking','tracking number','record calls','who called','missed call report'],
  a:"A separate tracking number per channel, forwarding to your real line. That's how you find out that the yard signs outperform the Facebook budget, or that half your \"SEO leads\" were actually people who saw the truck.\n\nOne caution people miss: use dynamic number insertion properly or your NAP consistency takes a hit, which costs you in the map pack. It's a solved problem, but it's solved deliberately, not by accident.",
  c:['How do you report?','Book my free audit'] },

{ id:'process', k:['process','how does it work','what happens','steps','get started','start','onboard','first','next step'],
  a:"Four steps. One: the audit — your site, profile, reviews, rankings, and the three competitors beating you in the map pack. You keep it whether you hire us or not.\n\nTwo: the numbers — your break-even cost per lead against what channels actually cost in your market.\n\nThree: build and launch — first thirty days is tracking, profile, conversion path, and whichever channel rings fastest for your trade.\n\nFour: report and scale — monthly, with attribution. Cut what isn't working.\n\nWant to start at step one? It's free.",
  c:['Book my free audit','Run my break-even'] },

{ id:'audit', k:['audit','free audit','review my site','look at my website','check my site','analysis','assessment'],
  a:"Free, no contract, no card. We look at your website, your Google Business Profile, your review profile, and the competitors currently outranking you. Takes about a day, and a real person calls you back — usually same day.\n\nYou keep the findings whether you hire us or not. Want me to take your details now?",
  c:['Book my free audit','Talk to a human'] },

{ id:'who_works', k:['who will work','account manager','my rep','the owner','founder','zach','team','junior','who handles'],
  a:"Zach works directly with clients, and the roster is deliberately kept small so that stays true. You'll know who's on your account and be able to reach them — which isn't the case at most agencies once the pitch is over.",
  c:['About AFC','Talk to a human'] },

{ id:'location', k:['where are you','location','based','denver','colorado','local to me','my area','my state','my city','nationwide','national'],
  a:"Denver, Colorado — but we work with contractors across the US and internationally. What matters is fit, not geography: whether we can realistically win in your market and whether the economics work for your business.\n\nWe've never needed to be in the same city as a client to rank them in it.",
  c:['Who we work with','Talk to a human'] },

{ id:'trades', k:['what trades','which trades','do you work with','industries','my trade','my industry','type of business'],
  a:"Roofing, plumbing, HVAC, electrical, solar, general contracting, painting, remodeling, pool building and fencing.\n\nEach gets its own strategy, because the customer behaves differently. A burst pipe is a five-minute decision at eleven at night. A pool build is a six-month conversation with a spouse. One playbook across every trade is why a lot of contractors think marketing doesn't work.\n\nOutside the trades, Eye To Ad Media handles dentists, law firms, med spas and more.",
  c:['Who we work with','What do leads cost?'] },

{ id:'commercial', k:['commercial','b2b','property manager','multifamily','municipal','bid work','government'],
  a:"Commercial changes the playbook. Fewer searches, much higher ticket, and the buyer is a property manager or GC rather than a homeowner — so the winning move is usually relationships plus being findable and credible when they check you out.\n\nWhat still applies: your profile, your reviews, and a site that survives being looked at by someone comparing three bidders. What matters less: map pack proximity and emergency intent.\n\nIf you're split residential and commercial, they need separate pages. Same site, different arguments.",
  c:['Who we work with','Book my free audit'] },

{ id:'multi_location', k:['multiple locations','second location','franchise','expand','new market','another city','service area'],
  a:"One profile can't own a metro — proximity is weighted too heavily. Real expansion means a real location signal in the new market and location pages with content specific to it, not a template with the city name swapped.\n\nThe efficient sequence is: dominate the first market, then use the authority you built there to enter the second cheaper. Contractors who spread thin across five cities at once usually rank in none of them.",
  c:['Local SEO page','Book my free audit'] },

{ id:'sab', k:['service area business','hide my address','home address','no storefront','work from home'],
  a:"Service Area Business is the correct setting if you go to the customer rather than the customer coming to you, and hiding a home address is legitimate — Google supports it.\n\nWhat isn't legitimate: virtual offices and mailbox addresses used to fake a presence. That's a suspension risk, and a suspended profile is a business-ending outcome for a contractor, not a slap on the wrist.",
  c:['Local SEO page','Book my free audit'] },

{ id:'recruiting', k:['hiring','recruit','find techs','crew','employees','staffing','applicants','cant find help'],
  a:"Recruiting ads are the most underrated spend in the trades right now. Same tools, different target: a careers page that ranks for \"[trade] jobs [city]\", paid social to the local workforce, and a Google Business Profile that makes you look like somewhere worth working.\n\nWorth saying plainly — if you can't staff the work, more leads make your business worse, not better. Fix capacity first. We'd rather tell you that than sell you traffic you can't service.",
  c:['Talk to a human','Book my free audit'] },

{ id:'financing', k:['financing','payment plan','finance offer','monthly payment','credit'],
  a:"Financing changes the arithmetic on high-ticket work more than any ad tweak will. \"$18,000\" and \"$240 a month\" are the same job and completely different conversations.\n\nIf you offer it, it belongs above the fold, in your ads, and in the follow-up — not buried on a sub-page. Half the contractors we audit have financing and hide it.",
  c:['Book my free audit','Website scorecard'] },

{ id:'website', k:['website','web site','build a site','new site','redesign','my site is old','wordpress','site speed','landing page'],
  a:"Your website is where every channel eventually sends people, so if it doesn't convert, everything upstream is wasted money.\n\nThe free Website Scorecard runs 25 weighted checks — speed, conversion path, trust signals, local SEO, AI readiness — and gives you a letter grade plus a fix list sorted by what's free versus what's worth paying for. Start there before you pay anyone, including us.",
  c:['Score my website','Free tools'] },

{ id:'own_assets',
  strong:['who owns','own the website','own the domain','own my website','if i leave','ownership'],
  k:['take it with me','my account','my ad account','hold my domain'],
  a:"You should own your domain, your Google Business Profile, your ad accounts and your website. Full stop. Anyone who holds those hostage is building a leash, not a campaign.\n\nIf you're currently in a setup where the agency owns your domain or your ad account, fix that before you fix anything else — it's the single most common way contractors get stuck paying for something that stopped working.",
  c:['Talk to a human','Book my free audit'] },

{ id:'reviews', k:['review','reviews','stars','rating','google reviews','reputation','bad review','one star'],
  a:"Review velocity — how steadily they arrive — matters more than raw count for map pack ranking, and it's one of the strongest signals AI systems use when deciding who to recommend.\n\nThe practical version: ask every satisfied customer, same day, with a direct link. A contractor with 40 reviews earned steadily over a year outranks one with 120 collected in a burst two years ago.\n\nOn bad reviews: respond calmly, publicly, once. Future customers are reading the reply more than the complaint.",
  c:['Local SEO page','Book my free audit'] },

{ id:'tools', k:['tool','tools','free tool','calculator','worksheet','spreadsheet','tracker','plan builder','scorecard'],
  a:"Four, all free, none gated behind a form.\n\nBreak-Even Lead Cost Worksheet — three inputs, tells you the most you can pay for a lead.\nMarketing Plan Builder — seven questions, gives back a twelve-month plan.\nWebsite Scorecard — 25 checks, letter grade, prioritized fixes.\nLead & Job Tracker — spreadsheet with the formulas already written.\n\nUse them and never call us. That's genuinely fine. Or I can run the break-even right here — faster than opening the page.",
  c:['Run my break-even','Free tools'] },

{ id:'seasonal',
  strong:['slow season','busy season','off season','winter','summer','seasonal','shoulder season'],
  k:['season','when to start','time of year','spring','fall'],
  a:"Budget pacing is where seasonal trades leak money. The instinct is to spend hardest during peak demand — but that's when competitors are bidding hardest too, so costs spike exactly when you're spending most.\n\nBetter: spend in the two or three weeks before demand arrives, when clicks are cheap and you're catching people in the research phase. And start SEO about six months ahead of the season you want to own, because it won't arrive faster than that.",
  c:['How long does SEO take?','Book my free audit'] },

{ id:'response_time',
  strong:['nobody answers','answers our phone','answer our phone','answer the phone',
          'missed calls','miss calls','response time','call them back','slow to respond'],
  k:['voicemail','follow up','after hours','leads go cold','no one answers','answering service'],
  a:"This is the one nobody wants to hear: the most common reason marketing \"doesn't work\" is response time, not the marketing.\n\nA lead that sits until tomorrow is usually gone — they called the next contractor. And with Google's agentic booking rolling out through 2026, in some categories the AI phones the business on the customer's behalf. If nobody picks up, it moves to the next provider. No ranking survives an unanswered phone.\n\nIf your intake is the leak, we'd rather help you fix that than sell you more traffic pouring into the same gap.",
  c:['Book my free audit','How do you report?'] },

{ id:'spanish', k:['spanish','bilingual','en espanol','espanol','translate','two languages'],
  a:"Bilingual sites are a real advantage in a lot of markets and almost nobody in the trades does them properly — usually it's a translate widget that Google ignores.\n\nDone right it's proper markup and real content on both sides, which means you show up for searches your competitors aren't even in. Worth asking about on the call if your market has the demand.",
  c:['Talk to a human','Book my free audit'] },

/* — handoff & buying signals ————————————————————————— */
{ id:'human', k:['human','person','real person','talk to someone','speak to','call you','phone','sales','rep','representative','contact','speak with'],
  noclose:true,
  a:"Call "+PHONE+" — a person answers, no phone tree. Or email "+MAIL+".\n\nIf it's easier, leave your details here and someone calls you back, usually the same day. Want to do that?",
  c:['Book my free audit'] },

{ id:'email_addr', k:['email','e-mail','address','write to you','send you'],
  not:['email marketing','newsletter','email me something'],
  noclose:true,
  a:"We're at "+MAIL+", or "+PHONE+" if you'd rather talk. Leaving your details here works too — it lands in the same inbox, with the conversation attached so nobody makes you repeat yourself.",
  c:['Book my free audit','Talk to a human'] },

{ id:'hours',
  strong:['hours','what time','weekend','saturday','sunday','open on'],
  k:['open','when are you','available'],
  noclose:true,
  a:"Business hours are Monday to Friday, 8am to 6pm Mountain Time. Leave details outside those hours and you'll hear back the next business day.",
  c:['Book my free audit','Talk to a human'] },

{ id:'calc_start', k:['break even','breakeven','break-even','what can i afford','my ceiling','max per lead','worth paying','run the numbers','do the math','calculate'],
  strong:['run my break even','run my break-even','run the math','my numbers'],
  noclose:true,
  a:"Good — this is the only number that matters. Three questions, twenty seconds.",
  c:[], action:'calc' },

{ id:'lead_start', k:['book','sign up','get started with you','yes','interested','lets do it','ready','send my info','callback','call me','sounds good','im in','lets go','sign me up','hire you'],
  strong:['book my free audit','call me back','i want to start','how do i sign up'],
  noclose:true,
  a:"Good. Four quick things — takes about twenty seconds — and someone calls you back, usually same day.",
  c:[], action:'lead' }
];

/* ─────────────────────────────────────────────────────────────────────
   GUARDRAILS — checked before intent matching. Order matters.
   ───────────────────────────────────────────────────────────────────── */
var GUARDS = [
  { t:['legal advice','sue','lawsuit','lawyer','attorney','contract dispute','court','liability','osha','lien'],
    a:"That's outside what I can help with — I'd be guessing, and guessing about legal exposure is worse than saying nothing. Talk to an attorney licensed in your state." },

  { t:['medical','injury','hurt','doctor','hospital','workers comp','injured'],
    a:"I can't help with that one, and you wouldn't want marketing software trying. If someone's hurt, that's a doctor and your insurance carrier." },

  { t:['guarantee my ranking','guarantee ranking','guaranteed ranking','guarantee results',
     'promise me','guarantee page one','guarantee first','guarantee top','guarantee me',
     'guarantee leads','guarantee calls'],
    a:"I won't promise that, because nobody can. Google's algorithm isn't ours to control, and any agency guaranteeing a ranking is either using fine print or picking a keyword nobody searches. What we'll commit to is honest attribution and no lock-in." },

  { t:['black hat','trick google','game the system','fake review','buy review','buy me review',
     'purchase review','paid review','write reviews for me','spam','cloaking','pbn',
     'private blog network','fake address','fake listing','keyword stuff'],
    a:"We don't do that, and I'd push back on anyone offering it. Fake reviews and fake listings violate Google's terms and get profiles suspended — that's a business-ending outcome for a contractor, not a slap on the wrist. Everything we build is designed to survive an algorithm update, which by definition rules that out." },

  { t:['sabotage','negative seo','report my competitor','take down their','hack their',
     'hurt my competitor','damage my competitor','fake reviews on','ddos','attack their site'],
    a:"Happy to talk about outranking a competitor — that's the job. Not going to help with anything aimed at damaging them. It's against Google's terms, and it tends to rebound on whoever tried it." },

  { t:['unlicensed','no license','without a license','uninsured','under the table','avoid permits','skip permit'],
    a:"Not something I'll help position. Licensing and permits are also a ranking factor in practice — Local Services Ads verify them, and homeowners check. Get that side straight first; it's cheaper than the alternative." },

  { t:['crypto','bitcoin','nft','forex','adult','gambling','casino','cbd','vape','firearm'],
    a:"That's outside our lane — we build for trade contractors and adjacent local service businesses. You'd want a specialist with actual experience in that category." },

  { t:['discrimin','only hire','no women','race','religion','immigrant','illegal worker'],
    a:"Not something I'll help with, and targeting like that violates advertising policy on every major platform besides being unlawful in most places." }
];

/* ─────────────────────────────────────────────────────────────────────
   LINK TARGETS for quick-reply chips
   ───────────────────────────────────────────────────────────────────── */
var CHIP_LINKS = {
  'See pricing page':          '/pricing/',
  'Free tools':                '/contractor-marketing-tools/',
  'Score my website':          '/contractor-website-scorecard/',
  'Website scorecard':         '/contractor-website-scorecard/',
  'Roofing marketing page':    '/roofing-marketing/',
  'HVAC marketing page':       '/hvac-marketing/',
  'Plumbing marketing page':   '/plumbing-marketing/',
  'Electrical marketing page': '/electrical-contractor-marketing/',
  'Solar marketing page':      '/solar-contractor-marketing/',
  'Painting marketing page':   '/painting-contractor-marketing/',
  'Remodeling marketing page': '/remodeling-marketing/',
  'Pool builder page':         '/pool-builder-marketing/',
  'Fencing page':              '/fence-company-advertising/',
  'General contracting page':  '/general-contractor-marketing/',
  'Contractor SEO page':       '/contractor-seo/',
  'Local SEO page':            '/local-seo-contractors/',
  'Google Ads page':           '/google-ads-contractors/',
  'Facebook ads page':         '/contractor-facebook-ads/',
  'AI search page':            '/ai-search-optimization-contractors/',
  'Lead generation page':      '/contractor-lead-generation/',
  'See results page':          '/results/',
  'Who we work with':          '/who-we-work-with/',
  'About AFC':                 '/about/'
};

/* ─────────────────────────────────────────────────────────────────────
   MATCHER
   ───────────────────────────────────────────────────────────────────── */
function norm(s){
  return (' ' + String(s).toLowerCase()
    .replace(/[\u2018\u2019'`]/g,'')
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
    if (it.k){
      for (j=0;j<it.k.length;j++){ if (has(t,it.k[j])) score += 1; }
    }
    if (score > bestScore){ bestScore = score; best = it; }
  }
  return bestScore >= 1 ? best : null;
}
function answerText(it){
  return typeof it.a === 'function' ? it.a() : it.a;
}

/* Closing engine. A trial close is appended once the visitor is engaged,
   never on greetings or handoffs, and never twice within three turns. */
function closeLine(it){
  if (it.noclose || it.action) return '';
  if (ctx.turns < 2) return '';
  if (ctx.turns - ctx.lastClose < 3) return '';
  ctx.lastClose = ctx.turns;
  var line = CLOSES[ctx.closeIdx % CLOSES.length];
  ctx.closeIdx++;
  return '\n\n' + line;
}

function fallback(){
  ctx.fallbacks++;
  if (ctx.fallbacks >= 2){
    return {
      a: "Still not catching it, and I'd rather hand you to someone who will than keep guessing. Call "+PHONE+", or leave your details here and a person calls you back — usually the same day.",
      c: ['Book my free audit','Talk to a human','Run my break-even']
    };
  }
  var extra = PAGE.ind ? " Since you're on the "+PAGE.label+" page, I can give you real 2026 lead costs for that trade." : '';
  return {
    a: "Not sure I caught that one." + extra + " Try me on lead costs, pricing, how long SEO takes, whether Angi is worth it, or how we report. I can also run your break-even live — three questions.",
    c: ['Run my break-even','What do leads cost?','Talk to a human']
  };
}

function opener(){
  var base = "Rivet here — AFC's estimator. ";
  if (PAGE.ind && CPL[PAGE.ind]){
    var d = CPL[PAGE.ind];
    var n = d.lsa ? "$"+d.lsa+" per lead on Local Services Ads" : "$"+d.ads+" per lead on non-branded Google Ads";
    return base + "You're reading about "+PAGE.label.toLowerCase()+", so here's the headline number: "+n+" in 2026. Ask me what that means against your own margins — I'll do the math live.";
  }
  if (PAGE.ind){
    return base + "You're on the "+PAGE.label+" page. No published 2026 benchmark exists for that trade and I won't invent one — but I can run your own break-even in three questions, which beats a national average anyway.";
  }
  return base + "Ask me what leads cost in your trade, what we charge, or whether Angi is worth it. I'll give you the real number — including when it's bad news.";
}

/* ─────────────────────────────────────────────────────────────────────
   IN-CHAT BREAK-EVEN ESTIMATOR
   Three questions, live math, then the ask. Whatever the visitor enters
   rides along on the lead email, so the callback opens with their own
   numbers instead of a cold pitch.
   ───────────────────────────────────────────────────────────────────── */
function num(s){
  var m = String(s).replace(/[,$\s]/g,'').match(/\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}
function rateOf(s){
  var t = String(s).toLowerCase();
  var m = t.match(/1\s*(?:in|of|out\s*of)\s*(\d+(\.\d+)?)/);
  if (m){ var d = parseFloat(m[1]); return d > 0 ? 100 / d : null; }
  var n = num(t);
  if (n === null) return null;
  if (n > 0 && n <= 1 && t.indexOf('%') === -1) return n * 100;
  return n;
}
function money(n){
  n = Math.round(n);
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

var CALC_STEPS = [
  { key:'job',
    q:"What's your average job worth? Ballpark is fine — just the number.",
    parse:function(x){ var n = num(x); return (n && n >= 50) ? n : null; },
    e:"Give me a dollar figure — something like 8500 or $12,000." },
  { key:'margin',
    q:"And your profit on that job — either a percentage (like 30) or the dollars you actually keep.",
    parse:function(x){ var n = num(x); return (n && n > 0) ? n : null; },
    e:"A percentage like 30, or a dollar amount like 2500. Either works." },
  { key:'close',
    q:"Last one — of the real leads you get, how many do you close? A percentage, or \"1 in 4\".",
    parse:function(x){ var n = rateOf(x); return (n && n > 0 && n <= 100) ? n : null; },
    e:"Something like 25%, or \"1 in 4\"." }
];
var calc = { active:false, step:0, data:{} };

function calcResult(){
  var job    = calc.data.job;
  var marg   = calc.data.margin;
  var closeR = calc.data.close;
  /* Under 100 reads as a percentage; over reads as dollars kept per job. */
  var profit = marg <= 100 ? job * (marg / 100) : marg;
  var ceiling = profit * (closeR / 100);

  var t = ctx.trade && CPL[ctx.trade] ? CPL[ctx.trade] : null;
  var bench = t ? (t.lsa || t.ads) : BLENDED;
  var benchName = t ? (t.name + (t.lsa ? ' on Local Services Ads' : ' on non-branded Google Ads'))
                    : 'blended home services on Local Services Ads';
  var pct = (bench / ceiling) * 100;

  ctx.calc = {
    job: job, profit: profit, close: closeR, ceiling: ceiling,
    bench: bench, benchName: benchName
  };

  var verdict;
  if (pct <= 15){
    verdict = "That's a wide margin. A "+money(bench)+" lead eats about "+Math.round(pct)+"% of the profit on a single job — and that's before repeat work and referrals. In your position the constraint is capacity, not lead cost.";
  } else if (pct <= 40){
    verdict = "That works. A "+money(bench)+" lead costs roughly "+Math.round(pct)+"% of one job's profit, which leaves real room. Channel choice matters, but the math is on your side.";
  } else if (pct <= 90){
    verdict = "Tighter than most, but workable — a "+money(bench)+" lead is about "+Math.round(pct)+"% of one job's profit. At that ratio you can't afford sloppy tracking or slow callbacks; every lead has to be worked.";
  } else {
    verdict = "Here's the honest read: at "+money(bench)+" a lead against a "+money(ceiling)+" ceiling, paid acquisition doesn't clear on the first job. That's not a marketing problem — it's a pricing, margin or close-rate problem, and no agency can outrun it. Fix one of those three first. I'd rather say that than sell you a campaign.";
  }

  return {
    profit: profit, ceiling: ceiling, bench: bench,
    benchName: benchName, verdict: verdict, pct: pct
  };
}

function calcCardHTML(r){
  var rows = [
    ['Average job',        money(calc.data.job)],
    ['Profit per job',     money(r.profit)],
    ['Close rate',         Math.round(calc.data.close) + '%'],
    ['Your break-even',    money(r.ceiling) + ' per lead'],
    ['Benchmark',          money(r.bench) + ' — ' + r.benchName]
  ];
  var html = '<div class="rvt-card"><div class="rvt-card-h">ESTIMATE &middot; BREAK-EVEN PER LEAD</div>';
  for (var i=0;i<rows.length;i++){
    var big = i === 3 ? ' rvt-card-big' : '';
    html += '<div class="rvt-card-r'+big+'"><span>'+rows[i][0]+'</span><b>'+rows[i][1]+'</b></div>';
  }
  html += '<div class="rvt-card-f">Formula: profit per job &times; close rate. Benchmarks: SearchLight Digital, 2026.</div></div>';
  return html;
}

/* ─────────────────────────────────────────────────────────────────────
   LEAD CAPTURE
   ───────────────────────────────────────────────────────────────────── */
var LEAD_STEPS = [
  { key:'Name',   q:"What's your name?",
    v:function(x){ return x.trim().length >= 2; },
    e:"Need at least a first name." },
  { key:'Phone',  q:"Best number to reach you?",
    v:function(x){ var d = x.replace(/\D/g,''); return d.length >= 10 && d.length <= 15; },
    e:"That's not landing on ten digits — mind checking it?" },
  { key:'Trade',  q:"What trade are you in, and what's the biggest problem right now?",
    v:function(x){ return x.trim().length >= 3; },
    e:"Even a couple of words helps." },
  { key:'Market', q:"Last one — what city or area do you work in?",
    v:function(x){ return x.trim().length >= 2; },
    e:"City or metro is fine." }
];
var lead = { active:false, step:0, data:{}, sent:false };

function endpoint(ajax){
  return 'https://formsubmit.co/' + (ajax ? 'ajax/' : '') + MAILUSER + '@' + MAILHOST;
}
function transcript(){
  var out = [], h = ctx.history, start = Math.max(0, h.length - 24);
  for (var i=start;i<h.length;i++){
    out.push((h[i].who === 'u' ? 'VISITOR: ' : 'RIVET: ') + h[i].text.replace(/\s+/g,' ').slice(0,320));
  }
  return out.join('\n');
}
function payload(partial){
  var mins = Math.max(1, Math.round((Date.now() - ctx.started) / 60000));
  var d = {
    Name:    lead.data.Name   || '(not given)',
    Phone:   lead.data.Phone  || '(not given)',
    Trade:   lead.data.Trade  || '(not given)',
    Market:  lead.data.Market || '(not given)',
    Source:  'RIVET chatbot — ' + (PAGE.label || path),
    PageURL: location.href,
    TimeOnChat: mins + ' min',
    _subject: (partial ? 'AFC RIVET partial lead — ' : 'AFC RIVET lead — ') + (PAGE.label || path),
    _template: 'table',
    _captcha: 'false',
    _honey: ''
  };
  if (ctx.calc){
    d.BreakEven = money(ctx.calc.ceiling) + ' per lead';
    d.TheirNumbers = 'Avg job ' + money(ctx.calc.job)
      + ' | profit ' + money(ctx.calc.profit)
      + ' | close rate ' + Math.round(ctx.calc.close) + '%'
      + ' | benchmark ' + money(ctx.calc.bench) + ' (' + ctx.calc.benchName + ')';
  }
  d.Transcript = transcript();
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
   STYLES
   Palette: ink #0D1117 · lime #A6CE39 / #C9F04B · hat yellow #FBCB3E /
   #F5B722 · hi-vis orange #E8622B · bone #F4F4F1 · steel #C9CDD2
   ───────────────────────────────────────────────────────────────────── */
var CSS = [
'.rvt,.rvt *{box-sizing:border-box}',

/* — launcher ————————————————————————————————————— */
'.rvt-fab{position:fixed;right:20px;bottom:20px;z-index:9990;width:74px;height:74px;',
'border-radius:50%;background:linear-gradient(160deg,#1B242F 0%,#0D1117 100%);',
'border:3px solid #A6CE39;cursor:pointer;box-shadow:0 12px 34px rgba(13,17,23,.4);',
'padding:0;overflow:visible;',
'transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,border-color .2s}',
'.rvt-clip{position:absolute;inset:0;border-radius:50%;overflow:hidden;display:block}',
'.rvt-clip svg{width:100%;height:100%;display:block}',
'.rvt-fab:hover{transform:translateY(-4px) scale(1.05);border-color:#C9F04B;',
'box-shadow:0 18px 44px rgba(13,17,23,.5)}',
'.rvt-fab:active{transform:translateY(-1px) scale(1.01)}',
'.rvt-fab:focus-visible{outline:3px solid #0D1117;outline-offset:4px}',
'.rvt-ring{position:absolute;inset:-3px;border-radius:50%;border:3px solid #A6CE39;',
'animation:rvtRing 2.8s ease-out infinite;pointer-events:none}',
'@keyframes rvtRing{0%{transform:scale(1);opacity:.55}70%{transform:scale(1.42);opacity:0}100%{opacity:0}}',
'.rvt-dot{position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:50%;',
'background:#E8622B;border:3px solid #0D1117;box-shadow:0 2px 8px rgba(13,17,23,.4)}',

/* — nudge ———————————————————————————————————————— */
'.rvt-nudge{position:fixed;right:104px;bottom:38px;z-index:9989;background:#0D1117;color:#fff;',
'padding:12px 16px;border-radius:10px;max-width:232px;font:500 13.5px/1.5 Inter,system-ui,sans-serif;',
'box-shadow:0 12px 34px rgba(13,17,23,.34);cursor:pointer;border-left:4px solid #A6CE39;',
'animation:rvtPop .32s cubic-bezier(.34,1.56,.64,1)}',
'@keyframes rvtPop{from{opacity:0;transform:translateX(10px) scale(.94)}to{opacity:1;transform:none}}',
'.rvt-nudge::after{content:"";position:absolute;right:-7px;bottom:19px;width:0;height:0;',
'border-left:8px solid #0D1117;border-top:7px solid transparent;border-bottom:7px solid transparent}',
'.rvt-nudge b{color:#C9F04B}',
'.rvt-nudge button{position:absolute;top:-9px;left:-9px;width:23px;height:23px;border-radius:50%;',
'border:none;background:#5C6672;color:#fff;font-size:13px;line-height:1;cursor:pointer;padding:0}',

/* — panel shell ——————————————————————————————————— */
'.rvt-panel{position:fixed;right:20px;bottom:104px;z-index:9991;width:396px;',
'max-width:calc(100vw - 32px);height:624px;max-height:calc(100vh - 136px);background:#fff;',
'border-radius:16px;box-shadow:0 28px 80px rgba(13,17,23,.44);display:none;flex-direction:column;',
'overflow:hidden;border:1px solid rgba(13,17,23,.12)}',
'.rvt-panel.open{display:flex;animation:rvtIn .26s cubic-bezier(.34,1.4,.64,1)}',
'@keyframes rvtIn{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}',

/* — header ———————————————————————————————————————— */
'.rvt-hd{background:linear-gradient(150deg,#1B242F 0%,#0D1117 70%);color:#fff;padding:12px 14px;',
'display:flex;align-items:center;gap:10px;flex-shrink:0;position:relative}',
'.rvt-hd-ic{width:50px;height:50px;flex-shrink:0;overflow:visible}',
'.rvt-hd-ic svg{width:50px;height:50px;display:block}',
'.rvt-hd-t{font:800 20px/1 "Barlow Condensed",Impact,sans-serif;letter-spacing:.06em;text-transform:uppercase}',
'.rvt-hd-s{font:400 10.5px/1.4 "IBM Plex Mono",ui-monospace,monospace;color:#A6CE39;letter-spacing:.09em;',
'display:flex;align-items:center;gap:5px;margin-top:2px}',
'.rvt-live{width:7px;height:7px;border-radius:50%;background:#A6CE39;box-shadow:0 0 0 0 rgba(166,206,57,.7);',
'animation:rvtLive 2s infinite}',
'@keyframes rvtLive{0%{box-shadow:0 0 0 0 rgba(166,206,57,.65)}70%{box-shadow:0 0 0 7px rgba(166,206,57,0)}100%{box-shadow:0 0 0 0 rgba(166,206,57,0)}}',
'.rvt-x{margin-left:auto;background:none;border:none;color:#8A939E;font-size:23px;cursor:pointer;',
'padding:4px 8px;line-height:1;border-radius:6px}',
'.rvt-x:hover{color:#fff;background:rgba(255,255,255,.1)}',
'.rvt-hazard{height:6px;flex-shrink:0;background:repeating-linear-gradient(135deg,#F5B722 0 11px,#0D1117 11px 22px)}',

/* — flow progress ——————————————————————————————— */
'.rvt-prog{flex-shrink:0;height:0;background:#0D1117;overflow:hidden;transition:height .2s}',
'.rvt-prog.on{height:26px}',
'.rvt-prog-in{display:flex;align-items:center;gap:8px;padding:5px 14px;',
'font:600 10.5px/1 "IBM Plex Mono",ui-monospace,monospace;color:#A6CE39;letter-spacing:.08em}',
'.rvt-prog-bar{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.16);overflow:hidden}',
'.rvt-prog-fill{height:100%;background:#A6CE39;width:0;transition:width .3s ease}',

/* — log & bubbles ——————————————————————————————— */
'.rvt-log{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;',
'background-color:#F4F4F1;background-image:repeating-linear-gradient(0deg,rgba(13,17,23,.045) 0 1px,transparent 1px 24px),',
'repeating-linear-gradient(90deg,rgba(13,17,23,.045) 0 1px,transparent 1px 24px)}',
'.rvt-row{display:flex;gap:8px;align-items:flex-end;max-width:100%}',
'.rvt-row.u{justify-content:flex-end}',
'.rvt-av{width:30px;height:30px;flex-shrink:0;border-radius:50%;background:#0D1117;',
'border:2px solid #A6CE39;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}',
'.rvt-av svg{width:28px;height:28px;margin-bottom:-1px}',
'.rvt-m{max-width:calc(100% - 42px);padding:11px 14px;border-radius:14px;',
'font:400 14.5px/1.62 Inter,system-ui,-apple-system,sans-serif;white-space:pre-wrap;',
'word-wrap:break-word;overflow-wrap:anywhere}',
'.rvt-b{background:#fff;color:#232A33;border:1px solid #E2E2DA;border-bottom-left-radius:4px;',
'box-shadow:0 2px 6px rgba(13,17,23,.05)}',
'.rvt-u{background:#0D1117;color:#fff;border-bottom-right-radius:4px;max-width:82%}',
'.rvt-b a{color:#4F6B0D;font-weight:600}',

/* — intro hero ——————————————————————————————————— */
'.rvt-hero{background:#0D1117;border-radius:14px;padding:14px 14px 12px;display:flex;gap:12px;',
'align-items:center;border:1px solid #2A3138;position:relative;overflow:hidden}',
'.rvt-hero::before{content:"";position:absolute;inset:0;',
'background-image:repeating-linear-gradient(0deg,rgba(166,206,57,.09) 0 1px,transparent 1px 18px),',
'repeating-linear-gradient(90deg,rgba(166,206,57,.09) 0 1px,transparent 1px 18px)}',
'.rvt-hero-fig{width:88px;flex-shrink:0;position:relative;z-index:1}',
'.rvt-hero-fig svg{width:88px;height:110px;display:block;overflow:visible}',
'.rvt-hero-tx{position:relative;z-index:1;color:#fff}',
'.rvt-hero-tx h4{margin:0 0 4px;font:800 21px/1 "Barlow Condensed",Impact,sans-serif;',
'letter-spacing:.05em;text-transform:uppercase;color:#fff}',
'.rvt-hero-tx p{margin:0;font:400 12.5px/1.55 Inter,system-ui,sans-serif;color:#B9C0C8}',
'.rvt-badge{display:inline-block;margin-top:7px;padding:3px 8px;border:1px solid #A6CE39;',
'border-radius:99px;font:600 9.5px/1.4 "IBM Plex Mono",ui-monospace,monospace;color:#C9F04B;letter-spacing:.1em}',

/* — estimate card ————————————————————————————————— */
'.rvt-card{background:#0D1117;border-radius:12px;padding:13px 14px;margin:2px 0;',
'border-left:4px solid #A6CE39;color:#fff;font-family:"IBM Plex Mono",ui-monospace,monospace}',
'.rvt-card-h{font-size:9.5px;letter-spacing:.14em;color:#A6CE39;margin-bottom:9px}',
'.rvt-card-r{display:flex;justify-content:space-between;gap:12px;padding:5px 0;font-size:12px;',
'border-bottom:1px dashed rgba(255,255,255,.13);color:#B9C0C8}',
'.rvt-card-r b{color:#fff;text-align:right}',
'.rvt-card-big{padding:9px 0}',
'.rvt-card-big span{color:#C9F04B}',
'.rvt-card-big b{color:#C9F04B;font-size:17px}',
'.rvt-card-f{margin-top:9px;font-size:9.5px;line-height:1.5;color:#6C7581}',

/* — typing ————————————————————————————————————— */
'.rvt-typing{display:flex;gap:4px;padding:13px 15px;background:#fff;border:1px solid #E2E2DA;',
'border-radius:14px;border-bottom-left-radius:4px}',
'.rvt-typing i{width:7px;height:7px;border-radius:50%;background:#8A939E;animation:rvtB 1.3s infinite}',
'.rvt-typing i:nth-child(2){animation-delay:.18s}.rvt-typing i:nth-child(3){animation-delay:.36s}',
'@keyframes rvtB{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}',

/* — chips ————————————————————————————————————— */
'.rvt-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 12px;background:#F4F4F1;flex-shrink:0;',
'border-top:0}',
'.rvt-chip{background:#fff;border:1.5px solid #A6CE39;color:#0D1117;border-radius:99px;',
'padding:8px 13px;font:600 12.5px/1 Inter,system-ui,sans-serif;cursor:pointer;',
'transition:background .14s,transform .12s;box-shadow:0 1px 3px rgba(13,17,23,.07)}',
'.rvt-chip:hover{background:#C9F04B;transform:translateY(-1px)}',
'.rvt-chip:active{transform:translateY(0)}',
'.rvt-chip.go{background:#0D1117;color:#fff;border-color:#0D1117}',
'.rvt-chip.go:hover{background:#1B242F;color:#C9F04B}',

/* — footer ————————————————————————————————————— */
'.rvt-ft{border-top:1px solid #E2E2DA;background:#fff;padding:11px}',
'.rvt-inrow{display:flex;gap:8px}',
'.rvt-in{flex:1;border:2px solid #E2E2DA;border-radius:9px;padding:11px 13px;',
'font:400 14.5px Inter,system-ui,sans-serif;color:#0D1117;min-width:0;background:#fff}',
'.rvt-in:focus{outline:none;border-color:#A6CE39;box-shadow:0 0 0 3px rgba(166,206,57,.18)}',
'.rvt-go{background:#A6CE39;border:none;border-radius:9px;width:48px;cursor:pointer;',
'display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .14s}',
'.rvt-go:hover{background:#C9F04B}',
'.rvt-go:disabled{opacity:.45;cursor:default}',
'.rvt-go svg{width:19px;height:19px}',
'.rvt-legal{font:400 10.5px/1.5 "IBM Plex Mono",ui-monospace,monospace;color:#8A939E;',
'margin-top:8px;text-align:center}',
'.rvt-legal a{color:#5C6672}',

/* — mascot motion ——————————————————————————————— */
'.rvt-guy{transform-box:fill-box;transform-origin:50% 92%;animation:rvtBob 3.6s ease-in-out infinite}',
'@keyframes rvtBob{0%,100%{transform:translateY(0) rotate(0)}',
'50%{transform:translateY(-1.6px) rotate(-1.1deg)}}',
'.rvt-armw{transform-box:fill-box;transform-origin:85% 90%;animation:rvtWave 3.2s ease-in-out infinite}',
'@keyframes rvtWave{0%,62%,100%{transform:rotate(0)}72%{transform:rotate(-17deg)}',
'80%{transform:rotate(7deg)}88%{transform:rotate(-11deg)}}',
'.rvt-eye{transform-box:fill-box;transform-origin:50% 50%;animation:rvtBlink 5.4s infinite}',
'@keyframes rvtBlink{0%,95.5%,100%{transform:scaleY(1)}97.5%{transform:scaleY(.12)}}',
'.rvt-glint{animation:rvtGlint 6s ease-in-out infinite}',
'@keyframes rvtGlint{0%,72%{transform:translateX(-26px)}88%,100%{transform:translateX(46px)}}',
'.rvt-fab:hover .rvt-guy{animation:rvtNod .62s ease-in-out}',
'@keyframes rvtNod{0%,100%{transform:rotate(0)}30%{transform:rotate(-9deg)}65%{transform:rotate(6deg)}}',

/* — responsive & motion preferences ——————————————— */
'@media(max-width:560px){',
'.rvt-panel{right:8px;left:8px;bottom:92px;width:auto;height:calc(100vh - 112px)}',
'.rvt-fab{width:64px;height:64px;right:15px;bottom:15px}',
'.rvt-nudge{display:none}}',
'@media(prefers-reduced-motion:reduce){',
'.rvt-typing i,.rvt-guy,.rvt-armw,.rvt-eye,.rvt-glint,.rvt-ring,.rvt-live{animation:none}',
'.rvt-fab,.rvt-panel.open,.rvt-nudge{transition:none;animation:none}}'
].join('');

/* ─────────────────────────────────────────────────────────────────────
   THE MASCOT
   Rivet: a hard hat with a face — safety glasses, hi-vis vest, tape
   measure arms, work boots. Inline SVG, so it scales sharp at any size
   and costs no extra request. Unique ids per instance so multiple
   copies on one page don't collide.
   ───────────────────────────────────────────────────────────────────── */
var UID = 0;
function uid(){ return 'rvt' + (++UID); }

/* Head: a face under the hat. Skin, hair poking out beneath the brim,
   safety glasses over the eyes, and a moulded hard hat with a centre
   ridge, side ribs, hazard stripe and rivets sitting on top. Drawn in a
   64-wide space, y roughly 8-50. Skin #EFB98B / #D18F5F and hair #3B2A1E
   are the two colours to swap if you want a different look. */
function headFrag(id){
  return ''
  /* neck */
  + '<path d="M26.8 39h10.4v10.4H26.8z" fill="#D18F5F"/>'
  /* ears */
  + '<ellipse cx="18.4" cy="35.4" rx="3.1" ry="3.7" fill="#E9AC7C"/>'
  + '<ellipse cx="45.6" cy="35.4" rx="3.1" ry="3.7" fill="#E9AC7C"/>'
  /* face */
  + '<path d="M19.4 24h25.2v12c0 6.8-5.7 12.2-12.6 12.2S19.4 42.8 19.4 36z" fill="#EFB98B"/>'
  + '<path d="M36.2 24h8.4v12c0 5.6-3.9 10.4-9.3 11.8 3.3-2.7 5.4-6.9 5.4-11.4z"'
  + ' fill="#D9996A" opacity=".5"/>'
  /* hair: temple tufts and a fringe showing under the brim */
  + '<path d="M19.4 27.6h5.8c-1.5 2.8-2.4 5.8-2.6 8.8-2.1-1.5-3.2-3.8-3.2-6.4z" fill="#3B2A1E"/>'
  + '<path d="M44.6 27.6h-5.8c1.5 2.8 2.4 5.8 2.6 8.8 2.1-1.5 3.2-3.8 3.2-6.4z" fill="#3B2A1E"/>'
  + '<path d="M19.4 24h25.2v7.8c-2.3 1.9-4.6.5-6.4-1-2 2.2-4.4 2.4-6.2.5-1.8 1.9-4.4 1.7-6.3-.4'
  + '-2 1.7-4.4 1.6-6.3-.6z" fill="#3B2A1E"/>'
  /* safety glasses: temples, tinted lenses, eyes behind them */
  + '<rect x="15.2" y="36.6" width="5.6" height="2.1" rx="1" fill="#0D1117"/>'
  + '<rect x="43.2" y="36.6" width="5.6" height="2.1" rx="1" fill="#0D1117"/>'
  + '<clipPath id="'+id+'L"><rect x="19.8" y="34.4" width="11.2" height="6.7" rx="3.3"/></clipPath>'
  + '<clipPath id="'+id+'R"><rect x="33" y="34.4" width="11.2" height="6.7" rx="3.3"/></clipPath>'
  + '<rect x="19.8" y="34.4" width="11.2" height="6.7" rx="3.3" fill="#C9F04B" opacity=".82"/>'
  + '<rect x="33" y="34.4" width="11.2" height="6.7" rx="3.3" fill="#C9F04B" opacity=".82"/>'
  + '<circle class="rvt-eye" cx="25.4" cy="37.7" r="2.1" fill="#2A1E16"/>'
  + '<circle class="rvt-eye" cx="38.6" cy="37.7" r="2.1" fill="#2A1E16"/>'
  + '<circle cx="26.2" cy="37" r=".75" fill="#fff"/>'
  + '<circle cx="39.4" cy="37" r=".75" fill="#fff"/>'
  + '<g clip-path="url(#'+id+'L)"><g class="rvt-glint">'
  + '<rect x="17" y="32" width="3.2" height="12" fill="#fff" opacity=".6" transform="rotate(18 18.6 38)"/>'
  + '</g></g>'
  + '<g clip-path="url(#'+id+'R)"><g class="rvt-glint">'
  + '<rect x="30.2" y="32" width="3.2" height="12" fill="#fff" opacity=".6" transform="rotate(18 31.8 38)"/>'
  + '</g></g>'
  + '<rect x="19.8" y="34.4" width="11.2" height="6.7" rx="3.3" fill="none" stroke="#0D1117" stroke-width="1.7"/>'
  + '<rect x="33" y="34.4" width="11.2" height="6.7" rx="3.3" fill="none" stroke="#0D1117" stroke-width="1.7"/>'
  + '<rect x="30.6" y="36.8" width="3.2" height="1.9" rx=".9" fill="#0D1117"/>'
  /* nose + grin */
  + '<path d="M32 40.8v2.6c0 1-1 1.7-2.1 1.4" stroke="#CE8A5A" stroke-width="1.5"'
  + ' stroke-linecap="round" fill="none"/>'
  + '<path d="M27.8 45.3c1.5 2.2 7 2.2 8.5 0" stroke="#A0523A" stroke-width="1.8"'
  + ' stroke-linecap="round" fill="none"/>'
  /* the hat itself */
  + '<path d="M10.4 27.4C10.4 16 20 8.4 32 8.4s21.6 7.6 21.6 19z" fill="#FBCB3E"/>'
  + '<path d="M32 8.4c12 0 21.6 7.6 21.6 19h-8.4C45.2 18.6 39.8 11.2 32 8.4z" fill="#F0AC16" opacity=".7"/>'
  + '<path d="M26.8 10.6C21 13.6 16.6 19.8 16.2 27.4h-2.6c.4-8.4 5.8-15 13.2-16.8z" fill="#FFE79B"/>'
  + '<path d="M28.6 9.9c1.4-.6 5.4-.6 6.8 0v17.5h-6.8z" fill="#F0AC16"/>'
  + '<path d="M31.2 9.6h1.6v17.8h-1.6z" fill="#E09A0E"/>'
  + '<path d="M23.4 12.4c-3 3.6-4.7 9.2-4.9 15M40.6 12.4c3 3.6 4.7 9.2 4.9 15"'
  + ' stroke="#E09A0E" stroke-width="1.3" fill="none" opacity=".75"/>'
  + '<path d="M5.6 25h52.8a2.8 2.8 0 0 1 2.8 2.8c0 2-2 3.4-4.4 3.4H7.2c-2.4 0-4.4-1.4-4.4-3.4'
  + 'A2.8 2.8 0 0 1 5.6 25z" fill="#F0AC16"/>'
  + '<rect x="6" y="25.2" width="52" height="2" rx="1" fill="#A6CE39"/>'
  + '<circle cx="10.6" cy="28.4" r="1.5" fill="#C9CDD2" stroke="#0D1117" stroke-width=".7"/>'
  + '<circle cx="53.4" cy="28.4" r="1.5" fill="#C9CDD2" stroke="#0D1117" stroke-width=".7"/>'
  + '<path d="M19.4 31.2h25.2v2.2H19.4z" fill="#0D1117" opacity=".15"/>';
}

/* A tape-measure limb: yellow ribbon, black tick marks, steel hook. */
function tape(d, hookX, hookY, rot){
  return '<path d="'+d+'" stroke="#FFD34E" stroke-width="5.4" fill="none" stroke-linecap="round"/>'
  + '<path d="'+d+'" stroke="#0D1117" stroke-width="5.4" fill="none" stroke-linecap="butt"'
  + ' stroke-dasharray="1.3 5.6" opacity=".8"/>'
  + '<g transform="rotate('+rot+' '+(hookX+3)+' '+(hookY+2.3)+')">'
  + '<rect x="'+hookX+'" y="'+hookY+'" width="6.4" height="4.8" rx="1.2" fill="#C9CDD2"'
  + ' stroke="#0D1117" stroke-width="1.1"/></g>';
}

/* Bust — launcher, header, message avatars. viewBox 0 0 64 64 */
function mascotBust(){
  var id = uid();
  return '<svg viewBox="0 8 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
  + '<g class="rvt-guy">'
  /* hi-vis shoulders */
  + '<path d="M13.5 63.5c0-9 8.3-14.9 18.5-14.9s18.5 5.9 18.5 14.9a2.6 2.6 0 0 1-2.6 2.6H16.1a2.6 2.6 0 0 1-2.6-2.6z" fill="#E8622B"/>'
  + '<path d="M19.8 52.8L17.8 66.1M44.2 52.8L46.2 66.1" stroke="#F4F4F1" stroke-width="2.6" opacity=".92"/>'
  /* arms */
  + '<g class="rvt-armw">' + tape('M15.4 53.4C9.2 51.4 5.6 45.4 6.2 38.4', 2.6, 33.4, -22) + '</g>'
  + '<g>' + tape('M48.6 53.4C54.8 51.4 58.4 45.4 57.8 38.4', 55, 33.4, 22) + '</g>'
  + headFrag(id)
  + '<path d="M25.2 48.8L32 57.4l6.8-8.6z" fill="#1B242F"/>'
  + '</g></svg>';
}

/* Full character — the intro card. viewBox 0 0 120 150 */
function mascotFull(){
  var id = uid();
  return '<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'
  + '<ellipse cx="60" cy="141" rx="33" ry="4.6" fill="#0D1117" opacity=".38"/>'
  + '<g class="rvt-guy">'
  /* legs */
  + '<path d="M53 92v30M67 92v30" stroke="#FFD34E" stroke-width="8.4" stroke-linecap="round"/>'
  + '<path d="M53 92v30M67 92v30" stroke="#0D1117" stroke-width="8.4" stroke-dasharray="1.5 7" opacity=".75"/>'
  /* boots */
  + '<path d="M42 120h13v10a3 3 0 0 1-3 3H42a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3z" fill="#2A3138"/>'
  + '<path d="M65 120h13a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H65a3 3 0 0 1-3-3v-10z" fill="#2A3138"/>'
  + '<rect x="37" y="130" width="20" height="4.6" rx="2.3" fill="#0D1117"/>'
  + '<rect x="63" y="130" width="20" height="4.6" rx="2.3" fill="#0D1117"/>'
  /* torso: dark tee under a hi-vis vest */
  + '<rect x="46" y="46" width="28" height="48" rx="5" fill="#2A3138"/>'
  + '<path d="M40 94V64c0-10 6.6-18 12-18v48zM80 94V64c0-10-6.6-18-12-18v48z" fill="#E8622B"/>'
  + '<rect x="40" y="70" width="40" height="4.6" fill="#F4F4F1" opacity=".92"/>'
  + '<rect x="45.6" y="47" width="4" height="47" fill="#F4F4F1" opacity=".92"/>'
  + '<rect x="70.4" y="47" width="4" height="47" fill="#F4F4F1" opacity=".92"/>'
  /* arms: one waving, one holding a clipboard */
  + '<g class="rvt-armw">' + tape('M42 60C26 60 13 54 9 43', 4.2, 37.4, -34) + '</g>'
  + '<g>' + tape('M78 58C88 63 93 73 91 84', 88.2, 82.6, 12) + '</g>'
  + '<g transform="rotate(9 92 96)">'
  + '<rect x="80" y="82" width="26" height="32" rx="2.6" fill="#EFEFE9" stroke="#0D1117" stroke-width="1.6"/>'
  + '<rect x="87" y="78.6" width="12" height="6" rx="2" fill="#C9CDD2" stroke="#0D1117" stroke-width="1.4"/>'
  + '<path d="M84 92h18M84 98h18M84 104h11" stroke="#8A939E" stroke-width="1.8" stroke-linecap="round"/>'
  + '<path d="M84 110h9" stroke="#A6CE39" stroke-width="2.6" stroke-linecap="round"/></g>'
  /* head */
  + '<g transform="translate(22.6,-8.3) scale(1.17)">' + headFrag(id) + '</g>'
  + '</g></svg>';
}

/* ─────────────────────────────────────────────────────────────────────
   MOUNT
   ───────────────────────────────────────────────────────────────────── */
var style = document.createElement('style');
style.setAttribute('data-rivet','');
style.textContent = CSS;
document.head.appendChild(style);

var root = document.createElement('div');
root.className = 'rvt';
root.innerHTML =
  '<button class="rvt-fab" id="rvtFab" type="button" aria-expanded="false" aria-controls="rvtPanel"'
+ ' aria-label="Open Rivet, the AFC chat assistant">'
+ '  <span class="rvt-ring"></span><span class="rvt-clip">' + mascotBust() + '</span>'
+ '  <span class="rvt-dot"></span></button>'
+ '<div class="rvt-panel" id="rvtPanel" role="dialog" aria-modal="false" aria-label="Rivet chat assistant">'
+ '  <div class="rvt-hd"><span class="rvt-hd-ic">'+mascotBust()+'</span>'
+ '    <span><span class="rvt-hd-t">Rivet</span>'
+ '      <span class="rvt-hd-s"><i class="rvt-live"></i>AFC &middot; ESTIMATOR</span></span>'
+ '    <button class="rvt-x" id="rvtX" type="button" aria-label="Close chat">&times;</button></div>'
+ '  <div class="rvt-hazard"></div>'
+ '  <div class="rvt-prog" id="rvtProg"><div class="rvt-prog-in">'
+ '    <span id="rvtProgT">STEP 1 / 3</span>'
+ '    <span class="rvt-prog-bar"><span class="rvt-prog-fill" id="rvtProgF"></span></span>'
+ '  </div></div>'
+ '  <div class="rvt-log" id="rvtLog" role="log" aria-live="polite" aria-atomic="false"></div>'
+ '  <div class="rvt-chips" id="rvtChips"></div>'
+ '  <div class="rvt-ft"><div class="rvt-inrow">'
+ '    <label for="rvtIn" style="position:absolute;left:-9999px">Message Rivet</label>'
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
    xBtn  = document.getElementById('rvtX'),
    prog  = document.getElementById('rvtProg'),
    progT = document.getElementById('rvtProgT'),
    progF = document.getElementById('rvtProgF');

var opened = false;
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────────────────────────────
   RENDERING
   ───────────────────────────────────────────────────────────────────── */
function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function linkify(s){
  return esc(s)
    .replace(/\b(1-800-481-8638)\b/g, '<a href="'+PHONE_HREF+'">$1</a>')
    .replace(/\b([a-z]+@[a-z]+\.com)\b/g, '<a href="mailto:$1">$1</a>');
}
function scroll(){ log.scrollTop = log.scrollHeight; }

function bubble(text, who, rawHTML){
  var row = document.createElement('div');
  row.className = 'rvt-row' + (who === 'u' ? ' u' : '');
  if (who !== 'u'){
    var av = document.createElement('span');
    av.className = 'rvt-av';
    av.innerHTML = mascotBust();
    row.appendChild(av);
  }
  var d = document.createElement('div');
  d.className = 'rvt-m ' + (who === 'u' ? 'rvt-u' : 'rvt-b');
  if (rawHTML) d.innerHTML = rawHTML;
  else d.innerHTML = who === 'u' ? esc(text) : linkify(text);
  row.appendChild(d);
  log.appendChild(row);
  scroll();
  ctx.history.push({ who: who, text: text || '[estimate card]' });
  if (ctx.history.length > 60) ctx.history.shift();
  return row;
}
function hero(){
  var d = document.createElement('div');
  d.className = 'rvt-hero';
  d.innerHTML = '<div class="rvt-hero-fig">' + mascotFull() + '</div>'
    + '<div class="rvt-hero-tx"><h4>Rivet</h4>'
    + '<p>Real 2026 lead costs, live break-even math, and straight answers &mdash; '
    + 'including when the answer is &ldquo;don&rsquo;t buy this.&rdquo;</p>'
    + '<span class="rvt-badge">EYE TO AD MEDIA &middot; EST. 2012</span></div>';
  log.appendChild(d);
  scroll();
}
function typing(){
  var row = document.createElement('div');
  row.className = 'rvt-row';
  row.innerHTML = '<span class="rvt-av">' + mascotBust() + '</span>'
    + '<div class="rvt-typing"><i></i><i></i><i></i></div>';
  log.appendChild(row);
  scroll();
  return row;
}
function setChips(list){
  chips.innerHTML = '';
  if (!list || !list.length) return;
  for (var i=0;i<list.length;i++){
    (function(label){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'rvt-chip' + (/audit|human|break-even/i.test(label) ? ' go' : '');
      b.textContent = label;
      b.addEventListener('click', function(){
        if (CHIP_LINKS[label]){ location.href = CHIP_LINKS[label]; return; }
        handle(label);
      });
      chips.appendChild(b);
    })(list[i]);
  }
}
function say(text, chipList, delay, rawHTML){
  var t = typing();
  setTimeout(function(){
    if (t.parentNode) t.parentNode.removeChild(t);
    bubble(text, 'b', rawHTML);
    setChips(chipList);
  }, reduce ? 60 : (delay || Math.min(1150, 320 + String(text||'').length * 3.2)));
}
function setProg(on, step, total, label){
  if (!on){ prog.className = 'rvt-prog'; return; }
  prog.className = 'rvt-prog on';
  progT.textContent = (label || 'STEP') + ' ' + step + ' / ' + total;
  progF.style.width = Math.round((step - 1) / total * 100) + '%';
}

/* ─────────────────────────────────────────────────────────────────────
   FLOWS
   ───────────────────────────────────────────────────────────────────── */
function askCalc(){
  setChips([]);
  setProg(true, calc.step + 1, CALC_STEPS.length, 'ESTIMATE');
  say(CALC_STEPS[calc.step].q, []);
}
function handleCalc(text){
  var step = CALC_STEPS[calc.step];
  var val = step.parse(text);
  if (val === null){ say(step.e, []); return; }
  calc.data[step.key] = val;
  calc.step++;
  if (calc.step < CALC_STEPS.length){ askCalc(); return; }

  calc.active = false;
  setProg(false);
  var r = calcResult();
  say('', [], reduce ? 60 : 700, calcCardHTML(r));
  setTimeout(function(){
    var tight = r.pct > 90;
    say(r.verdict + (tight
        ? "\n\nIf you want a second pair of eyes on which of those three to fix, that conversation is free."
        : "\n\nWant us to build to that number? The audit's free, you keep it either way, and a person calls you back — usually same day."),
      tight ? ['Talk to a human','Free tools'] : ['Book my free audit','What do leads cost?','Talk to a human']);
  }, reduce ? 140 : 1500);
}

function askLead(){
  setChips([]);
  setProg(true, lead.step + 1, LEAD_STEPS.length, 'DETAILS');
  say(LEAD_STEPS[lead.step].q, []);
}
function handleLead(text){
  var step = LEAD_STEPS[lead.step];
  if (!step.v(text)){ say(step.e, []); return; }
  lead.data[step.key] = text.trim();
  lead.step++;
  if (lead.step < LEAD_STEPS.length){ askLead(); return; }

  setProg(false);
  say("Sending that over\u2026", []);
  send(payload(false), function(state){
    lead.sent = true;
    lead.active = false;
    var extra = ctx.calc
      ? " Your break-even numbers went with it, so nobody's going to make you repeat them."
      : "";
    if (state === 'confirmed'){
      say("Confirmed on our end." + extra + " Someone will call you back within one business day, usually sooner. If you'd rather not wait, "+PHONE+" gets you a person now.",
          ['Free tools','Run my break-even']);
    } else if (state === 'unconfirmed'){
      say("Sent \u2014 with one honest caveat. Your details went through but no delivery receipt came back, so I can't confirm it landed. If you haven't heard from us within one business day, please call "+PHONE+" rather than waiting on us.",
          ['Free tools']);
    } else {
      say("That didn't send, and I'd rather tell you than let it disappear. Please call "+PHONE+" or email "+MAIL+" directly.",
          ['Free tools']);
    }
  });
}

/* ─────────────────────────────────────────────────────────────────────
   MAIN TURN
   ───────────────────────────────────────────────────────────────────── */
function handle(text){
  text = String(text || '').trim();
  if (!text) return;
  bubble(text, 'u');
  input.value = '';
  setChips([]);

  if (calc.active){ handleCalc(text); return; }
  if (lead.active){ handleLead(text); return; }

  var g = guard(text);
  if (g){ say(g, ['Talk to a human','What do leads cost?']); return; }

  var hit = match(text);
  if (!hit){ var f = fallback(); say(f.a, f.c); return; }
  ctx.fallbacks = 0;
  if (hit.trade) ctx.trade = hit.trade;

  if (hit.action === 'calc'){
    calc.active = true; calc.step = 0; calc.data = {};
    say(answerText(hit), []);
    setTimeout(askCalc, reduce ? 120 : 950);
    return;
  }
  if (hit.action === 'lead'){
    lead.active = true; lead.step = 0; lead.data = {};
    say(answerText(hit), []);
    setTimeout(askLead, reduce ? 120 : 1000);
    return;
  }

  ctx.turns++;
  ctx.asked[hit.id] = true;
  say(answerText(hit) + closeLine(hit), hit.c);
}

/* ─────────────────────────────────────────────────────────────────────
   PANEL
   ───────────────────────────────────────────────────────────────────── */
function openPanel(){
  panel.classList.add('open');
  fab.setAttribute('aria-expanded','true');
  var n = document.getElementById('rvtNudge');
  if (n && n.parentNode) n.parentNode.removeChild(n);
  var dot = fab.querySelector('.rvt-dot');
  if (dot) dot.style.display = 'none';
  var ring = fab.querySelector('.rvt-ring');
  if (ring) ring.style.display = 'none';
  if (!opened){
    opened = true;
    hero();
    say(opener(), ['Run my break-even','What do leads cost?','What do you charge?'], reduce ? 60 : 620);
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
go.addEventListener('click', function(){ handle(input.value); });
input.addEventListener('keydown', function(e){
  if (e.key === 'Enter'){ e.preventDefault(); handle(input.value); }
});
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
});

/* Nudge after a pause — once per page view, desktop only, dismissible.
   Trade-aware, so the hook is a number rather than a greeting. */
setTimeout(function(){
  if (opened || window.innerWidth < 560) return;
  var msg;
  if (PAGE.ind && CPL[PAGE.ind]){
    var d = CPL[PAGE.ind];
    msg = PAGE.label + ' leads ran <b>$' + (d.lsa || d.ads) + '</b> in 2026. Want to know what you can afford to pay?';
  } else {
    msg = 'Want to know what leads <b>actually cost</b> in your trade? Ask me.';
  }
  var n = document.createElement('div');
  n.className = 'rvt-nudge'; n.id = 'rvtNudge';
  n.innerHTML = msg + '<button type="button" aria-label="Dismiss">&times;</button>';
  n.addEventListener('click', function(e){
    if (e.target.tagName === 'BUTTON'){ n.parentNode.removeChild(n); return; }
    openPanel();
  });
  root.appendChild(n);
  setTimeout(function(){ if (n.parentNode && !opened) n.parentNode.removeChild(n); }, 15000);
}, 9000);

})();
