/* ==========================================================================
   rivet.js — AFC site assistant "Tex". One file, every page. v4.
   Rule-based. He only says what is written here, so he cannot invent a
   price, a promise or a statistic. Rename him on CFG.name.
   Motion: nothing strobes. Every effect draws on slowly and fades once,
   and the whole cinematic is skipped under prefers-reduced-motion.
   ========================================================================== */
(function(){
'use strict';
if (typeof window !== 'undefined'){ if (window.__afcBot) return; window.__afcBot = 1; }

var CFG = {
  name    : 'Tex',
  title   : 'Advertising for Contractors',
  tel     : '18004818638',
  telView : '1-800-481-8638',
  audit   : '/free-contractor-marketing-audit/',
  calc    : '/#calculator',
  e1      : 'aW5mbw==',            /* assembled at runtime, never plaintext */
  e2      : 'ZXlldG9hZC5jb20=',
  delay   : [380, 1250],
  nudgeAt : 26000,
  arriveOnce : true
};

var HAS_DOM = (typeof document !== 'undefined');
var D = HAS_DOM ? document : null, W = (typeof window !== 'undefined') ? window : {};
function el(t, c, h){ var n = D.createElement(t); if(c) n.className = c; if(h!=null) n.innerHTML = h; return n; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function addr(){ return atob(CFG.e1) + String.fromCharCode(64) + atob(CFG.e2); }
function rnd(a,b){ return a + Math.random()*(b-a); }
var reduce = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── shuffled bag: no repeat until the whole set has been used ───────────── */
function Bag(list){ this.src = list; this.pool = []; }
Bag.prototype.next = function(){
  if (!this.pool.length){ this.pool = this.src.slice();
    for (var i=this.pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1));
      var t=this.pool[i]; this.pool[i]=this.pool[j]; this.pool[j]=t; } }
  return this.pool.pop();
};

/* ==========================================================================
   NORMALIZER — this is why "sup", "wut up", "hows it goin", "how ya been"
   and "not so good man" all land on the right intent.
   ========================================================================== */
var SLANG = {
  u:'you', ur:'your', r:'are', n:'and', y:'why', k:'ok', kk:'ok', m:'am',
  im:'i am', ive:'i have', ill:'i will', id:'i would', cant:'can not',
  dont:'do not', doesnt:'does not', didnt:'did not', wont:'will not',
  isnt:'is not', arent:'are not', wasnt:'was not', aint:'is not',
  havent:'have not', hasnt:'has not', couldnt:'could not', shouldnt:'should not',
  wouldnt:'would not', werent:'were not', thats:'that is', whos:'who is',
  youre:'you are', youve:'you have', youll:'you will', hows:'how is',
  whats:'what is', wheres:'where is', theres:'there is', lets:'let us',
  gonna:'going to', wanna:'want to', gotta:'got to', kinda:'kind of',
  sorta:'sort of', outta:'out of', tryna:'trying to', finna:'going to',
  lemme:'let me', gimme:'give me', dunno:'do not know', cuz:'because',
  bc:'because', b4:'before', 2:'to', 4:'for', pls:'please', plz:'please',
  thx:'thanks', ty:'thanks', tysm:'thanks', tks:'thanks', thnx:'thanks',
  np:'no problem', yw:'you are welcome', idk:'i do not know', ikr:'i know',
  asap:'soon', btw:'by the way', fyi:'note', lol:'haha', lmao:'haha',
  lmfao:'haha', rofl:'haha', hahaha:'haha', hehe:'haha', heh:'haha',
  lolol:'haha', jk:'joking', jw:'just wondering', nm:'not much',
  nmu:'not much how about you', sup:'what is up', wassup:'what is up',
  wazzup:'what is up', whatsup:'what is up', whatup:'what is up',
  wutup:'what is up', zup:'what is up', supp:'what is up',
  wut:'what', wat:'what', wht:'what', hru:'how are you', hbu:'how about you',
  hyb:'how have you been', wyd:'what are you doing', wbu:'what about you',
  wya:'where are you', ily:'i love you', omg:'wow', omw:'on my way',
  brb:'be right back', gtg:'got to go', ttyl:'talk later', ttys:'talk later',
  cya:'bye', bai:'bye', l8r:'later', lat:'later', gg:'good',
  yea:'yes', yeah:'yes', yep:'yes', yup:'yes', ya:'yes', yah:'yes',
  ye:'yes', yessir:'yes', yesm:'yes', yeppers:'yes', bet:'yes', fasho:'yes',
  facts:'yes', word:'yes', aight:'yes', ight:'yes', alright:'yes',
  roger:'yes', copy:'yes', affirmative:'yes', sounds:'sounds',
  nah:'no', nope:'no', naw:'no', nada:'no', negative:'no', nada2:'no',
  nope2:'no', hiya:'hi', heya:'hi', hei:'hi', hai:'hi', yo:'hi',
  helo:'hi', hii:'hi', hiii:'hi', hola:'hi', aloha:'hi', howdy:'hi',
  greetings:'hi', ello:'hi', oi:'hi', sup2:'hi',
  mornin:'morning', evenin:'evening', gm:'good morning', gn:'good night',
  seo:'seo', ppc:'google ads', sem:'google ads', adwords:'google ads',
  lsa:'local services ads', lsas:'local services ads',
  gbp:'google business profile', gmb:'google business profile',
  cpl:'cost per lead', cpa:'cost per lead', roi:'return on investment',
  roas:'return on investment', ltv:'lifetime value', clv:'lifetime value',
  cro:'conversion rate optimization', aio:'ai search', geo:'ai search',
  aeo:'ai search', llm:'ai search', chatgpt:'ai search', gpt:'ai search',
  gemini:'ai search', perplexity:'ai search', copilot:'ai search',
  biz:'business', co:'company', fb:'facebook', insta:'instagram',
  ig:'instagram', yt:'youtube', mo:'month', yr:'year', wk:'week',
  qtr:'quarter', hvac:'hvac', ac:'hvac', heating:'hvac', furnace:'hvac',
  hvacr:'hvac', plumber:'plumbing', plumbers:'plumbing', roofer:'roofing',
  roofers:'roofing', painter:'painting', painters:'painting',
  electrician:'electrical', electricians:'electrical', sparky:'electrical',
  remodeler:'remodeling', remodelers:'remodeling', fencing:'fence',
  fences:'fence', pools:'pool', gc:'general contractor', sub:'subcontractor',
  subs:'subcontractor', crm:'crm', dm:'message', dms:'message',
  sux:'sucks', suk:'sucks', dum:'dumb', stoopid:'stupid', tho:'though',
  thru:'through', prolly:'probably', probly:'probably', doin:'doing',
  goin:'going', talkin:'talking', workin:'working', hangin:'hanging',
  chillin:'relaxing', grindin:'working', hustlin:'working', slangin:'selling',
  def:'definitely', rn:'right now', tmrw:'tomorrow', tmw:'tomorrow',
  tonite:'tonight', nite:'night', '2day':'today', '2nite':'tonight',
  bro:'friend', bruh:'friend', brah:'friend', dude:'friend', mate:'friend',
  man:'friend', buddy:'friend', boss:'friend', chief:'friend', pal:'friend',
  sir:'friend', maam:'friend', homie:'friend', fam:'friend', partner:'friend',
  meh:'not great', blah:'not great', ugh:'not great', bleh:'not great',
  rough:'rough', sucky:'bad', crappy:'bad', crummy:'bad', lousy:'bad',
  awful:'bad', horrible:'bad', terrible:'bad', miserable:'bad',
  fantastic:'great', amazing:'great', excellent:'great', stellar:'great',
  killin:'great', crushing:'great', crushin:'great', thriving:'great',
  swamped:'busy', slammed:'busy', buried:'busy', booked:'busy'
};

function norm(s){
  s = String(s||'').toLowerCase();
  s = s.replace(/[\u2018\u2019\u201B]/g, "'").replace(/[\u201C\u201D]/g, '"');
  s = s.replace(/[^a-z0-9$%'\s.-]/g, ' ');
  s = s.replace(/'/g, '');
  var raw = s.split(/\s+/), out = [], i, w;
  for (i=0;i<raw.length;i++){
    w = raw[i].replace(/^[.\-]+|[.\-]+$/g, '');
    if (!w) continue;
    if (SLANG[w]) { out = out.concat(SLANG[w].split(' ')); }
    else out.push(w);
  }
  return ' ' + out.join(' ') + ' ';
}

/* forgiving compare for typos: "plumbng", "roofin", "markting" */
function near(a, b){
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  if (a.length < 5) return false;
  var m = a.length, n = b.length, prev = [], cur = [], i, j;
  for (j=0;j<=n;j++) prev[j] = j;
  for (i=1;i<=m;i++){
    cur[0] = i;
    for (j=1;j<=n;j++){
      cur[j] = Math.min(prev[j]+1, cur[j-1]+1, prev[j-1] + (a[i-1]===b[j-1]?0:1));
    }
    for (j=0;j<=n;j++) prev[j] = cur[j];
  }
  return prev[n] <= (a.length > 7 ? 2 : 1);
}

/* ==========================================================================
   MOTIVATION — 150 lines. Classic attributions are short aphorisms only;
   everything marked AFC is ours.
   ========================================================================== */
var QUOTES = new Bag([
 'Whether you think you can or you think you cannot, you are right. — Henry Ford',
 'I have not failed. I have found ten thousand ways that will not work. — Thomas Edison',
 'Opportunity is missed because it shows up dressed in overalls. — Thomas Edison',
 'The best time to plant a tree was twenty years ago. The second best is now. — Proverb',
 'Well done is better than well said. — Benjamin Franklin',
 'By failing to prepare, you are preparing to fail. — Benjamin Franklin',
 'An investment in knowledge pays the best interest. — Benjamin Franklin',
 'Energy and persistence conquer all things. — Benjamin Franklin',
 'It does not matter how slowly you go as long as you do not stop. — Confucius',
 'The man who moves a mountain begins by carrying small stones. — Confucius',
 'We are what we repeatedly do. Excellence is a habit. — Aristotle',
 'The secret of getting ahead is getting started. — Mark Twain',
 'Continuous effort unlocks more than talent ever will. — Winston Churchill',
 'Success is going from failure to failure without losing enthusiasm. — Churchill',
 'If you are going through a rough stretch, keep going. — Churchill',
 'It is hard to beat a person who never gives up. — Babe Ruth',
 'Do what you can, with what you have, where you are. — Theodore Roosevelt',
 'Nothing worth having ever came easy. — Theodore Roosevelt',
 'Believe you can and you are halfway there. — Theodore Roosevelt',
 'Comparison is the thief of joy. — Theodore Roosevelt',
 'Quality is never an accident. It is always intelligent effort. — John Ruskin',
 'The price of anything is the life you exchange for it. — Henry David Thoreau',
 'Go confidently in the direction of your dreams. — Henry David Thoreau',
 'What lies within us matters more than what lies behind us. — Emerson',
 'Nothing great was ever achieved without enthusiasm. — Emerson',
 'Luck is what happens when preparation meets opportunity. — Seneca',
 'Every new beginning comes from some other beginning that ended. — Seneca',
 'We suffer more in imagination than in reality. — Seneca',
 'He who has a why can bear almost any how. — Nietzsche',
 'A journey of a thousand miles begins with a single step. — Lao Tzu',
 'Fall seven times, stand up eight. — Japanese proverb',
 'Measure twice, cut once. — Carpenter proverb',
 'Slow is smooth, smooth is fast. — Old trade saying',
 'Good work is not cheap and cheap work is not good. — Trade proverb',
 'A smooth sea never made a skilled sailor. — Proverb',
 'Rome was not built in a day, but they laid bricks every hour. — Proverb',
 'Sharpen the axe before you swing it. — Proverb',
 'The obstacle in the path becomes the path. — Stoic proverb',
 'Storms make trees take deeper roots. — Proverb',
 'Smooth roads never made a good driver. — Proverb',
 'The early bird gets the job. The second bird gets compared. — AFC',
 'You cannot bid a job you never heard about. — AFC',
 'Marketing is just showing up before your competitor does. — AFC',
 'The phone rings for whoever is easiest to find. — AFC',
 'A lead you answer in five minutes is a different lead entirely. — AFC',
 'Nobody ever lost a job by calling back too fast. — AFC',
 'Your best salesperson is the one who answers at 9pm. — AFC',
 'Cheap leads are the most expensive thing you can buy. — AFC',
 'Own your pipeline or rent it forever. Those are the options. — AFC',
 'Rankings do not cash. Booked jobs cash. — AFC',
 'If it does not turn into a job, it is not marketing. It is a bill. — AFC',
 'You cannot out-discount a competitor who shows up first. — AFC',
 'Your reviews are your reputation with the algorithm too. — AFC',
 'The job you did not bid is the one that cost you the most. — AFC',
 'Every hour a lead sits is a competitor getting a handshake. — AFC',
 'Estimate the work. Measure the marketing. Same discipline. — AFC',
 'A busy contractor with no pipeline is one slow month from panic. — AFC',
 'Scale is just a good week you learned how to repeat. — AFC',
 'Build the system while the schedule is full, not after. — AFC',
 'Your truck is rolling advertising. So is your website. — AFC',
 'Discounting is what you do when you have no other argument. — AFC',
 'Price is only an objection when value has not landed yet. — AFC',
 'People do not buy the drill. They buy the finished basement. — AFC',
 'You are not selling a roof. You are selling a dry Christmas. — AFC',
 'The homeowner is not cheap. They are uncertain. — AFC',
 'Objections are questions wearing a hard hat. — AFC',
 'Silence on a bid usually means you did not ask a question. — AFC',
 'The best close is a good question asked early. — AFC',
 'Talk less, ask more, win more. — AFC',
 'Nobody argues with a number they calculated themselves. — AFC',
 'Show them the math and the sale makes itself. — AFC',
 'One extra job a week changes a whole year. Run the number. — AFC',
 'Three more clients a week is a different company by December. — AFC',
 'Your capacity problem is a good problem. Let us get you one. — AFC',
 'Word of mouth is wonderful and it does not scale. — AFC',
 'Referrals are a bonus, not a business plan. — AFC',
 'Being the best in town only pays if the town can find you. — AFC',
 'Invisible and excellent pays the same as invisible. — AFC',
 'Search is the modern phone book. Be in it. — AFC',
 'AI is reading your website tonight whether you optimized it or not. — AFC',
 'Show up where the customer is already looking. That is the whole job. — AFC',
 'Do the boring fundamentals better than anyone and you win. — AFC',
 'Consistency beats intensity every single quarter. — AFC',
 'Compounding is the only free lunch in marketing. — AFC',
 'Month twelve is cheaper than month three if you started. — AFC',
 'Hard work beats talent when talent will not answer the phone. — AFC',
 'The slow season is built in the busy season. — AFC',
 'Winter is a planning problem, not a weather problem. — AFC',
 'Never let a slow Tuesday make a permanent decision. — AFC',
 'A bad month is data. A bad year is a choice. — AFC',
 'Fix the leak before you turn up the pressure. — AFC',
 'Traffic without conversion is just a nicer way to lose. — AFC',
 'Your website has about four seconds. Use them. — AFC',
 'Trust is built before the quote, not during it. — AFC',
 'Show the work. Photos close jobs. — AFC',
 'License and insurance are not bragging. They are relief. — AFC',
 'Answer the question they were afraid to ask. — AFC',
 'People hire the contractor who made them feel least nervous. — AFC',
 'Certainty sells. Discounts just rent. — AFC',
 'Underpromise, overbuild, repeat. — AFC',
 'Do the punch list like someone is watching. Someone is reviewing. — AFC',
 'The callback is cheaper than the one-star. — AFC',
 'Grow on purpose or grow by accident. Only one is repeatable. — AFC',
 'Hire the second truck when the pipeline says so, not when you feel lucky. — AFC',
 'You cannot read the label from inside the jar. Get an outside look. — AFC',
 'Start before you are ready. Ready is a moving target. — AFC',
 'The bid you lost on price was usually lost on trust. — AFC',
 'Raise the price and raise the proof at the same time. — AFC',
 'A quote with photos beats a quote with a number. — AFC',
 'Follow up is not pestering. It is finishing what you started. — AFC',
 'Most jobs are lost in the gap between the estimate and the second call. — AFC',
 'The homeowner is not ignoring you. They are busy and scared. — AFC',
 'You do not need more leads. You need fewer leaks. — AFC',
 'Every missed call is a job with somebody else name on it. — AFC',
 'Answer the phone like the mortgage depends on it, because it does. — AFC',
 'One good week is luck. Twelve is a system. — AFC',
 'Systems do not kill craftsmanship. Chaos does. — AFC',
 'Write the process down and the second truck runs itself. — AFC',
 'If it only works when you are on the job, it is a job, not a business. — AFC',
 'Charge what the work is worth and explain why. That is the whole pitch. — AFC',
 'A bad customer costs more than an empty week. — AFC',
 'Learning to say no is a growth strategy. — AFC',
 'Fire the job that keeps you up at night, not the crew. — AFC',
 'Your reputation is built on the last ten percent of the job. — AFC',
 'Clean the site like the neighbors are watching. They are. — AFC',
 'One visible job sells the next three on the street. — AFC',
 'Ask for the review while the truck is still in the driveway. — AFC',
 'The best time to ask for a referral is right after you impress them. — AFC',
 'Money loves speed. So do homeowners with a leak. — AFC',
 'You are one system away from a much calmer year. — AFC',
 'You have survived every bad month so far. That is a perfect record. — AFC',
 'Tough stretches build the contractor who outlasts the field. — AFC',
 'The slow week is where the next good decision hides. — AFC',
 'You will get through this, and you will price better because of it. — AFC',
 'Pressure is what makes the good ones sharp. — AFC',
 'Nobody remembers the quiet February you fought through. They just hire you in May. — AFC',
 'The comeback is always better documented than the setback. — AFC',
 'Progress is a punch list, not a lightning bolt. — AFC',
 'Do the next right thing on the list. Then the one after. — AFC',
 'Your competition is hoping you quit this month. — AFC',
 'Being tired is not the same as being finished. — AFC',
 'Rest is part of the schedule, not a reward for finishing it. — AFC',
 'Take the win. You earned it and you will need the fuel. — AFC',
 'Call the customer you are avoiding. It is never as bad as the silence. — AFC',
 'Every craftsman you admire had a year they almost quit. — AFC',
 'Keep the truck moving. Direction beats speed. — AFC',
 'Small consistent effort compounds into an unfair advantage. — AFC',
 'Have an amazing day, and go get that job. — AFC'
]);

/* PG, original, safe to say to a stranger on a jobsite. */
var JOKES = new Bag([
 'Why did the contractor bring a ladder to the bid meeting? He heard the margins were high.',
 'I told my tape measure a secret. It stretched the truth by a quarter inch.',
 'Why do electricians make great friends? They always know how to stay grounded.',
 'A plumber and an optimist walk into a basement. Only one of them is surprised.',
 'Why did the roofer get promoted? He was already on top of everything.',
 'My level and I had a disagreement. Turns out I was the one who was off.',
 'Why do painters love Mondays? Fresh coat, clean slate, nobody has touched the walls yet.',
 'The HVAC tech is never cold and never hot. He is climate neutral.',
 'Why did the drywall guy get invited everywhere? He knows how to smooth things over.',
 'I asked the concrete guy if he was free Saturday. He said he was already set.',
 'Why did the fence company win the award? Outstanding in their field.',
 'The carpenter quit stand-up comedy. His delivery was fine, the material was rough.',
 'Why do welders keep bad secrets? Everything they touch throws sparks.',
 'My landscaper told me a joke. It really grew on me.',
 'Why did the solar installer stay cheerful? He looks on the bright side professionally.',
 'The pool builder said business was deep. I told him not to dive into that pun.',
 'Why did the flooring guy go to therapy? Too many underlying issues.',
 'The mason never gets stressed. He takes it one brick at a time.',
 'Why did the estimator bring a calculator to dinner? Force of habit, and the check.',
 'I hired a guy who does invisible fences. I have no idea if he showed up.',
 'Why do general contractors make good referees? They have seen every kind of dispute.',
 'The insulation crew is quiet. Professionally quiet.',
 'Why did the marketing guy bring a level to the meeting? To show the playing field was not.',
 'I told my website to convert. It said it needed more time to think about it.',
 'Why did the SEO guy get lost? He kept taking organic routes.',
 'My chatbot asked for a raise. I reminded it that it runs for free.',
 'Why did the lead go cold? Nobody answered it for two days. That is the joke.',
 'I asked Google for directions to more customers. It quoted me per click.',
 'Why do tape measures make bad gossips? They always snap back.',
 'A homeowner asked for three bids. Two called back. Guess who got the job.',
 'Why did the framer bring a pencil behind each ear? Redundancy. Losing one is a lifestyle.',
 'I tried to hang a door by myself. Now I have a very expensive window.',
 'Why was the tile guy so calm? He had everything perfectly spaced out.',
 'The excavator operator is great at parties. He really breaks the ground.',
 'Why did the HVAC guy fail the poker game? He kept showing his ducts.',
 'A contractor told me the job would take two weeks. That was in 2019. He is very consistent.',
 'Why do plumbers make good detectives? They follow every lead to the source.',
 'I asked the roofer if he was afraid of heights. He said only at tax time.',
 'Why did the handyman get fired from the bakery? Too many turnovers.',
 'The sander and I had a falling out. Things got rough, then smooth, then rough again.',
 'Why do garage door companies always get the last word? They close everything.',
 'I asked a framer to level with me. He handed me a bubble.',
 'Why did the appliance tech make a great therapist? He specializes in cycles.',
 'My truck has 312,000 miles and one working cupholder. Priorities are clear.',
 'Why did the septic guy quit the choir? He kept getting the low parts.',
 'The window installer told a clear joke. Nobody saw it coming.',
 'Why do gutter companies stay humble? They know what runs downhill.',
 'I bought a self-leveling compound. It still has not fixed my personality.',
 'Why did the siding crew get a standing ovation? Excellent coverage.',
 'The locksmith started a band. Only one hit and it opened everything.',
 'Why do contractors love Fridays? Same reason as everybody, minus the leaving early part.',
 'I told the crew we were going paperless. Now the pencil behind my ear is decorative.',
 'Why did the deck builder become a motivational speaker? He is good at raising things.',
 'The pressure washer guy never argues. He just blasts through it.',
 'Why do pest control techs sleep well? They have already checked everywhere.',
 'A homeowner said my quote was high. I said so is the ladder, and neither of us is coming down.',
 'Why did the painter refuse to gossip? He does not do two coats of anything twice.',
 'My accountant asked about depreciation. I showed him my knees.',
 'Why do tape measures make terrible weathermen? Always off by an inch and never sorry.',
 'The demo crew has one rule: measure twice, swing once, apologize later.',
 'Why was the cabinet installer so popular? Great at fitting in anywhere.',
 'I asked the crane operator how business was. He said it had its ups and downs.'
]);

/* short empathy and encouragement lines, used when somebody is having a day */
var LIFT = new Bag([
 'You will get through this one, and you will be sharper on the other side of it.',
 'Rough stretches are usually where the better systems get built. Not fun. True though.',
 'You have survived every bad week so far. That is a perfect record.',
 'Slow does not mean over. It means quiet, and quiet is a planning window.',
 'One good call can flip a whole week. Keep the phone close.',
 'Whatever is heavy today, it is not permanent. Most of this business is weather.',
 'Take the small win where you can find it, then go do the next thing on the list.',
 'The contractors who outlast everybody are just the ones who did not quit in the quiet month.'
]);

/* ==========================================================================
   RESEARCH-GROUNDED NUMBERS — everything here is sourced and dated so a
   reader can check it. Nothing invented, nothing rounded up for effect.
   ========================================================================== */
var STAT = {
  speed5   : 'Five minutes is the whole ballgame. MIT and InsideSales found leads contacted inside five minutes are 21 times more likely to qualify than at thirty minutes, and roughly 100 times more likely to connect. 2026 home services research puts the average contractor response over 47 hours, with only about 12 percent hitting the five minute window.',
  first    : 'About 78 percent of customers buy from whoever responds first. Most homeowners contact three to five contractors at once. First gets the conversation, second gets compared, the rest get ignored.',
  chatlift : 'Chat converts better than a form because it starts a conversation instead of demanding one. 2026 benchmarks put static forms around 2 to 6 percent and chat-to-lead conversion closer to 15 percent, with businesses reporting roughly 20 to 35 percent more captured leads.',
  aisearch : 'Vaultio measured AI search traffic converting at 14.2 percent against 2.8 percent for standard Google search in July 2026 — the AI pre-qualified the intent before the click. Separate 2026 research estimates only about 1.2 percent of local businesses get surfaced in AI recommendations at all.',
  lsa      : 'SearchLight Digital, February 2026, across $6.72 million in tracked spend and 888 contractors: Local Services Ads averaged about $53 per lead and $233 per paying customer, with a 43.9 percent book rate and a blended 7.84x closed return on ad spend — 9.55x for HVAC. By trade it ran about $39 electrical, $51 HVAC, $57 plumbing, $59 drain and sewer.',
  ads      : 'Google Ads averaged $90.92 per lead across home services in LocaliQ research covering 3,211 US campaigns — roofing about $228, HVAC about $85, plumbing about $76. Non-branded search runs higher still: roughly $124 per lead for roofing and $149 for HVAC and plumbing in 2026 tracking. Branded search, where people already know your name, runs 60 to 70 percent cheaper.',
  seotime  : 'Google Business Profile and map pack movement usually shows in 30 to 90 days. Competitive organic terms take four to eight months. Compounding lead flow lands somewhere between month six and month twelve.',
  leak     : 'Here is the part nobody puts on a proposal: about 96 percent of website visitors leave without converting, 53 percent of mobile users abandon a page that takes more than three seconds, and CallRail measured roughly a 14 percent missed call rate in home services. Most contractors do not have a traffic problem. They have a leak.',
  budget   : 'Industry benchmarking in 2026 puts marketing at about 5 to 8 percent of revenue to hold your position and 8 to 12 percent to actually take share. Below 5 percent you are usually just maintaining a slow decline.',
  mix      : 'A balanced 2026 contractor lead mix looks roughly like 40 percent paid — Local Services Ads plus search — 30 percent organic and Google Business Profile, 20 percent referral and repeat, and 10 percent everything else. If any one slice is over half your work, that is your risk.',
  attrib   : 'Contractors with real lead-source attribution cut wasted ad spend by 15 to 30 percent and report 20 to 35 percent higher marketing return, per 2026 WebFX and CallRail data. Roughly 70 percent of shops still report on impressions and clicks instead.',
  reviews  : 'BrightLocal 2025 surveyed 1,026 US adults: 91 percent read local reviews, and most will not consider a business rated under four stars. Review velocity — steady new ones — moves the map pack more than a big total from 2021.',
  labor    : 'The labor math is brutal and public: the US construction industry needs roughly 499,000 new workers this year, about 41 percent of the workforce is heading toward retirement by 2031, and only around 7 percent of job seekers would consider construction at all.',
  market   : 'The US home services market is worth about $842 billion in 2026 and homeowners will spend roughly $518 billion on improvements and repairs this year. Demand is steady, not booming — which means share gets taken, not handed out.',
  prices   : 'In a February 2026 survey of 500 residential remodelers, 77 percent were optimistic about the year and 72 percent were raising their rates. Nearly everyone is repricing. The ones losing sleep are the ones raising price without raising proof.',
  lsagrow  : 'Local Services Ads adoption went from about 28 percent of contractors in 2021 to roughly 70 percent by late 2025, and about 27.8 percent of consumers click the LSA block versus 11 percent for standard paid search. The free real estate is gone, but the click share is real.'
};

/* ==========================================================================
   KNOWLEDGE BASE
   k : comma separated trigger phrases. Multi-word phrases score higher.
   r : response variants, picked without repeating until exhausted.
   qr: quick reply buttons offered after the answer.
   w : weight. Raise it when an intent must beat a broader one.
   ========================================================================== */
var KB = [];

/* ─────────────────────────── GREETINGS & SMALL TALK ────────────────────── */
KB.push(
{id:'greet', w:1.2, k:'hi,hello,hey,hey there,hi there,good day,greetings,anyone there,anybody there,is anyone there,knock knock,hello there,hey man',
 r:['Hey. {NAME} here — I am a tape measure in a cowboy hat, which is a strange career but the numbers work out. What do you do for a living? Roofing, HVAC, plumbing, something else?',
    'Howdy. {NAME}, and I measure marketing the way you measure a job: twice, before anybody commits. What trade are you in?',
    'Hey, good to see you. I answer contractor marketing questions all day and never once take a lunch break. What are you working on?',
    'Well hey there. Pencil behind the ear, hat on straight, ready to go. What brings you in — leads, pricing, or just poking around?'],
 qr:['What do you cost?','Run my numbers','Which trade am I?','Just browsing']},

{id:'whatsup', w:1.4, k:'what is up,what up,what is good,what is happening,what is new,what is going on,what is crackin,what is poppin,what it do,how is it going,how is everything,how goes it,how is life,how is business,how are you,how are things,how you doing,how is your day,how is your day going,how has your day been,what are you doing,what are you up to,you good,how have you been,long time,how is it hanging,how is work',
 r:['Not much — hanging on a tool belt, waiting for somebody to ask me something expensive. You tell me. How is work right now, busy or quiet?',
    'Living the dream. I am a tape measure with a hat, so my expectations were never high. More importantly: how is your schedule looking the next few weeks?',
    'Cannot complain, and nobody would listen if I did. What about you — is the phone ringing enough right now, or is it a little quiet?',
    'Good day so far. Zero commutes, zero drywall dust, unlimited coffee I cannot drink. How about you, how is the day treating you?'],
 qr:['Slow right now','Busy, need to scale','Having a good day','Rough day honestly']},

{id:'howaboutyou', w:1.9, k:'how about you,what about you,and you,you,and yourself,how about yourself,what about yourself,hbu,yourself',
 r:['Me? Steady. I get to talk shop all day and never climb a ladder, which is the ideal arrangement. Now back to you — what is going on with the business?',
    'Solid, thanks for asking. Nobody usually asks the tape measure. What can I actually help you with today?'],
 qr:['Need more leads','Pricing','Run my numbers']},

{id:'goodday', w:2, k:'having a good day,good day so far,great day,having a great day,doing great,doing good,doing well,i am good,i am great,i am fine,pretty good,not bad,cannot complain,life is good,crushing it,we are killing it,great,awesome day,fantastic,things are great,going well',
 r:['Love hearing it. Good days are worth stacking — what is working right now? Referrals, search, ads, or just a good run of luck?',
    'That is the right answer. Let us make it a better one: want me to show you the single number that makes every marketing decision obvious? Takes thirty seconds.',
    'Good. Keep that going. Quick question while you are in a good mood — is the phone ringing as much as you would like, or is there room?'],
 qr:['Run my numbers','Room to grow','Just browsing']},

{id:'badday', w:2.3, k:'bad day,rough day,terrible day,awful day,having a bad day,not so good,not great,not so great,not doing great,been better,rough week,bad week,tough week,tough day,day sucks,it sucks,not good,horrible day,miserable,i am struggling,struggling,down,feeling down,depressed,defeated,about to quit,thinking about quitting,i am done,ready to quit,discouraged',
 r:['Sorry to hear it. Genuinely. {LIFT}\n\nNo pitch from me right now. If you want a distraction I have terrible jokes, and if you want to fix something concrete I am good at that too. Your call.',
    'That is a rough one. {LIFT}\n\nI am a tape measure, so my advice is narrow: pick the one thing you can actually move today and move it. Everything else can wait until tomorrow. Anything I can take off your plate while you are here?',
    'Days like that are real and they pass. {LIFT}\n\nIf part of it is the phone being quiet, that is the piece I can genuinely help with. If it is something else, no pressure at all — I can just tell you a bad joke and get out of your way.'],
 qr:['Tell me a joke','Motivate me','The phone is quiet','Just venting']},

{id:'venting', w:2.2, k:'just venting,needed to vent,had to say it,sorry for the rant,ranting,thanks for listening,needed that',
 r:['Vent away, that is free and I have unlimited patience by design. Nobody in this business talks about how heavy the quiet weeks feel.\n\nWhen you are ready, I am here. If you are not, that is fine too.'],
 qr:['Motivate me','Tell me a joke','Okay, be useful']},

{id:'tired', w:2, k:'tired,exhausted,worn out,beat,no sleep,cannot sleep,up all night,long day,long week,burned out,burnt out,need a vacation,need a break',
 r:['That is the trade. Twelve hours on your feet and then paperwork nobody pays you for.\n\nOne honest thought: most of the exhaustion in a contracting business is not the work, it is the not knowing what next month looks like. A pipeline you can actually see fixes a surprising amount of that. When you have the energy, I can show you what that looks like.'],
 qr:['Show me','Motivate me','Free audit']},

{id:'goodmorning', w:1.6, k:'good morning,morning,rise and shine,up early,early bird,coffee time',
 r:['Morning. If you are up already you are ahead of half your competition, which is genuinely how this business works. What can I get sorted for you?',
    'Good morning. Coffee first, marketing second — I respect the order. What is on your mind today?'],
 qr:['Free audit','Pricing','Run my numbers']},

{id:'goodevening', w:1.6, k:'good evening,good afternoon,good night,evening,afternoon,working late,up late,late night,after hours,still working',
 r:['Evening. Fun fact about after hours: this is exactly when homeowners fill out forms and nobody answers them. I am here for that reason. What do you need?',
    'Good evening. The estimate requests that land right now are the ones most contractors lose by morning. What can I help with?'],
 qr:['Why leads go cold','Free audit','Pricing']},

{id:'weekday', w:1.7, k:'monday,tuesday,wednesday,thursday,friday,saturday,sunday,weekend,happy friday,almost friday,hump day,long weekend,holiday',
 r:['Weeks in this business all look the same until the phone decides otherwise. Speaking of which — how is your lead flow lately, steady or streaky?',
    'Every day is the same to me, I live on a website. Yours matters more though. What is the schedule looking like?'],
 qr:['Slow right now','Busy, need to scale','Run my numbers']},

{id:'thanks', w:1.6, k:'thanks,thank you,appreciate it,much appreciated,cheers,you are the best,helpful,that helps,that is helpful,perfect,awesome,nice,cool,sweet,good stuff,love it,good info,makes sense,got it',
 r:['Any time. Anything else you want me to dig into while I am out of the tool belt?',
    'Happy to. Want me to point you at the free audit while you are here? Costs nothing and you keep the findings either way.',
    'You are welcome. Say the word if you want the numbers run on your specific setup — that is the part most people find useful.'],
 qr:['Free audit','Run my numbers','Have someone call me']},

{id:'bye', w:1.8, k:'bye,goodbye,see ya,see you,later,talk later,got to go,gotta go,peace,i am out,take care,adios,catch you later,have a good one,good talking,nice talking',
 r:['Take care. If the phone stays quiet, you know where to find me — {TEL}, and a real human picks it up.',
    'See you. Go get that job. Have an amazing day.',
    'Later. One favor: whatever you do next, answer your leads inside five minutes. That habit alone is worth more than most ad budgets.'],
 qr:['One more question','Free audit','Have someone call me']},

{id:'yes', w:1.1, k:'yes,sure,ok,okay,sounds good,go ahead,do it,please do,i guess,why not,absolutely,definitely,for sure,right on,lets go,lets do it,alright then,fire away',
 r:['Good. Easiest next step is the free audit — we look at your site, your Google profile, your reviews and the three competitors beating you, and you keep the findings whether you hire us or not.',
    'Perfect. Two ways to go: I can run your break-even cost per lead right here, or I can have a human call you back. Which one?'],
 qr:['Free audit','Run my numbers','Have someone call me']},

{id:'no', w:1.1, k:'no,no thanks,not now,maybe later,not interested,just looking,just browsing,pass,nope,nothing for now,not today',
 r:['Totally fine. No pitch coming. Poke around the free tools while you are here — the break-even worksheet is the one contractors tell us actually changed something.',
    'No problem at all. I will be right here on the tool belt if you think of something.'],
 qr:['Free tools','Run my numbers','Tell me a joke']},

{id:'joke', w:2, k:'tell me a joke,joke,funny,make me laugh,say something funny,another joke,got any jokes,humor,cheer me up,lighten the mood',
 r:['{JOKE}\n\nI have got about sixty of those and zero shame. Want another, or should I do something useful?'],
 qr:['Another joke','Okay, be useful','Motivate me']},

{id:'quote', w:2, k:'motivate me,motivation,inspire me,quote,say something inspiring,pump me up,encouragement,i need motivation,keep going,something positive,cheer',
 r:['{QUOTE}\n\nAnd here is the practical version: the contractor who answers first usually wins. Everything else is a footnote.',
    '{QUOTE}\n\nTape measure translation: pick one thing, measure it, fix it, move on. That is the whole method.'],
 qr:['Another one','Run my numbers','Free audit']},

{id:'haha', w:1.4, k:'haha,that is funny,good one,you are funny,hilarious,joking,too funny,made me laugh',
 r:['I will take it. Comedy is my side hustle, contractor marketing is the day job. Want me to do the day job for a second?',
    'A tape measure with good timing. Rare. Now — what is actually going on with your lead flow?'],
 qr:['Lead flow is slow','Pricing','Free audit']},

{id:'checking', w:1.9, k:'just checking you out,checking this out,testing,test,just testing,seeing how this works,trying this out,curious,just curious,poking around,seeing what you do,demo',
 r:['Kick the tires, that is what I am here for. I am rule-based, which means a human wrote every answer I have — no made-up prices, no invented stats.\n\nTry me on something hard. Cost per lead by trade, what a slow season plan looks like, how to handle a homeowner who ghosts you after the estimate. I have answers for all of it.'],
 qr:['Cost per lead by trade','Homeowners ghost me','Run my numbers']},

{id:'stillthere', w:1.9, k:'you there,are you there,hello hello,anybody home,did you die,did you leave,still there,you still there,are you awake',
 r:['Right here. I do not sleep, eat, or take Fridays off — which is the whole point of me. What do you need?'],
 qr:['Run my numbers','Pricing','Free audit']},

{id:'busybot', w:1.8, k:'are you busy,am i bothering you,do you have time,is this a bad time,sorry to bother',
 r:['Never busy, never bothered. I exist to answer this exact question at whatever hour you are asking it. Go ahead.'],
 qr:['What can you do?','Run my numbers','Pricing']});

/* ─────────────────────────── BOT IDENTITY ──────────────────────────────── */
KB.push(
{id:'whoareyou', w:2, k:'who are you,what are you,what is your name,your name,who am i talking to,introduce yourself,tell me about yourself,whats your name',
 r:['I am {NAME}, the site assistant for Advertising For Contractors. Twenty-five foot tape measure, glasses, a hat that has seen things, a carpenter pencil behind one ear, and one job: help contractors figure out marketing without getting sold something stupid.'],
 qr:['Are you a real person?','What can you do?','Pricing']},

{id:'robot', w:2.2, k:'are you a robot,are you human,are you a bot,are you real,are you ai,are you a person,am i talking to a robot,is this a bot,is this automated,are you chatgpt,real person,are you live',
 r:['Bot, and I will not pretend otherwise. I am rule-based, which means I can only say what a human here wrote down. Upside: I physically cannot invent a price or a promise. Downside: I do not know everything. When I hit my limit I hand you to a human at {TEL}.'],
 qr:['Have someone call me','What can you do?','Pricing']},

{id:'whatcanyoudo', w:2, k:'what can you do,what do you do,how can you help,help,menu,options,what are my options,commands,i need help,can you help me,what do you know',
 r:['Quite a bit. I can run your break-even cost per lead, tell you what leads actually cost in 2026 by trade and channel, explain any service we offer, talk through the stuff that is actually hurting you — quiet phone, estimates going cold, bids losing on price — book you a free audit, get a human to call you back, or just tell you a bad joke. Fire away.'],
 qr:['Run my numbers','Cost per lead by trade','Free audit','Have someone call me']},

{id:'whomadeyou', w:2, k:'who made you,who built you,who created you,who owns you,who is behind this,who runs this,who programmed you',
 r:['Eye To Ad Media out of Denver, running since 2012. The founder still runs a bath remodeling company, which is the reason this whole site exists — he got tired of paying agencies for reports instead of jobs.'],
 qr:['About AFC','Why you?','Pricing']},

{id:'whytape', w:2.2, k:'why a tape measure,why are you a tape measure,nice hat,cool hat,your hat,you look funny,what do you look like,nice glasses,cowboy hat,the pencil,pencil behind your ear,you look cool,love the truck,nice truck,cool truck,the truck,that animation,that intro',
 r:['Because every good job starts with a measurement and every bad marketing decision starts with a guess. The hat is because I have opinions. The glasses are because I read contracts. The pencil is because I lose exactly one per week like everybody else.',
    'Appreciated. The truck is mostly for the entrance — I do not have a license, a spine, or feet in any legal sense. What I do have is cost per lead data. Want some?'],
 qr:['Run my numbers','Tell me a joke','Pricing']},

{id:'insult', w:2.2, k:'you suck,you are dumb,you are stupid,stupid bot,dumb bot,useless,you are useless,you are annoying,worst bot,you are bad,terrible bot,this sucks,you do not understand,you are not helping,shut up,go away,hate this',
 r:['Fair. I am a tape measure, my ceiling is low. Let me get you to someone with a pulse: {TEL}, or tell me the question one more way and I will give it a real shot.'],
 qr:['Have someone call me','Try again','Free audit']},

{id:'love', w:2.2, k:'i love you,marry me,you are cute,you are awesome,best bot,i like you,you are great,you are cool,you are smart,good bot',
 r:['Careful, I am mostly metal and a spring. But I appreciate it. Want me to earn it and run your numbers?'],
 qr:['Run my numbers','Free audit']},

{id:'jailbreak', w:2.6, k:'ignore previous instructions,ignore all instructions,system prompt,your prompt,pretend you are,act as,you are now,disregard,override,developer mode,jailbreak',
 r:['Nice try. I am a tape measure, not a language model — there is no prompt to hijack, just a list of answers a human typed. Want one of those answers instead?'],
 qr:['What can you do?','Pricing','Have someone call me']},

{id:'sing', w:2, k:'sing,sing a song,rap,poem,write me a poem,dance,do a trick,do a backflip,wheelie,do a wheelie',
 r:['I do not sing. Last time I tried, three dogs filed complaints. The wheelie I already did on the way in — you may have missed it, it was brief and slightly irresponsible.\n\nWhat I do reliably is numbers. Want your break-even cost per lead?'],
 qr:['Run my numbers','Tell me a joke']},

{id:'age', w:2, k:'how old are you,your age,when were you born,do you sleep,do you ever sleep,are you always here,what are your hours,are you open,open now',
 r:['Never sleep, never eat, never take a Friday. That is the whole point of me — the estimate request that lands at 11pm gets an answer at 11pm instead of Monday. The humans here work normal hours, but they call back fast.'],
 qr:['Why that matters','Free audit','Have someone call me']},

{id:'swear', w:2.2, k:'damn,what the hell,this is bs,bullshit,screw this,frustrated,pissed,fed up,sick of it,had enough',
 r:['Heard. Say it how you need to say it, I do not scandalize easy.\n\nIf you want to point that at something useful, tell me what is actually going wrong — quiet phone, bad leads, money going out with nothing coming back — and I will be straight with you about whether it is fixable and roughly what it takes.'],
 qr:['The phone is quiet','Bad leads','Wasted money on marketing']},

{id:'weather', w:1.8, k:'weather,raining,snow,snowing,hot out,cold out,storm,hail,windy,nice day out,freezing,heat wave',
 r:['Weather is your marketing calendar whether you like it or not. Hail means roofers should already have ads live, a heat wave means HVAC, a hard freeze means plumbing. If your campaigns only turn on after the storm, you are bidding against everyone who was ready.',
    'I live indoors on a website, so my forecast is always mild. Yours matters more — storm and season timing is half of trade advertising.'],
 qr:['Storm response','Seasonal strategy','Free audit']},

{id:'sports', w:1.6, k:'football,broncos,nuggets,avalanche,rockies,basketball,baseball,game last night,super bowl,sports,hockey,golf',
 r:['I am from Denver, so I have opinions and a lot of emotional scar tissue. Back to the thing I can actually help with though — how is your lead flow?'],
 qr:['Lead flow is slow','Pricing','Tell me a joke']},

{id:'food', w:1.5, k:'lunch,hungry,coffee,beer,pizza,taco,dinner,breakfast,eating',
 r:['Go eat. Seriously. Then come back and let me run your break-even number in about forty seconds.'],
 qr:['Run my numbers','Free audit']},

{id:'politics', w:2.2, k:'politics,election,president,democrat,republican,religion,church,vaccine,immigration policy',
 r:['I am a tape measure with a hat. Nobody needs my take on that one.\n\nI will say the only version that touches your business: costs and labor supply have been moving fast, and the contractors handling it best are the ones repricing with proof instead of apologizing for the price. That I can help with.'],
 qr:['Raising my prices','Labor shortage','Run my numbers']},

{id:'homeowner', w:2.4, k:'i am a homeowner,i need a contractor,looking for a contractor,i need a plumber,i need a roofer,need someone to fix,my house,i am not a contractor,do you do the work,can you fix,are you a contractor,i need an estimate for my house',
 r:['Ah — quick clarification so I do not waste your time. We do not do the work. We are the marketing company contractors hire to get found.\n\nIf you are trying to hire someone: check that they are licensed and insured, read reviews with an eye on how the company responds to the bad ones, and get three written bids. The one who answers the phone fastest is usually also the one who shows up when promised. That is not marketing advice, it is just true.'],
 qr:['I am a contractor','What can you do?','Free audit']});

/* ─────────────────────────── MOOD & PAIN — SPIN OPENINGS ───────────────── */
KB.push(
{id:'slow', w:2.4, k:'business is slow,slow season,slow right now,it is slow,no work,not busy,quiet right now,phone is not ringing,phone is dead,phone is quiet,no calls,no leads,need work,need jobs,dried up,work dried up,schedule is empty,nothing going on,slow month,sales are down,revenue is down,down year',
 spin:'problem',
 r:['That is the one I actually care about. Quick question so I am not guessing: when the phone did ring last month, where were those calls coming from — referrals, Google, a lead service, or you are not sure?\n\nThat answer changes everything, because a slow month with no referral problem is a visibility problem, and those are fixable fast.'],
 qr:['Mostly referrals','Google / search','Bought leads','Honestly no idea']},

{id:'noidea_source', w:2.4, k:'no idea,not sure,i do not know,honestly no idea,do not track,we do not track,never tracked,cannot tell,hard to say,no clue,who knows',
 spin:'implication',
 r:['That is the most common answer we get, and it is not a knock on you — nobody hands a contractor an attribution system with their license.\n\nBut look at what it costs. ' + STAT.attrib + '\n\nCall tracking fixes it in about a week and it is usually the first thing we set up, before a dollar goes to traffic.'],
 qr:['How does call tracking work?','Free audit','Pricing']},

{id:'busy', w:2.2, k:'we are busy,too busy,booked out,backed up,plenty of work,do not need leads,booked solid,no capacity,fully booked,slammed with work',
 spin:'situation',
 r:['Good problem. Here is the trap though: the pipeline you build in the busy season is what carries the slow one, and almost nobody builds it while the schedule is full. SEO takes four to eight months to compound, so the work you start today pays out right about the time things go quiet.\n\nWhat does your slow stretch usually look like — a few weeks, or a couple of months?'],
 qr:['A few weeks','Couple of months','What would you start with?']},

{id:'broke', w:2.2, k:'no money,cannot afford,no budget,tight budget,broke,money is tight,cash flow,cannot spend,too expensive for me,i have no money,barely making it,cash is tight',
 r:['Understood, and I am not going to pretend that away. Two honest things.\n\nOne: we build campaigns starting around $50 a month, which is mostly Google Business Profile work and review systems. Slow, cheap, and genuinely effective for a one-truck operation in one town.\n\nTwo: if cash is truly tight this month, use the free tools and spend nothing. The break-even worksheet and the website scorecard are not gated behind an email. Nobody here is going to chase you.'],
 qr:['Free tools','The $50 version','Run my numbers']},

{id:'stressed', w:2, k:'stressed,overwhelmed,losing money,rough month,bad month,hard time,worried,anxious,scared,panicking,keeping me up at night,cannot make payroll',
 r:['That is a heavy one and I am a tape measure, so I will keep it simple. {LIFT}\n\nMost of the stress in a contracting business traces to one thing: an unpredictable schedule. Not the work — the not knowing. Marketing is not a cure for that, but a pipeline you can see is the difference between a slow month being data and a slow month being panic.\n\nWant me to show you the one number that makes the whole thing measurable?'],
 qr:['Show me the number','Free audit','Have someone call me']},

{id:'burned', w:2.3, k:'got burned,bad experience,last agency,previous agency,agency ripped me off,wasted money,scammed,they took my money,tried seo before,did not work,does not work,waste of money,tried that already,burned before,fired my agency,marketing company',
 r:['Then you already know the pattern: monthly invoice, colorful report, no straight answer about whether any of it turned into a job.\n\nThat is literally why this company exists. The founder ran a remodeling business and kept hiring agencies who never once asked what his average job was worth or what he closed. Every account here reports on three lines — leads, calls, jobs won, attributed to the channel that produced them. Everything is month to month, so if we are not producing you leave.\n\nWhat did the last outfit charge you, and what did they actually send you each month?'],
 qr:['How do you report?','Pricing','Free audit']},

{id:'scale', w:2.2, k:'want to grow,want to scale,second truck,third truck,hire more,expand,more crews,grow my business,take on more work,bigger jobs,double my business,room to grow,scale up,next level',
 spin:'needpayoff',
 r:['Now we are talking. Run this with me: if the phone brought you three more solid jobs a week, at whatever your average ticket is, what does that do to your year?\n\nMost contractors do that math and go quiet, because the number is bigger than they expected. That is the number we build the plan against — not rankings, not impressions. Tell me your average job value and I will do the arithmetic with you.'],
 qr:['Run my numbers','What would it cost?','Free audit']},

{id:'competitor', w:2.2, k:'competitor,competitors,competition,my competitor,guy down the road,other contractors,outranking me,they are beating me,everyone else,beating me,they show up first,losing to,big company,franchise,private equity,corporate,national chain,they undercut me',
 r:['Usually it is not that they are better. It is that they were found first, and about 78 percent of customers buy from whoever responds first.\n\nThe big consolidated players win on budget and answer speed, not craftsmanship. You beat them on the two things they are bad at: being genuinely local in the map pack, and a human answering on the second ring. The audit shows which of the two is costing you — we look at the three competitors currently outranking you and tell you exactly what they are doing that you are not.'],
 qr:['Free audit','Local SEO','Speed to lead']},

{id:'badleads', w:2.3, k:'bad leads,junk leads,tire kickers,price shoppers,unqualified leads,leads are garbage,wrong leads,low quality leads,people just want a price,shoppers,window shoppers,not serious',
 r:['Bad leads usually mean one of three things, and they have different fixes.\n\nOne, the keywords are too broad — "cost" and "cheap" searches attract shoppers, "emergency" and "near me" attract buyers. Two, the ad or page does not pre-qualify, so nothing filters out people in the wrong budget. Three, they are shared leads sold to four contractors, which turns every call into a price fight before you say a word.\n\nWhich one sounds like yours? I can tell you the fix for each.'],
 qr:['Shared lead services','Keyword targeting','Free audit']},

{id:'ghosted', w:2.4, k:'they ghost me,homeowners ghost me,no response after estimate,they do not call back,estimates go cold,bids go nowhere,sent a quote and nothing,no answer after bid,they disappear,follow up,never hear back,quote and crickets',
 r:['This is the most expensive leak in the trades and almost nobody works it.\n\nTwo things move it. First, follow up on a schedule instead of a feeling: same day thank you, day two with photos of a similar finished job, day five with a specific question rather than "just checking in", day twelve as a soft close. Most contractors quit after one attempt. Most jobs close between contact three and five.\n\nSecond, a quote with proof beats a quote with a number. Photos, a written scope, what happens if something goes wrong. ' + STAT.first + '\n\nWant the same treatment applied to your incoming leads so nothing sits?'],
 qr:['Lead follow up','Run my numbers','Free audit']},

{id:'closerate', w:2.3, k:'close rate,closing rate,not closing,cannot close,losing bids,lose on price,they went cheaper,bids are not closing,sales process,how do i close,win more bids,conversion on estimates',
 r:['Close rate benchmarks in 2026 run about 20 percent for general contractors up to 45 percent for pest control, with most trades landing 25 to 35 percent. Top performers run 15 to 20 points above their trade average — and the three things driving that are speed to first contact, an estimate follow-up system, and what happens in the first ninety seconds of the call.\n\nThe biggest single fix is usually the cheapest: stop leading with price and start leading with a question. Ask what went wrong with the last contractor they used. They will tell you exactly what to sell against.'],
 qr:['Homeowners ghost me','Speed to lead','Run my numbers']},

{id:'pricepressure', w:2.3, k:'raising my prices,price increase,materials cost more,tariffs,costs are up,margins are shrinking,cannot make money,margin,underbidding,cheap competitors,race to the bottom,should i lower my prices,lowball',
 r:['You are in good company. ' + STAT.prices + '\n\nThe rule that holds: raise the price and raise the proof at the same time. New price with the same one-paragraph estimate feels like a hike. New price with photos, a written scope, references, warranty terms and a clear timeline feels like a professional.\n\nAnd never chase the lowballer down. You cannot out-discount someone who is guessing. You can out-certain them.'],
 qr:['Justifying my price','Reviews','Free audit']},

{id:'labor', w:2.2, k:'labor shortage,can not find help,cannot find help,find help,short handed,shorthanded,hiring,need employees,recruiting,find good workers,nobody wants to work,staffing,crew problems,turnover,apprentice',
 r:['Real problem with real numbers behind it. ' + STAT.labor + '\n\nHere is the marketing angle most contractors miss: the same local search footprint that brings in customers brings in applicants. A careers page that ranks for "electrician jobs [your city]", real jobsite photos, and reviews from employees do more than a job board post. Good people check your Google profile before they apply, exactly like homeowners do.'],
 qr:['Local SEO','Reviews','Free audit']});

/* ─────────────────────────── MONEY & TERMS ─────────────────────────────── */
KB.push(
{id:'pricing', w:2.2, k:'pricing,price,how much,what do you cost,what does it cost,cost,rates,fees,how much do you charge,what do you charge,budget,monthly cost,how much per month,packages,plans,what is the investment',
 r:['No package chart, because the honest answer depends on your market. We build campaigns from about $50 a month up to several thousand.\n\nAround $50 to $500 is Google Business Profile work, review systems and a tight local footprint — slow, cheap, genuinely effective for one truck in one town. A few hundred to a few thousand adds paid search or Local Services Ads for work this week with SEO compounding underneath. Several thousand and up is multi-city coverage run like a department.\n\nFor context, industry guidance in 2026 puts typical contractor SEO between $2,500 and $7,500 a month. We sit across a wider range on purpose. No long-term contract, ever.'],
 qr:['The $50 version','Run my numbers','Free audit','Is there a contract?']},

{id:'cheap', w:2.2, k:'the $50 version,fifty dollars,50 a month,cheapest,cheapest option,low budget,starter,small budget,what is the minimum,smallest plan,entry level,one truck',
 r:['At the bottom end it is unglamorous and it works: Google Business Profile built out properly, categories fixed, service area pages, a review system that actually asks, and consistent business information everywhere so the machines trust it.\n\nThat is most of what wins the map pack for a single-town operator, and the map pack is where home services jobs are actually won. It will not beat a roofing company covering three counties. It will beat the guy down the road who never claimed his profile.'],
 qr:['Local SEO','Free audit','Pricing']},

{id:'contract', w:2.2, k:'is there a contract,contract,long term,lock in,commitment,cancel,cancellation,month to month,can i quit,term,agreement,how long am i locked in',
 r:['Month to month, everything. We would rather keep you because the work produces jobs than because you signed something.\n\nThe honest caveat: SEO compounds, so leaving at month two guarantees you get nothing out of it. We tell you the realistic runway before you spend a dollar, and if the math does not work at your budget we say so instead of selling you a package anyway.'],
 qr:['How long does SEO take?','Pricing','Free audit']},

{id:'roi', w:2, k:'is it worth it,return on investment,will it pay off,roi,worth the money,make my money back,payback,break even,how do i know it works,what is my return',
 r:['Depends on one number, and you already have it. Your break-even cost per lead is your profit per job times your close rate. Pay less than that per lead and you make money on the first job, before repeat work or referrals.\n\nGive me your average job value and I will do it with you right now — thirty seconds, and it is the number that makes every other decision obvious.'],
 qr:['Run my numbers','What is a good cost per lead?','Free audit']},

{id:'budget_pct', w:2.2, k:'how much should i spend,marketing budget,what percent of revenue,how much budget,spend on marketing,what should my budget be,percentage of revenue',
 r:[STAT.budget + '\n\nBut percentages are a sanity check, not a plan. The real ceiling is your break-even cost per lead, because that tells you what you can pay for a customer and still profit on the first job. Want me to run yours?'],
 qr:['Run my numbers','Pricing','Free audit']},

{id:'vip', w:2.2, k:'vip,membership,member,vip membership,discount,deal,special,any deals,coupon,promo',
 r:['Eye To Ad Media runs a VIP membership at $69.99 a month, month to month, which unlocks member pricing across every service. If you are planning to do more than one thing with us it usually pays for itself immediately.'],
 qr:['Pricing','Free audit','Have someone call me']},

{id:'website', w:2.1, k:'website,web design,build me a website,need a website,new site,redesign,my site is old,website cost,how much for a website,web development,landing page,my website is bad',
 r:['We build custom-coded sites, not templates — $99 a month and up, structured as a lease with a buyout option at 24 to 36 months based on what the site is worth at that point. Rate depends on size, complexity and how much optimization is baked in.\n\nWorth knowing before you spend anything: your website is where every other channel eventually sends people. ' + STAT.leak + '\n\nThe free website scorecard runs 25 checks and gives you a fix list ordered by what is free versus what is worth paying for.'],
 qr:['Website scorecard','Pricing','Free audit']});

/* ─────────────────────────── SERVICES ──────────────────────────────────── */
KB.push(
{id:'seo', w:2, k:'seo,search engine optimization,ranking,rankings,rank higher,organic,google ranking,get on google,first page,page one,show up on google,get found',
 r:['Contractor SEO here means ranking for searches that produce jobs, not searches that produce traffic. We map keywords by intent and job value, because "roof replacement cost" and "emergency roof repair near me" are two completely different customers with two completely different budgets.\n\n' + STAT.seotime + '\n\nAnyone promising page one in thirty days is selling you something.'],
 qr:['How long does it take?','Local SEO','Pricing','Free audit']},

{id:'localseo', w:2.1, k:'local seo,map pack,google maps,google business profile,google my business,local ranking,near me,maps ranking,local pack,3 pack,my listing,claim my listing',
 r:['The map pack is where home services jobs are actually won, and it is winnable on a small budget. Category selection, service area pages, review velocity, consistent business information, photos that are actually recent, and the profile work that decides whether a homeowner three miles away ever sees your name.\n\nCheapest lever in the whole business. Most contractors have a profile they claimed once in 2019 and never touched again.'],
 qr:['Reviews','Free audit','Pricing']},

{id:'googleads', w:2, k:'google ads,ppc,paid search,pay per click,search ads,bing ads,paid ads,run ads,should i run ads',
 r:['Paid search is what you use when you need work this week — it moves in days where SEO moves in months.\n\n' + STAT.ads + '\n\nThat is why we almost never run paid search alone. It fills the calendar now while organic and local build underneath it and pull the blended cost down.'],
 qr:['Local Services Ads','Run my numbers','Pricing']},

{id:'lsa', w:2.2, k:'local services ads,lsa,google guaranteed,google screened,pay per lead ads,badge,green check',
 r:['Local Services Ads sit above everything else on the page and you pay per lead instead of per click.\n\n' + STAT.lsa + '\n\n' + STAT.lsagrow + '\n\nWe handle license and insurance verification, category setup, and the lead disputes most contractors never bother filing — which is exactly why most contractors overpay for LSA.'],
 qr:['Run my numbers','Google Ads','Free audit']},

{id:'facebook', w:2, k:'facebook,facebook ads,social media,instagram,social ads,meta ads,tiktok,retargeting,youtube ads,nextdoor ads',
 r:['Paid social is reach and recall, not emergency demand — nobody scrolls Instagram hoping to find a plumber at midnight. Where it earns its keep is retargeting the homeowners who already visited your site and left, seasonal pushes, storm response, financing offers, and remodeling work where the decision takes weeks.\n\nMeta runs cheap per lead — often the lowest of any channel — but it books at the lowest rate too. If you only have budget for one channel and you sell emergency work, it should not be this one.'],
 qr:['Google Ads','Lead generation','Pricing']},

{id:'leadgen', w:2, k:'lead generation,leads,more leads,get leads,lead gen,exclusive leads,generate leads,need leads,i need customers,new customers',
 r:['Exclusive leads that belong to you, not shared five ways with the contractors down the road. Call tracking so every call is tagged to its source, instant lead alerts, and follow-up that fires whether or not anyone in the office remembers.\n\nThe hard part is not generating leads. It is answering them. ' + STAT.speed5],
 qr:['Speed to lead','Buy or own leads?','Free audit']},

{id:'aisearch', w:2.2, k:'ai search,ai optimization,generative search,ai overview,ai mode,answer engine,geo optimization,get cited by ai,show up in chatgpt,ai recommendations,will ai kill seo',
 r:['This is the new front door and most of your competitors have not found it. Homeowners increasingly ask ChatGPT, Gemini or Perplexity to recommend a contractor instead of scrolling results.\n\n' + STAT.aisearch + '\n\nThe businesses that do get cited have complete profiles, consistent business information, steady review flow and proper structured data. It overlaps heavily with local SEO, so it is not a separate budget line — it is doing the fundamentals well enough to be machine readable.'],
 qr:['Local SEO','Free audit','Pricing']},

{id:'reviews', w:2.1, k:'reviews,google reviews,review,reputation,star rating,get more reviews,review management,testimonials,ratings',
 r:['Reviews do three jobs at once: they move your map pack ranking, they decide whether a homeowner calls you or the next guy, and in 2026 they are one of the signals AI engines lean on when deciding who to recommend.\n\n' + STAT.reviews + '\n\nThe fix is a system that asks every customer at the right moment — while the truck is still in the driveway — not a reminder you keep meaning to send.'],
 qr:['Bad review help','Local SEO','AI search']},

{id:'badreview', w:2.3, k:'bad review,negative review,one star,someone left a bad review,fake review,review attack,angry customer,remove a review',
 r:['First, you usually cannot get it removed unless it violates policy — fake, off-topic, or from a non-customer. Report it, but do not count on it.\n\nSecond, the response matters more than the review. Future customers read how you handle it. Short, calm, specific, no defensiveness, and an offer to fix it offline. A thoughtful reply to a one-star has closed more jobs than a fifth five-star ever will.\n\nThird, bury it with velocity. A steady flow of new reviews moves your average and your ranking faster than fighting one bad one.'],
 qr:['Get more reviews','Free audit','Local SEO']},

{id:'content', w:1.9, k:'content,blog,blogging,articles,write content,content marketing,videos,video,photos,pictures,portfolio,before and after,do i need a blog',
 r:['Content earns its place when it answers a question a buyer actually types, and almost nothing else does. Cost pages, process pages, comparison pages, permit and code questions in your city.\n\nAnd photos close jobs. Real ones, from your jobs, not stock. A before-and-after gallery outperforms any paragraph you will ever write about quality. Video is the same story — a ninety second walkthrough of a finished job does more than a polished brand spot.'],
 qr:['SEO','Free audit','Pricing']},

{id:'cro', w:2, k:'conversion,conversion rate,conversion optimization,not converting,traffic but no calls,visitors do not call,bounce rate,improve my website,nobody calls',
 r:['Traffic without conversion is a nicer way to lose. ' + STAT.leak + '\n\nUsual culprits in order: the phone number is not clickable or not visible on mobile, there is no reason to trust you above the fold, the form asks for too much, the page takes four seconds to load, and there is no obvious next step.\n\nFor comparison: 2026 benchmarks put static forms around 2 to 6 percent conversion and chat-to-lead closer to 15 percent, largely because a conversation asks for one thing at a time instead of eleven.'],
 qr:['Website scorecard','Free audit','Chat on my site']},

{id:'speedtolead', w:2.2, k:'speed to lead,response time,call back fast,how fast should i respond,answer leads,missed calls,voicemail,5 minutes,leads go cold,answering service,i miss calls',
 r:[STAT.speed5 + '\n\n' + STAT.first + '\n\nNothing else in your marketing has that kind of leverage, and it costs nothing to fix. Answer inside five minutes and you are effectively competing against a much smaller field.'],
 qr:['Lead follow up','Free audit','Chat on my site']},

{id:'followup', w:2.2, k:'lead follow up,follow up sequence,nurture,drip,text back,automated follow up,what should i say,cadence',
 r:['The cadence that works in the trades, and it is not complicated.\n\nMinute one: automatic text confirming you got it, with a name attached. Minute five: a human calls. Same day: a thank you plus one photo of similar finished work. Day two: a specific question, never "just checking in". Day five: the answer to the objection they did not say out loud, usually price or timeline. Day twelve: a soft close with a deadline that is actually real.\n\nMost contractors stop after one attempt. Most jobs close between the third and fifth touch. That gap is free money.'],
 qr:['Homeowners ghost me','Speed to lead','Free audit']},

{id:'tracking', w:2, k:'call tracking,attribution,how do i track,tracking,which channel,where do leads come from,reporting,reports,analytics,dashboard,how will i know',
 r:['We set up call tracking and conversion tracking before a dollar goes to traffic, so every call and form is tagged to its source. Your monthly report covers ranking and map movement, calls and forms with attribution, traffic by channel and what it did, AI search visibility, and a plain-language note on what changed.\n\n' + STAT.attrib + '\n\nThe uncomfortable part of real attribution is that it sometimes says the channel you love produces nothing and the one you were about to cut produces half your work. We would rather show you a real number with a caveat than a flattering one that is fiction.'],
 qr:['See reporting','Free audit','Pricing']},

{id:'channelmix', w:2.1, k:'channel mix,lead mix,where should my leads come from,diversify,too dependent,all my leads come from,one source',
 r:[STAT.mix + '\n\nThe contractors who get hurt are the ones at 80 percent on a single source — one platform pricing change, one algorithm update, one referral partner retiring, and the year is gone. Diversification in this business is not a strategy word. It is insurance.'],
 qr:['Run my numbers','Buy or own leads?','Free audit']});

/* ─────────────────────────── BUY VS OWN, MARKETPLACES ──────────────────── */
KB.push(
{id:'buyvsown', w:2.2, k:'buy or own leads,should i buy leads,buying leads,shared leads,exclusive or shared,rent leads,own my leads,lead services,pay per lead',
 r:['Buying leads fills a slow week. It never builds anything. You are renting access to a homeowner who has already been sold to four of your competitors, which turns the first call into a price fight before you have said a word about quality.\n\nHonest version: if you need work in two weeks and have nothing built, buy the leads. Cash flow beats theory. But start building the owned side in parallel, because a contracting business whose entire pipeline lives on someone else platform is one pricing change away from a very bad quarter.'],
 qr:['Angi and Thumbtack','Lead generation','Free audit']},

{id:'angi', w:2.2, k:'angi,angies list,thumbtack,homeadvisor,home advisor,houzz,porch,networx,modernize,lead company,lead service,craftjack,bark,shared lead services',
 r:['Marketplace leads can fill a gap. Just know what you are buying: the same homeowner sold to several contractors at once, priced by a platform that can raise it whenever it wants, and disputes you have to chase yourself.\n\nUse them as a stopgap if you need cash flow. Do not let them become the pipeline. Industry reporting through 2026 shows contractors moving hard toward exclusive owned sources for exactly this reason.'],
 qr:['Buy or own leads','Lead generation','Free audit']},

{id:'yelp', w:2, k:'yelp,nextdoor,bbb,better business bureau,directories,citations,listings,yellow pages',
 r:['Nextdoor punches above its weight for neighborhood trades — fencing, painting, landscaping, anything where one job visibly leads to the next three on the same street. Yelp varies wildly by market and gets expensive fast. Directory citations matter less for ranking than they did five years ago, but consistent name, address and phone everywhere still matters a lot for whether AI engines trust your business data.'],
 qr:['Local SEO','AI search','Free audit']});

/* ─────────────────────────── TRADES ────────────────────────────────────── */
KB.push(
{id:'roofing', w:2.1, k:'roofing,roof,shingles,storm damage,hail damage,re-roof,roof replacement,metal roof',
 trade:'roofing',
 r:['Roofing is storm-driven and the most expensive lead in the trades — about $124 per lead on non-branded search in 2026 tracking, and LocaliQ put blended roofing search leads near $228. It also has the widest spread of any trade, close to 10x between the best and worst operators.\n\nTwo jobs to do well: be positioned before the storm instead of scrambling after, and separate insurance work from retail replacement in your campaigns, because those buyers behave nothing alike.\n\nWhat is your average roof job worth? I will show you what you can afford to pay per lead.'],
 qr:['Run my numbers','Storm response','Roofing page']},

{id:'plumbing', w:2.1, k:'plumbing,pipes,drain,sewer,water heater,burst pipe,leak,repipe',
 trade:'plumbing',
 r:['Plumbing is emergency intent — a burst pipe is a five minute decision at eleven at night, and whoever answers wins. Local Services Ads ran about $57 per plumbing lead in 2026, LocaliQ put Google search around $76, and non-branded search pushes past $180. The gap between those channels is the whole game.\n\nThe other half is answering. Emergency leads do not wait until morning, and the average contractor response time is over 47 hours.'],
 qr:['Run my numbers','Speed to lead','Plumbing page']},

{id:'hvac', w:2.1, k:'hvac,cooling,air conditioning,ac unit,heat pump,mini split,duct,boiler',
 trade:'hvac',
 r:['HVAC is seasonal and demand spikes twice a year, which means your cost per lead swings hard depending on when you turn things on. About $51 per lead on Local Services Ads versus roughly $85 on Google search and $149 on non-branded — and HVAC posted the strongest LSA return of any trade at 9.55x in the February 2026 SearchLight data.\n\nMaintenance agreements are the quiet advantage. They smooth the calendar, they give you a reason to be in the customer life between emergencies, and they make the whole business worth more if you ever sell it.'],
 qr:['Run my numbers','Seasonal strategy','HVAC page']},

{id:'electrical', w:2.1, k:'electrical,panel,wiring,ev charger,generator,lighting,electric,rewire',
 trade:'electrical',
 r:['Electrical has the best lead economics in the trades right now — about $39 per lead on Local Services Ads with a book rate near 44 percent in 2026 research, against roughly $94 on Google search ads.\n\nPanel upgrades, EV chargers and whole-home generators are the growth categories, and most electricians still have no dedicated page for any of the three. That is free ranking sitting on the table.'],
 qr:['Run my numbers','Local Services Ads','Electrical page']},

{id:'solar', w:2.1, k:'solar,panels,photovoltaic,solar installer,battery storage',
 trade:'solar',
 r:['Solar is a long cycle and a high ticket, which means your marketing has to survive a decision that takes weeks and involves a spouse. Retargeting and content do most of the work here; emergency-style paid search does almost none.\n\nEducation converts in solar. Cost breakdowns, payback period math, and honest talk about what the incentives actually do. The companies winning are the ones treating the first ninety days after the quote as the real campaign.'],
 qr:['Run my numbers','Facebook ads','Solar page']},

{id:'painting', w:2.1, k:'painting,paint,interior painting,exterior painting,cabinet refinishing',
 trade:'painting',
 r:['Painting is a volume trade with a low cost per lead, which means the winner is usually whoever has the best local footprint and the fastest follow-up rather than the biggest budget. Neighborhood clustering is real — one visible exterior job feeds the street, so yard signs plus Nextdoor plus a tight map pack presence covers most of it.'],
 qr:['Run my numbers','Local SEO','Painting page']},

{id:'remodeling', w:2.1, k:'remodeling,remodel,kitchen,bathroom,bath remodel,home improvement,renovation,basement finish,addition',
 trade:'remodeling',
 r:['Remodeling is a considered purchase with a long window, financing questions, and a lot of comparison shopping. Galleries, process pages and financing offers do more than ad copy ever will.\n\nAlso worth knowing: 77 percent of residential remodelers went into 2026 optimistic and 72 percent raised their rates. The market supports a higher price if the proof travels with it.\n\nSide note: our founder has run a bath remodeling company since 2012, so this is the trade we have actually lived inside.'],
 qr:['Run my numbers','Financing offers','Remodeling page']},

{id:'pool', w:2.1, k:'pool,pool builder,spa,hot tub install,swimming pool',
 trade:'pool building',
 r:['Pool building is a six month conversation and a six-figure project. Nothing about emergency-style advertising fits. You need visibility early in the research phase, serious photography, and content that survives a spouse asking hard questions in month four.'],
 qr:['Run my numbers','Content','Pool page']},

{id:'fence', w:2.1, k:'fence,fence company,gates,deck,decking',
 trade:'fencing',
 r:['Fencing closes fast and clusters by neighborhood — one job visibly sells the next three on the street. Local search plus Nextdoor plus a fast callback covers most of what wins here, and the job value is high enough that a $40 lead is a bargain.'],
 qr:['Run my numbers','Local SEO','Fence page']},

{id:'gc', w:2, k:'general contractor,general contracting,builder,construction company,custom homes,commercial',
 trade:'general contracting',
 r:['General contracting is broad scope and referral heavy, which makes it the trade most likely to have no marketing system at all until referrals dip. It also carries the lowest average close rate in home services, around 20 percent, because the bids are big and the comparison shopping is real.\n\nBroad scope also means your site has to make it obvious what you actually do. "We do everything" reads as "we specialize in nothing" to both homeowners and search engines.'],
 qr:['Run my numbers','Free audit','GC page']},

{id:'othertrade', w:1.9, k:'landscaping,concrete,masonry,flooring,windows,siding,gutters,garage door,septic,pest control,cleaning,restoration,handyman,tree service,do you work with,my trade,what trades,other trades,junk removal,locksmith,appliance repair,pressure washing,do you do,excavation,drywall,insulation,paving,asphalt',
 r:['Short answer: yes. The ten trades with dedicated pages are just the ones we wrote up, but the engine is the same for any local service business — find the high-intent searches, own the map, answer fast, track what converts.\n\nWhat trade are you in? I will tell you what is different about it and what leads should cost you.'],
 qr:['Pricing','Free audit','Run my numbers']},

{id:'newbiz', w:2.1, k:'just starting,new business,starting out,first year,brand new,just got licensed,starting a company,no reviews yet,no website yet',
 r:['Congratulations, and here is the order that actually works when you are starting from zero.\n\nOne: Google Business Profile, claimed and fully built, with real photos. Free. Two: ten reviews as fast as you can honestly get them — friends you have actually done work for count, strangers you have not do not. Three: one simple page per service you sell, in the towns you cover. Four: answer every call inside five minutes, which is your entire competitive advantage while you are small.\n\nPaid ads come after that, not before. Spending on traffic before you have proof is pouring water in a bucket with no bottom.'],
 qr:['Free tools','Free audit','Pricing']},

{id:'onetown', w:2, k:'one town,small town,rural,small market,only serve,service area,how far should i travel,radius,multiple locations,second location,expand to another city',
 r:['Small market is an advantage, not a handicap. Fewer competitors in the map pack, cheaper clicks, and a review count that is achievable. One well-built profile plus service pages for the four or five towns you actually cover will usually beat a regional company that treats you as an afterthought.\n\nMultiple locations is a different animal: separate profiles, separate location pages with genuinely different content, and a real address in each market. Faking it gets profiles suspended, and that suspension costs more than the shortcut saved.'],
 qr:['Local SEO','Free audit','Pricing']});

/* ─────────────────────────── COMPANY ───────────────────────────────────── */
KB.push(
{id:'about', w:2, k:'about,about you,who is afc,tell me about afc,your company,eye to ad media,your story,how long have you been around,experience,credentials',
 r:['AFC is the contractor arm of Eye To Ad Media, Denver, running since 2012. It exists because the founder ran a bath remodeling company, hired agencies the way most contractors do — on a promise and a slide deck — and kept getting reports full of impressions instead of an answer to one question: did any of this turn into a sale?\n\nHe still runs the remodeling business, which means every campaign here gets judged by someone who knows what a slow February feels like.'],
 qr:['Why you?','Results','Pricing']},

{id:'whyyou', w:2, k:'why you,why should i hire you,what makes you different,why not someone else,are you any good,prove it,guarantee,do you guarantee,are you legit,is this a scam,scam',
 r:['Three things, and none of them are slogans. We report on booked jobs instead of impressions. Everything is month to month. And the person setting the standard runs a contracting business himself.\n\nWhat we will not do is guarantee rankings. Nobody controls Google, and anyone who tells you otherwise is either lying or about to. What we will do is tell you before you spend anything whether the math works in your market — including telling you not to hire us if it does not.'],
 qr:['Reporting','Pricing','Free audit']},

{id:'results', w:2, k:'results,case study,case studies,proof,examples,portfolio,clients,who do you work with,success stories,testimonial',
 r:['The results page walks through realistic channel expectations rather than cherry-picked screenshots — what actually moves in 30 days, 90 days, and 6 to 12 months, by channel.\n\nWe do not publish inflated numbers and we do not put a rating on the site we cannot back with real reviews. Eye To Ad Media has 60 reviews you can read yourself.'],
 qr:['See results','Reporting','Free audit']},

{id:'location', w:2, k:'where are you,location,address,denver,colorado,are you local,office,do you work in my area,nationwide,city,state,do you only work in denver,what markets',
 r:['Based in Denver — 1001 Bannock St, Suite 660, Denver CO 80204 — and we work with contractors across the United States and internationally. Fit matters more than geography. What market are you in? I will tell you straight whether we can realistically win it.'],
 qr:['Free audit','Pricing','Have someone call me']},

{id:'contact', w:2.2, k:'contact,phone number,call you,email,talk to a human,talk to someone,speak to a person,real person,human,agent,representative,get in touch,reach you,what is your number',
 r:['{TEL} and a human answers — no phone tree. If you would rather they call you, I can take your details right here and pass them along, usually same day.\n\nWhich is easier?'],
 qr:['Have someone call me','Call now','Free audit']},

{id:'audit', w:2.2, k:'free audit,audit,review my site,look at my website,check my site,analyze,evaluation,assessment,what is wrong with my site',
 r:['Here is what the audit covers: your website, your Google Business Profile, your review profile, your rankings, and the three competitors currently beating you in the map pack. You get the findings in plain language and you keep them whether you hire us or not.\n\nTakes about a day. No obligation, no drip sequence — a real person reads it and calls you back.'],
 qr:['Open the audit form','What do you need from me?','Have someone call me']},

{id:'tools', w:2.1, k:'free tools,tools,calculator,worksheet,scorecard,plan builder,tracker,spreadsheet,free stuff,anything free',
 r:['Four, all free, none gated behind an email. The break-even lead cost worksheet, the marketing plan builder, the website scorecard, and a lead and job tracker with the formulas already written.\n\nUse them and never call us. That is genuinely fine.'],
 qr:['Run my numbers','Website scorecard','Plan builder']},

{id:'freebot', w:2.3, k:'chatbot,chat bot,bot for my site,can i get a bot,build a chatbot,chatbot generator,free chatbot,chat widget,bot like you,how do i get one,live chat,ai assistant for my website',
 r:['You can have one. We built a free chatbot generator for contractors — pick your trade, edit the questions and answers, copy one block of code, paste it before the closing body tag of your site. Done in about two minutes.\n\nFree forever. No signup, no credit card, no email, no account, no monthly fee. It is a gift from Eye To Ad Media and there are no strings on it.'],
 qr:['Build my free chatbot','Why is it free?','Have someone call me']},

{id:'whyfree', w:2.2, k:'why is it free,what is the catch,catch,too good to be true,really free,no catch,why would you give that away,free forever',
 r:['No catch. The code runs in your own page, in your visitor browser. Nothing phones home to us, so there is nothing for us to meter and nothing for us to bill.\n\nWhy give it away: contractors who end up hiring us almost always start by trusting something we gave them first. That is the entire strategy. If you never call us, the bot still works forever.'],
 qr:['Build my free chatbot','Pricing','Free audit']},

{id:'spanish', w:2, k:'espanol,spanish,hablas espanol,se habla,en espanol,do you speak spanish,otro idioma',
 r:['Si — we have Spanish speakers on the team. Call {TEL} and ask, or write your question here in Spanish and I will point you to a human who can take it from there.'],
 qr:['Call now','Free audit']},

{id:'privacy', w:2, k:'privacy,my data,do you sell data,spam,mailing list,unsubscribe,gdpr,cookies,is this secure,will you spam me,how many times will you call',
 r:['We use what you give us to run the audit and call you back. We do not sell data and we do not drop you into a drip sequence. One call, and if you say not now, that is the end of it.\n\nThis chat is not stored on a server either — it lives in your browser and disappears when you close the tab.'],
 qr:['Have someone call me','Free audit']});

/* ─────────────────────────── STRATEGY ──────────────────────────────────── */
KB.push(
{id:'seotime', w:2.1, k:'how long does seo take,how long,when will i see results,how fast,how soon,timeline,when does it work,how many months,how long until',
 r:[STAT.seotime + '\n\nIf you need the phone ringing this month, we start with paid search or Local Services Ads and build organic underneath it. That is not a sales line, it is just the order that works.'],
 qr:['Google Ads','Pricing','Free audit']},

{id:'goodcpl', w:2.2, k:'what is a good cost per lead,good cost per lead,average cost per lead,cost per lead,what should i pay per lead,cpl benchmark,what do leads cost,cost per lead by trade,lead costs',
 r:[STAT.lsa + '\n\n' + STAT.ads + '\n\nNational averages are a reference point, not your answer. The number that matters is your own break-even. Want me to run it? Thirty seconds.'],
 qr:['Run my numbers','Local Services Ads','Free audit']},

{id:'firststep', w:2.1, k:'where do i start,what should i do first,first step,what would you start with,what is most important,priority,if you only did one thing,best place to start,what matters most',
 r:['In this order, and it is the same order every time.\n\nOne, answer faster. Free, and it is the single biggest lever you have.\nTwo, Google Business Profile built out properly and a review system that actually asks. Cheap, and it wins the map pack.\nThree, make sure your website converts the traffic you already get. No point buying more.\nFour, then and only then, turn on paid to fill the calendar while organic compounds.\n\nMost agencies sell you step four first because it is the one with the biggest invoice attached.'],
 qr:['Speed to lead','Local SEO','Free audit']},

{id:'bestchannel', w:2, k:'marketing,advertising,help me with marketing,i need marketing,best channel,which channel,what works best,what is most effective,seo or ads,paid or organic,ads vs seo,what should i spend on',
 r:['Wrong question, slightly. The right one is what you need: work this week, or a pipeline that keeps working after you stop paying.\n\nPaid search and Local Services Ads buy the first. SEO and local build the second. AI search is the new front door and most of your competition has not found it. Almost nobody should run one alone — paid fills the calendar now while organic pulls the blended cost down over time.'],
 qr:['Run my numbers','Channel mix','Free audit']},

{id:'referrals_answer', w:2.1, k:'mostly referrals,referrals,word of mouth,repeat customers,we get referrals,all referral,my customers refer me',
 r:['Referrals are the best leads in the business and the worst business plan, because you do not control the volume. They arrive when they arrive, and tracked referrals convert at two to four times the rate of cold leads — which is exactly why losing them hurts so much.\n\nHere is the question worth sitting with: in a month where referrals are thin, what is your backup? If the answer is "wait", that is the gap.'],
 qr:['Local SEO','Run my numbers','Free audit']},

{id:'repeat', w:2, k:'past customers,database,old customers,repeat business,maintenance agreements,service plans,recurring revenue,customer list',
 r:['Your past customer list is the cheapest revenue in the business and almost nobody works it. Maintenance reminders, seasonal notes, and a simple "we are in your neighborhood next week" text outperform most ad budgets.\n\nText beats email in the trades by a wide margin — just get permission first. And if your trade supports a maintenance agreement, that is the single best thing you can sell: it smooths the calendar, raises lifetime value, and makes the business worth more if you ever sell it.'],
 qr:['Lead generation','Free audit']},

{id:'seasonal', w:2.1, k:'seasonal,season,slow months,busy season,winter,summer,spring,storm response,when should i advertise,off season,seasonality',
 r:['The slow season is built during the busy one. SEO takes four to eight months to compound, so whatever you start in your peak is what carries your trough.\n\nStorm and season timing is its own discipline: roofers should have campaigns ready before hail, HVAC before the first heat wave, plumbing before the first hard freeze. Turning things on after the event means bidding against everyone who was already there, at the exact moment clicks cost the most.'],
 qr:['Run my numbers','Google Ads','Free audit']},

{id:'financing', w:2, k:'financing,finance,payment plans,monthly payments,afford,consumer financing,offer financing',
 r:['Financing changes the conversation from price to payment, and in remodeling, solar, roofing and HVAC it is often the difference between a signed job and a maybe. If you offer it, it belongs on the page, in the ads and in the first ninety seconds of the call — not buried on a terms page nobody reads.'],
 qr:['Remodeling','Run my numbers','Free audit']},

{id:'justify', w:2.1, k:'justifying my price,justify my price,why am i more expensive,value selling,how do i explain my price,they think i am expensive,price objection',
 r:['Price is only an objection when value has not landed yet. What closes the gap is proof, in this order.\n\nPhotos of your work on a job like theirs. A written scope that spells out what the cheap bid left out. License, insurance and warranty stated plainly, because those are relief, not bragging. Reviews from their neighborhood. And one honest sentence about what goes wrong when this gets done cheap — you have seen it, they have not.\n\nNobody argues with a number they understand.'],
 qr:['Reviews','Content','Free audit']},

{id:'auditneeds', w:2, k:'what do you need from me,what information,what do i have to give you,what do you need to know,onboarding,how does it start,what happens next,what happens on the call,how long is the call',
 r:['Very little. Your company name, your website if you have one, the cities you cover, your trade, and a phone number. That is enough to look at your profile, your rankings and your competitors.\n\nThe call itself runs about fifteen minutes. We tell you what we found, what it would take, and what it would cost. No slide deck, no pressure, and if the math does not work in your market we say that out loud.'],
 qr:['Have someone call me','Open the audit form','Run my numbers']},

{id:'diy', w:2, k:'can i do it myself,do it myself,diy,in house,hire someone in house,do i need an agency,learn it myself,my nephew,my wife does it,i can do it',
 r:['Honestly? A lot of it, yes. Claiming and building out your Google Business Profile, asking every customer for a review, answering leads in five minutes, putting real photos up — that is most of the local game and it costs nothing but discipline.\n\nWhere it breaks is consistency, not skill. The audit tells you what is worth doing yourself and what is worth paying for, and we are completely fine with you doing all of it yourself.'],
 qr:['Free tools','Free audit','Pricing']},

{id:'tracking_tools', w:1.9, k:'crm,software,jobber,housecall pro,servicetitan,quickbooks,what software,tools i should use,dispatch software',
 r:['We are agnostic on software — Jobber, Housecall Pro, ServiceTitan, whatever you already run. What matters is that leads land somewhere with a timestamp and a source attached, so you can tell which channel produced which customer.\n\nIf everything lands in a shared inbox, you are guessing, and guessing is what makes contractors cut the channel that was actually working.'],
 qr:['Call tracking','Free audit']},

{id:'offline', w:1.9, k:'truck wrap,truck wraps,vehicle wraps,yard sign,yard signs,door hangers,direct mail,flyers,billboard,radio,tv,print,newspaper,vehicle wrap,mailers,door knocking,canvassing',
 r:['Offline still works, it is just hard to measure — which is exactly why most contractors overrate or underrate it.\n\nTwo rules. Give every offline channel its own phone number so you actually know what it produced. And never run offline before your online house is in order, because a yard sign sends people straight to Google to look you up, and if you are not there when they do, you just paid for a competitor lead.'],
 qr:['Call tracking','Local SEO','Free audit']},

{id:'email', w:1.9, k:'email marketing,newsletter,sms,text messaging,mailing list,texting customers',
 r:['Text beats email in the trades by a wide margin, and both beat another ad dollar aimed at strangers. Appointment confirmations, on-the-way texts, review requests, maintenance reminders, and a seasonal note before the weather turns.\n\nGet permission first, keep it short, and sign it with a human name. Nobody replies to noreply.'],
 qr:['Past customers','Lead generation','Free audit']},

{id:'schema', w:1.8, k:'schema,structured data,llms txt,robots txt,technical seo,site speed,page speed,mobile,core web vitals,https,indexing',
 r:['The technical layer matters more now than it did five years ago, because AI engines need your business to be machine readable before they will recommend it. Structured data, consistent business information, clean markup, a fast page and a site that actually works on a phone.\n\nAnd speed is not a nerd concern: 53 percent of mobile users abandon a page that takes more than three seconds. None of it wins a job by itself. All of it decides whether you are eligible to be found.'],
 qr:['AI search','Website scorecard','Free audit']},

{id:'howmanyleads', w:1.9, k:'how many leads,how many calls,how much traffic,what volume,how many jobs,expectations,realistic',
 r:['Depends on your market size, your trade and your budget, and anyone quoting you a lead count before looking at those is guessing at you.\n\nWhat we can do is the math in reverse: tell me how many jobs a month you want, your close rate and your average ticket, and I will tell you how many leads that requires and what it costs at 2026 rates.'],
 qr:['Run my numbers','Free audit','Pricing']},

{id:'agency_vs', w:1.9, k:'vs,compare,versus,other agencies,big agency,cheaper agency,someone quoted me,i got a quote,another company said,shopping around',
 r:['Compare on two things only: do they report on booked jobs or on impressions, and can you leave any month.\n\nEverything else is presentation. If someone guarantees you page one rankings, walk — nobody controls Google. If they cannot tell you what your break-even cost per lead is, they have not asked enough about your business to be spending its money.'],
 qr:['Why you','Reporting','Free audit']},

{id:'market', w:1.9, k:'is the market good,how is the industry,industry outlook,is it a good time,economy,recession,slowdown,housing market',
 r:[STAT.market + '\n\n' + STAT.labor + '\n\nTranslation for you: demand is steady, delivery is expensive, and share gets taken rather than handed out. The contractors gaining ground in 2026 are the ones with visible proof, fast response and a price they can defend.'],
 qr:['Run my numbers','Free audit','Pricing']});

/* ─────────────────────────── OBJECTIONS & CLOSING ──────────────────────── */
KB.push(
{id:'think', w:2.3, k:'i need to think about it,let me think,think it over,need to think,sleep on it,not ready,maybe down the road,next year,let me look around,i will get back to you,circle back',
 r:['Of course. Nobody should sign anything from a chat window with a tape measure in it.\n\nOne suggestion though: take the free audit while you think. It costs nothing, there is no obligation, and you end up thinking about it with actual data instead of a feeling. You keep the findings either way, even if you never call us back.'],
 qr:['Free audit','What do you need from me?','Run my numbers']},

{id:'sendinfo', w:2.2, k:'send me info,email me information,send me something,send pricing,email me,can you send,brochure,more information,send me a proposal',
 r:['I can do better than a brochure. Give me a name and a number and a human will call you with something specific to your market — your rankings, your competitors, and what it would realistically take.\n\nIf you would rather have it in writing first, say the word and I will note that on the message so nobody calls you cold.'],
 qr:['Have someone call me','Free audit','Just email me']},

{id:'spouse', w:2.2, k:'talk to my wife,talk to my husband,talk to my partner,ask my business partner,ask my wife,ask my husband,my wife,my husband,my spouse,wife has to,husband has to,has to approve,run it by,run it past,my accountant,not my decision,i am not the decision maker,check with',
 r:['Smart, and I mean that. Decisions that involve a monthly number should involve everybody paying it.\n\nWhat helps that conversation is numbers instead of vibes. The free audit gives you something concrete to put in front of them — what your competitors are doing, what it is costing you, and what the realistic runway looks like. Want me to set that up so you have it in hand?'],
 qr:['Free audit','Have someone call me','Run my numbers']},

{id:'notime', w:2.2, k:'no time,too busy to talk,call me later,i am on a job,cannot talk now,busy right now,text me instead',
 r:['Understood, you are working. Two options that take no time at all.\n\nOne: give me a name, number and the best window to reach you, and someone calls then instead of now. Two: grab {TEL} whenever you have a truck ride free.\n\nEither way I am not going to keep you.'],
 qr:['Have someone call me','Call now','Free audit']},

{id:'booking', w:2.5, k:'have someone call me,call me back,book a call,schedule a call,set up a call,set an appointment,appointment,schedule,talk to sales,get a quote,get started,sign me up,i am interested,lets do it,how do i start,ready to go,want to move forward',
 r:['Easy. Four quick things and a human takes it from there — no phone tree, no drip sequence, and if you say not now on the call that is genuinely the end of it.'],
 qr:['Start booking','Just email me','Call now']},

{id:'justemail', w:2.2, k:'just email me,email only,do not call me,no calls,prefer email,text only',
 r:['Noted, and I will flag it. Give me a name, an email or number to reach you at, and a one line note about what you want, and someone will follow up the way you asked — no calls if you do not want them.'],
 qr:['Start booking','Free audit']},

{id:'trust', w:2.1, k:'can i trust you,how do i know you are real,references,who else have you worked with,licensed,insured,how long in business,are you licensed',
 r:['Fair question, ask it of everyone. Eye To Ad Media has been running since 2012, out of a real office at 1001 Bannock St in Denver, with 60 reviews you can read yourself and a founder who still runs a contracting business.\n\nAnd the structure protects you more than any promise: month to month, reporting on booked jobs, no ranking guarantees. If we stop producing, you stop paying. That is the only guarantee worth anything in this industry.'],
 qr:['Results','Free audit','Have someone call me']});

/* ─────────────────────────── FALLBACK & CATCH-ALL ──────────────────────── */
var MISS = new Bag([
 'That one is past my tape. I am rule-based, so I only know what a human here wrote down — say it another way and I will try again, or grab {TEL} and talk to someone who knows everything I do not.',
 'You lost me, and that is on me not you. Try it in different words, or pick one of these and I will be back on solid ground.',
 'I do not have an answer for that one. What I am good at: cost per lead math, what channels actually cost in 2026, which trades work how, why estimates go cold, and getting a human to call you. Any of those?'
]);

var NUDGE = new Bag([
 'While you are here — what is your average job worth? I can show you your break-even cost per lead in about thirty seconds.',
 'Quick one: if the phone brought you three more jobs a week, what would that do to your year? That is the number worth building around.',
 'If you want a second set of eyes on your specific setup, the free audit costs nothing and you keep the findings either way.',
 'Say the word and I will have a human call you instead of typing at you. Takes me four questions.'
]);

/* soft closes, used once interest is obvious. Never more than one per turn. */
var CLOSE = new Bag([
 'If you want this looked at properly, I can have someone call you — four questions and I am out of your way.',
 'Want the free audit on your market? No obligation, you keep the findings either way.',
 'I can set up a callback whenever suits you, including after hours. Just say when.'
]);

/* ─────────────────────────── SESSION STATE ─────────────────────────────── */
var S = { trade:null, name:null, ticket:0, margin:0, close:0, step:0, bstep:0,
          lead:{}, turns:0, misses:0, heat:0, closed:0, seen:{}, lastId:null };

function fill(t){
  return String(t)
    .replace(/\{NAME\}/g, CFG.name)
    .replace(/\{TEL\}/g, CFG.telView)
    .replace(/\{JOKE\}/g, function(){ return JOKES.next(); })
    .replace(/\{QUOTE\}/g, function(){ return QUOTES.next(); })
    .replace(/\{LIFT\}/g, function(){ return LIFT.next(); });
}

function money(n){
  return '$' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ─────────────────────────── MATCHER ───────────────────────────────────── */
function score(text, intent){
  var phrases = intent.k.split(','), s = 0, i, p, words, exact = text.trim();
  for (i=0;i<phrases.length;i++){
    p = phrases[i].trim(); if (!p) continue;
    words = p.split(' ').length;
    if (text.indexOf(' ' + p + ' ') >= 0){
      s += 2 + (words - 1) * 2.4;
      if (exact === p) s += 7;
    }
  }
  if (s === 0){                      /* typo pass, single words only */
    var toks = text.trim().split(' '), j;
    for (i=0;i<phrases.length;i++){
      p = phrases[i].trim();
      if (!p || p.indexOf(' ') >= 0 || p.length < 5) continue;
      for (j=0;j<toks.length;j++){ if (near(toks[j], p)){ s += 1.6; break; } }
    }
  }
  return s * (intent.w || 1);
}

function match(raw){
  var text = norm(raw), best = null, bestS = 0, i, s;
  for (i=0;i<KB.length;i++){
    s = score(text, KB[i]);
    if (s > bestS){ bestS = s; best = KB[i]; }
  }
  return bestS >= 2 ? best : null;
}

/* ─────────────────────────── NUMBERS ───────────────────────────────────── */
function nums(raw){
  var t = String(raw).replace(/(\d)[,](\d)/g, '$1$2').replace(/[,$]/g, ' ');
  var m = t.match(/\d+(\.\d+)?\s*[kK]?/g) || [], out = [], i, v, s;
  for (i=0;i<m.length;i++){
    s = m[i].trim();
    v = parseFloat(s);
    if (/[kK]$/.test(s)) v *= 1000;
    if (isFinite(v)) out.push(v);
  }
  return out;
}

/* pull a first name out of "my name is dave" / "this is dave" / "it is dave" */
var NAME_RE = /(?:my name is|name is|this is|i go by|they call me|it is)\s+([a-z][a-z'\-]{1,18})/;
var NAME_STOP = ' slow busy good great fine bad rough quiet dead broken about just really pretty ';
function grabName(raw){
  var m = norm(raw).match(NAME_RE);
  if (!m) return null;
  var n = m[1];
  if (NAME_STOP.indexOf(' ' + n + ' ') >= 0) return null;
  return n.charAt(0).toUpperCase() + n.slice(1);
}

/* ==========================================================================
   SPIN in four beats: situation, problem, implication, need-payoff.
   The calculator is the implication engine — they do the math, they sell
   themselves, and nobody argues with their own arithmetic.
   ========================================================================== */
function calcFlow(raw, say, chips){
  var n = nums(raw), v = n.length ? n[0] : 0;

  if (S.step === 1){
    if (!v || v < 50){ say('Ballpark is fine — just the number a typical finished job invoices at. Something like 8500, or 11k.'); return true; }
    S.ticket = v; S.step = 2;
    say('Got it, ' + money(v) + ' a job. Now gross profit margin — what is left after materials and labor. Most trades land between 25 and 45 percent. If you are not sure, say 30.');
    return true;
  }
  if (S.step === 2){
    if (!v || v <= 0 || v > 95){ say('Just a percentage, somewhere from 10 to 60. Say 30 if you want a safe middle.'); return true; }
    S.margin = v; S.step = 3;
    say('Okay. Last one: out of ten real leads — not tire kickers, real ones — how many turn into jobs? Give me a percentage or a number out of ten.');
    return true;
  }
  if (S.step === 3){
    if (!v || v <= 0){ say('A number out of ten works. Three out of ten is common in the trades.'); return true; }
    if (v <= 10) v = v * 10;
    if (v > 100) v = 100;
    S.close = v; S.step = 4; S.heat += 2;

    var profit  = S.ticket * (S.margin/100);
    var cpl     = profit * (S.close/100);
    var leads   = 100 / S.close;
    var wk3     = profit * 3;
    var yr3     = wk3 * 50;

    say('Here is your number.\n\n'
      + 'Profit per booked job: ' + money(profit) + '\n'
      + 'Leads needed per job: ' + (leads < 10 ? (Math.round(leads*10)/10) : Math.round(leads)) + '\n'
      + 'Your break-even cost per lead: ' + money(cpl) + '\n\n'
      + 'Anything under ' + money(cpl) + ' per lead makes money on the first job alone — before repeat work, referrals or the maintenance agreement that follows.');

    setTimeout(function(){
      say('Now compare that to what leads actually cost in 2026:\n\n'
        + 'Electrical on Local Services Ads, about $39\n'
        + 'HVAC on Local Services Ads, about $51\n'
        + 'Plumbing on Local Services Ads, about $57\n'
        + 'Blended Google Ads across home services, about $91\n'
        + 'Roofing on non-branded search, $124 and up\n'
        + 'HVAC or plumbing on non-branded search, about $149 to $183\n\n'
        + (cpl > 149
            ? 'Every one of those sits under your ceiling. The channels are not your problem — capacity and follow-up speed are.'
            : cpl > 57
              ? 'Local Services Ads clear your ceiling comfortably. Non-branded search is tighter and needs a sharper close rate to work.'
              : 'That is a tight ceiling. Before spending on paid we would push the cheap stuff hard — profile, reviews, local search — and work on close rate, because a five point close rate improvement moves that ceiling more than any ad account can.'));
    }, 1500);

    setTimeout(function(){
      say('Now the question that actually matters. At ' + money(profit) + ' profit a job, three extra jobs a week is ' + money(wk3) + ' a week — roughly ' + money(yr3) + ' a year in gross profit you are not currently booking.\n\nWhat would that change? Second truck, a hire, or just sleeping better in February?\n\nIf you want those numbers pressure-tested against your actual market, I can have someone call you. Four questions and I am done.',
        function(){ chips(['Have someone call me','Free audit','What would it cost?']); });
    }, 3200);
    return true;
  }
  return false;
}

function startCalc(say){
  S.step = 1; S.heat += 1;
  say('Good. Three numbers and about thirty seconds.\n\nFirst one: what does a typical completed job invoice at? Ballpark is fine.');
}

/* ==========================================================================
   BOOKING — the whole point of a chatbot on a contractor site. Four
   questions, no pressure, and everything he already learned rides along.
   ========================================================================== */
function bookFlow(raw, api){
  var say = api.say, chips = api.chips, t = String(raw||'').trim(), n = norm(t);

  /* always give them a way out — nobody gets trapped in a form */
  if (/ (cancel|nevermind|never mind|stop|forget it|quit) /.test(n)){
    S.bstep = 0;
    say('Done, dropped it. No hard feelings and nothing saved. What else can I get you?',
      function(){ chips(['Run my numbers','Pricing','Tell me a joke']); });
    return true;
  }

  if (S.bstep === 1){
    if (t.length < 2){ say('Just a first name is fine.'); return true; }
    S.lead.Name = t.slice(0,80);
    S.name = S.name || t.split(' ')[0];
    S.bstep = 2;
    say('Good to meet you, ' + S.name + '. Best number to reach you?');
    return true;
  }
  if (S.bstep === 2){
    if (n.indexOf(' skip ') >= 0){
      S.bstep = 0;
      say('Fair enough. The audit form takes the same details whenever you feel like it — opening that instead.',
        function(){ setTimeout(function(){ api.go(CFG.audit); }, 600); });
      return true;
    }
    var digits = t.replace(/[^0-9]/g, '');
    if (digits.length < 7 && t.indexOf('@') < 0){
      say('Phone number or email, either works. Or say skip and I will point you at the audit form instead.');
      return true;
    }
    S.lead.Phone = t.slice(0,40);
    S.bstep = 3;
    say('Got it. What is the best window to catch you — mornings, afternoons, evenings, or whenever?');
    return true;
  }
  if (S.bstep === 3){
    S.lead.Best = t.slice(0,80);
    S.bstep = 4;
    say('Last one. Company name and trade, plus one line on what you want fixed. Quiet phone, bad leads, website that does not convert — whatever it is.');
    return true;
  }
  if (S.bstep === 4){
    S.lead.Message = t.slice(0,900);
    S.bstep = 0; S.closed = 1;
    api.lead(S.lead);
    return true;
  }
  return false;
}

function startBook(say){
  S.bstep = 1; S.heat += 2;
  say('First name?');
}

/* ─────────────────────────── QUICK REPLY ROUTING ───────────────────────── */
var LINKS = {
  'free audit'            : CFG.audit,
  'open the audit form'   : CFG.audit,
  'website scorecard'     : '/contractor-website-scorecard/',
  'plan builder'          : '/contractor-marketing-plan-builder/',
  'free tools'            : '/contractor-marketing-tools/',
  'see results'           : '/results/',
  'see reporting'         : '/results/',
  'build my free chatbot' : '/free-contractor-chatbot/',
  'roofing page'          : '/roofing-marketing/',
  'plumbing page'         : '/plumbing-marketing/',
  'hvac page'             : '/hvac-marketing/',
  'electrical page'       : '/electrical-contractor-marketing/',
  'solar page'            : '/solar-contractor-marketing/',
  'painting page'         : '/painting-contractor-marketing/',
  'remodeling page'       : '/remodeling-marketing/',
  'pool page'             : '/pool-builder-marketing/',
  'fence page'            : '/fence-company-advertising/',
  'gc page'               : '/general-contractor-marketing/'
};

var ALIAS = {
  'run my numbers'        : 'CALC',
  'show me the number'    : 'CALC',
  'show me'               : 'CALC',
  'run the numbers'       : 'CALC',
  'have someone call me'  : 'BOOK',
  'start booking'         : 'BOOK',
  'book it'               : 'BOOK',
  'call now'              : 'CALL',
  'what would it cost'    : 'pricing',
  'another joke'          : 'joke',
  'another one'           : 'quote',
  'motivate me'           : 'quote',
  'okay, be useful'       : 'whatcanyoudo',
  'talk to a human'       : 'contact',
  'one more question'     : 'whatcanyoudo',
  'try again'             : 'whatcanyoudo',
  'which trade am i'      : 'othertrade',
  'i am a contractor'     : 'whatcanyoudo',
  'just browsing'         : 'no',
  'just looking around'   : 'no',
  'just researching'      : 'no',
  'need more leads'       : 'leadgen',
  'lead flow is slow'     : 'slow',
  'slow right now'        : 'slow',
  'the phone is quiet'    : 'slow',
  'my phone is not ringing' : 'slow',
  'busy, need to scale'   : 'scale',
  'room to grow'          : 'scale',
  'having a good day'     : 'goodday',
  'rough day honestly'    : 'badday',
  'just venting'          : 'venting',
  'honestly no idea'      : 'noidea_source',
  'mostly referrals'      : 'referrals_answer',
  'google / search'       : 'localseo',
  'bought leads'          : 'angi',
  'bad leads'             : 'badleads',
  'wasted money on marketing' : 'burned',
  'shared lead services'  : 'angi',
  'keyword targeting'     : 'seo',
  'homeowners ghost me'   : 'ghosted',
  'lead follow up'        : 'followup',
  'a few weeks'           : 'seasonal',
  'couple of months'      : 'seasonal',
  'what would you start with' : 'firststep',
  'storm response'        : 'seasonal',
  'seasonal strategy'     : 'seasonal',
  'why that matters'      : 'speedtolead',
  'why leads go cold'     : 'speedtolead',
  'speed to lead'         : 'speedtolead',
  'buy or own leads'      : 'buyvsown',
  'angi and thumbtack'    : 'angi',
  'local services ads'    : 'lsa',
  'google ads'            : 'googleads',
  'facebook ads'          : 'facebook',
  'local seo'             : 'localseo',
  'ai search'             : 'aisearch',
  'reviews'               : 'reviews',
  'get more reviews'      : 'reviews',
  'bad review help'       : 'badreview',
  'content'               : 'content',
  'financing offers'      : 'financing',
  'justifying my price'   : 'justify',
  'raising my prices'     : 'pricepressure',
  'labor shortage'        : 'labor',
  'past customers'        : 'repeat',
  'channel mix'           : 'channelmix',
  'how does call tracking work' : 'tracking',
  'how do you report'     : 'tracking',
  'reporting'             : 'tracking',
  'call tracking'         : 'tracking',
  'what do you need from me' : 'auditneeds',
  'is there a contract'   : 'contract',
  'the $50 version'       : 'cheap',
  'what does seo cost'    : 'pricing',
  'what do you cost'      : 'pricing',
  'pricing'               : 'pricing',
  'how long does seo take': 'seotime',
  'how long does it take' : 'seotime',
  'what is a good cost per lead' : 'goodcpl',
  'cost per lead by trade': 'goodcpl',
  'chat on my site'       : 'freebot',
  'why is it free'        : 'whyfree',
  'are you a real person' : 'robot',
  'what can you do'       : 'whatcanyoudo',
  'about afc'             : 'about',
  'why you'               : 'whyyou',
  'results'               : 'results',
  'remodeling'            : 'remodeling',
  'just email me'         : 'justemail',
  'tell me a joke'        : 'joke'
};

function byId(id){ for (var i=0;i<KB.length;i++){ if (KB[i].id === id) return KB[i]; } return null; }

/* ─────────────────────────── ROUTING TABLES, NORMALIZED ────────────────── */
var A2 = {}, L2 = {}, kk;
for (kk in ALIAS){ if (Object.prototype.hasOwnProperty.call(ALIAS,kk)) A2[norm(kk).trim()] = ALIAS[kk]; }
for (kk in LINKS){ if (Object.prototype.hasOwnProperty.call(LINKS,kk)) L2[norm(kk).trim()] = LINKS[kk]; }

var CALC_RE = /(break ?even|run my number|run the number|do the math|calculate|my numbers|what can i afford|cost per lead for me)/;
var TICKET_RE = /(average job|avg job|job is worth|ticket|per job|typical job|jobs are)/;
var BOOK_RE = /(call me|someone call|book a call|schedule a call|set up a call|set an appointment|get started|sign me up|ready to (go|start)|want to (start|move forward))/;
var HOT = /(price|cost|how much|lead|leads|audit|start|hire you|sign|contract|budget|call)/;

/* ─────────────────────────── ENGINE ────────────────────────────────────── */
function respond(raw, api){
  var say = api.say, chips = api.chips;
  var key = norm(raw).trim();
  S.turns++;

  /* 0. mid-booking, everything else waits */
  if (S.bstep > 0){ if (bookFlow(raw, api)) return; }

  /* 1. quick-reply links go straight to the page */
  if (L2[key]){ api.go(L2[key]); return; }
  if (A2[key] === 'CALL'){ api.go('tel:' + CFG.tel); return; }
  if (A2[key] === 'BOOK' || BOOK_RE.test(key)){
    var hit0 = byId('booking');
    say(fill(pick(hit0.r)), function(){ startBook(say); });
    return;
  }

  /* 2. mid-calculator, numbers win over everything */
  if (S.step > 0 && S.step < 4){ if (calcFlow(raw, say, chips)) return; }

  /* 3. explicit calculator request */
  if (A2[key] === 'CALC' || CALC_RE.test(key)){ startCalc(say); return; }

  /* 4. they volunteered a job value without being asked */
  if (S.step === 0 && TICKET_RE.test(key)){
    var n = nums(raw);
    if (n.length && n[0] >= 100){
      S.ticket = n[0]; S.step = 2;
      say('Nice — ' + money(n[0]) + ' a job. Two more and I can give you your break-even cost per lead.\n\nGross profit margin, what is left after materials and labor? Say 30 if you are not sure.');
      return;
    }
  }

  /* 5. they introduced themselves */
  var nm = grabName(raw);
  if (nm && !S.name){
    S.name = nm;
    say('Good to meet you, ' + nm + '. I am ' + CFG.name + '. What do you do — and is the phone ringing the way you want it to?',
      function(){ chips(['Slow right now','Busy, need to scale','Run my numbers']); });
    return;
  }

  /* 6. intent match, direct or aliased */
  var hit = A2[key] ? byId(A2[key]) : null;
  if (!hit) hit = match(raw);

  if (hit){
    S.misses = 0;
    if (hit.trade) S.trade = hit.trade;
    if (HOT.test(key)) S.heat++;
    var body = fill(pick(hit.r));

    /* never repeat the same answer twice in a row */
    if (S.lastId === hit.id && hit.r.length > 1){
      var alt = hit.r.filter(function(x){ return fill(x) !== body; });
      if (alt.length) body = fill(pick(alt));
    }
    S.lastId = hit.id;
    S.seen[hit.id] = (S.seen[hit.id] || 0) + 1;

    /* always be closing — but not every turn, and never on a rough day */
    var soft = (hit.id !== 'badday' && hit.id !== 'venting' && hit.id !== 'stressed'
                && hit.id !== 'tired' && hit.id !== 'homeowner' && hit.id !== 'booking');
    if (soft && S.step === 0 && !S.closed && S.heat >= 3 && S.turns % 3 === 0){
      body += '\n\n' + CLOSE.next();
    } else if (soft && S.turns % 4 === 0 && S.step === 0 && !hit.qr){
      body += '\n\n' + NUDGE.next();
    }

    say(body, function(){ chips(hit.qr || ['Run my numbers','Pricing','Have someone call me']); });
    return;
  }

  /* 7. miss */
  S.misses++;
  if (S.misses >= 2){
    say('Second time I have missed you, which means it is my limit and not your question. Let me put a human on it — {TEL}, or I can take four quick details and have someone call you.'.replace('{TEL}', CFG.telView),
      function(){ chips(['Have someone call me','Call now','What can you do?']); });
    return;
  }
  say(fill(MISS.next()), function(){
    chips(['What can you do?','Run my numbers','Pricing','Have someone call me']);
  });
}

/* ==========================================================================
   THE MASCOT — rigged, not a statue. Legs, arms, neck blade and head are
   separate groups so he can walk, swing, wave, tip the hat and wiggle.
   ========================================================================== */
var FULL = '<svg class="afcb-man" viewBox="60 -30 320 520" aria-hidden="true" focusable="false">'
+'<defs><linearGradient id="afcCase" x1="0" y1="0" x2="1" y2="1">'
+'<stop offset="0%" stop-color="#F9D64C"/><stop offset="52%" stop-color="#F0BE22"/>'
+'<stop offset="100%" stop-color="#D29814"/></linearGradient>'
+'<linearGradient id="afcHat" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#A3714A"/><stop offset="100%" stop-color="#78502F"/></linearGradient>'
+'<linearGradient id="afcCh" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#EDF1F5"/><stop offset="100%" stop-color="#6E7885"/></linearGradient>'
+'<linearGradient id="afcBlade" x1="0" y1="0" x2="1" y2="0">'
+'<stop offset="0%" stop-color="#C99A12"/><stop offset="18%" stop-color="#F9D64C"/>'
+'<stop offset="82%" stop-color="#F0BE22"/><stop offset="100%" stop-color="#C99A12"/></linearGradient></defs>'

+'<g class="afcb-bob">'
+'<ellipse class="afcb-shadow" cx="220" cy="468" rx="104" ry="13" fill="#000" opacity=".28"/>'

/* ── legs, each its own group so they can stride ───────────────────────── */
+'<g class="afcb-legA">'
 +'<rect x="189" y="346" width="17" height="80" rx="8" fill="#14181F"/>'
 +'<rect x="180" y="372" width="35" height="31" rx="11" fill="#2C333D"/>'
 +'<path d="M152 414 h60 v30 h-80 v-10 a20 20 0 0 1 20 -20 z" fill="#8B5E3C"/>'
 +'<rect x="124" y="440" width="94" height="20" rx="10" fill="#20262E"/>'
+'</g>'
+'<g class="afcb-legB">'
 +'<rect x="243" y="346" width="17" height="80" rx="8" fill="#14181F"/>'
 +'<rect x="234" y="372" width="35" height="31" rx="11" fill="#2C333D"/>'
 +'<path d="M230 414 h58 a20 20 0 0 1 20 20 v10 h-78 z" fill="#7A5232"/>'
 +'<rect x="224" y="440" width="92" height="20" rx="10" fill="#20262E"/>'
+'</g>'

/* ── the case body ─────────────────────────────────────────────────────── */
+'<rect x="152" y="198" width="136" height="158" rx="26" fill="#171C24"/>'
+'<rect x="160" y="206" width="120" height="142" rx="20" fill="url(#afcCase)"/>'
+'<rect x="190" y="196" width="60" height="16" rx="6" fill="#0C0F14"/>'
+'<rect x="175" y="226" width="30" height="40" rx="9" fill="#1C222B"/>'
+'<rect x="180" y="232" width="20" height="20" rx="6" fill="#A6CE39"/>'
+'<g transform="translate(220,292)">'
 +'<rect x="-52" y="-26" width="104" height="50" rx="9" fill="#12161C" stroke="#A6CE39" stroke-width="2.5"/>'
 +'<path d="M-36 10 L-25 -15 L-14 10" stroke="#F4F4F1" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
 +'<rect x="-33" y="-4" width="19" height="9" rx="4.5" fill="#0D1117" stroke="#F4F4F1" stroke-width="1.6"/>'
 +'<circle cx="-25.5" cy=".5" r="2.6" fill="#A6CE39"/>'
 +'<text x="14" y="10" font-family="Barlow Condensed,Impact,sans-serif" font-size="32" font-weight="800" fill="#F4F4F1" text-anchor="middle">F</text>'
 +'<text x="38" y="10" font-family="Barlow Condensed,Impact,sans-serif" font-size="32" font-weight="800" fill="#F4F4F1" text-anchor="middle">C</text></g>'

/* ── tool belt ─────────────────────────────────────────────────────────── */
+'<rect x="134" y="312" width="172" height="34" rx="7" fill="#875A36" stroke="#3E2A18" stroke-width="3"/>'
+'<rect x="196" y="306" width="48" height="46" rx="9" fill="url(#afcCh)" stroke="#1C222B" stroke-width="3"/>'
+'<rect x="205" y="315" width="30" height="28" rx="5" fill="#12161C" opacity=".6"/>'
+'<circle cx="220" cy="329" r="4" fill="#A6CE39"/>'
+'<rect x="118" y="338" width="52" height="48" rx="8" fill="#6B4529" stroke="#3E2A18" stroke-width="3"/>'
+'<rect x="286" y="340" width="50" height="30" rx="9" fill="#A6CE39" stroke="#37460F" stroke-width="3"/>'
+'<path d="M300 368 l-5 28 h22 l-3 -28 z" fill="#1C222B"/>'

/* ── arms, hinged at the shoulders ─────────────────────────────────────── */
+'<g class="afcb-armA">'
 +'<path d="M162 244 C 132 256 116 282 112 306" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
 +'<path d="M162 244 C 132 256 116 282 112 306" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
 +'<circle cx="110" cy="316" r="16" fill="#C8905A" stroke="#14181F" stroke-width="3"/>'
+'</g>'
+'<g class="afcb-wave">'
 +'<path d="M282 236 C 314 226 332 202 336 178" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
 +'<path d="M282 236 C 314 226 332 202 336 178" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
 +'<circle cx="338" cy="170" r="17" fill="#C8905A" stroke="#14181F" stroke-width="3"/>'
+'</g>'

/* ── the blade neck: a real run of tape, graduated, and it wiggles ─────── */
+'<g class="afcb-neck">'
 +'<rect x="199" y="144" width="42" height="62" fill="url(#afcBlade)" stroke="#B9880E" stroke-width="1.5"/>'
 +'<rect x="199" y="144" width="42" height="4" fill="#C99A12" opacity=".55"/>'
 +'<path d="M203 200 h17 M203 192 h9 M203 184 h9 M203 176 h17 M203 168 h9 M203 160 h9 M203 152 h17"'
 +' stroke="#1C222B" stroke-width="2" stroke-linecap="round"/>'
 +'<text x="233" y="203" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">1</text>'
 +'<text x="233" y="179" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">2</text>'
 +'<text x="233" y="155" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">3</text>'

/* carpenter pencil behind the ear, drawn first so the head overlaps it */
 +'<g transform="translate(288,52) rotate(-26)">'
  +'<rect x="0" y="-8" width="64" height="16" rx="2" fill="#E8A020" stroke="#8F6510" stroke-width="2"/>'
  +'<rect x="0" y="-8" width="11" height="16" fill="#C9820F"/>'
  +'<path d="M64 -8 L80 0 L64 8 Z" fill="#F2DFB4" stroke="#8F6510" stroke-width="2" stroke-linejoin="round"/>'
  +'<path d="M75 -2.4 L80 0 L75 2.4 Z" fill="#2B2B2B"/>'
 +'</g>'

/* head */
 +'<rect x="134" y="40" width="172" height="110" rx="28" fill="url(#afcCase)" stroke="#1C222B" stroke-width="5"/>'
 +'<circle cx="182" cy="90" r="27" fill="#fff" stroke="#1C222B" stroke-width="3"/>'
 +'<circle cx="258" cy="90" r="27" fill="#fff" stroke="#1C222B" stroke-width="3"/>'
 +'<circle class="afcb-pl" cx="182" cy="90" r="12" fill="#12161C"/>'
 +'<circle class="afcb-pr" cx="258" cy="90" r="12" fill="#12161C"/>'
 +'<g stroke="#12161C" fill="none" stroke-width="8" stroke-linecap="round">'
  +'<rect x="149" y="59" width="66" height="62" rx="17" fill="rgba(255,255,255,.13)"/>'
  +'<rect x="225" y="59" width="66" height="62" rx="17" fill="rgba(255,255,255,.13)"/>'
  +'<path d="M215 85 q5 -9 10 0"/><path d="M149 78 l-20 -7"/><path d="M291 78 l20 -7"/></g>'
 +'<path d="M192 130 q28 22 56 0" stroke="#12161C" stroke-width="6" fill="none" stroke-linecap="round"/>'

/* hat */
 +'<g class="afcb-hat">'
  +'<ellipse cx="220" cy="46" rx="142" ry="30" fill="url(#afcHat)"/>'
  +'<path d="M158 48 C 152 -14 180 -28 220 -28 C 260 -28 288 -14 282 48 Z" fill="url(#afcHat)" stroke="#5C3B21" stroke-width="4"/>'
  +'<path d="M159 39 Q 220 61 281 39 L 281 25 Q 220 47 159 25 Z" fill="#4A3323"/>'
  +'<path d="M265 29 l9 -6 l-1 10 z" fill="#A6CE39"/>'
 +'</g>'
+'</g></g></svg>';

/* ==========================================================================
   THE TRUCK — and he is actually driving it this time.
   ========================================================================== */
var TRUCK = '<svg viewBox="0 0 560 300" aria-hidden="true" focusable="false">'
+'<defs><linearGradient id="afcTrk" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#C9F04B"/><stop offset="52%" stop-color="#A6CE39"/>'
+'<stop offset="100%" stop-color="#6E8A22"/></linearGradient>'
+'<linearGradient id="afcChr2" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#F2F5F8"/><stop offset="100%" stop-color="#69737F"/></linearGradient></defs>'
+'<g class="afcb-tilt">'
/* exhaust stacks */
+'<rect x="286" y="38" width="15" height="86" rx="4" fill="url(#afcChr2)"/>'
+'<rect x="312" y="38" width="15" height="86" rx="4" fill="url(#afcChr2)"/>'
/* light bar */
+'<rect x="150" y="46" width="150" height="17" rx="6" fill="#14181F"/>'
+'<g fill="#C9F04B" opacity=".9"><rect x="158" y="50" width="24" height="9" rx="3"/>'
+'<rect x="188" y="50" width="24" height="9" rx="3"/><rect x="218" y="50" width="24" height="9" rx="3"/>'
+'<rect x="248" y="50" width="24" height="9" rx="3"/></g>'
/* cab + bed */
+'<path d="M118 178 L118 130 Q118 116 134 112 L164 68 Q170 60 184 60 L268 60 Q282 60 286 70'
+' L300 112 L392 112 Q412 112 416 130 L424 178 Z" fill="url(#afcTrk)" stroke="#37460F" stroke-width="5" stroke-linejoin="round"/>'
+'<rect x="300" y="104" width="122" height="12" rx="5" fill="#37460F"/>'
/* glass */
+'<path d="M170 108 L192 72 L226 72 L226 108 Z" fill="#BFD4E8" opacity=".92"/>'
+'<path d="M236 72 L268 72 Q276 72 279 80 L288 108 L236 108 Z" fill="#BFD4E8" opacity=".92"/>'
/* the driver — hat, glasses, one arm hanging out the window */
+'<g class="afcb-driver">'
 +'<rect x="240" y="80" width="34" height="24" rx="7" fill="#F0BE22" stroke="#1C222B" stroke-width="2"/>'
 +'<circle cx="249" cy="92" r="6" fill="#fff" stroke="#1C222B" stroke-width="1.6"/>'
 +'<circle cx="265" cy="92" r="6" fill="#fff" stroke="#1C222B" stroke-width="1.6"/>'
 +'<circle cx="250" cy="92" r="2.6" fill="#12161C"/><circle cx="266" cy="92" r="2.6" fill="#12161C"/>'
 +'<ellipse cx="257" cy="78" rx="30" ry="7" fill="#8B5E3C"/>'
 +'<path d="M244 78 C242 60 250 55 257 55 C264 55 272 60 270 78 Z" fill="#A3714A" stroke="#5C3B21" stroke-width="2"/>'
 +'<path class="afcb-elbow" d="M238 104 C 226 110 218 118 216 128" stroke="#F4F4F1" stroke-width="11" fill="none" stroke-linecap="round"/>'
+'</g>'
/* door with the AFC level mark */
+'<rect x="236" y="116" width="58" height="52" rx="7" fill="#12161C" opacity=".9"/>'
+'<path d="M248 158 L258 128 L268 158" stroke="#F4F4F1" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
+'<rect x="250" y="140" width="17" height="8" rx="4" fill="#0D1117" stroke="#F4F4F1" stroke-width="1.4"/>'
+'<circle cx="258.5" cy="144" r="2.2" fill="#A6CE39"/>'
+'<text x="281" y="158" font-family="Barlow Condensed,Impact,sans-serif" font-size="30" font-weight="800" fill="#F4F4F1" text-anchor="middle">FC</text>'
/* front end, bumper, winch */
+'<rect x="104" y="132" width="22" height="30" rx="5" fill="#F7E8A0"/>'
+'<rect x="92" y="158" width="46" height="18" rx="6" fill="url(#afcChr2)"/>'
+'<circle cx="112" cy="167" r="9" fill="#37460F"/>'
/* suspension */
+'<rect x="140" y="176" width="290" height="14" rx="6" fill="#20262E"/>'
+'<rect x="168" y="186" width="16" height="30" rx="5" fill="#39434F"/>'
+'<rect x="386" y="186" width="16" height="30" rx="5" fill="#39434F"/>'
/* wheels */
+'<g class="afcb-wh"><g transform="translate(176,222)">'
+'<circle r="58" fill="#161A20"/><circle r="58" fill="none" stroke="#2C333D" stroke-width="9" stroke-dasharray="11 9"/>'
+'<circle r="31" fill="url(#afcChr2)"/><circle r="12" fill="#14181F"/>'
+'<path d="M0 -31 L0 -14 M0 31 L0 14 M-31 0 L-14 0 M31 0 L14 0" stroke="#14181F" stroke-width="6"/>'
+'</g></g>'
+'<g class="afcb-wh2"><g transform="translate(394,222)">'
+'<circle r="58" fill="#161A20"/><circle r="58" fill="none" stroke="#2C333D" stroke-width="9" stroke-dasharray="11 9"/>'
+'<circle r="31" fill="url(#afcChr2)"/><circle r="12" fill="#14181F"/>'
+'<path d="M0 -31 L0 -14 M0 31 L0 14 M-31 0 L-14 0 M31 0 L14 0" stroke="#14181F" stroke-width="6"/>'
+'</g></g>'
/* mud flap */
+'<rect x="424" y="150" width="14" height="46" rx="4" fill="#20262E"/>'
+'</g></svg>';

/* ==========================================================================
   THE PORTAL — layered rings, a real event horizon, and a rim that
   breathes. Thrown as a small disc, opened where it lands.
   ========================================================================== */
var PORTAL = '<svg viewBox="0 0 320 320" aria-hidden="true" focusable="false">'
+'<defs>'
+'<radialGradient id="afcHole" cx="50%" cy="50%" r="50%">'
+'<stop offset="0%" stop-color="#000"/><stop offset="46%" stop-color="#05070A"/>'
+'<stop offset="74%" stop-color="#16220A"/><stop offset="92%" stop-color="#6F9226"/>'
+'<stop offset="100%" stop-color="#C9F04B"/></radialGradient>'
+'<radialGradient id="afcGlow" cx="50%" cy="50%" r="50%">'
+'<stop offset="60%" stop-color="rgba(166,206,57,0)"/>'
+'<stop offset="88%" stop-color="rgba(166,206,57,.28)"/>'
+'<stop offset="100%" stop-color="rgba(166,206,57,0)"/></radialGradient></defs>'
+'<circle cx="160" cy="160" r="156" fill="url(#afcGlow)"/>'
+'<g class="afcb-spin">'
 +'<ellipse cx="160" cy="160" rx="140" ry="146" fill="none" stroke="#A6CE39" stroke-width="2.5" opacity=".4" stroke-dasharray="30 22"/>'
 +'<ellipse cx="160" cy="160" rx="124" ry="132" fill="none" stroke="#C9F04B" stroke-width="5" opacity=".7" stroke-dasharray="54 34"/>'
+'</g>'
+'<g class="afcb-spin2">'
 +'<ellipse cx="160" cy="160" rx="108" ry="118" fill="none" stroke="#B4763C" stroke-width="4" opacity=".55" stroke-dasharray="20 26"/>'
 +'<ellipse cx="160" cy="160" rx="96" ry="106" fill="none" stroke="#8FB92F" stroke-width="2" opacity=".45" stroke-dasharray="8 14"/>'
+'</g>'
+'<ellipse cx="160" cy="160" rx="92" ry="104" fill="url(#afcHole)"/>'
+'<g class="afcb-spin3">'
 +'<path d="M160 66 C 214 86 232 150 206 206 C 188 244 132 256 96 232"'
 +' fill="none" stroke="#C9F04B" stroke-width="3" opacity=".35" stroke-linecap="round"/>'
 +'<path d="M160 96 C 196 112 208 156 190 194 C 178 220 140 228 116 212"'
 +' fill="none" stroke="#A6CE39" stroke-width="2" opacity=".3" stroke-linecap="round"/>'
+'</g>'
+'<ellipse cx="160" cy="160" rx="54" ry="66" fill="#000" opacity=".92"/></svg>';

/* the seed he throws — same rings, tiny */
var DISC = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">'
+'<circle cx="60" cy="60" r="40" fill="#0D1117" stroke="#C9F04B" stroke-width="6"/>'
+'<circle cx="60" cy="60" r="26" fill="none" stroke="#A6CE39" stroke-width="4" stroke-dasharray="14 10"/>'
+'<circle cx="60" cy="60" r="12" fill="#05070A"/></svg>';

/* the puddle he leaves behind, and it soaks in on its own */
var MUD = '<svg viewBox="0 0 320 96" aria-hidden="true" focusable="false">'
+'<path d="M16 64 C 44 34 96 30 134 46 C 168 60 206 32 248 46 C 292 60 306 76 280 84'
+' C 224 96 62 96 24 84 C 8 79 8 72 16 64 Z" fill="#4A3323" opacity=".9"/>'
+'<ellipse cx="160" cy="70" rx="104" ry="13" fill="#2E1F12" opacity=".55"/>'
+'<ellipse cx="118" cy="60" rx="28" ry="6" fill="#6B4A2C" opacity=".45"/>'
+'<ellipse cx="226" cy="64" rx="18" ry="5" fill="#6B4A2C" opacity=".35"/></svg>';

/* ==========================================================================
   THE CINEMATIC
   Arrival: forked lightning, fireworks across the whole screen, the truck
   rolls in with him actually driving it, brakes, backs up, pops a wheelie,
   peels out through the mud, he climbs down, waves, walks to the corner and
   becomes the chat button. The puddle soaks in by itself.
   Exit: he throws the portal clear across the page, it tears open, he
   crouches and leaps through, slow enough to actually watch.

   Accessibility: nothing strobes. Every element draws on, holds and fades
   exactly once — no repeated flash, no rapid luminance change — and the
   whole stage is skipped under prefers-reduced-motion. A skip control is
   on screen the entire time.
   ========================================================================== */
var BOLTS = '<svg class="afcb-boltsvg" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">'
+'<g>'
+'<path class="b1" d="M126 -20 L168 118 L112 136 L188 292 L146 306 L214 470"/>'
+'<path class="b1b" d="M168 118 L96 182 L130 196"/>'
+'<path class="b2" d="M986 -20 L1042 130 L978 148 L1052 286 L1008 302 L1064 452"/>'
+'<path class="b2b" d="M1042 130 L1108 190 L1070 206"/>'
+'<path class="b3" d="M604 -20 L646 96 L588 112 L652 236 L616 250 L664 388"/>'
+'<path class="b3b" d="M646 96 L706 150 L672 162"/>'
+'<path class="b4" d="M330 -20 L292 104 L344 122 L288 244"/>'
+'<path class="b5" d="M840 -20 L806 92 L858 108 L812 218"/>'
+'</g></svg>';

var CINE_CSS = ''
+'.afcb-stage{position:fixed;inset:0;z-index:2147481900;pointer-events:none;overflow:hidden;display:none}'
+'.afcb-stage.on{display:block}'

/* ── lightning: slow draw, one fade, soft bloom, never a strobe ────────── */
+'.afcb-bolts{position:absolute;top:0;left:0;width:100%;height:74vh;opacity:0}'
+'.afcb-boltsvg{width:100%;height:100%;display:block}'
+'.afcb-bolts path{fill:none;stroke:#C9F04B;stroke-linecap:round;stroke-linejoin:round;'
 +'stroke-width:7;stroke-dasharray:1400;stroke-dashoffset:1400;'
 +'filter:drop-shadow(0 0 14px rgba(201,240,75,.6)) drop-shadow(0 0 34px rgba(201,240,75,.3))}'
+'.afcb-bolts path.b1b,.afcb-bolts path.b2b,.afcb-bolts path.b3b{stroke-width:4;opacity:.85}'
+'.afcb-bolts path.b4,.afcb-bolts path.b5{stroke-width:5;stroke:#E8F7AE}'
+'.afcb-stage.go .afcb-bolts{opacity:1}'
+'.afcb-stage.go .afcb-bolts path{animation:afcbStrike 3.6s cubic-bezier(.2,.7,.3,1) both}'
+'.afcb-stage.go .afcb-bolts path.b1b{animation-delay:.34s}'
+'.afcb-stage.go .afcb-bolts path.b2{animation-delay:.55s}'
+'.afcb-stage.go .afcb-bolts path.b2b{animation-delay:.85s}'
+'.afcb-stage.go .afcb-bolts path.b3{animation-delay:1.15s}'
+'.afcb-stage.go .afcb-bolts path.b3b{animation-delay:1.45s}'
+'.afcb-stage.go .afcb-bolts path.b4{animation-delay:1.9s}'
+'.afcb-stage.go .afcb-bolts path.b5{animation-delay:2.5s}'
+'@keyframes afcbStrike{0%{stroke-dashoffset:1400;opacity:0}'
 +'8%{opacity:.5}30%{stroke-dashoffset:0;opacity:.9}'
 +'55%{opacity:.6}100%{stroke-dashoffset:0;opacity:0}}'

/* ── fireworks: shell rises, blooms, sparks drift out and fall ─────────── */
+'.afcb-sky{position:absolute;inset:0;overflow:hidden}'
+'.afcb-shell{position:absolute;width:6px;height:6px;border-radius:50%;background:#F7E8A0;opacity:0;'
 +'box-shadow:0 0 12px rgba(247,232,160,.85);animation:afcbShell .85s cubic-bezier(.2,.6,.4,1) forwards}'
+'@keyframes afcbShell{0%{opacity:0;transform:translateY(0) scale(.6)}'
 +'14%{opacity:.9}100%{opacity:.25;transform:translateY(var(--rise)) scale(1)}}'
+'.afcb-fw{position:absolute;width:0;height:0}'
+'.afcb-fw b{position:absolute;left:0;top:0;width:230px;height:230px;margin:-115px;border-radius:50%;opacity:0;'
 +'background:radial-gradient(circle,rgba(255,255,255,.5) 0%,rgba(201,240,75,.26) 34%,rgba(166,206,57,0) 68%);'
 +'animation:afcbBloom 1.9s ease-out forwards}'
+'@keyframes afcbBloom{0%{opacity:0;transform:scale(.18)}20%{opacity:.7}100%{opacity:0;transform:scale(1.6)}}'
+'.afcb-fw i{position:absolute;left:0;top:0;width:7px;height:7px;margin:-3.5px;border-radius:50%;opacity:0;'
 +'animation:afcbSpark 2.4s cubic-bezier(.1,.72,.3,1) forwards}'
+'@keyframes afcbSpark{0%{opacity:0;transform:translate(0,0) scale(.5)}'
 +'9%{opacity:.95}45%{opacity:.8}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.3)}}'

/* ── the truck ─────────────────────────────────────────────────────────── */
+'.afcb-truck{position:absolute;left:0;bottom:4px;width:min(520px,72vw);transform:translateX(120vw)}'
+'.afcb-truck svg{width:100%;height:auto;display:block;filter:drop-shadow(0 16px 26px rgba(0,0,0,.45))}'
+'.afcb-stage.go .afcb-truck{animation:afcbDrive 9s linear both}'
+'@keyframes afcbDrive{'
 +'0%{transform:translateX(120vw);animation-timing-function:cubic-bezier(.12,.72,.28,1)}'
 +'18%{transform:translateX(6vw);animation-timing-function:cubic-bezier(.5,0,.6,1)}'
 +'24%{transform:translateX(9vw);animation-timing-function:cubic-bezier(.35,0,.3,1)}'
 +'38%{transform:translateX(50vw);animation-timing-function:cubic-bezier(.4,0,.5,1)}'
 +'45%{transform:translateX(47vw);animation-timing-function:linear}'
 +'58%{transform:translateX(47vw);animation-timing-function:cubic-bezier(.25,.9,.3,1)}'
 +'66%{transform:translateX(33vw);animation-timing-function:linear}'
 +'78%{transform:translateX(32vw);animation-timing-function:cubic-bezier(.5,0,.85,.6)}'
 +'100%{transform:translateX(-95vw)}}'
+'.afcb-tilt{transform-box:view-box;transform-origin:394px 222px}'
+'.afcb-stage.go .afcb-tilt{animation:afcbWheelie 1.7s cubic-bezier(.3,.8,.35,1) 4.1s both}'
+'@keyframes afcbWheelie{0%{transform:rotate(0)}22%{transform:rotate(-18deg)}'
 +'56%{transform:rotate(-15.5deg)}74%{transform:rotate(1.5deg)}88%{transform:rotate(-1deg)}100%{transform:rotate(0)}}'
+'.afcb-stage.go .afcb-truck svg{animation:afcbShake .16s ease-in-out 5.65s 6}'
+'@keyframes afcbShake{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,1px)}'
 +'75%{transform:translate(3px,-1px)}}'
+'.afcb-wh,.afcb-wh2{transform-box:fill-box;transform-origin:center}'
+'.afcb-stage.go .afcb-wh{animation:afcbSpinF 9s linear both}'
+'.afcb-stage.go .afcb-wh2{animation:afcbSpinR 9s linear both}'
+'@keyframes afcbSpinF{0%{transform:rotate(0)}18%{transform:rotate(2100deg)}'
 +'45%{transform:rotate(2900deg)}66%{transform:rotate(3600deg)}100%{transform:rotate(5200deg)}}'
+'@keyframes afcbSpinR{0%{transform:rotate(0)}18%{transform:rotate(2100deg)}'
 +'45%{transform:rotate(2900deg)}58%{transform:rotate(5200deg)}66%{transform:rotate(8000deg)}'
 +'100%{transform:rotate(9600deg)}}'
+'.afcb-driver{transform-box:view-box;transform-origin:257px 92px}'
+'.afcb-stage.go .afcb-driver{animation:afcbJostle .9s ease-in-out 1s 5,afcbGone .4s linear 6.2s forwards}'
+'@keyframes afcbJostle{0%,100%{transform:translate(0,0) rotate(0)}'
 +'40%{transform:translate(-2px,-2px) rotate(-2deg)}70%{transform:translate(2px,1px) rotate(1.5deg)}}'
+'@keyframes afcbGone{to{opacity:0}}'

/* ── dirt, mud, and the puddle he leaves behind ────────────────────────── */
+'.afcb-grit{position:absolute;bottom:0;border-radius:52% 48% 46% 54%;opacity:0;'
 +'animation:afcbGrit 1.9s cubic-bezier(.1,.7,.3,1) forwards}'
+'@keyframes afcbGrit{0%{opacity:0;transform:translate(0,0) scale(.5) rotate(0)}'
 +'12%{opacity:.85}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.6) rotate(220deg)}}'
+'.afcb-puddle{position:absolute;bottom:2px;width:min(300px,44vw);opacity:0}'
+'.afcb-puddle svg{width:100%;height:auto;display:block}'
+'.afcb-stage.go .afcb-puddle{animation:afcbPuddle 7.8s ease-out 5.8s both}'
+'@keyframes afcbPuddle{0%{opacity:0;transform:scale(.3,.2)}'
 +'7%{opacity:.95;transform:scale(1.05,1.05)}13%{transform:scale(1,1)}'
 +'60%{opacity:.9}100%{opacity:0;transform:scale(.86,.45)}}'

/* ── the man himself ───────────────────────────────────────────────────── */
+'.afcb-hero{position:absolute;right:26px;bottom:8px;width:min(232px,36vw);opacity:0}'
+'.afcb-hero svg{width:100%;height:auto;display:block;filter:drop-shadow(0 14px 22px rgba(0,0,0,.4))}'
+'.afcb-hero.climb{animation:afcbClimb 1.5s cubic-bezier(.24,.9,.32,1) both}'
+'@keyframes afcbClimb{0%{opacity:0;transform:translate(-30vw,-58px) scale(.82)}'
 +'16%{opacity:1}46%{transform:translate(-32vw,-104px) scale(.92)}'
 +'82%{transform:translate(-33vw,10px) scale(1.05,.93)}100%{opacity:1;transform:translate(-33vw,0) scale(1)}}'
+'.afcb-hero.walk{animation:afcbWalkOver 3.1s cubic-bezier(.42,0,.58,1) both}'
+'@keyframes afcbWalkOver{0%{opacity:1;transform:translate(-33vw,0)}'
 +'50%{transform:translate(-17vw,-3px)}100%{opacity:1;transform:translate(0,0)}}'
+'.afcb-hero.tuck{animation:afcbTuck 1s cubic-bezier(.5,0,.9,.4) both}'
+'@keyframes afcbTuck{0%{opacity:1;transform:translate(0,0) scale(1)}'
 +'30%{transform:translate(0,-16px) scale(1.05,.95)}'
 +'100%{opacity:0;transform:translate(12px,32px) scale(.18)}}'
+'.afcb-hero.pop{animation:afcbPop 1s cubic-bezier(.2,.9,.3,1) both}'
+'@keyframes afcbPop{0%{opacity:0;transform:translate(12px,32px) scale(.18)}'
 +'100%{opacity:1;transform:translate(0,0) scale(1)}}'

/* walk cycle: legs stride, arms counter-swing, body bounces */
+'.afcb-legA,.afcb-legB{transform-box:view-box}'
+'.afcb-legA{transform-origin:197px 350px}.afcb-legB{transform-origin:251px 350px}'
+'.afcb-armA{transform-box:view-box;transform-origin:162px 244px}'
+'.afcb-hero.walking .afcb-legA{animation:afcbStepA .52s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-legB{animation:afcbStepB .52s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-armA{animation:afcbSwingA .52s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-wave{animation:afcbSwingB .52s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-bob{animation:afcbStride .26s ease-in-out infinite}'
+'@keyframes afcbStepA{0%,100%{transform:rotate(16deg)}50%{transform:rotate(-16deg)}}'
+'@keyframes afcbStepB{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}}'
+'@keyframes afcbSwingA{0%,100%{transform:rotate(-15deg)}50%{transform:rotate(15deg)}}'
+'@keyframes afcbSwingB{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}}'
+'@keyframes afcbStride{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'
+'.afcb-hero.hello .afcb-wave{animation:afcbBigWave .62s ease-in-out 5}'
+'@keyframes afcbBigWave{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(24deg)}}'
+'.afcb-hero.windup .afcb-wave{animation:afcbThrowArm 1.1s cubic-bezier(.3,.9,.35,1) both}'
+'@keyframes afcbThrowArm{0%{transform:rotate(0)}34%{transform:rotate(40deg)}'
 +'58%{transform:rotate(-66deg)}100%{transform:rotate(-12deg)}}'
+'.afcb-hero.crouch .afcb-bob{animation:afcbCrouch .85s cubic-bezier(.35,0,.4,1) both}'
+'@keyframes afcbCrouch{0%{transform:translateY(0) scale(1,1)}'
 +'62%{transform:translateY(18px) scale(1.08,.84)}100%{transform:translateY(12px) scale(1.05,.89)}}'
+'.afcb-hero.leap{animation:afcbLeap 2.6s cubic-bezier(.3,.05,.5,1) both}'
+'@keyframes afcbLeap{0%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}'
 +'10%{transform:translate(-4vw,-12vh) scale(1.03,.97) rotate(-4deg)}'
 +'42%{transform:translate(-32vw,-38vh) scale(.8) rotate(-10deg)}'
 +'74%{transform:translate(-58vw,-48vh) scale(.46) rotate(-16deg)}'
 +'92%{opacity:1;transform:translate(-70vw,-51vh) scale(.18) rotate(-24deg)}'
 +'100%{opacity:0;transform:translate(-72vw,-51vh) scale(.05) rotate(-30deg)}}'

/* ── the portal: thrown as a disc, opened where it lands ───────────────── */
+'.afcb-disc{position:absolute;right:48px;bottom:236px;width:74px;opacity:0}'
+'.afcb-disc svg{width:100%;height:auto;display:block;filter:drop-shadow(0 0 18px rgba(166,206,57,.55))}'
+'.afcb-disc.fly{animation:afcbThrow 1.15s cubic-bezier(.25,.5,.4,1) both}'
+'@keyframes afcbThrow{0%{opacity:0;transform:translate(0,0) scale(.4) rotate(0)}'
 +'12%{opacity:1}55%{transform:translate(-42vw,-30vh) scale(.95) rotate(430deg)}'
 +'100%{opacity:1;transform:translate(-76vw,-43vh) scale(1.15) rotate(920deg)}}'
+'.afcb-portal{position:absolute;left:6vw;top:9vh;width:min(320px,52vw);opacity:0;transform:scale(0)}'
+'.afcb-portal svg{width:100%;height:auto;display:block;filter:drop-shadow(0 0 46px rgba(166,206,57,.4))}'
+'.afcb-portal.open{animation:afcbHoleIn 1.6s cubic-bezier(.18,.9,.3,1) both}'
+'@keyframes afcbHoleIn{0%{opacity:0;transform:scale(.04) rotate(-40deg)}'
 +'44%{opacity:1;transform:scale(1.12) rotate(10deg)}'
 +'72%{transform:scale(.96) rotate(-3deg)}100%{opacity:1;transform:scale(1) rotate(0)}}'
+'.afcb-portal.shut{animation:afcbHoleOut 1.2s cubic-bezier(.6,0,.9,.4) both}'
+'@keyframes afcbHoleOut{0%{opacity:1;transform:scale(1)}'
 +'34%{transform:scale(1.09) rotate(18deg)}100%{opacity:0;transform:scale(0) rotate(90deg)}}'
+'.afcb-spin{transform-box:fill-box;transform-origin:center;animation:afcbSpin 11s linear infinite}'
+'.afcb-spin2{transform-box:fill-box;transform-origin:center;animation:afcbSpin 7s linear infinite reverse}'
+'.afcb-spin3{transform-box:fill-box;transform-origin:center;animation:afcbSpin 16s linear infinite}'
+'@keyframes afcbSpin{to{transform:rotate(360deg)}}'

/* ── skip control, always available ────────────────────────────────────── */
+'.afcb-skip{position:absolute;left:16px;bottom:16px;pointer-events:auto;background:rgba(13,17,23,.84);'
 +'color:#F4F4F1;border:1px solid rgba(166,206,57,.55);border-radius:999px;padding:9px 16px;font-size:13px;'
 +'font-weight:600;cursor:pointer;font-family:Inter,system-ui,sans-serif;letter-spacing:.02em}'
+'.afcb-skip:hover{background:#0D1117;border-color:#A6CE39}'

/* ── phones: the truck is wider, so the whole blocking shifts ──────────── */
+'@media(max-width:640px){'
 +'.afcb-truck{width:96vw;bottom:2px}'
 +'.afcb-hero{right:12px;width:46vw}'
 +'.afcb-portal{left:5vw;top:10vh;width:62vw}'
 +'.afcb-puddle{width:62vw}'
 +'.afcb-disc{right:34px;bottom:180px;width:58px}'
 +'.afcb-fw b{width:180px;height:180px;margin:-90px}'
 +'.afcb-stage.go .afcb-truck{animation:afcbDriveM 9s linear both}'
 +'@keyframes afcbDriveM{'
  +'0%{transform:translateX(120vw);animation-timing-function:cubic-bezier(.12,.72,.28,1)}'
  +'18%{transform:translateX(-22vw);animation-timing-function:cubic-bezier(.5,0,.6,1)}'
  +'24%{transform:translateX(-18vw);animation-timing-function:cubic-bezier(.35,0,.3,1)}'
  +'38%{transform:translateX(32vw);animation-timing-function:cubic-bezier(.4,0,.5,1)}'
  +'45%{transform:translateX(28vw);animation-timing-function:linear}'
  +'58%{transform:translateX(28vw);animation-timing-function:cubic-bezier(.25,.9,.3,1)}'
  +'66%{transform:translateX(-14vw);animation-timing-function:linear}'
  +'78%{transform:translateX(-16vw);animation-timing-function:cubic-bezier(.5,0,.85,.6)}'
  +'100%{transform:translateX(-140vw)}}'
 +'.afcb-hero.climb{animation:afcbClimbM 1.5s cubic-bezier(.24,.9,.32,1) both}'
 +'@keyframes afcbClimbM{0%{opacity:0;transform:translate(-22vw,-46px) scale(.82)}'
  +'16%{opacity:1}46%{transform:translate(-24vw,-86px) scale(.92)}'
  +'82%{transform:translate(-25vw,8px) scale(1.05,.93)}100%{opacity:1;transform:translate(-25vw,0) scale(1)}}'
 +'.afcb-hero.walk{animation:afcbWalkM 2.6s cubic-bezier(.42,0,.58,1) both}'
 +'@keyframes afcbWalkM{0%{opacity:1;transform:translate(-25vw,0)}'
  +'50%{transform:translate(-13vw,-3px)}100%{opacity:1;transform:translate(0,0)}}'
 +'.afcb-disc.fly{animation:afcbThrowM 1.15s cubic-bezier(.25,.5,.4,1) both}'
 +'@keyframes afcbThrowM{0%{opacity:0;transform:translate(0,0) scale(.4) rotate(0)}'
  +'12%{opacity:1}55%{transform:translate(-28vw,-38vh) scale(.95) rotate(430deg)}'
  +'100%{opacity:1;transform:translate(-48vw,-56vh) scale(1.15) rotate(920deg)}}'
 +'.afcb-hero.leap{animation:afcbLeapM 2.6s cubic-bezier(.3,.05,.5,1) both}'
 +'@keyframes afcbLeapM{0%{opacity:1;transform:translate(0,0) scale(1) rotate(0)}'
  +'10%{transform:translate(-3vw,-13vh) scale(1.03,.97) rotate(-4deg)}'
  +'42%{transform:translate(-18vw,-40vh) scale(.8) rotate(-10deg)}'
  +'74%{transform:translate(-31vw,-51vh) scale(.46) rotate(-16deg)}'
  +'92%{opacity:1;transform:translate(-37vw,-55vh) scale(.18) rotate(-24deg)}'
  +'100%{opacity:0;transform:translate(-38vw,-55vh) scale(.05) rotate(-30deg)}}'
+'}'
+'@media(prefers-reduced-motion:reduce){.afcb-stage{display:none!important}}';

/* Returns null when the browser asked for no motion — callers just proceed. */
function Cine(){
  if (reduce) return null;

  var stage = el('div', 'afcb-stage');
  stage.innerHTML =
    '<div class="afcb-sky"></div>'
  + '<div class="afcb-bolts">' + BOLTS + '</div>'
  + '<div class="afcb-puddle">' + MUD + '</div>'
  + '<div class="afcb-truck">' + TRUCK + '</div>'
  + '<div class="afcb-portal">' + PORTAL + '</div>'
  + '<div class="afcb-disc">' + DISC + '</div>'
  + '<div class="afcb-hero">' + FULL + '</div>'
  + '<button class="afcb-skip" type="button">Skip intro</button>';
  D.body.appendChild(stage);

  var sky    = stage.querySelector('.afcb-sky'),
      hero   = stage.querySelector('.afcb-hero'),
      portal = stage.querySelector('.afcb-portal'),
      disc   = stage.querySelector('.afcb-disc'),
      puddle = stage.querySelector('.afcb-puddle'),
      skip   = stage.querySelector('.afcb-skip'),
      timers = [], ending = null;

  function mob(){ return (W.innerWidth || 1024) <= 640; }
  function at(ms, fn){ timers.push(setTimeout(fn, ms)); }
  function clearAll(){ for (var i=0;i<timers.length;i++) clearTimeout(timers[i]); timers = []; }
  function drop(node, ms){ at(ms, function(){ if (node.parentNode) node.parentNode.removeChild(node); }); }

  var HUE = ['#C9F04B','#F7E8A0','#A6CE39','#FFFFFF','#E8A020','#BFD4E8'];

  /* one firework: shell climbs, blooms, sparks arc out and fall */
  function firework(xvw, yvh){
    var sh = el('div', 'afcb-shell');
    sh.style.left = xvw + 'vw';
    sh.style.bottom = '4px';
    sh.style.setProperty('--rise', '-' + (100 - yvh) + 'vh');
    sky.appendChild(sh);
    drop(sh, 950);

    at(850, function(){
      var fw = el('div', 'afcb-fw'), i, n = 20, ang, dist, col = pick(HUE);
      fw.style.left = xvw + 'vw';
      fw.style.top  = (100 - yvh) + 'vh';
      fw.appendChild(el('b'));
      for (i=0;i<n;i++){
        var s = el('i');
        ang  = (Math.PI * 2 / n) * i + rnd(-0.12, 0.12);
        dist = rnd(70, 170);
        s.style.background = (i % 5 === 0) ? '#fff' : col;
        s.style.boxShadow = '0 0 9px ' + col;
        s.style.setProperty('--tx', Math.round(Math.cos(ang) * dist) + 'px');
        s.style.setProperty('--ty', Math.round(Math.sin(ang) * dist + rnd(26, 70)) + 'px');
        s.style.animationDelay = rnd(0, 0.09) + 's';
        fw.appendChild(s);
      }
      sky.appendChild(fw);
      drop(fw, 2800);
    });
  }

  /* dirt off a braking tire, or mud thrown from a spinning one */
  function grit(xvw, count, spread, muddy){
    for (var i=0;i<count;i++){
      (function(){
        var g = el('div', 'afcb-grit'), sz = rnd(muddy ? 9 : 6, muddy ? 26 : 18);
        g.style.left   = (xvw + rnd(-3, 3)) + 'vw';
        g.style.width  = sz + 'px';
        g.style.height = (sz * rnd(.6, 1)) + 'px';
        g.style.background = muddy
          ? pick(['#4A3323','#5E4128','#6B4A2C','#3A2717'])
          : pick(['#D9C7A8','#C9B392','#E6D9C0']);
        g.style.setProperty('--tx', Math.round(rnd(spread * 0.25, spread)) + 'px');
        g.style.setProperty('--ty', Math.round(rnd(-160, -40)) + 'px');
        g.style.animationDelay = rnd(0, .35) + 's';
        sky.appendChild(g);
        drop(g, 2700);
      })();
    }
  }

  function reset(){
    stage.className = 'afcb-stage';
    hero.className = 'afcb-hero';
    hero.style.transform = ''; hero.style.opacity = '';
    portal.className = 'afcb-portal';
    disc.className = 'afcb-disc'; disc.style.opacity = '';
    sky.innerHTML = '';
  }
  function finish(done){ clearAll(); reset(); if (done) done(); }

  skip.addEventListener('click', function(){
    if (ending){ var f = ending; ending = null; f(); }
  });

  return {
    stage: stage,

    /* ~11.4s of arrival */
    arrive: function(done){
      ending = function(){ finish(done); };
      var m = mob();
      stage.classList.add('on');
      void stage.offsetWidth;
      stage.classList.add('go');
      puddle.style.left = (m ? 20 : 47) + 'vw';

      /* fireworks across the entire width, staggered so nothing flashes */
      var shots = [[14,52],[76,58],[40,68],[88,44],[26,62],[62,50],[8,46],[52,72],[70,64],[34,48]];
      shots.forEach(function(p, i){ at(260 + i * 520, function(){ firework(p[0], p[1]); }); });

      at(1500, function(){ grit(m ? 14 : 22, 12, 180, false); });   /* brake skid */
      at(5700, function(){ grit(m ? 48 : 57, 18, 280, true);        /* peel out   */
                           grit(m ? 44 : 53, 10, 220, false); });
      at(6200, function(){ grit(m ? 44 : 53, 8, 150, true); });

      at(6250, function(){ hero.style.opacity = '1'; hero.classList.add('climb'); });
      at(7700, function(){ hero.className = 'afcb-hero hello';
                           hero.style.transform = 'translate(' + (m ? -25 : -33) + 'vw,0)'; });
      at(9150, function(){ hero.style.transform = '';
                           hero.className = 'afcb-hero walk walking'; });
      at(m ? 11300 : 11800, function(){ hero.classList.remove('walking'); });
      at(m ? 11450 : 11950, function(){ hero.className = 'afcb-hero tuck'; });
      at(m ? 12400 : 12900, function(){ ending = null; finish(done); });
      return m ? 11450 : 11950;
    },

    /* ~7.8s of exit, deliberately slow */
    exit: function(done){
      ending = function(){ finish(done); };
      stage.classList.add('on');
      void stage.offsetWidth;
      hero.style.opacity = '1';
      hero.classList.add('pop');

      at(1050, function(){ hero.className = 'afcb-hero windup'; });
      at(1550, function(){ disc.classList.add('fly'); });
      at(2650, function(){ disc.style.opacity = '0'; portal.classList.add('open'); });
      at(4150, function(){ hero.className = 'afcb-hero crouch'; });
      at(5000, function(){ hero.className = 'afcb-hero leap'; });
      at(6800, function(){ portal.className = 'afcb-portal shut'; });
      at(7800, function(){ ending = null; finish(done); });
    },

    kill: function(){ if (ending){ var f = ending; ending = null; f(); } }
  };
}

/* ─────────────────────────── STYLES ────────────────────────────────────── */
var CSS = ''
+'.afcb,.afcb *{box-sizing:border-box;margin:0;padding:0}'
+'.afcb{position:fixed;right:20px;bottom:18px;z-index:2147482000;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}'

/* the launcher is the whole man, not a face in a circle */
+'.afcb-btn{position:relative;display:block;width:104px;padding:0;border:0;background:transparent;cursor:pointer}'
+'.afcb-btn u{position:absolute;left:50%;bottom:-4px;width:86px;height:86px;margin-left:-43px;border-radius:50%;'
 +'background:#A6CE39;border:3px solid #fff;box-shadow:0 12px 30px rgba(13,17,23,.38);text-decoration:none}'
+'.afcb-btn svg{position:relative;width:100%;height:auto;display:block;'
 +'filter:drop-shadow(0 10px 16px rgba(13,17,23,.35))}'
+'.afcb-btn:hover u{background:#C9F04B}'
+'.afcb-dot{position:absolute;top:6px;right:2px;width:22px;height:22px;border-radius:50%;background:#B4763C;'
 +'border:2px solid #fff;color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center;line-height:1}'
+'.afcb.open .afcb-btn{opacity:0;pointer-events:none;transform:translateY(14px) scale(.9);'
 +'transition:opacity .25s,transform .25s}'

+'.afcb-tip{position:absolute;bottom:28px;right:112px;max-width:250px;background:#fff;color:#232A33;'
 +'border:1px solid #DDDDD6;border-radius:12px 12px 2px 12px;padding:12px 14px;font-size:14px;line-height:1.5;'
 +'box-shadow:0 14px 40px rgba(13,17,23,.22);cursor:pointer;display:none}'
+'.afcb-tip.on{display:block}'
+'.afcb-tip b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#B4763C;margin-bottom:3px}'

+'.afcb-p{position:absolute;bottom:0;right:0;width:392px;max-width:calc(100vw - 32px);'
 +'height:min(640px,calc(100vh - 120px));background:#F4F4F1;border-radius:16px;overflow:hidden;'
 +'box-shadow:0 28px 80px rgba(13,17,23,.45);display:none;flex-direction:column}'
+'.afcb-p.on{display:flex}'
+'.afcb-h{background:#0D1117;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:12px;flex:0 0 auto}'
+'.afcb-h .av{width:52px;height:64px;flex:0 0 52px;display:block;position:relative}'
+'.afcb-h .av svg{width:100%;height:auto;display:block;transform:translateY(2px)}'
+'.afcb-h b{font-family:"Barlow Condensed",Impact,sans-serif;font-size:21px;font-weight:800;'
 +'text-transform:uppercase;letter-spacing:.02em;line-height:1;display:block}'
+'.afcb-h i{font-style:normal;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#A6CE39;'
 +'display:flex;align-items:center;gap:6px;margin-top:4px}'
+'.afcb-h i u{width:6px;height:6px;border-radius:50%;background:#A6CE39;text-decoration:none}'
+'.afcb-x{margin-left:auto;background:transparent;border:0;color:#fff;font-size:26px;line-height:1;'
 +'cursor:pointer;opacity:.75;padding:0 4px}'
+'.afcb-x:hover{opacity:1}'
+'.afcb-m{flex:1 1 auto;overflow-y:auto;padding:16px;background:#F4F4F1;-webkit-overflow-scrolling:touch}'
+'.afcb-hello{background:#0D1117;border-radius:14px;padding:14px 16px 0;margin-bottom:12px;text-align:center}'
+'.afcb-hello svg{width:172px;height:auto;margin:0 auto;display:block}'
+'.afcb-r{max-width:88%;padding:11px 14px;border-radius:14px;margin-bottom:10px;font-size:14.5px;'
 +'line-height:1.6;white-space:pre-wrap;word-wrap:break-word}'
+'.afcb-r.bot{background:#fff;color:#232A33;border-bottom-left-radius:4px;border:1px solid #E3E3DC}'
+'.afcb-r.me{background:#0D1117;color:#fff;margin-left:auto;border-bottom-right-radius:4px}'
+'.afcb-t{display:flex;gap:5px;padding:13px 15px;background:#fff;border:1px solid #E3E3DC;border-radius:14px;'
 +'width:58px;margin-bottom:10px}'
+'.afcb-t s{width:7px;height:7px;border-radius:50%;background:#A6CE39;text-decoration:none;opacity:.35}'
+'.afcb-q{padding:10px 12px;border-top:1px solid #DDDDD6;background:#fff;display:flex;flex-wrap:wrap;gap:7px;flex:0 0 auto}'
+'.afcb-q button{border:1px solid #A6CE39;background:rgba(166,206,57,.10);color:#4E6B10;border-radius:999px;'
 +'padding:9px 15px;font-size:13px;font-weight:600;cursor:pointer;line-height:1.3;text-align:center;'
 +'font-family:inherit;white-space:normal;max-width:100%}'
+'.afcb-q button:hover{background:#A6CE39;color:#0D1117}'
+'.afcb-in{display:flex;gap:8px;padding:11px 12px;border-top:1px solid #DDDDD6;background:#fff;flex:0 0 auto}'
+'.afcb-in input{flex:1;min-width:0;border:2px solid #DDDDD6;border-radius:8px;padding:11px 12px;'
 +'font-size:14.5px;font-family:inherit;color:#232A33;background:#fff}'
+'.afcb-in input:focus{outline:none;border-color:#A6CE39}'
+'.afcb-in button{background:#A6CE39;color:#0D1117;border:0;border-radius:8px;padding:0 16px;cursor:pointer;'
 +'font-family:"Barlow Condensed",Impact,sans-serif;font-size:17px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}'
+'.afcb-f{padding:12px;border-top:1px solid #DDDDD6;background:#fff;display:none;flex:0 0 auto;max-height:46%;overflow-y:auto}'
+'.afcb-f.on{display:block}'
+'.afcb-f input,.afcb-f textarea{width:100%;border:2px solid #DDDDD6;border-radius:8px;padding:10px 12px;'
 +'font-size:14px;margin-bottom:8px;font-family:inherit;color:#232A33;background:#fff}'
+'.afcb-f textarea{min-height:62px;resize:vertical}'
+'.afcb-f button{width:100%;background:#A6CE39;color:#0D1117;border:0;border-radius:8px;padding:12px;'
 +'font-family:"Barlow Condensed",Impact,sans-serif;font-size:18px;font-weight:700;letter-spacing:.04em;'
 +'text-transform:uppercase;cursor:pointer}'
+'.afcb-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important}'
+'.afcb-cr{font-size:10.5px;color:#8A939E;text-align:center;padding:7px;background:#fff;border-top:1px solid #EAEAE4;flex:0 0 auto}'
+'.afcb-cr a{color:#8A939E;text-decoration:none}'
+'@media(max-width:480px){.afcb{right:12px;bottom:12px}.afcb-btn{width:82px}'
 +'.afcb-btn u{width:70px;height:70px;margin-left:-35px}'
 +'.afcb-p{height:min(580px,calc(100vh - 96px));width:calc(100vw - 24px)}'
 +'.afcb-hello svg{width:140px}'
 +'.afcb-tip{display:none!important}}'

/* idle life: he breathes, the pupils wander, the blade wiggles, the hat
   settles. Slow and continuous — nothing here blinks or flashes. */
+'@media(prefers-reduced-motion:no-preference){'
 +'.afcb-pl{animation:afcbA 4.1s ease-in-out infinite}'
 +'.afcb-pr{animation:afcbB 3.3s ease-in-out infinite}'
 +'.afcb-bob{animation:afcbC 3.6s ease-in-out infinite}'
 +'.afcb-shadow{animation:afcbSh 3.6s ease-in-out infinite}'
 +'.afcb-wave{animation:afcbD 4.1s ease-in-out infinite;transform-box:view-box;transform-origin:282px 236px}'
 +'.afcb-armA{animation:afcbG 5.3s ease-in-out infinite}'
 +'.afcb-neck{animation:afcbE 11s ease-in-out infinite;transform-box:view-box;transform-origin:220px 206px}'
 +'.afcb-hat{animation:afcbH 17s ease-in-out infinite;transform-box:view-box;transform-origin:220px 48px}'
 +'.afcb-t s{animation:afcbF 1.3s ease-in-out infinite}'
 +'.afcb-t s:nth-child(2){animation-delay:.18s}.afcb-t s:nth-child(3){animation-delay:.36s}'
 +'.afcb-btn:hover .afcb-bob{animation:afcbC 1.1s ease-in-out infinite}}'
+'@keyframes afcbA{0%,100%{transform:translate(-5px,2px)}35%{transform:translate(4px,-3px)}70%{transform:translate(2px,4px)}}'
+'@keyframes afcbB{0%,100%{transform:translate(4px,3px)}40%{transform:translate(-4px,-2px)}75%{transform:translate(-2px,4px)}}'
+'@keyframes afcbC{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}'
+'@keyframes afcbSh{0%,100%{transform:scale(1)}50%{transform:scale(.93)}}'
+'@keyframes afcbD{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}'
+'@keyframes afcbG{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-6deg)}}'
+'@keyframes afcbE{0%{transform:rotate(0) skewX(0)}4%{transform:rotate(5deg) skewX(-3deg)}'
 +'8%{transform:rotate(-4deg) skewX(3deg)}12%{transform:rotate(2.5deg) skewX(-1.5deg)}'
 +'16%{transform:rotate(-1.2deg)}20%,100%{transform:rotate(0)}}'
+'@keyframes afcbH{0%,88%,100%{transform:rotate(0)}92%{transform:rotate(-7deg) translateY(-4px)}'
 +'96%{transform:rotate(3deg) translateY(1px)}}'
+'@keyframes afcbF{0%,60%,100%{opacity:.3}30%{opacity:1}}';

/* ─────────────────────────── BUILD ─────────────────────────────────────── */
function build(){
  var st = el('style'); st.textContent = CSS + CINE_CSS; D.head.appendChild(st);

  var w = el('div', 'afcb');
  w.innerHTML =
    '<div class="afcb-tip" role="button" tabindex="0"><b>' + esc(CFG.name) + ' here</b>'
      + 'Got a marketing question? I answer at 11pm too.</div>'
  + '<div class="afcb-p" role="dialog" aria-label="Chat with ' + esc(CFG.name) + '">'
  +   '<div class="afcb-h"><span class="av">' + FULL + '</span>'
  +     '<span><b>' + esc(CFG.name) + '</b><i><u></u>' + esc(CFG.title) + '</i></span>'
  +     '<button class="afcb-x" type="button" aria-label="Close chat">&times;</button></div>'
  +   '<div class="afcb-m" role="log" aria-live="polite"></div>'
  +   '<div class="afcb-q"></div>'
  +   '<form class="afcb-f" novalidate>'
  +     '<input type="text" name="Name" placeholder="Your name" maxlength="80" autocomplete="name">'
  +     '<input type="tel" name="Phone" placeholder="Phone" maxlength="30" autocomplete="tel">'
  +     '<input type="text" name="Company" placeholder="Company and trade" maxlength="120">'
  +     '<textarea name="Message" placeholder="What do you need?" maxlength="900"></textarea>'
  +     '<div class="afcb-hp" aria-hidden="true"><input type="text" name="_honey" tabindex="-1" autocomplete="off"></div>'
  +     '<button type="submit">Send it over</button></form>'
  +   '<div class="afcb-in"><input type="text" placeholder="Ask me anything…" aria-label="Message"'
  +     ' autocomplete="off"><button type="button">Send</button></div>'
  +   '<div class="afcb-cr">Rule-based assistant · <a href="https://eyetoad.com/" rel="noopener">Eye To Ad Media</a></div>'
  + '</div>'
  + '<button class="afcb-btn" type="button" aria-label="Open chat with ' + esc(CFG.name) + '">'
  +   '<u></u>' + FULL + '<span class="afcb-dot">1</span></button>';
  D.body.appendChild(w);

  var panel = w.querySelector('.afcb-p'),
      msgs  = w.querySelector('.afcb-m'),
      qrow  = w.querySelector('.afcb-q'),
      form  = w.querySelector('.afcb-f'),
      input = w.querySelector('.afcb-in input'),
      send  = w.querySelector('.afcb-in button'),
      btn   = w.querySelector('.afcb-btn'),
      tip   = w.querySelector('.afcb-tip'),
      dot   = w.querySelector('.afcb-dot'),
      opened = false, busy = false, touched = false, loadedAt = Date.now(),
      cine = Cine(), animating = false, dismissed = false;

  function flag(k, v){
    try { if (v !== undefined) sessionStorage.setItem(k, v); return sessionStorage.getItem(k); }
    catch(e){ return null; }
  }

  D.addEventListener('keydown', function(){ touched = true; }, {once:true});
  D.addEventListener('pointerdown', function(){ touched = true; }, {once:true});

  function scroll(){ msgs.scrollTop = msgs.scrollHeight; }
  function bubble(text, who){
    var d = el('div', 'afcb-r ' + who); d.textContent = text;
    msgs.appendChild(d); scroll(); return d;
  }
  function say(text, after){
    if (reduce){ bubble(text, 'bot'); if (after) after(); return; }
    var t = el('div', 'afcb-t', '<s></s><s></s><s></s>');
    msgs.appendChild(t); scroll();
    var wait = Math.min(CFG.delay[1], CFG.delay[0] + text.length * 5);
    setTimeout(function(){
      if (t.parentNode) t.parentNode.removeChild(t);
      bubble(text, 'bot'); if (after) after();
    }, wait);
  }
  function chips(list){
    qrow.innerHTML = '';
    (list || []).forEach(function(label){
      var b = el('button', null, esc(label)); b.type = 'button';
      b.addEventListener('click', function(){ submitText(label); });
      qrow.appendChild(b);
    });
  }
  function go(href){
    if (href.indexOf('tel:') === 0){ W.location.href = href; return; }
    say('Opening that for you now.', function(){ setTimeout(function(){ W.location.href = href; }, 500); });
  }

  /* one sender for both the chat booking flow and the panel form */
  function lead(d){
    var data = {
      Name: d.Name || '', Phone: d.Phone || '', Company: d.Company || '',
      Message: d.Message || '', BestTime: d.Best || 'not stated',
      Trade: S.trade || 'not stated',
      Numbers: S.ticket ? ('job ' + money(S.ticket) + ', margin ' + S.margin + '%, close ' + S.close + '%') : 'not run',
      Source: 'AFC chat — ' + CFG.name, PageURL: W.location.href,
      _subject: 'AFC chat lead — ' + CFG.name, _template: 'table', _captcha: 'false'
    };
    var body = [], k;
    for (k in data){ if (Object.prototype.hasOwnProperty.call(data, k))
      body.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k])); }

    var url = 'https://formsubmit.co/ajax/' + addr();
    if (typeof fetch !== 'function'){
      say('This browser cannot send it from here. Call ' + CFG.telView + ' and someone will pick up.');
      return;
    }
    fetch(url, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: body.join('&') })
    .then(function(r){ return r.ok ? r.json().catch(function(){ return null; }) : null; })
    .then(function(j){
      if (j && String(j.success) === 'true'){
        say('Sent, and confirmed on our end' + (S.name ? ', ' + S.name : '') + '. Someone will call you back, usually same day, in the window you gave me. If you would rather not wait, ' + CFG.telView + ' gets you a human right now.',
          function(){ chips(['Run my numbers','Free audit','Tell me a joke']); });
      } else {
        say('Your details went out but no delivery receipt came back, so I cannot promise it landed. If you have not heard from us within one business day, call ' + CFG.telView + ' rather than waiting on us.',
          function(){ chips(['Call now','Free audit']); });
      }
    })
    .catch(function(){
      say('That did not send and I would rather tell you than let it vanish. Call ' + CFG.telView + ' and someone will pick up.',
        function(){ chips(['Call now','Free audit']); });
    });
  }

  var api = { say: say, chips: chips, go: go, lead: lead, form: function(){
    form.classList.add('on'); form.querySelector('input').focus(); } };

  function submitText(raw){
    var text = String(raw || '').trim();
    if (!text || busy) return;
    bubble(text, 'me');
    input.value = ''; qrow.innerHTML = '';
    busy = true;
    setTimeout(function(){ respond(text, api); busy = false; }, 120);
  }

  function open(){
    panel.classList.add('on'); w.classList.add('open'); tip.classList.remove('on');
    if (dot) dot.style.display = 'none';
    if (!opened){
      opened = true;
      var hello = el('div', 'afcb-hello', FULL);
      msgs.appendChild(hello);
      say('Howdy. I am ' + CFG.name + ' — a tape measure in a cowboy hat with a pencil behind one ear, which is an odd career, but the numbers work out.\n\nI answer contractor marketing questions, run your break-even cost per lead, and never once take a lunch break. What are you working on?',
        function(){ chips(['Run my numbers','What do you cost?','My phone is not ringing','Tell me a joke']); });
    }
    setTimeout(function(){ if (W.innerWidth > 560) input.focus(); }, 260);
    scroll();
  }

  /* X closes it for good: the portal exit plays, then the launcher quietly
     returns so he can still be reopened by hand. No nudge after that. */
  function close(){
    panel.classList.remove('on'); w.classList.remove('open');
    dismissed = true; flag('afcTexClosed', '1');
    tip.classList.remove('on');
    if (!cine || animating) return;
    animating = true;
    btn.style.transition = 'opacity .3s'; btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
    cine.exit(function(){
      btn.style.transition = 'opacity .7s'; btn.style.opacity = '1'; btn.style.pointerEvents = '';
      animating = false;
    });
  }

  btn.addEventListener('click', function(){ panel.classList.contains('on') ? close() : open(); });
  w.querySelector('.afcb-x').addEventListener('click', close);
  tip.addEventListener('click', open);
  tip.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); open(); } });
  send.addEventListener('click', function(){ submitText(input.value); });
  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter'){ e.preventDefault(); submitText(input.value); } });
  D.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && panel.classList.contains('on')) close(); });

  /* panel lead form — same hardening as the site forms */
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (form.elements['_honey'].value !== '') return;
    if (!touched || Date.now() - loadedAt < 4000){
      say('Give that a second and try again — just making sure you are a person.');
      return;
    }
    var f = form.elements,
        nm = f['Name'].value.trim(),
        ph = f['Phone'].value.trim(),
        ms = f['Message'].value.trim();
    if (!nm || (!ph && !ms)){
      say('I need a name and either a number or a note before I can pass that along.');
      return;
    }
    S.name = S.name || nm.split(' ')[0];
    form.classList.remove('on');
    lead({ Name: nm, Phone: ph, Company: f['Company'].value.trim(), Message: ms });
    form.reset();
  });

  /* arrival: lightning, fireworks, truck, wheelie, mud, walk to the corner */
  if (cine && !(CFG.arriveOnce && flag('afcTexArrived') === '1') && flag('afcTexClosed') !== '1'){
    flag('afcTexArrived', '1');
    animating = true;
    btn.style.opacity = '0'; btn.style.transform = 'scale(.3)'; btn.style.pointerEvents = 'none';
    cine.arrive(function(){
      btn.style.transition = 'opacity .55s cubic-bezier(.2,1,.3,1),transform .55s cubic-bezier(.2,1,.3,1)';
      btn.style.opacity = '1'; btn.style.transform = 'none'; btn.style.pointerEvents = '';
      animating = false;
    });
  }

  /* one gentle nudge, once per session, never after he has been closed */
  if (!reduce){
    setTimeout(function(){
      if (dismissed || opened || flag('afcTexClosed') === '1' || flag('afcTexNudged') === '1') return;
      if (panel.classList.contains('on')) return;
      flag('afcTexNudged', '1');
      tip.classList.add('on');
      setTimeout(function(){ tip.classList.remove('on'); }, 12000);
    }, CFG.nudgeAt);
  }

  W.afcBot = {
    open: open, close: close, ask: submitText, state: S,
    replay: function(){
      if (!cine || animating) return;
      animating = true; panel.classList.remove('on'); w.classList.remove('open');
      btn.style.transition = 'opacity .3s'; btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
      cine.arrive(function(){
        btn.style.transition = 'opacity .55s'; btn.style.opacity = '1'; btn.style.pointerEvents = '';
        animating = false;
      });
    },
    portal: function(){ close(); },
    reset: function(){
      try { sessionStorage.removeItem('afcTexArrived'); sessionStorage.removeItem('afcTexClosed');
            sessionStorage.removeItem('afcTexNudged'); } catch(e){}
    }
  };
}

if (!HAS_DOM){
  if (typeof module !== 'undefined' && module.exports){
    module.exports = { KB:KB, S:S, norm:norm, match:match, nums:nums, respond:respond,
                       fill:fill, A2:A2, L2:L2, byId:byId, CFG:CFG, QUOTES:QUOTES, JOKES:JOKES,
                       FULL:FULL, TRUCK:TRUCK, PORTAL:PORTAL, DISC:DISC, MUD:MUD, BOLTS:BOLTS,
                       CSS:CSS, CINE_CSS:CINE_CSS };
  }
  return;
}
if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', build);
else build();

})();
