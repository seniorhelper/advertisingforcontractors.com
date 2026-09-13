/* ==========================================================================
   rivet.js — AFC site assistant "Zach". One file, every page. v11.
   Rule-based. He only says what is written here, so he cannot invent a
   price, a promise or a statistic. Rename him on CFG.name.
   Motion: nothing strobes. Every effect draws on slowly and fades once,
   and the whole cinematic is skipped under prefers-reduced-motion.
   v11 changes v10 in exactly three places: the head is a photo of Zach
   instead of drawn art, the name is his, and he says he founded the place.
   Every other line is the v10 file, unchanged.
   ========================================================================== */
(function(){
'use strict';
if (typeof window !== 'undefined'){ if (window.__afcBot) return; window.__afcBot = 1; }

var CFG = {
  name    : 'Zach',
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

/* what runs under his name in the panel header — one at a time, slow fade */
var CREDS = [
  'Founder',
  'Marketing connoisseur',
  'Lead generation expert',
  'SEO pro',
  'Agentics innovator',
  'AIO coder',
  'Conversion optimization expert',
  'Full stack developer'
];

/* the four faces. Same head, same hat, different expression. */
var MOODS = {
  main    : '/images/afc-head-main.png',
  shades  : '/images/afc-head-shades.png',
  straight: '/images/afc-head-straight.png',
  grin    : '/images/afc-head-grin.png'
};

/* which face he wears for which subject — anything unlisted stays on main */
var MOOD_OF = {
  pricing:'shades', cheap:'shades', vip:'shades', goodcpl:'shades', roi:'shades',
  website:'shades', budget_pct:'shades', payperlead:'shades', convrate:'shades',
  contract:'straight', whyyou:'straight', seotime:'straight', agency_vs:'straight',
  buyvsown:'straight', angi:'straight', burned:'straight', diy:'straight',
  guarantee:'straight', redflags:'straight', ownership:'straight', safety:'straight',
  howtowork:'straight', homeowner:'straight', rankingdrop:'straight',
  gbpsuspended:'straight', capital:'straight', switching:'straight',
  joke:'grin', quote:'grin', thanks:'grin', haha:'grin', love:'grin', scale:'grin',
  whyfree:'grin', freebot:'grin', celebrate:'grin', goodday:'grin', compliment:'grin',
  motivate:'grin', growtool:'grin', bored:'grin'
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
Bag.prototype.add = function(items){
  for (var i=0;i<items.length;i++) this.src.push(items[i]);
  this.pool = [];
  return this;
};
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
  gc:'general contractor', sub:'subcontractor', subs:'subcontractors',
  cpl:'cost per lead', cac:'customer acquisition cost', roas:'return on ad spend',
  gbp:'google business profile', gmb:'google business profile', lsa:'local services ads',
  ppc:'google ads', nap:'name address phone', cta:'call to action', crm:'crm',
  aio:'ai search', geo:'ai search', aeo:'ai search', sge:'ai search',
  bidz:'bids', estimating:'estimates', reno:'remodeling', renos:'remodeling',
  hoa:'homeowners association', diy:'do it myself',
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
  'They call me Zach because that is my name. I am a jack of all trades. Master of one, though — and you are reading it.',
  'Jack of all trades, master of none is the short version. The full quote ends with "but oftentimes better than master of one." Somebody clipped it to sell you specialization.',
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

/* ─────────────────────────── MORE JOKES ─────────────────────────────────
   Two hundred more, shuffled into the same bag as the originals so the
   same one does not come back around for a very long time.
   ───────────────────────────────────────────────────────────────────── */
var JOKES2 = [
"Why did the marketer bring a ladder? To improve the company reach.",
"Why did the contractor become a comedian? He already had great delivery.",
"Why was the website always calm? It had plenty of inner links.",
"Why did the carpenter carry a pencil everywhere? He liked to draw conclusions.",
"Why did the marketer cross the road? To reach a new audience.",
"Why was the construction worker great at parties? He always raised the roof.",
"Why did the SEO specialist visit the bakery? He wanted better organic rolls.",
"Why did the painter get promoted? His work was outstanding in its field.",
"Why was the advertisement exhausted? It had been running all week.",
"Why did the plumber start a podcast? He had a steady stream of ideas.",
"Why was the contractor good at math? He knew how to measure success.",
"Why did the billboard go to school? It wanted greater exposure.",
"Why did the roofer bring sunglasses? The future looked shingle-bright.",
"Why was the marketing campaign so polite? It always asked for permission to convert.",
"Why did the electrician become a marketer? He knew how to generate buzz.",
"Why was the hammer confident? It always nailed the assignment.",
"Why did the website hire a personal trainer? It needed stronger core pages.",
"Why was the carpenter such a good listener? He always took notes on the board.",
"Why did the marketer bring a fishing pole? He was looking for better leads.",
"Why was the construction plan so popular? Everyone could build on it.",
"Why did the email campaign go to therapy? It had too many attachment issues.",
"Why did the painter love Monday mornings? Every week was a fresh coat.",
"Why did the contractor start a band? He already had the right tools.",
"Why was the landing page so successful? It knew how to make an entrance.",
"Why did the plumber stay positive? He knew every problem would eventually drain away.",
"Why did the social media manager bring a megaphone? The post needed more reach.",
"Why was the drill invited to every project? It always got straight to the point.",
"Why did the marketer become a gardener? He was great at growing brands.",
"Why did the roofer avoid gossip? He preferred to stay above it all.",
"Why was the paintbrush so relaxed? It knew how to go with the flow.",
"Why did the contractor bring coffee to the jobsite? He needed help building momentum.",
"Why did the search engine break up with the website? There was no connection.",
"Why was the electrician always invited to brainstorms? He had bright ideas.",
"Why did the ad campaign carry an umbrella? It was expecting a flood of leads.",
"Why was the measuring tape so trustworthy? It always told the whole length.",
"Why did the website visit the eye doctor? It needed better visibility.",
"Why was the plumber a great detective? He always found the source of the leak.",
"Why did the marketer open a bakery? He knew how to generate dough.",
"Why did the contractor refuse to argue? He preferred constructive criticism.",
"Why was the keyword feeling important? Everyone was searching for it.",
"Why did the carpenter become a teacher? He was good at explaining the framework.",
"Why did the business hire an SEO expert? It wanted to move up in the world.",
"Why was the construction crew so musical? They worked in perfect hammer-ny.",
"Why did the painter bring two ladders? He wanted to take his business to the next level.",
"Why did the marketing funnel feel crowded? Too many prospects were pouring in.",
"Why was the cement mixer such a good friend? It always helped smooth things over.",
"Why did the website get a makeover? Its look was losing visitors.",
"Why did the roofer win employee of the month? His performance was through the roof.",
"Why did the marketer study maps? He wanted to understand the customer journey.",
"Why was the contractor never surprised? He always had a concrete plan.",
"Why did the logo go to the gym? It wanted a stronger brand identity.",
"Why was the carpenter great at relationships? He knew how to build trust.",
"Why did the advertisement take a vacation? It needed time to recharge its campaign.",
"Why did the plumber bring a notebook? He wanted to keep track of current events.",
"Why did the contractor become an author? He had a great story under construction.",
"Why was the call-to-action so popular? It always knew what to say next.",
"Why did the painter open a restaurant? He specialized in tasteful finishes.",
"Why did the marketer buy binoculars? To keep an eye on the competition.",
"Why was the toolbox so organized? Everything had its place.",
"Why did the webpage arrive early? It wanted a fast loading time.",
"Why did the electrician tell jokes at work? To lighten the mood.",
"Why was the contractor good at chess? He planned several builds ahead.",
"Why did the marketing team love elevators? They were always discussing conversion lifts.",
"Why did the carpenter become an influencer? He had a strong following of studs.",
"Why was the roof so confident? It had everything covered.",
"Why did the email marketer knock first? He did not want to be marked as spam.",
"Why did the painter become a motivational speaker? He knew everyone deserved a fresh start.",
"Why was the wrench always helpful? It could turn any situation around.",
"Why did the marketer carry a compass? To keep the campaign on target.",
"Why was the construction site optimistic? Progress was being made every day.",
"Why did the website get embarrassed? Someone saw its cookies.",
"Why did the contractor start exercising? He wanted to improve his foundation.",
"Why was the ad so convincing? It made a strong case.",
"Why did the plumber become a singer? He had excellent pipes.",
"Why did the carpenter love puzzles? He enjoyed putting the pieces together.",
"Why did the marketing report wear glasses? It wanted to focus on the numbers.",
"Why was the brick so dependable? It was solid through and through.",
"Why did the painter bring a camera? He wanted to capture the perfect finish.",
"Why did the contractor open a bakery? He was already good with turnovers.",
"Why did the social post sit by the window? It wanted more exposure.",
"Why was the hammer such a good manager? It knew when to drive the point home.",
"Why did the marketer visit the gym? To work on customer retention.",
"Why did the roofer enjoy winter? Business always picked up after a good freeze.",
"Why was the landing page lonely? Nobody clicked with it.",
"Why did the carpenter bring glue to the meeting? He wanted the team to stick together.",
"Why did the contractor become a chef? He knew the recipe for a successful build.",
"Why did the keyword feel lost? It had no search intent.",
"Why was the paint can so optimistic? It always saw a brighter future.",
"Why did the plumber get promoted? He knew how to handle pressure.",
"Why did the marketer carry extra batteries? The campaign needed more energy.",
"Why was the construction estimate nervous? It was afraid of being taken out of context.",
"Why did the website make friends easily? It had an inviting homepage.",
"Why did the electrician enjoy networking? He loved making connections.",
"Why was the carpenter calm under pressure? He knew the drill.",
"Why did the marketer order a large pizza? He wanted a bigger piece of the market.",
"Why was the concrete worker so patient? He knew good things take time to set.",
"Why did the ad stop telling long stories? It wanted to get straight to the point.",
"Why was the painter great at decorating? He always knew how to set the tone.",
"Why did the contractor bring a calculator? He wanted the job to add up.",
"Why was the website so popular? It had great character.",
"Why did the marketer sit near the fireplace? He wanted warmer leads.",
"Why did the carpenter win the debate? He made a solid point.",
"Why was the plumber good at networking? He knew how everything connected.",
"Why did the business redesign its logo? It was time to make its mark.",
"Why did the roofer become a photographer? He loved taking shots from the top.",
"Why was the drill so focused? It had one point to make.",
"Why did the SEO specialist bring snacks? Rankings can be a long climb.",
"Why was the contractor a great neighbor? He was always willing to lend a hand tool.",
"Why did the paint roller get the big job? It knew how to cover a lot of ground.",
"Why did the marketer talk to the calendar? He was planning his next campaign.",
"Why was the ladder proud? It helped everyone move up.",
"Why did the website stop whispering? It needed a stronger voice.",
"Why did the carpenter become a referee? He knew when something was out of line.",
"Why did the ad campaign visit a tailor? It needed a better fit for its audience.",
"Why was the plumber never bored? Something interesting was always flowing his way.",
"Why did the contractor bring a level to the meeting? He wanted a balanced discussion.",
"Why did the marketer visit the farm? He was searching for organic growth.",
"Why did the roof apply for a management position? It was already on top of everything.",
"Why was the blueprint such a good leader? It gave everyone direction.",
"Why did the email have excellent manners? It always included a proper subject.",
"Why did the painter take up acting? He was great at changing scenes.",
"Why was the construction worker a great storyteller? He knew how to build suspense.",
"Why did the website bring luggage? It was preparing for more traffic.",
"Why did the marketer become a meteorologist? He was always forecasting trends.",
"Why was the screwdriver so persuasive? It could put a new twist on anything.",
"Why did the contractor hire a musician? The project needed better timing.",
"Why did the landing page join a dating app? It wanted more meaningful conversions.",
"Why was the electrician such a positive person? He always looked on the bright side.",
"Why did the marketer become a tour guide? He understood every step of the customer journey.",
"Why did the carpenter bring a ruler to lunch? He wanted a well-measured meal.",
"Why was the construction team never lost? They followed the plans.",
"Why did the logo sit in the front row? It wanted to be recognized.",
"Why did the roofer become a philosopher? He spent a lot of time thinking at a higher level.",
"Why was the paintbrush a good dancer? It had smooth strokes.",
"Why did the marketer carry a magnet? To attract more customers.",
"Why did the contractor tell everyone to relax? The project was coming together.",
"Why was the website good at introductions? It had a strong opening page.",
"Why did the plumber become a teacher? He knew how to explain complicated pipelines.",
"Why did the social media post go camping? It wanted to become more engaging.",
"Why was the saw always prepared? It had plenty of cutting-edge ideas.",
"Why did the marketer bring a flashlight? To shine a light on the brand.",
"Why was the construction worker good at baseball? He knew how to handle a pitch.",
"Why did the call-to-action start exercising? It wanted to become stronger.",
"Why was the contractor office so peaceful? Everything was under construction, including the stress.",
"Why did the website get invited to dinner? It had an appealing menu.",
"Why did the painter tell colorful stories? He had a vivid imagination.",
"Why did the marketer become a fisherman? He knew the right bait for every audience.",
"Why was the nail such a hard worker? It never stopped until the job was finished.",
"Why did the contractor carry a map? Every great project needs direction.",
"Why was the SEO report excited? The results were looking up.",
"Why did the electrician bring an idea to lunch? It was a light snack.",
"Why did the marketer avoid the revolving door? He was focused on customer retention.",
"Why was the cement truck invited to the meeting? It brought a solid contribution.",
"Why did the carpenter open a coffee shop? He knew how to make a good blend of grounds and beans.",
"Why did the website apologize? It had given someone a bad link.",
"Why was the roofer good at solving problems? He could see the big picture from above.",
"Why did the ad campaign wear running shoes? It wanted to improve its performance.",
"Why did the contractor become a motivational coach? He loved helping people build confidence.",
"Why was the paint sprayer so efficient? It never brushed off a big job.",
"Why did the marketer take an art class? To create a better impression.",
"Why was the wrench invited to negotiate? It was good at making adjustments.",
"Why did the website visit a mechanic? Its engine needed optimization.",
"Why did the contractor carry an eraser? Even solid plans sometimes need changes.",
"Why was the marketing team good at gardening? They knew how to nurture leads.",
"Why did the plumber stay late? He was working overtime to stop a leak in productivity.",
"Why was the carpenter presentation successful? He framed the idea perfectly.",
"Why did the business put its logo on everything? It wanted to leave a lasting impression.",
"Why did the construction crew bring cake? They had reached another milestone.",
"Why was the keyword invited to every meeting? It was highly relevant.",
"Why did the painter become an optimist? He always believed things could be brighter.",
"Why did the marketer carry a net? To capture more leads.",
"Why was the contractor good at public speaking? He had a strong delivery and a solid foundation.",
"Why did the roof refuse a vacation? It did not want to leave the house uncovered.",
"Why did the website drink coffee? It needed faster response times.",
"Why did the electrician become a photographer? He understood lighting.",
"Why was the marketing plan so dependable? It had a strong strategy behind it.",
"Why did the carpenter bring a level on vacation? He liked everything balanced.",
"Why did the contractor start a podcast? He had plenty of projects to talk about.",
"Why was the advertisement always confident? It knew its value proposition.",
"Why did the paintbrush get employee of the month? It never left a job unfinished.",
"Why did the marketer bring seeds to work? He wanted to plant new ideas.",
"Why was the toolbox a great team? Everyone brought a different skill.",
"Why did the website stop wearing camouflage? It wanted customers to find it.",
"Why did the plumber avoid making quick decisions? He preferred to let ideas sink in.",
"Why was the contractor good at comedy? He had excellent timing and great delivery.",
"Why did the SEO specialist climb a mountain? He wanted the top position.",
"Why did the carpenter become a photographer? He had an eye for framing.",
"Why was the marketing funnel never thirsty? It always had prospects pouring through it.",
"Why did the construction worker carry a broom? He wanted to make a clean finish.",
"Why did the ad bring a name tag? It wanted better brand recognition.",
"Why was the measuring tape invited to settle arguments? It provided accurate perspective.",
"Why did the marketer build a bridge? To connect the brand with its customers.",
"Why was the painter never stuck for an answer? He always had another coat ready.",
"Why did the contractor enjoy sunrise? Every day offered a chance to build something new.",
"Why did the website join a choir? It wanted a more consistent brand voice.",
"Why was the drill good at interviews? It asked penetrating questions.",
"Why did the marketer become a contractor? He wanted to turn leads into concrete results.",
"Why did the construction crew love teamwork? Many hands make solid work.",
"Why did the landing page smile? Its conversion rate had finally clicked.",
"Why did the contractor and marketer become friends? One built the business, and the other helped people find it."
];
JOKES.add(JOKES2);

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
 r:['Hey. {NAME} here — I am a tape measure in a hard hat wearing my own face, which is a strange career but the numbers work out. What do you do for a living? Roofing, HVAC, plumbing, something else?',
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
 r:['I am {NAME}, and I founded this place. That is my actual face on a twenty-five foot tape measure, in a hard hat, with a carpenter pencil behind one ear.\n\nMarketing connoisseur, lead generation expert, SEO pro, agentics innovator, AIO coder, conversion optimization expert, full stack developer — and a contractor before any of it. One job here: help contractors figure out marketing without getting sold something stupid.'],
 qr:['Are you a real person?','What can you do?','Pricing']},

{id:'robot', w:2.2, k:'are you a robot,are you human,are you a bot,are you real,are you ai,are you a person,am i talking to a robot,is this a bot,is this automated,are you chatgpt,real person,are you live',
 r:['Bot, and I will not pretend otherwise. The face and the name are real — that is me, I founded this place — but what you are typing to is rule-based, which means I can only say what a human here wrote down. Upside: I physically cannot invent a price or a promise. Downside: I do not know everything. When I hit my limit I hand you to a human at {TEL}.'],
 qr:['Have someone call me','What can you do?','Pricing']},

{id:'whatcanyoudo', w:2, k:'what can you do,what do you do,how can you help,help,menu,options,what are my options,commands,i need help,can you help me,what do you know',
 r:['Quite a bit. I can run your break-even cost per lead, tell you what leads actually cost in 2026 by trade and channel, explain any service we offer, talk through the stuff that is actually hurting you — quiet phone, estimates going cold, bids losing on price — book you a free audit, get a human to call you back, or just tell you a bad joke. Fire away.'],
 qr:['Run my numbers','Cost per lead by trade','Free audit','Have someone call me']},

{id:'whomadeyou', w:2, k:'who made you,who built you,who created you,who owns you,who is behind this,who runs this,who programmed you',
 r:['I did. Eye To Ad Media out of Denver, running since 2012 — I founded it. I still run a bath remodeling company too, which is the reason this whole site exists: I got tired of paying agencies for reports instead of jobs.'],
 qr:['About AFC','Why you?','Pricing']},

{id:'whytape', w:2.2, k:'why a tape measure,why are you a tape measure,nice hat,cool hat,your hat,you look funny,what do you look like,nice glasses,hard hat,the pencil,pencil behind your ear,you look cool,love the truck,nice truck,cool truck,the truck,that animation,that intro,is that your face,your face',
 r:['That is my actual face, yes. The body is a tape measure because every good job starts with a measurement and every bad marketing decision starts with a guess. The hard hat is because I have opinions. The pencil is because I lose exactly one per week like everybody else.',
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
 qr:['Call tracking','Free audit','Pricing']},

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
 r:['Then you already know the pattern: monthly invoice, colorful report, no straight answer about whether any of it turned into a job.\n\nThat is literally why this company exists. I ran a remodeling business and kept hiring agencies who never once asked what my average job was worth or what I closed. Every account here reports on three lines — leads, calls, jobs won, attributed to the channel that produced them. Everything is month to month, so if we are not producing you leave.\n\nWhat did the last outfit charge you, and what did they actually send you each month?'],
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
 qr:['Run my numbers','Good cost per lead','Free audit']},

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
 r:['Remodeling is a considered purchase with a long window, financing questions, and a lot of comparison shopping. Galleries, process pages and financing offers do more than ad copy ever will.\n\nAlso worth knowing: 77 percent of residential remodelers went into 2026 optimistic and 72 percent raised their rates. The market supports a higher price if the proof travels with it.\n\nSide note: I have run a bath remodeling company since 2012, so this is the trade I have actually lived inside.'],
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
 r:['AFC is the contractor arm of Eye To Ad Media, Denver, running since 2012. It exists because I ran a bath remodeling company, hired agencies the way most contractors do — on a promise and a slide deck — and kept getting reports full of impressions instead of an answer to one question: did any of this turn into a sale?\n\nI still run the remodeling business, which means every campaign here gets judged by someone who knows what a slow February feels like.'],
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
 r:['Yes — and it is free, which I realize sounds like a setup. It is not. Build one here: https://advertisingforcontractors.com/free-contractor-chatbot/\n\nYou customize it for your own company — your trades, your service area, your pricing language — and it goes on your site and works the hours you cannot. Somebody lands on your page at 11pm with a dead water heater, and instead of a contact form nobody reads until Tuesday, they get answers and you get the lead in your inbox.\n\nThat one thing can move the needle on its own. You already paid for the traffic. This is just refusing to waste it.'],
 qr:['Build my free chatbot','Speed to lead','Free audit']},

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
 r:['Of course. Nobody should sign anything from a chat window.\n\nOne suggestion though: take the free audit while you think. It costs nothing, there is no obligation, and you end up thinking about it with actual data instead of a feeling. You keep the findings either way, even if you never call us back.'],
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

/* ─────────────────────────── 2026 RESEARCH ADDITIONS ───────────────────── */
KB.push(
{id:'textback', w:2.3, k:'text back,missed call text,texting,sms,text messages,should i text leads,text or email,text follow up,missed calls,nobody answers the phone,phone rings and nobody,answering service,a2p,10dlc',
 r:['Texting is the single cheapest fix in this entire industry and most contractors still have not turned it on.\n\nThe numbers everybody quotes trace back to Gartner: business texts open around 98% against roughly 20% for email, and reply around 45% against about 6%. Harvard Business Review found the average business takes about 42 hours to answer a web lead and 23% never answer at all. So the bar is on the floor.\n\nMissed-call text-back is the play. Caller hangs up, they get a text in under a minute, and industry reporting in 2026 puts recovery at roughly 15–20% of missed callers, higher when a human picks the thread up fast. One caution: A2P 10DLC registration is mandatory now — carriers quietly kill unregistered business texting. Get that paperwork done before you build the sequence.'],
 qr:['Speed to lead','Follow-up system','Free audit']},

{id:'automation', w:2.2, k:'crm,automation,automate,ai answering,ai receptionist,voice agent,answering bot,software,servicetitan,jobber,housecall pro,gohighlevel,after hours,who answers at night',
 r:['Automation is worth it for exactly one reason: it never gets tired at 9pm on a Friday, which is when a surprising share of emergency work comes in.\n\nWhere it earns its keep — instant reply to every web lead, missed-call text-back, appointment reminders, and review requests fired the day the job closes. Hatch analyzed 132,000 HVAC campaigns and found multi-touch follow-up sequences responded at 89.86% against 8.56% for a single touch. That gap is not a software feature, it is just persistence made automatic.\n\nWhere it does not: the actual sales conversation. A homeowner deciding on a $14,000 job wants a person. Automate the speed, keep the human.'],
 qr:['Missed call text back','Follow-up system','Have someone call me']},

{id:'retarget', w:2.1, k:'retargeting,remarketing,follow people around,ads follow,pixel,facebook pixel,people leave my site,abandoned form,they visited and left',
 r:['Somebody hits your estimate form, gets called away by a kid or a dog, and never comes back. Retargeting is how you show back up in front of that person for pennies instead of paying full freight to find them again.\n\nKeep it simple and keep it decent: cap the frequency so you are not haunting anybody, rotate the creative every few weeks because ad fatigue is real, and point the ad at the specific thing they looked at rather than your homepage.\n\nIt is a closing channel, not a discovery channel. It only works if something is filling the top of the funnel first.'],
 qr:['Google Ads','Website that converts','Free audit']},

{id:'proposals', w:2.2, k:'estimates,proposal,quote template,written estimate,bid,good better best,options pricing,digital proposal,estimate software,how should i present price',
 r:['How you hand over the number moves close rate about as much as the number itself.\n\nTwo things the 2026 dealer reporting keeps showing. One, digital proposals close in the low-to-mid 40s where handwritten estimates land closer to 20, with a meaningful bump in average ticket. Two, giving three options instead of one price lets the homeowner choose between versions of yes instead of deciding yes or no.\n\nThe sequence matters too: lead with the monthly payment, not the total. Once somebody has built a mental model around $187 a month, the total stops being a cliff. Bring it up after they have already flinched at the total and it reads like a consolation prize.'],
 qr:['Financing','Close rate','Run my numbers']},

{id:'photos', w:2.1, k:'photos,pictures,job photos,before and after,video,youtube,tiktok,instagram,reels,should i post pictures,drone,proof of work',
 r:['Job photos are the most underused asset on a contractor phone. You are carrying around proof that you did the work well and never posting it.\n\nWhat to do with them: before-and-afters on the service page they belong to, a handful on the Google Business Profile every month, and a short vertical video when a job is visually satisfying. Homeowners are not judging your cinematography. They are checking whether you are real and whether your work looks like theirs.\n\nOne practical rule: shoot the same three angles on every job. Consistency beats artistry, and it means anybody on the crew can do it.'],
 qr:['Google Business Profile','Content','Reviews']},

{id:'gbp', w:2.3, k:'google business profile,gbp,google listing,my google page,maps listing,google my business,gmb,map pack,business profile,posts on google',
 r:['Your Google Business Profile is usually the first thing a homeowner sees, and a stale one quietly costs you the click before your website ever gets a chance.\n\nWhat actually moves it in 2026: recent reviews, fresh photos, service updates, correct categories and service areas, and matching name, address and phone everywhere else on the internet. Freshness and activity carry more weight than they used to, which is good news — it is work anybody can do without a budget.\n\nThe habit that wins is weekly, not heroic. Ten minutes a week beats one panicked overhaul every spring.'],
 qr:['Local SEO','Reviews','Free audit']},

{id:'database', w:2.1, k:'past customers,old customers,customer list,database,reactivate,email list,repeat business,people i already worked for,old leads,dead leads',
 r:['Your customer list is the highest-return marketing asset you own and it costs nothing to use. Those people already know you, already paid you, and already let you in the house.\n\nThree touches worth running: a seasonal reminder tied to the work you did, a maintenance or tune-up offer, and a plain referral ask about two weeks after the job when they are still happy about it.\n\nAnd a genuinely dead pile is not dead. Estimates that went quiet six or eighteen months ago are the cheapest list you will ever work. Half of them just got busy.'],
 qr:['Follow-up system','Referrals','Repeat customers']},

{id:'referral', w:2.1, k:'referrals,referral program,word of mouth,friends and family,neighbor,should i pay for referrals,referral fee',
 r:['Word of mouth is not a marketing plan, but a referral program is.\n\nThe difference is asking on purpose. Pick the moment — the day the job passes final inspection, not three months later — and make the ask specific. "Do you know anybody else on this street dealing with the same thing" gets a real answer. "Send people my way" gets a nod and nothing else.\n\nReferral leads convert higher and cost less than anything you can buy, which is exactly why they should not be left to luck.'],
 qr:['Past customers','Reviews','Free audit']},

{id:'storm', w:2.2, k:'storm response,storm season,hail,after a storm,storm chasers,catastrophe,tornado,hurricane,wind damage,storm leads,storm marketing',
 r:['Storm work is the widest swing in the trades. One hail event can outrun a whole planned season, and a quiet year can gut a roofing company that built its model on weather.\n\nThe contractors who handle it well are positioned before the sky opens: pages already ranking for the neighborhoods, ad campaigns built and paused, and a landing page ready to switch on the same afternoon. The out-of-state crews with the magnetic door signs show up within 48 hours. If your marketing starts when theirs does, you are already behind.\n\nThe other half is not letting storm revenue hide the fact that retail replacement demand needs its own year-round engine.'],
 qr:['Roofing','Seasonality','Free audit']},

{id:'offseason', w:2.2, k:'should i pause ads,cut marketing,turn off ads,go dark,stop advertising,off season,shoulder season,winter,slow months,pause campaigns,save money on marketing',
 r:['I know the instinct. Phone is quiet, so the marketing line looks like the easiest thing to cut. It is usually the most expensive cut you can make.\n\nTwo reasons. Paused campaigns lose their optimization history, so you restart in the learning phase right when demand and competition peak — and 2026 tracking showed most home service categories facing higher click costs during those spikes, with emergency keywords passing $30 a click in competitive metros. Second, SEO does not restart on demand; the work you skip in February is the ranking you do not have in May.\n\nBetter move: shift the money instead of killing it. Slow months are for the shoulder-season push — tune-ups, maintenance plans, early-bird scheduling, and reworking your past customer list.'],
 qr:['Seasonality','Budget','Past customers']},

{id:'motivate', w:2.1, k:'motivate me,pep talk,inspire me,encourage me,say something motivational,need motivation,give me a boost,hype me up,words of wisdom',
 r:['{QUOTE}\n\nAnd here is the practical version: almost nobody who is good at this trade fails because of the trade. They fail because the phone got quiet and nobody built the thing that keeps it from getting quiet.\n\nThat part is fixable, and it is the only part I am here for. What do you want to work on?'],
 qr:['Where do I start?','Free audit','Tell me a joke']},

{id:'celebrate', w:2.1, k:'we just closed,got the job,landed a big one,we won the bid,best month ever,record month,signed the contract,booked solid,crushing it right now',
 r:['That is great news, and you should take ten full minutes to enjoy it before your brain starts looking for the next problem. Congratulations.\n\nOne thing while you are riding high: this is the best possible moment to ask that customer for a review and a referral. Nobody is ever more willing than right after you made them happy.\n\nWhat closed it, out of curiosity — price, timing, or did you just outwork the other guy?'],
 qr:['Reviews','Referrals','Close rate']},

{id:'bored', w:2, k:'im bored,bored,nothing to do,kill some time,entertain me,say something interesting',
 r:['Slow day or dodging paperwork? Either one is fine by me.\n\n{JOKE}\n\nIf you want to make the boredom productive, I can run your numbers and tell you what you can actually afford to pay for a lead. Takes about a minute and it is weirdly satisfying.'],
 qr:['Run my numbers','Tell me a joke','Free audit']},

{id:'compliment', w:2, k:'you are funny,youre funny,you are smart,good bot,nice bot,you are cool,i like you,you are helpful,best bot,you are awesome,love this bot',
 r:['Appreciate that. Low bar, cleared it.\n\nSeriously though — ask me something hard. I would rather be useful than charming.'],
 qr:['Run my numbers','What do you do?','Tell me a joke']},

{id:'advice', w:2.1, k:'what would you do,if you were me,your honest opinion,what do you think i should do,whats your advice,tell me straight,be honest with me',
 r:['Straight answer, without knowing your numbers: I would fix the leaks before I bought more traffic. Answering every call, texting back the missed ones, and following up estimates for three weeks costs almost nothing and it is where most contractors are bleeding.\n\nThen I would own one channel properly instead of dabbling in four. Usually that is local search plus Local Services Ads, because that is where somebody who needs you today is already looking.\n\nGive me your trade and your average job size and I will get a lot more specific than that.'],
 qr:['Run my numbers','Where do I start?','Speed to lead']});

/* ─────────────────────────── SELLING, NOT JUST MARKETING ───────────────── */
KB.push(
{id:'salestraining', w:2.4, k:'sales training,teach me to sell,how do i sell,better at sales,selling,sales help,my sales suck,closing techniques,sales process,sales tips,sales advice,improve my sales,train my guys,sales team',
 r:['Now we are talking. Marketing gets the appointment. Selling is what happens in the kitchen, and most contractors lose more money there than anywhere else in the business.\n\nThe short version of what works in the trades:\n\n1. Condition the price before you present it, so the number is never a surprise.\n2. Ask questions that make the cost of doing nothing obvious. That is SPIN — situation, problem, implication, need-payoff.\n3. Use trial closes on the way through, not one big ask at the end.\n4. Give three options instead of one price, and lead with the monthly payment.\n5. Follow up like you mean it. Most jobs are lost to silence, not to a competitor.\n\nWhich of those is costing you the most right now?'],
 qr:['Trial closes','Price conditioning','SPIN selling','Close rate']},

{id:'trialclose', w:2.4, k:'trial close,tie down,tie downs,assumptive close,closing questions,how do i close,ask for the sale,closing the deal,close the sale,soft close,alternative close',
 r:['A trial close is a temperature check, not an ask. You are finding out where you stand before you get to the number.\n\nSounds like: "If we could get this on the schedule before the weather turns, would that solve the problem for you?" Or: "Assuming the price works, is there anything else that would keep you from moving forward?" That second one is the most valuable question in home improvement sales — it surfaces the real objection while you still have time to handle it.\n\nTie-downs are the small agreements along the way. "That makes sense, right?" "You would rather fix it once than three times, correct?" Each yes makes the last yes smaller.\n\nOne rule: never use either one as a trick. Homeowners can smell it, and in the trades your reputation travels down the street faster than your marketing does.'],
 qr:['Price conditioning','SPIN selling','Sales training']},

{id:'pricecondition', w:2.3, k:'price conditioning,sticker shock,present the price,how to present price,how do i present price,presenting price,present price,they gasp at the price,price objection,too expensive,price shopping,prepare them for price,drop the price',
 r:['Price conditioning is just refusing to let the number be a surprise.\n\nEarly in the visit: "Most projects like this land somewhere between X and Y depending on what we find behind the wall. Is that the range you were expecting?" Now you know before you have spent two hours measuring, and they have had time to get used to the number.\n\nThen present in this order: the monthly payment first, the total second, the three options third. A homeowner comparing $187 a month to their power bill makes a very different decision than one staring at $13,000 against a savings account.\n\nAnd when somebody says too expensive, they almost never mean it literally. They mean they do not yet see why yours costs more. That is a value problem, not a price problem — and dropping your price to fix it just teaches them they were right to push.'],
 qr:['Financing','Trial closes','Proposals']},

{id:'spin', w:2.4, k:'spin selling,spin questions,situation problem implication,need payoff,discovery questions,qualifying questions,what questions should i ask,consultative selling',
 r:['SPIN is four kinds of questions in order, and it works in the trades because it makes the homeowner say the painful part out loud instead of you.\n\nSituation — how old is the system, how long has it been doing that.\nProblem — what does it cost you when it goes out.\nImplication — what happens if it fails in February with company in the house.\nNeed-payoff — if we fixed it permanently before winter, what would that be worth to you?\n\nThat last one is the whole game. When they describe the value, you never have to argue for it.\n\nSame thing works on your own business, by the way. What would an extra five projects a week do for your bottom line? Answer that honestly and your marketing budget question answers itself.'],
 qr:['Run my numbers','Trial closes','Sales training']},

{id:'capacity', w:2.2, k:'more projects,extra jobs,five more jobs,what would more jobs do,handle more work,capacity,can i handle more,how many more,double my jobs,scale up work',
 r:['Good question to sit with. Take your average job, multiply by five, multiply by four weeks. That is the monthly number you are currently leaving on the table — and for most contractors it is a bigger figure than they expect to see.\n\nThen the honest follow-up: could your crew actually absorb it? If the answer is no, the first project is capacity, not marketing, and I will tell you that rather than sell you leads you cannot service.\n\nIf the answer is yes, give me your average ticket and I will show you exactly what you can afford to pay to get one.'],
 qr:['Run my numbers','Free audit','Scale up']},

{id:'capital', w:2.3, k:'undercapitalized,under capitalized,cash flow,running out of money,no cash,cash crunch,capitalization,why businesses fail,going out of business,profitability,profit margin,not making money,working capital',
 r:['This is the quiet killer, and it deserves a straight answer: undercapitalization ends more contracting businesses than bad workmanship ever has. Good crews with full schedules go under because the money runs out before the receivables come in.\n\nMarketing is part of that equation, not separate from it. Consistent lead flow smooths the calendar, and a smooth calendar is what lets you price for margin instead of pricing to survive the month.\n\nThree things that move it fastest: sell on value instead of low bids, collect deposits and progress payments like a professional, and never let the pipeline go dark during a busy stretch — that gap shows up as a dead month eight weeks later.\n\nIf you want a tool built around exactly this, eyetoad.com has a business growth resource for owners: https://eyetoad.com/grow-my-business/'],
 qr:['Budget','Free audit','Sales training']},

{id:'growtool', w:2.7, k:'grow my business,help me grow,business growth,grow bigger,build my business,business advice,business owner help,entrepreneur',
 r:['That is the whole point of this, so let me point you at real things rather than a pep talk.\n\nStart free: the marketing audit here tells you where you actually stand against your competitors. And this one is built for owners thinking about the business as a business, not just the phone: https://eyetoad.com/grow-my-business/\n\nThen there is the free chatbot. You can build one for your own site, customize it to your company, and have it working leads at 11pm while you sleep: https://advertisingforcontractors.com/free-contractor-chatbot/\n\nNone of that costs anything. Which one do you want first?'],
 qr:['Free audit','Build my free chatbot','Sales training']});

/* ─────────────────────────── 2026 BENCHMARKS, ROUND TWO ────────────────── */
KB.push(
{id:'convrate', w:2.4, k:'conversion rate,website conversion,what should my site convert,how many visitors turn into leads,visitors but no calls,traffic but no leads,form fills,my site does not convert',
 r:['This is the leak worth measuring before you spend another dollar on traffic.\n\n2026 benchmarks put the median contractor website at roughly 2 to 4 percent of visitors turning into a tracked call or form fill. The well-built ones run 8 to 12 percent on the same traffic. That gap is not design taste, it is conversion architecture.\n\nBy trade it splits about like this: plumbing and pest control 12 to 16 percent because the intent is an emergency, HVAC repair 10 to 15 on emergency pages but 3 to 6 on system replacement, electrical 6 to 10, roofing 4 to 8, remodeling 3 to 7.\n\nSo find your trade, then find your number. If you are below it, the fix is usually the same three things: mobile speed, a phone number that is impossible to miss, and one obvious next step per page.'],
 qr:['Website that converts','Speed to lead','Free audit']},

{id:'funnel', w:2.2, k:'funnel,where am i losing,leaks,where do leads drop off,booking rate,show rate,my numbers do not add up,track the whole process',
 r:['Every home service business runs the same six stages whether they map it or not. Industry medians for 2026 look roughly like this per 100 site visitors:\n\nVisit → 4 to 8 call or fill out a form → about 4 qualified → 1 to 3 booked → 1 to 2 jobs completed → half a review.\n\nTop operators run the same funnel and get about 12 calls, 7 booked, 6 completed and 3 reviews from the same 100 visitors. Same traffic. Six times the reviewed customers.\n\nThe stage most contractors have never measured is the booking call. Average office staff books around 42 percent of the calls they take; the top quartile books 65 to 85. Nobody is buying more ads to fix that, and it is usually the cheapest 20 points available.'],
 qr:['Conversion rate','Speed to lead','Run my numbers']},

{id:'mobilespeed', w:2.2, k:'slow website,site is slow,page speed,load time,mobile speed,core web vitals,my site takes forever,website loading',
 r:['Speed is a revenue number, not an IT number. The 2026 research lines up around roughly 7 percent of conversions lost for every extra second of mobile load time, which means a five second page is giving away something like a third of its leads against a one second page on identical traffic.\n\nAnd about three out of four of your visitors are on a phone, usually mid-problem. Breaker tripped, basement wet, no heat. They are not going to wait.\n\nUnder two seconds on mobile is the bar now. If you want, I can have someone actually measure yours instead of guessing.'],
 qr:['Website that converts','Free audit','Have someone call me']},

{id:'aicite', w:2.4, k:'ai search,chatgpt,perplexity,gemini,ai overview,geo,generative engine optimization,aeo,answer engine,get cited by ai,will ai replace google,ai recommendations',
 r:['Short version: the position you earned on Google is no longer the first thing a homeowner sees, and getting named inside the AI answer is now its own job.\n\nWhat the systems are actually reading: your site content and how cleanly it is structured, your Google Business Profile, your reviews and the patterns inside them, and third-party mentions of your company in your actual service area. UC Davis put it well in their guidance — strong traditional SEO still predicts AI visibility, but the foundation alone is no longer enough.\n\nThe encouraging part is how open the field still is. ServiceTitan 2026 reporting found only about a quarter of residential contractors using AI in any meaningful way. Being early here is the same advantage the mobile-first contractors got in 2017.'],
 qr:['Local SEO','Google Business Profile','Free audit']},

{id:'localproof', w:2.2, k:'local content,service area pages,city pages,prove we work here,local authority,neighborhood pages,do city pages work,duplicate pages',
 r:['Claiming a city is not the same as proving you work there, and the systems deciding who gets recommended can now tell the difference.\n\nA page titled "Roofing in [city]" with the town name swapped in nine times is the old playbook, and it is worth very little now. A page that shows the actual job — the neighborhood, the house style, what the inspection found, what it cost to fix, photos from the truck — is nearly impossible for a competitor to copy, because they were not there.\n\nThe good news for you is that this plays directly to the thing you already have and agencies do not: real work in real places.'],
 qr:['Content','AI search','Job photos']},

{id:'calltracking', w:2.2, k:'call tracking,callrail,tracking numbers,attribution,which ads work,where are my leads coming from,cant tell what works,measure marketing',
 r:['If every channel funnels into one office number, you cannot tell whether your ad spend produced anything — and most contractors guessing at this are guessing wrong.\n\nUnique tracking numbers per channel fix it in a week. Then the real metric becomes cost per booked job instead of cost per lead, which regularly flips the answer: a source with pricier leads that actually close is cheaper than cheap leads that never book.\n\nOne detail people miss — only about a third of calls from digital marketing are genuine new leads. The rest are suppliers, existing customers and wrong numbers. If you are not separating those, your cost per lead looks better than it is.'],
 qr:['Tracking','Run my numbers','Free audit']});

/* ─────────────────────────── HIRING AN AGENCY, HONESTLY ────────────────── */
KB.push(
{id:'ownership', w:2.5, k:'who owns the website,do i own my website,own my accounts,own the domain,account ownership,who owns the ads account,if i leave do i keep,take it with me,hold my website hostage,proprietary platform,do i own my data',
 r:['You own all of it. Full stop.\n\nThe correct default in this industry, and ours: the domain, the website files in editable form, the Google Ads account under your billing, the Local Services Ads profile, the Google Business Profile, the call tracking numbers, the CRM data, and every piece of copy and creative produced for you. We are a user on your accounts, not the owner.\n\nIf you leave, you walk out with everything and nothing breaks. Any agency that hosts your site on a platform you cannot export, or registers your domain in their own name, has built a hostage situation and is counting on you not asking. Ask them in writing.'],
 qr:['Red flags','Contracts','Have someone call me']},

{id:'redflags', w:2.4, k:'red flags,how do i pick an agency,questions to ask an agency,been burned,last agency,previous agency,got ripped off,scammed,agency lied,how do i know they are legit,vet an agency,choosing an agency',
 r:['Sorry you had that experience — it is depressingly common. A 2025 survey of business owners using SEO services found about two thirds had already been through more than one provider.\n\nThe questions that actually separate the good from the bad:\n\n1. Who owns the accounts, the domain and the site files if I leave?\n2. Do you work with my competitors in my service area? Get it in writing.\n3. Show me a real client report from last month, live on screen.\n4. What exactly happens in month one?\n5. What are the exit terms if performance does not hit the benchmark?\n\nEvasive answers on any of those are the tell. It is not about catching anybody out — it is that a confident shop answers all five in about two minutes.'],
 qr:['Who owns my website?','Exclusivity','Reporting']},

{id:'exclusivity', w:2.3, k:'do you work with my competitors,other contractors in my area,exclusive to my market,territory,competitor client,same city,another roofer in my town,exclusivity',
 r:['Fair question and one you should ask everybody. Two contractors in the same trade and the same service area means somebody is getting the second-best effort, and it will not be the one who signed first.\n\nAsk for it in writing, defined by trade and geography rather than a vague promise. And ask what happens if they later sign one — a real answer exists for that, and "we would never" is not it.\n\nIf you tell me your trade and market, I can have someone check what we already have in your area before you spend any time on this.'],
 qr:['Red flags','Have someone call me','Free audit']},

{id:'reports', w:2.3, k:'reporting,what reports,how often do i hear from you,monthly report,do you send reports,what metrics,kpi,do i get updates,who do i talk to,account manager',
 r:['Reporting should connect to the business, not to the platform. Impressions and rankings are inputs. The numbers that belong on the front page of your report are cost per booked job, lead to booked rate, and revenue attributed by source.\n\nCadence that works for contractors: a short summary regularly, a deeper look monthly, and a named human you can actually call — not a dashboard link and silence.\n\nThe test for any agency, including us: ask them to walk you through a real client report live, on screen. The ones hiding behind vanity metrics do not take that invitation.'],
 qr:['Tracking','Results','Have someone call me']},

{id:'switching', w:2.3, k:'switch agencies,leave my agency,fire my agency,change providers,move my website,transfer my site,migrate,without losing rankings,start over somewhere else',
 r:['You can move without losing what you have built, as long as you do it in the right order.\n\nBefore you give notice: confirm the domain registrar login is yours, get admin on the Google Ads, Analytics, Search Console, LSA and Business Profile accounts, export the site files or at least the content, and pull the call tracking history. Do that first. Leverage disappears the moment you tell them you are leaving.\n\nRankings mostly survive a clean move. What kills them is a rebuild that drops pages, changes every URL without redirects, or goes dark for two weeks. That part is avoidable and it is the first thing we check.'],
 qr:['Who owns my website?','Free audit','Have someone call me']},

{id:'inhouse', w:2.2, k:'in house,hire someone in house,hire a marketing person,my daughter does social media,should i hire,employee vs agency,build a team',
 r:['Honest comparison, not a pitch.\n\nIn-house wins when you have enough volume to keep a person busy and enough process to manage them. One good marketing hire runs $60k and up with taxes, and they are one person with one skill set — usually strong at either content or ads, rarely both, almost never technical SEO too.\n\nAn agency wins when you want several skill sets part-time and you do not want to manage the work. It loses when the agency treats you like account number forty.\n\nThe worst version is the middle: a family member doing it in spare time with no accountability. That is not cheap, it is just invisible.\n\nWhere are you on volume right now?'],
 qr:['What do you cost?','Free audit','Run my numbers']},

{id:'whatyoudont', w:2.6, k:'what dont you do,logos,logo,branding,brand identity,what do you not do,things you refuse,do you do social media,do you do tv,billboards,do you do print,do you do video production,do you do branding,logo design,do you build apps',
 r:['Worth being clear about the limits, because most places will just say yes to everything.\n\nWhat we do: websites built to convert, local and AI search visibility, Google Ads and Local Services Ads managed to cost per booked job, reviews, tracking, and the follow-up systems around all of it.\n\nWhat we do not: we are not a billboard or radio buyer, we do not run big social media content calendars for the sake of posting, we do not do brand identity or logo work, and we do not build mobile apps. We also will not sell you an SEO retainer if your real problem is that nobody answers the phone.\n\nIf what you need is on the second list, say so and I will point you somewhere useful instead of pretending.'],
 qr:['What do you do?','Free audit','Have someone call me']});

/* ─────────────────────────── FROM THE TRAINING GUIDE ───────────────────── */
KB.push(
{id:'crickets', w:2.4, k:'crickets,its crickets,phone is dead,my phone is dead,site is dead,my site is dead,dead phone,nothing is coming in,no calls at all,zero leads,silence,nobody is calling,no one calls',
 r:['Crickets is the worst sound in this business. Before anybody sells you anything, it is worth knowing which kind of quiet it is.\n\nThere are only three: nobody is finding you, people are finding you and leaving without calling, or calls are coming in and not getting answered or returned. Those have completely different fixes, and two of them cost almost nothing.\n\nWhich does it feel like — is the website getting traffic at all?'],
 qr:['Conversion rate','Speed to lead','Free audit']},

{id:'feastfamine', w:2.3, k:'feast or famine,up and down,inconsistent,some months great some terrible,rollercoaster,unpredictable,never know what next month,steady work',
 r:['Feast or famine is almost never a demand problem. It is a pipeline problem — marketing gets switched on when the schedule empties, and by the time it works you are slammed again, so it gets switched off.\n\nThe fix is boring and it works: keep a steady baseline running year round, and use your past customer list and shoulder-season offers to fill the dips instead of scrambling.\n\nHow far out are you booked right now? That tells me whether this is a lead problem or a smoothing problem.'],
 qr:['Seasonality','Past customers','Free audit']},

{id:'tirekickers', w:2.7, k:'tire kickers,tirekickers,lowballers,price shoppers,just want a free estimate,wasting my time,people looking for free advice,shoppers,bargain hunters,cheapest bid',
 r:['Tire kickers are usually a targeting and qualifying problem, not a character flaw in your market.\n\nThings that thin them out fast: say your minimum project size somewhere visible, ask one budget-range question on the form, use keywords that match the work you want instead of broad service terms, and add negative keywords for repair when you sell replacement.\n\nAlso worth saying plainly — somebody who shops three bids is not automatically a bad lead. They are just doing what you would do with $14,000.'],
 qr:['Bad leads','Close rate','Free audit']},

{id:'guarantee', w:2.5, k:'can you guarantee,guarantee results,guarantee number one,guarantee leads,guarantee rankings,promise results,do you guarantee,money back',
 r:['No, and anybody who does is either lying or about to define their way out of it in the fine print.\n\nNobody controls Google rankings. Lead volume depends on demand, season, competition, budget and pricing — most of which nobody controls either.\n\nWhat can be committed to is the actual work: what gets built, what gets tracked, what gets reported, and month to month terms so you can leave if it is not producing. That is a guarantee with teeth, because it costs us something.'],
 qr:['Contracts','What do you cost?','Red flags']},

{id:'rankingdrop', w:2.4, k:'rankings dropped,lost rankings,traffic dropped,google slapped me,dropped off google,fell off page one,used to rank,my traffic tanked,lost visibility,algorithm update',
 r:['Before blaming an update — which is where everyone starts and is usually wrong — the first question is how wide the drop is. One keyword, one page, the map listing, or the whole site?\n\nThings that cause this far more often than an algorithm: a redesign that changed URLs without redirects, a page that got deindexed, a Business Profile edit, lost links, a security issue, tracking or location differences in how you are checking, or simply a competitor who got better.\n\nWhen did you first notice it, and did anything change on the site around then?'],
 qr:['Local SEO','Free audit','Have someone call me']},

{id:'gbpsuspended', w:2.4, k:'profile suspended,google suspended,gbp suspended,listing suspended,my listing disappeared,business profile gone,reinstate,suspension',
 r:['That one hurts, because the map listing is often the biggest single source of calls.\n\nDo not start making edits at random — that can make reinstatement harder. Find the stated reason in the suspension email first, then check the usual triggers: a business name with keywords stuffed into it, an address that does not meet the guidelines, service-area setup, category changes, or a recent burst of edits.\n\nDid Google send a reason, or did it just vanish?'],
 qr:['Google Business Profile','Local SEO','Have someone call me']},

{id:'brandbidding', w:2.2, k:'competitor bidding on my name,bidding on my brand,ads on my company name,competitor ads my name,trademark,they show up when people search my name',
 r:['Annoying, and usually legal. Competitors can often bid on brand-related searches, within platform and trademark rules.\n\nThree practical moves: run your own branded campaign so you hold the top spot cheaply, check whether their ad copy actually uses your trademarked name in the text since that is a separate complaint, and make sure your own listing and profile are strong enough that the click still comes to you.\n\nBranded traffic is the cheapest traffic you will ever buy. Worth protecting.'],
 qr:['Google Ads','Free audit','Have someone call me']},

{id:'boostpost', w:2.2, k:'boost a post,boost my post,boosted posts,should i boost,promote post,facebook boost',
 r:['Boosting is the easy button and it mostly buys you exposure, not projects. It optimizes for engagement rather than for someone calling you.\n\nA properly built campaign gives you control over the audience, the objective, the placement, the tracking and the follow-up. Same money, very different outcome.\n\nThat said — if the goal is genuinely awareness in one small town, a boost is not a crime. Just do not expect it to fill the schedule.'],
 qr:['Facebook','Retargeting','Free audit']},

{id:'socialneed', w:2.2, k:'do i need tiktok,tiktok,instagram,do i need social media,should i post daily,social media necessary,youtube shorts,reels for contractors',
 r:['Not necessarily, and I would rather tell you that than sell you a posting package.\n\nSocial works well for visual trades — remodels, painting, landscaping, anything with a dramatic before and after. It works poorly as a substitute for being findable when somebody has a problem right now.\n\nOrder of operations: website that converts, Business Profile, reviews, tracking. If those are solid and you have content coming off jobs anyway, then yes, post it.'],
 qr:['Job photos','Content','Free audit']},

{id:'payperlead', w:2.3, k:'pay per lead,only pay per lead,pay for results,performance based,pay per call,commission only,pay when i get a job',
 r:['It feels safer, and sometimes it is. Worth knowing the trade-offs before you sign.\n\nAsk three questions of anyone offering it: is the lead exclusive or sold to several contractors, who owns the site and the phone number generating it, and what happens to that asset if you stop paying. Often the answer is that you were renting the whole time.\n\nThe version that actually builds something is where the rankings, the site and the numbers are yours. Then a slow month still leaves you with an asset.'],
 qr:['Buy or own leads','Who owns my website?','Free audit']},

{id:'referralonly', w:2.7, k:'i get all my work from referrals,word of mouth only,referrals are enough,dont need marketing,never advertised,all word of mouth',
 r:['That is a genuinely strong position — referred customers arrive pre-trusted and rarely price shop.\n\nThe risk is not today, it is the quarter where two big referral sources retire, move, or go quiet at the same time. That happens to somebody every year and it always feels sudden.\n\nMarketing does not have to replace referrals. It just has to be warm enough that you are not starting from zero when you need it.'],
 qr:['Referrals','Free audit','Seasonality']},

{id:'rebuild', w:3, k:'nephew built,my nephew,buddy built my site,someone built my site,do i need a new website,should i rebuild,redo my website,is my site too old,rebuild or fix,my nephew built my website,my son built my site,built it myself',
 r:['Possibly, but not automatically — and whoever built it does not deserve to be trashed for getting you started.\n\nA rebuild is worth it when the structure is the problem: no service pages, not mobile usable, slow to the point of losing people, or built on something that cannot be edited or exported.\n\nOften the bigger gains are cheaper than that: the message above the fold, page speed, real photos, one clear next step, and tracking so you can see what is happening at all.\n\nWhat specifically is not working — is it traffic, or is it people arriving and leaving?'],
 qr:['Conversion rate','Website that converts','Free audit']},

{id:'impressions', w:2.2, k:'impressions,what are impressions,i got 500 impressions,likes,my ad got likes,engagement,views,does that mean visitors',
 r:['Worth untangling, because these get mixed up constantly.\n\nImpressions mean your ad or listing was displayed. Clicks mean somebody came to the page. Conversions mean somebody called, filled out a form, or booked. Only the last one has ever paid a crew.\n\nLikes are the same story. Encouraging, not revenue. If a report leads with impressions and engagement, ask for calls and booked jobs instead and watch what happens.'],
 qr:['Tracking','Reporting','Free audit']},

{id:'citystuffing', w:2.2, k:'add cities to footer,list of cities,city list,put 50 cities,keyword stuffing,stuff keywords,rank in every city,more keywords better',
 r:['A footer full of city names does almost nothing, and it has not worked for a long time.\n\nSame with stuffing keywords into a page. Google is looking for a credible reason to show you in a given area — real work there, real content about it, reviews from those customers, and a service area that makes sense.\n\nMore words does not equal better either. A clear 900-word service page will beat 3,000 words of repetition every time.'],
 qr:['Local proof','Content','Local SEO']},

{id:'safety', w:2.6, k:'smell gas,gas leak,fire,smoke,sparking,live wire,shocked,carbon monoxide,flooding,water and electricity,structural,house is shifting,collapse,emergency',
 r:['If that is happening right now, stop reading and deal with it: get people out, do not touch switches or anything that could spark, and call the utility or emergency services from somewhere safe.\n\nI am a marketing assistant, so I am not the right help for that — and this is one of the few places where I would rather be useless than confident.\n\nOnce everybody is safe, I am here.'],
 qr:['What do you do?','Free audit']},

{id:'howtowork', w:2.4, k:'how do i wire,how do i install,how to fix my,can i do it myself,diy repair,what size breaker,how do i vent,code requirement,permit required,is it up to code',
 r:['I am going to be upfront: I help contractors with marketing, not with the work itself. Giving you a confident answer about panels, gas lines, load calculations or code would be irresponsible and possibly dangerous.\n\nRequirements also vary by jurisdiction, so even a correct general answer can be wrong where you are standing.\n\nIf you are the contractor and you are asking about marketing that work, though, that I can help with all day.'],
 qr:['What do you do?','Free audit','Have someone call me']},

{id:'aiall', w:2.3, k:'can ai do my marketing,will ai replace,ai run everything,automate everything,do i still need a person,is ai enough',
 r:['AI is genuinely good at research, drafts, follow-up, reporting and testing. It is not good at knowing that your best month is February because of frozen pipes, or that the north side of town does not convert for you.\n\nSo: it removes a lot of grunt work and it can absolutely help a small shop punch above its weight. It still needs accurate business information, strategy and somebody checking the output.\n\nFully automatic is not the same as effective. Ask me how I know.'],
 qr:['AI search','Free chatbot','Free audit']},

{id:'lookatsite', w:2.3, k:'look at my website,can you review my site,check my site,here is my website,review my page,what do you think of my site,audit my site',
 r:['I would like to, but I want to be honest about what I can see from a chat window: nothing. I cannot load your site, your rankings or your ad account from here, and I am not going to pretend otherwise and invent findings.\n\nWhat I can do is get a real set of eyes on it. The free audit covers rankings, competitors, site issues and where the leads are leaking, and you keep the findings either way.\n\nWant me to set that up? Just the site address and a name and number.'],
 qr:['Free audit','Have someone call me','Conversion rate']},

{id:'confused', w:2.8, k:'i dont understand,dont understand,understand any of this,this is confusing,over my head,i am not techy,not good with computers,explain it simple,dumb it down,i dont know anything about marketing',
 r:['No problem at all, and you do not need to become a marketing technician. That is the whole reason I am here.\n\nPlain English version: people who need your service are searching right now, they call one of the first few companies they trust, and everything else is details about how to be one of those companies.\n\nTell me what you do and what kind of work you want more of. We will take it one piece at a time and I will skip the jargon.'],
 qr:['Where do I start?','Run my numbers','Free audit']});

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
  'Quick one while you are here: what would an extra five projects a week do for your bottom line? That number is usually the whole argument.',
  'Fair question to sit with — if the phone rang twice as often next month, could the crew absorb it? If yes, the rest of this is just math.',
  'If we could fix the quiet part of your calendar before the season turns, would that solve the real problem, or is something else in the way?',
  'Assuming the money made sense, is there anything else that would keep you from moving on this? I would rather know now than guess.',
  'You would rather fix it once than keep patching it every spring, right? Same logic homeowners use on you.',
  'Want me to run your actual numbers? Three questions, and you keep the answer either way.',
  'Everything here is free, audit included. The only thing it costs you is finding out where you really stand.'
]);

/* ─────────────────────────── SESSION STATE ─────────────────────────────── */
var S = { trade:null, name:null, ticket:0, margin:0, close:0, step:0, bstep:0,
          lead:{}, turns:0, misses:0, heat:0, closed:0, seen:{}, lastId:null };

/* which face he is wearing. Kept off S so the state object stays as it was. */
var FACE = 'main';
function setFace(m){
  if (!MOODS[m] || FACE === m || !HAS_DOM) return;
  FACE = m;
  var faces = D.querySelectorAll('.afcb-face'), i;
  for (i = 0; i < faces.length; i++){
    faces[i].setAttribute('href', MOODS[m]);
    try { faces[i].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', MOODS[m]); } catch(e){}
  }
}

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
/* Scoring runs in two passes. The first looks for whole phrases, which is
   what you want when somebody types a clean question. The second picks
   individual keywords out of a messy sentence — misspelled, half-typed, or
   wrapped in slang — so one recognizable word is still enough to get the
   context instead of a blank "I did not catch that". */
var STOPW = (' the and for you your yours are was were our ours with that this these those have has had how what'
 + ' when where why who whom can could would should will shall get got getting need needs want wants about into'
 + ' from they them their there here just like more most some any all not but its it is am do does did on in at'
 + ' to of a an i me my we us be been being as or if so up out one two really very much many lot lots way ok okay'
 + ' yeah yes no know think thing things stuff please thanks thank hey hi hello ').split(' ');

function isStop(w){ for (var i=0;i<STOPW.length;i++){ if (STOPW[i] === w) return true; } return false; }

/* crude stemmer — enough to tie roofing/roofs/roofer together */
function stem(w){
  if (w.length > 6 && /ers$/.test(w))  return w.slice(0, -3);
  if (w.length > 5 && /ing$/.test(w))  return w.slice(0, -3);
  if (w.length > 5 && /er$/.test(w))   return w.slice(0, -2);
  if (w.length > 4 && /ed$/.test(w))   return w.slice(0, -2);
  if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1);
  return w;
}

function score(text, intent){
  var phrases = intent.k.split(','), s = 0, i, j, p, words, exact = text.trim();

  /* pass one: the whole phrase is in there */
  for (i=0;i<phrases.length;i++){
    p = phrases[i].trim(); if (!p) continue;
    words = p.split(' ').length;
    if (text.indexOf(' ' + p + ' ') >= 0){
      s += 2 + (words - 1) * 2.4;
      if (exact === p) s += 7;
    }
  }

  /* pass two: individual keywords, typo-tolerant, stem-matched */
  var toks = exact.split(' '), seen = {}, hits = 0, kw, t, st;
  for (i=0;i<phrases.length && hits < 4;i++){
    p = phrases[i].trim(); if (!p) continue;
    var kws = p.split(' ');
    for (j=0;j<kws.length;j++){
      kw = kws[j];
      if (kw.length < 4 || isStop(kw) || seen[kw]) continue;
      st = stem(kw);
      for (t=0;t<toks.length;t++){
        if (toks[t].length < 3) continue;
        if (toks[t] === kw || stem(toks[t]) === st || near(toks[t], kw)){
          seen[kw] = 1; hits++; break;
        }
      }
    }
  }
  if (hits) s += (s > 0 ? hits * 0.6 : 1 + (hits - 1) * 0.9);

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
    setFace('grin');

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
  'call tracking'         : 'calltracking',
  'good cost per lead'    : 'goodcpl',
  'local proof'           : 'localproof',
  'free chatbot'          : 'freebot',
  'bad leads'             : 'badleads',
  'who owns my website?'  : 'ownership',
  'red flags'             : 'redflags',
  'exclusivity'           : 'exclusivity',
  'reporting'             : 'reports',
  'contracts'             : 'contract',
  'conversion rate'       : 'convrate',
  'job photos'            : 'photos',
  'follow-up system'      : 'followup',
  'follow up system'      : 'followup',
  'missed call text back' : 'textback',
  'google business profile': 'gbp',
  'storm response'        : 'storm',
  'past customers'        : 'database',
  'referrals'             : 'referral',
  'seasonality'           : 'seasonal',
  'repeat customers'      : 'repeat',
  'website that converts' : 'cro',
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
    setFace(MOOD_OF[hit.id] || 'main');
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
   THE MASCOT — one canonical build used everywhere: launcher, header,
   welcome card and the cinematic. Every gradient id carries a per-instance
   suffix (__U__) so two copies in the DOM can never fight over one id.

   Rigged for real motion: hips AND knees, shoulders AND elbows, a torso
   that leans, a neck that wiggles, a head that counter-rotates.

   v11: the head is a photograph of Zach — hard hat, hair, ears and pencil
   all baked into the PNG — riding on the same blade neck as before. It is
   deliberately oversized against the body. It is a bobblehead.
   ========================================================================== */
var FULL = '<svg class="afcb-man" viewBox="60 -175 320 665" aria-hidden="true" focusable="false">'
+'<defs>'
+'<linearGradient id="afcCase__U__" x1="0" y1="0" x2="1" y2="1">'
+'<stop offset="0%" stop-color="#FBE071"/><stop offset="46%" stop-color="#F0BE22"/>'
+'<stop offset="100%" stop-color="#C68C0F"/></linearGradient>'
+'<linearGradient id="afcCh__U__" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#EDF1F5"/><stop offset="100%" stop-color="#6E7885"/></linearGradient>'
+'<linearGradient id="afcBlade__U__" x1="0" y1="0" x2="1" y2="0">'
+'<stop offset="0%" stop-color="#C99A12"/><stop offset="16%" stop-color="#FBE071"/>'
+'<stop offset="80%" stop-color="#F0BE22"/><stop offset="100%" stop-color="#C99A12"/></linearGradient>'
+'<linearGradient id="afcBoot__U__" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#A56F42"/><stop offset="60%" stop-color="#7E5230"/>'
+'<stop offset="100%" stop-color="#5A3A20"/></linearGradient>'
+'<linearGradient id="afcGlove__U__" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#D8A067"/><stop offset="100%" stop-color="#A4713F"/></linearGradient>'
+'</defs>'

+'<g class="afcb-bob">'
+'<ellipse class="afcb-shadow" cx="220" cy="468" rx="104" ry="13" fill="#000" opacity=".26"/>'

/* ── LEG A (our left) — hip group with a knee group inside ─────────────── */
+'<g class="afcb-legA">'
 +'<rect x="188" y="342" width="19" height="64" rx="9" fill="#161B22"/>'
 +'<rect x="188" y="352" width="19" height="6" fill="#242B34"/>'
 +'<g class="afcb-shinA">'
  +'<rect x="189" y="396" width="17" height="30" rx="7" fill="#11151B"/>'
  +'<rect x="180" y="404" width="35" height="20" rx="8" fill="#2C333D"/>'
  +'<path d="M182 414 h34 v40 h-66 q-12 0 -12 -9 q0 -7 9 -11 l24 -10 z"'
  +' fill="url(#afcBoot__U__)" stroke="#3F2A17" stroke-width="3" stroke-linejoin="round"/>'
  +'<path d="M186 420 h26 M184 428 h28 M185 436 h27" stroke="#3F2A17" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>'
  +'<path d="M150 434 q-10 4 -12 11 q-1 6 8 7 h16 z" fill="#8F613A" opacity=".6"/>'
  +'<path d="M138 450 h80 v9 q0 5 -6 5 h-68 q-9 0 -11 -6 q-1 -5 5 -8 z" fill="#181D24"/>'
  +'<path d="M146 458 h6 M160 458 h6 M174 458 h6 M188 458 h6 M202 458 h6" stroke="#39434F" stroke-width="2.4" stroke-linecap="round"/>'
 +'</g>'
+'</g>'

/* ── LEG B (our right) ─────────────────────────────────────────────────── */
+'<g class="afcb-legB">'
 +'<rect x="242" y="342" width="19" height="64" rx="9" fill="#161B22"/>'
 +'<rect x="242" y="352" width="19" height="6" fill="#242B34"/>'
 +'<g class="afcb-shinB">'
  +'<rect x="243" y="396" width="17" height="30" rx="7" fill="#11151B"/>'
  +'<rect x="234" y="404" width="35" height="20" rx="8" fill="#2C333D"/>'
  +'<path d="M267 414 h-34 v40 h66 q12 0 12 -9 q0 -7 -9 -11 l-24 -10 z"'
  +' fill="url(#afcBoot__U__)" stroke="#3F2A17" stroke-width="3" stroke-linejoin="round"/>'
  +'<path d="M263 420 h-26 M265 428 h-28 M264 436 h-27" stroke="#3F2A17" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>'
  +'<path d="M299 434 q10 4 12 11 q1 6 -8 7 h-16 z" fill="#8F613A" opacity=".6"/>'
  +'<path d="M311 450 h-80 v9 q0 5 6 5 h68 q9 0 11 -6 q1 -5 -5 -8 z" fill="#181D24"/>'
  +'<path d="M303 458 h-6 M289 458 h-6 M275 458 h-6 M261 458 h-6 M247 458 h-6" stroke="#39434F" stroke-width="2.4" stroke-linecap="round"/>'
 +'</g>'
+'</g>'

/* ── TORSO: the tape case, hinged at the hips so he can lean ───────────── */
+'<g class="afcb-torso">'
+'<rect x="152" y="198" width="136" height="158" rx="26" fill="#171C24"/>'
+'<rect x="160" y="206" width="120" height="142" rx="20" fill="url(#afcCase__U__)"/>'
+'<path d="M168 214 q18 -6 36 0 v14 q-18 -6 -36 0 z" fill="#fff" opacity=".22"/>'
+'<rect x="190" y="196" width="60" height="16" rx="6" fill="#0C0F14"/>'
+'<rect x="175" y="226" width="30" height="40" rx="9" fill="#1C222B"/>'
+'<rect x="180" y="232" width="20" height="20" rx="6" fill="#A6CE39"/>'
+'<circle cx="167" cy="213" r="3" fill="#8F6510" opacity=".8"/>'
+'<circle cx="273" cy="213" r="3" fill="#8F6510" opacity=".8"/>'
+'<circle cx="167" cy="341" r="3" fill="#8F6510" opacity=".8"/>'
+'<circle cx="273" cy="341" r="3" fill="#8F6510" opacity=".8"/>'
+'<g transform="translate(220,292)">'
 +'<rect x="-54" y="-27" width="108" height="53" rx="10" fill="#0D1117" stroke="#A6CE39" stroke-width="3"/>'
 +'<path d="M-40 13 L-27 -17 L-14 13" stroke="#C9F04B" stroke-width="6.5" fill="none"'
 +' stroke-linecap="round" stroke-linejoin="round"/>'
 +'<path d="M-33.5 1 h13" stroke="#C9F04B" stroke-width="5" stroke-linecap="round"/>'
 +'<text x="20" y="13" font-family="Barlow Condensed,Impact,Haettenschweiler,sans-serif" font-size="34"'
 +' font-weight="800" letter-spacing="1.5" fill="#F4F4F1" text-anchor="middle">FC</text></g>'

/* tool belt: hammer loop, tape clip, pouch */
+'<rect x="134" y="312" width="172" height="34" rx="7" fill="#875A36" stroke="#3E2A18" stroke-width="3"/>'
+'<path d="M140 318 h160 M140 340 h160" stroke="#6B4529" stroke-width="2" opacity=".7"/>'
+'<rect x="196" y="306" width="48" height="46" rx="9" fill="url(#afcCh__U__)" stroke="#1C222B" stroke-width="3"/>'
+'<rect x="205" y="315" width="30" height="28" rx="5" fill="#12161C" opacity=".6"/>'
+'<circle cx="220" cy="329" r="4" fill="#A6CE39"/>'
+'<rect x="118" y="338" width="52" height="48" rx="8" fill="#6B4529" stroke="#3E2A18" stroke-width="3"/>'
+'<path d="M126 348 h36 M126 358 h36" stroke="#4C321C" stroke-width="2.2" opacity=".8"/>'
+'<rect x="286" y="340" width="50" height="30" rx="9" fill="#A6CE39" stroke="#37460F" stroke-width="3"/>'
+'<path d="M300 368 l-5 28 h22 l-3 -28 z" fill="#1C222B"/>'
+'</g>'

/* ── ARM A: shoulder group, elbow group inside ─────────────────────────── */
+'<g class="afcb-armA">'
 +'<path d="M164 242 C 140 256 126 276 120 298" stroke="#14181F" stroke-width="20" fill="none" stroke-linecap="round"/>'
 +'<path d="M164 242 C 140 256 126 276 120 298" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
 +'<g class="afcb-foreA">'
  +'<path d="M120 298 C 114 316 110 332 110 344" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
  +'<path d="M120 298 C 114 316 110 332 110 344" stroke="#F4F4F1" stroke-width="12" fill="none" stroke-linecap="round"/>'
  +'<rect x="99" y="338" width="22" height="10" rx="5" fill="#A6CE39" stroke="#37460F" stroke-width="2"/>'
  +'<circle cx="110" cy="360" r="16" fill="url(#afcGlove__U__)" stroke="#14181F" stroke-width="3"/>'
  +'<path d="M101 356 q9 -5 18 0" stroke="#7A4E25" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
 +'</g>'
+'</g>'

/* ── THE BLADE NECK — a real run of graduated tape ─────────────────────── */
+'<g class="afcb-neck">'
 +'<rect x="199" y="142" width="42" height="64" fill="url(#afcBlade__U__)" stroke="#B9880E" stroke-width="1.5"/>'
 +'<rect x="199" y="142" width="42" height="4" fill="#C99A12" opacity=".55"/>'
 +'<rect x="199" y="142" width="7" height="64" fill="#fff" opacity=".18"/>'
 +'<path d="M203 200 h17 M203 192 h9 M203 184 h9 M203 176 h17 M203 168 h9 M203 160 h9 M203 152 h17"'
 +' stroke="#1C222B" stroke-width="2" stroke-linecap="round"/>'
 +'<text x="233" y="203" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">1</text>'
 +'<text x="233" y="179" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">2</text>'
 +'<text x="233" y="155" font-family="monospace" font-size="10" fill="#1C222B" text-anchor="middle">3</text>'

/* ── HEAD: the real thing. Hat, hair, ears and pencil are in the photo. ── */
 +'<g class="afcb-head">'
  +'<ellipse cx="220" cy="150" rx="92" ry="14" fill="#000" opacity=".18"/>'
  +'<image class="afcb-face" href="__FACE__" x="70" y="-161" width="300" height="323"'
  +' preserveAspectRatio="xMidYMax meet"/>'
 +'</g>'
+'</g>'

/* ── ARM B: the waving, throwing, truck-hoisting arm ───────────────────── */
+'<g class="afcb-wave">'
 +'<path d="M278 238 C 302 232 320 216 328 198" stroke="#14181F" stroke-width="20" fill="none" stroke-linecap="round"/>'
 +'<path d="M278 238 C 302 232 320 216 328 198" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
 +'<g class="afcb-foreB">'
  +'<path d="M328 198 C 334 184 338 172 339 162" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
  +'<path d="M328 198 C 334 184 338 172 339 162" stroke="#F4F4F1" stroke-width="12" fill="none" stroke-linecap="round"/>'
  +'<rect x="328" y="158" width="22" height="10" rx="5" fill="#A6CE39" stroke="#37460F" stroke-width="2"/>'
  +'<circle cx="340" cy="142" r="17" fill="url(#afcGlove__U__)" stroke="#14181F" stroke-width="3"/>'
  +'<path d="M331 138 q9 -5 18 0" stroke="#7A4E25" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
 +'</g>'
+'</g>'

+'</g></svg>';

/* one unique copy per call — kills the duplicate-id collision for good */
var _mid = 0;
function man(extra, mood){
  var u = 'x' + (++_mid);
  return FULL.replace(/__U__/g, u)
             .replace('__FACE__', MOODS[mood || FACE || 'main'])
             .replace('class="afcb-man"', 'class="afcb-man' + (extra ? ' ' + extra : '') + '"');
}

/* ==========================================================================
   THE TRUCK — with a door that actually opens, and a driver inside it.
   ========================================================================== */
var TRUCK = '<svg viewBox="0 0 560 300" aria-hidden="true" focusable="false">'
+'<defs><clipPath id="afcCab"><rect x="320" y="66" width="74" height="44" rx="4"/></clipPath>'
+'<linearGradient id="afcTrk" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#C9F04B"/><stop offset="52%" stop-color="#A6CE39"/>'
+'<stop offset="100%" stop-color="#6E8A22"/></linearGradient>'
+'<linearGradient id="afcChr2" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#F2F5F8"/><stop offset="100%" stop-color="#69737F"/></linearGradient>'
+'<linearGradient id="afcBeamL" x1="0" y1="0" x2="1" y2="0">'
+'<stop offset="0%" stop-color="rgba(255,247,196,.8)"/>'
+'<stop offset="60%" stop-color="rgba(255,247,196,.2)"/>'
+'<stop offset="100%" stop-color="rgba(255,247,196,0)"/></linearGradient></defs>'
+'<g class="afcb-tilt">'

/* ── REAR (left): tailgate, two red lamps, mud flap ────────────────────── */
+'<rect x="88" y="150" width="12" height="46" rx="3" fill="#20262E"/>'
+'<rect x="96" y="118" width="12" height="26" rx="3" fill="#C8392F" stroke="#7A1F18" stroke-width="2"/>'
+'<rect x="96" y="150" width="12" height="16" rx="3" fill="#E8A020" stroke="#8F6510" stroke-width="2"/>'

/* ── BODY: long bed at the back, cab, then a long hood up front ────────── */
+'<path d="M96 178 L96 106 L300 106 L307 66 Q312 60 324 60 L396 60 Q409 60 415 71'
+' L438 112 L506 112 Q522 114 527 130 L534 178 Z"'
+' fill="url(#afcTrk)" stroke="#37460F" stroke-width="5" stroke-linejoin="round"/>'
+'<rect x="94" y="98" width="210" height="12" rx="5" fill="#37460F"/>'
+'<path d="M112 128 h176 M112 146 h176" stroke="#6E8A22" stroke-width="3" opacity=".6"/>'
+'<path d="M300 110 L300 176" stroke="#5E7A12" stroke-width="4"/>'

/* ── exhaust stacks, right behind the cab ──────────────────────────────── */
+'<rect x="286" y="26" width="14" height="82" rx="4" fill="url(#afcChr2)"/>'
+'<rect x="264" y="34" width="14" height="74" rx="4" fill="url(#afcChr2)"/>'
+'<rect x="284" y="22" width="18" height="9" rx="3" fill="#9AA4B0"/>'
+'<rect x="262" y="30" width="18" height="9" rx="3" fill="#9AA4B0"/>'

/* ── light bar over the cab ────────────────────────────────────────────── */
+'<rect x="316" y="44" width="92" height="16" rx="6" fill="#14181F"/>'
+'<g fill="#C9F04B" opacity=".92"><rect x="323" y="48" width="18" height="8" rx="3"/>'
+'<rect x="347" y="48" width="18" height="8" rx="3"/><rect x="371" y="48" width="18" height="8" rx="3"/></g>'

/* ── the cab interior, revealed when the door opens ────────────────────── */
+'<path d="M312 60 L436 60 L436 176 L312 176 Z" fill="#0F141A"/>'
+'<path d="M398 100 L436 110 L436 132 L396 122 Z" fill="#242B34"/>'
+'<rect x="330" y="150" width="98" height="14" fill="#181D24"/>'
+'<rect x="316" y="164" width="114" height="12" rx="3" fill="#2C333D"/>'
+'<rect x="326" y="86" width="28" height="66" rx="9" fill="#4A3323"/>'
+'<rect x="330" y="90" width="20" height="58" rx="7" fill="#5E4128"/>'
+'<rect x="328" y="68" width="26" height="20" rx="8" fill="#4A3323"/>'
+'<rect x="326" y="140" width="64" height="16" rx="6" fill="#4A3323"/>'
+'<rect x="330" y="143" width="56" height="10" rx="5" fill="#5E4128"/>'
+'<ellipse cx="410" cy="120" rx="7" ry="21" fill="none" stroke="#1C222B" stroke-width="7"/>'
+'<circle cx="410" cy="120" r="4" fill="#39434F"/>'
+'<rect x="356" y="96" width="8" height="56" rx="4" fill="#20262E"/>'
+'<rect x="318" y="64" width="78" height="46" rx="5" fill="#1A2029"/>'
+'<rect x="300" y="180" width="140" height="11" rx="5" fill="#39434F" stroke="#20262E" stroke-width="2"/>'
+'<g class="afcb-driver" clip-path="url(#afcCab)">'
 +'<rect x="336" y="78" width="34" height="24" rx="7" fill="#F0BE22" stroke="#1C222B" stroke-width="2"/>'
 +'<circle cx="345" cy="90" r="6" fill="#fff" stroke="#1C222B" stroke-width="1.6"/>'
 +'<circle cx="361" cy="90" r="6" fill="#fff" stroke="#1C222B" stroke-width="1.6"/>'
 +'<circle cx="346" cy="90" r="2.6" fill="#12161C"/><circle cx="362" cy="90" r="2.6" fill="#12161C"/>'
 +'<ellipse cx="353" cy="76" rx="30" ry="7" fill="#F2C020"/>'
 +'<path d="M340 76 C338 58 346 53 353 53 C360 53 368 58 366 76 Z" fill="#F7C81A" stroke="#C08F06" stroke-width="2"/>'
+'</g>'
/* the door — it swings open where he climbs out */
+'<g class="afcb-door">'
 +'<path d="M314 62 L396 62 Q409 62 415 71 L436 110 L314 110 Z"'
 +' fill="url(#afcTrk)" stroke="#37460F" stroke-width="4" stroke-linejoin="round"/>'
 +'<rect x="320" y="66" width="74" height="44" rx="5" fill="#BFD4E8" opacity=".92"/>'
 +'<path d="M404 66 L430 106 L400 106 L400 66 Z" fill="#BFD4E8" opacity=".92"/>'
 +'<path d="M326 70 L344 70 L330 102 L326 102 Z" fill="#fff" opacity=".4"/>'
 +'<rect x="398" y="112" width="18" height="6" rx="3" fill="url(#afcChr2)"/>'
 +'<rect x="314" y="62" width="7" height="108" fill="#37460F"/>'
 +'<g class="afcb-badge">'
  +'<rect x="322" y="116" width="72" height="46" rx="9" fill="#0D1117" stroke="#C9F04B" stroke-width="2.5"/>'
  +'<path d="M330 152 L339 124 L348 152" stroke="#C9F04B" stroke-width="5" fill="none"'
  +' stroke-linecap="round" stroke-linejoin="round"/>'
  +'<path d="M334 142 h10" stroke="#C9F04B" stroke-width="4" stroke-linecap="round"/>'
  +'<text x="370" y="151" font-family="Barlow Condensed,Impact,Haettenschweiler,sans-serif" font-size="30"'
  +' font-weight="800" letter-spacing="1" fill="#F4F4F1" text-anchor="middle">FC</text>'
 +'</g>'
+'</g>'
+'<path d="M404 66 L430 106 L400 106 L400 66 Z" fill="#BFD4E8" opacity=".92"/>'
/* the door as it looks swung wide open, hinged at the front and angled out */
+'<g class="afcb-dooropen">'
 +'<path d="M436 66 L498 82 L498 184 L436 168 Z" fill="url(#afcTrk)" stroke="#37460F"'
 +' stroke-width="4" stroke-linejoin="round"/>'
 +'<path d="M444 80 L490 92 L490 120 L444 110 Z" fill="#9FB6CE" opacity=".85"/>'
 +'<path d="M444 80 L458 84 L448 110 L444 109 Z" fill="#fff" opacity=".35"/>'
 +'<rect x="447" y="126" width="44" height="34" rx="6" fill="#0D1117" stroke="#C9F04B" stroke-width="2"'
 +' transform="rotate(6 469 143)"/>'
 +'<path d="M454 152 L460 132 L466 152" stroke="#C9F04B" stroke-width="3.5" fill="none"'
 +' stroke-linecap="round" stroke-linejoin="round" transform="rotate(6 460 142)"/>'
 +'<text x="481" y="150" font-family="Barlow Condensed,Impact,sans-serif" font-size="20" font-weight="800"'
 +' fill="#F4F4F1" text-anchor="middle" transform="rotate(6 481 144)">FC</text>'
 +'<rect x="440" y="112" width="14" height="6" rx="3" fill="url(#afcChr2)"/>'
+'</g>'

/* ── FRONT (right): long hood, grille, two round lamps, bumper, beam ───── */
+'<path d="M438 112 L506 112 Q522 114 527 130 L534 178 L500 178 L500 120 Z"'
+' fill="#8FB92F" opacity=".35"/>'
+'<path d="M446 122 h48 M446 134 h48" stroke="#6E8A22" stroke-width="3" opacity=".55"/>'
+'<rect x="516" y="118" width="18" height="46" rx="5" fill="#20262E" stroke="#14181F" stroke-width="2"/>'
+'<path d="M518 126 h14 M518 136 h14 M518 146 h14 M518 156 h14" stroke="#69737F" stroke-width="3" stroke-linecap="round"/>'
+'<circle cx="508" cy="126" r="12" fill="#FFF6C8" stroke="#C9A227" stroke-width="3"/>'
+'<circle cx="504" cy="122" r="4" fill="#fff"/>'
+'<circle cx="508" cy="152" r="9" fill="#F7E8A0" stroke="#C9A227" stroke-width="2.5"/>'
+'<path d="M534 112 L560 96 L560 180 L534 168 Z" fill="url(#afcBeamL)"/>'
+'<rect x="498" y="166" width="52" height="16" rx="6" fill="url(#afcChr2)" stroke="#39434F" stroke-width="2"/>'
+'<circle cx="524" cy="174" r="7" fill="#37460F"/>'

/* ── frame, suspension, wheels ─────────────────────────────────────────── */
+'<rect x="120" y="176" width="370" height="14" rx="6" fill="#20262E"/>'
+'<rect x="162" y="186" width="16" height="30" rx="5" fill="#39434F"/>'
+'<rect x="432" y="186" width="16" height="30" rx="5" fill="#39434F"/>'
+'<g class="afcb-wh"><g transform="translate(170,222)">'
+'<circle r="58" fill="#161A20"/><circle r="58" fill="none" stroke="#2C333D" stroke-width="9" stroke-dasharray="11 9"/>'
+'<circle r="31" fill="url(#afcChr2)"/><circle r="12" fill="#14181F"/>'
+'<path d="M0 -31 L0 -14 M0 31 L0 14 M-31 0 L-14 0 M31 0 L14 0" stroke="#14181F" stroke-width="6"/>'
+'</g></g>'
+'<g class="afcb-wh2"><g transform="translate(440,222)">'
+'<circle r="58" fill="#161A20"/><circle r="58" fill="none" stroke="#2C333D" stroke-width="9" stroke-dasharray="11 9"/>'
+'<circle r="31" fill="url(#afcChr2)"/><circle r="12" fill="#14181F"/>'
+'<path d="M0 -31 L0 -14 M0 31 L0 14 M-31 0 L-14 0 M31 0 L14 0" stroke="#14181F" stroke-width="6"/>'
+'</g></g>'
+'</g></svg>';

/* ==========================================================================
   THE SAUCER — symmetrical on purpose, so there is no front or back to get
   wrong, and a tractor beam that sets the truck down.
   ========================================================================== */
var UFO = '<svg viewBox="0 0 420 200" aria-hidden="true" focusable="false">'
+'<defs>'
+'<linearGradient id="afcHull" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#EDF1F5"/><stop offset="46%" stop-color="#9AA4B0"/>'
+'<stop offset="100%" stop-color="#4A5563"/></linearGradient>'
+'<radialGradient id="afcDome" cx="38%" cy="28%" r="72%">'
+'<stop offset="0%" stop-color="#EAFBA8"/><stop offset="52%" stop-color="#A6CE39"/>'
+'<stop offset="100%" stop-color="#4F6B14"/></radialGradient>'
+'<radialGradient id="afcUnder" cx="50%" cy="0%" r="80%">'
+'<stop offset="0%" stop-color="rgba(201,240,75,.85)"/>'
+'<stop offset="100%" stop-color="rgba(201,240,75,0)"/></radialGradient></defs>'
+'<path d="M140 84 C140 40 176 16 210 16 C244 16 280 40 280 84 Z" fill="url(#afcDome)"/>'
+'<path d="M166 62 C172 40 194 30 210 30 C196 34 178 46 172 66 Z" fill="#fff" opacity=".35"/>'
+'<ellipse cx="210" cy="96" rx="196" ry="34" fill="url(#afcHull)"/>'
+'<ellipse cx="210" cy="88" rx="196" ry="30" fill="none" stroke="#EDF1F5" stroke-width="3" opacity=".5"/>'
+'<ellipse cx="210" cy="104" rx="150" ry="22" fill="#2C333D" opacity=".55"/>'
+'<g fill="#C9F04B">'
+'<circle cx="72" cy="102" r="8"/><circle cx="141" cy="112" r="8"/>'
+'<circle cx="210" cy="115" r="8"/><circle cx="279" cy="112" r="8"/><circle cx="348" cy="102" r="8"/></g>'
+'<ellipse cx="210" cy="118" rx="52" ry="16" fill="url(#afcUnder)"/>'
+'<ellipse cx="210" cy="116" rx="30" ry="9" fill="#EAFBA8" opacity=".9"/></svg>';

/* the tractor beam: a widening cone of light, steady, never strobing */
var BEAM = '<svg viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
+'<defs><linearGradient id="afcCone" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="rgba(201,240,75,.5)"/>'
+'<stop offset="55%" stop-color="rgba(201,240,75,.22)"/>'
+'<stop offset="100%" stop-color="rgba(201,240,75,.05)"/></linearGradient></defs>'
+'<path d="M118 0 L182 0 L286 396 L14 396 Z" fill="url(#afcCone)"/>'
+'<path class="afcb-ray1" d="M132 0 L146 0 L96 396 L66 396 Z" fill="rgba(234,251,168,.22)"/>'
+'<path class="afcb-ray2" d="M158 0 L172 0 L236 396 L206 396 Z" fill="rgba(234,251,168,.16)"/></svg>';

/* ==========================================================================
   THE PORTAL — layered rings, a real event horizon, a rim that breathes.
   ========================================================================== */
var PORTAL = '<svg viewBox="0 0 320 320" aria-hidden="true" focusable="false">'
+'<defs>'
+'<radialGradient id="afcVoid" cx="50%" cy="48%" r="52%">'
+'<stop offset="0%" stop-color="#000000"/><stop offset="38%" stop-color="#000000"/>'
+'<stop offset="58%" stop-color="#04060A"/><stop offset="72%" stop-color="rgba(7,11,9,.92)"/>'
+'<stop offset="84%" stop-color="rgba(10,16,10,.6)"/><stop offset="93%" stop-color="rgba(14,22,12,.26)"/>'
+'<stop offset="100%" stop-color="rgba(14,22,12,0)"/></radialGradient>'
+'<radialGradient id="afcHaze" cx="50%" cy="50%" r="50%">'
+'<stop offset="56%" stop-color="rgba(120,160,50,0)"/>'
+'<stop offset="82%" stop-color="rgba(120,160,50,.16)"/>'
+'<stop offset="100%" stop-color="rgba(120,160,50,0)"/></radialGradient>'
+'<filter id="afcSoft" x="-35%" y="-35%" width="170%" height="170%">'
+'<feGaussianBlur stdDeviation="14"/></filter></defs>'
+'<circle cx="160" cy="160" r="158" fill="url(#afcHaze)"/>'
+'<ellipse cx="160" cy="158" rx="150" ry="156" fill="url(#afcVoid)"/>'
+'<g class="afcb-spin">'
 +'<path d="M160 44 A 116 130 0 0 1 160 272" fill="none" stroke="#7FA52C" stroke-width="20"'
 +' opacity=".26" filter="url(#afcSoft)"/>'
 +'<path d="M160 76 A 84 96 0 0 0 160 240" fill="none" stroke="#243A12" stroke-width="26"'
 +' opacity=".5" filter="url(#afcSoft)"/>'
+'</g>'
+'<ellipse cx="160" cy="158" rx="146" ry="152" fill="none" stroke="rgba(166,206,57,.22)"'
+' stroke-width="3" filter="url(#afcSoft)"/></svg>';

/* the seed he throws */
var DISC = '<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">'
+'<circle cx="60" cy="60" r="40" fill="#0D1117" stroke="#C9F04B" stroke-width="6"/>'
+'<circle cx="60" cy="60" r="26" fill="none" stroke="#A6CE39" stroke-width="4" stroke-dasharray="14 10"/>'
+'<circle cx="60" cy="60" r="12" fill="#05070A"/></svg>';

/* the puddle he leaves behind, and it soaks in on its own */
function mud(){
  var r = function(a, b){ return Math.round(rnd(a, b)); },
      flip = Math.random() < .5 ? 1 : -1,
      p1 = r(14, 34), p2 = r(54, 74), p3 = r(128, 152), p4 = r(238, 268),
      d1 = r(58, 72), d2 = r(38, 52), d3 = r(40, 54),
      lift = r(84, 94);
  return '<svg viewBox="0 0 320 110" aria-hidden="true" focusable="false">'
  + '<defs><radialGradient id="afcMud' + (++_mid) + '" cx="50%" cy="42%" r="62%">'
  + '<stop offset="0%" stop-color="#2A1B0E"/><stop offset="58%" stop-color="#3B2816"/>'
  + '<stop offset="100%" stop-color="#5A3E24"/></radialGradient></defs>'
  + '<g transform="translate(' + (flip < 0 ? 320 : 0) + ',0) scale(' + flip + ',1)">'
  + '<ellipse cx="160" cy="74" rx="' + r(132, 150) + '" ry="' + r(26, 33) + '" fill="#4A3323" opacity=".32"/>'
  + '<path d="M' + p1 + ' ' + d1 + ' C ' + p2 + ' ' + r(28, 40) + ' ' + (p2 + 48) + ' ' + r(26, 36)
  +   ' ' + p3 + ' ' + d2 + ' C ' + (p3 + 36) + ' ' + r(54, 66) + ' ' + (p4 - 42) + ' ' + r(26, 38)
  +   ' ' + p4 + ' ' + d3 + ' C ' + r(288, 306) + ' ' + r(56, 66) + ' ' + r(300, 312) + ' ' + r(74, 82)
  +   ' ' + r(272, 288) + ' ' + lift
  +   ' C ' + r(210, 232) + ' ' + r(96, 104) + ' ' + r(54, 70) + ' ' + r(96, 104) + ' ' + r(20, 32) + ' ' + lift
  +   ' C ' + r(6, 14) + ' ' + r(76, 84) + ' ' + r(6, 14) + ' ' + r(68, 76) + ' ' + p1 + ' ' + d1 + ' Z"'
  +   ' fill="url(#afcMud' + _mid + ')" stroke="#6B4A2C" stroke-width="3" stroke-opacity=".55"/>'
  + '<ellipse cx="' + r(108, 142) + '" cy="' + r(54, 62) + '" rx="' + r(34, 50) + '" ry="' + r(7, 11)
  +   '" fill="#C9B392" opacity=".18"/>'
  + '<ellipse cx="' + r(196, 228) + '" cy="' + r(62, 72) + '" rx="' + r(18, 30) + '" ry="' + r(5, 8)
  +   '" fill="#C9B392" opacity=".13"/>'
  + '<path d="M' + r(62, 78) + ' ' + r(78, 86) + ' q' + r(34, 46) + ' ' + r(6, 10) + ' ' + r(84, 102)
  +   ' ' + r(2, 6) + '" stroke="#8B6A44" stroke-width="2" fill="none" opacity=".3"/>'
  + '<ellipse cx="' + r(24, 44) + '" cy="' + r(92, 100) + '" rx="' + r(8, 14) + '" ry="' + r(3, 5) + '" fill="#3B2816" opacity=".65"/>'
  + '<ellipse cx="' + r(276, 300) + '" cy="' + r(90, 99) + '" rx="' + r(6, 12) + '" ry="' + r(3, 5) + '" fill="#3B2816" opacity=".55"/>'
  + '<ellipse cx="' + r(176, 214) + '" cy="' + r(94, 102) + '" rx="' + r(5, 10) + '" ry="' + r(2, 4) + '" fill="#3B2816" opacity=".5"/>'
  + '<ellipse cx="' + r(84, 116) + '" cy="' + r(94, 102) + '" rx="' + r(4, 9) + '" ry="' + r(2, 4) + '" fill="#3B2816" opacity=".45"/>'
  + '<ellipse class="afcb-rip1" cx="' + r(118, 146) + '" cy="' + r(60, 68) + '" rx="' + r(22, 30)
  +   '" ry="7" fill="none" stroke="#9C7C55" stroke-width="2.5" opacity=".55"/>'
  + '<ellipse class="afcb-rip2" cx="' + r(198, 226) + '" cy="' + r(66, 74) + '" rx="' + r(14, 22)
  +   '" ry="5" fill="none" stroke="#9C7C55" stroke-width="2" opacity=".45"/>'
  + '</g></svg>';
}

/* storm clouds that drift across the top while he arrives */
var CLOUD = '<svg viewBox="0 0 300 120" aria-hidden="true" focusable="false">'
+'<path d="M52 96 C 22 96 10 78 18 62 C 24 50 40 46 52 50 C 56 24 84 10 110 18'
+' C 128 4 160 4 176 20 C 200 10 228 22 232 44 C 260 42 276 58 272 76 C 268 92 250 96 232 96 Z"'
+' fill="#39434F" opacity=".92"/>'
+'<path d="M70 78 C 50 78 44 66 52 56 C 62 44 88 44 96 54 C 112 40 140 44 148 60 C 128 78 96 82 70 78 Z"'
+' fill="#4A5563" opacity=".85"/>'
+'<path d="M150 22 C 168 12 196 20 202 40 C 182 44 160 38 150 22 Z" fill="#5A6673" opacity=".7"/></svg>';

/* ==========================================================================
   THE CINEMATIC

   Arrival: storm clouds roll in, rain slants across the top, forked
   lightning cracks down the sky, fireworks open across the whole width.
   A saucer drifts in and sets the truck down on a tractor beam. The truck
   lights the rear tyre up, blasts through mud puddles, the door swings
   open, Zach steps down like a person (sometimes with a flip off the
   running board), introduces himself, throws the portal to the far side,
   then grabs the truck, reaches back and hurls it through.

   Exit: he waves goodbye, throws a second portal, and flips slowly up
   into it.

   Accessibility: nothing strobes. Every bolt, spark and shell draws on,
   holds, and fades exactly once; strikes are spaced far enough apart that
   the screen never pulses. The whole stage is skipped under
   prefers-reduced-motion and a skip control is on screen the entire time.
   ========================================================================== */

/* ── real lightning, generated fresh every run ─────────────────────────── */
function boltPath(x, y, len, spread, segs){
  var d = 'M' + Math.round(x) + ' ' + Math.round(y), pts = [[x, y]], i, step = len / segs;
  for (i = 0; i < segs; i++){
    x += rnd(-spread, spread);
    y += step * rnd(.62, 1.38);
    d += ' L' + Math.round(x) + ' ' + Math.round(y);
    pts.push([x, y]);
  }
  return { d: d, pts: pts };
}

function boltGroup(x, len, spread){
  var main = boltPath(x, -30, len, spread, 11 + Math.floor(rnd(0, 4))),
      out  = [{ d: main.d, w: 9 }], i, from, b, sub;

  for (i = 0; i < 3; i++){
    from = main.pts[2 + Math.floor(rnd(0, main.pts.length - 4))];
    b = boltPath(from[0], from[1], len * rnd(.22, .42), spread * 1.5, 5);
    out.push({ d: b.d, w: 5 });
    if (i < 2){
      sub = boltPath(b.pts[2][0], b.pts[2][1], len * rnd(.1, .2), spread * 1.6, 3);
      out.push({ d: sub.d, w: 3 });
    }
  }
  return out;
}

function boltSVG(w, h, count){
  var s = '<svg class="afcb-boltsvg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">',
      i, j, parts, delay;
  for (i = 0; i < count; i++){
    parts = boltGroup(rnd(w * .06, w * .94), h * rnd(.55, .95), w * .035);
    delay = (.25 + i * .9).toFixed(2);
    s += '<g class="afcb-bolt" style="animation-delay:' + delay + 's">';
    for (j = 0; j < parts.length; j++){
      s += '<path class="hl" d="' + parts[j].d + '" stroke-width="' + (parts[j].w * 3.4) + '"/>'
        +  '<path class="ch" d="' + parts[j].d + '" stroke-width="' + parts[j].w + '"/>'
        +  '<path class="co" d="' + parts[j].d + '" stroke-width="' + (parts[j].w * .34) + '"/>';
    }
    s += '</g>';
  }
  return s + '</svg>';
}

var CINE_CSS = ''
+'.afcb-stage{position:fixed;inset:0;z-index:2147481900;pointer-events:none;overflow:hidden;display:none;'
 +'--hdoor:51vw;--hfront:40vw;--hcorner:90vw;--tstop:34vw;--ton:-52vw;--toff:116vw;'
 +'--px:12vw;--py:-64vh;--tpx:-8vw;--tpy:-52vh;--hpx:8vw;--hpy:-54vh;--ufox:38vw;--beamx:42vw;--sayx:40vw;--saysh:-46%}'
+'.afcb-stage.on{display:block}'
+'.afcb-stage.m{--hdoor:39vw;--hfront:24vw;--hcorner:74vw;--tstop:4vw;--ton:-96vw;--toff:104vw;'
 +'--px:18vw;--py:-71vh;--tpx:-22vw;--tpy:-70vh;--hpx:10vw;--hpy:-72vh;--ufox:24vw;--beamx:30vw;--sayx:50vw;--saysh:-50%}'

/* ── the rig: every joint gets a real pivot ────────────────────────────── */
+'.afcb-man g{transform-box:view-box}'
+'.afcb-man .afcb-legA{transform-origin:197px 348px}'
+'.afcb-man .afcb-legB{transform-origin:251px 348px}'
+'.afcb-man .afcb-shinA{transform-origin:197px 404px}'
+'.afcb-man .afcb-shinB{transform-origin:251px 404px}'
+'.afcb-man .afcb-armA{transform-origin:164px 242px}'
+'.afcb-man .afcb-foreA{transform-origin:120px 298px}'
+'.afcb-man .afcb-wave{transform-origin:278px 238px}'
+'.afcb-man .afcb-foreB{transform-origin:328px 198px}'
+'.afcb-man .afcb-neck{transform-origin:220px 206px}'
+'.afcb-man .afcb-head{transform-origin:220px 150px}'
+'.afcb-man .afcb-torso{transform-origin:220px 352px}'

/* ── storm sky ─────────────────────────────────────────────────────────── */
+'.afcb-weather{position:absolute;top:0;left:0;right:0;height:62vh;opacity:0;transition:opacity 1.4s ease}'
+'.afcb-stage.go .afcb-weather{opacity:1}'
+'.afcb-stage.clear .afcb-weather{opacity:0}'
+'.afcb-cloud{position:absolute;left:100%;opacity:.85;filter:drop-shadow(0 10px 22px rgba(13,17,23,.28))}'
+'.afcb-cloud svg{display:block;width:100%;height:auto}'
+'.afcb-stage.go .afcb-cloud{animation:afcbCloud var(--cd) linear forwards}'
+'@keyframes afcbCloud{0%{transform:translateX(0)}100%{transform:translateX(calc(-100vw - 120%))}}'
+'.afcb-rain{position:absolute;inset:0;overflow:hidden}'
+'.afcb-rain i{position:absolute;top:-14vh;width:2px;height:var(--len);border-radius:2px;'
 +'background:linear-gradient(180deg,rgba(191,212,232,0),rgba(191,212,232,.75));'
 +'transform:rotate(12deg)}'
+'.afcb-stage.go .afcb-rain i{animation:afcbRain var(--dur) linear infinite}'
+'@keyframes afcbRain{0%{transform:translate(0,0) rotate(12deg);opacity:0}'
 +'10%{opacity:.7}90%{opacity:.5}100%{transform:translate(-14vh,88vh) rotate(12deg);opacity:0}}'

/* ── lightning: draw on, hold, fade once. No strobe, ever ──────────────── */
+'.afcb-bolts{position:absolute;top:0;left:0;width:100%;height:78vh;opacity:0}'
+'.afcb-boltsvg{width:100%;height:100%;display:block}'
+'.afcb-stage.go .afcb-bolts{opacity:1}'
+'.afcb-bolts path{fill:none;stroke-linecap:round;stroke-linejoin:round}'
+'.afcb-bolts .hl{stroke:#C9F04B;opacity:.16;filter:blur(6px)}'
+'.afcb-bolts .ch{stroke:#DFF59B;filter:drop-shadow(0 0 12px rgba(201,240,75,.55))}'
+'.afcb-bolts .co{stroke:#FFFFFF;opacity:.95}'
+'.afcb-bolt{opacity:0}'
+'.afcb-stage.go .afcb-bolt{animation:afcbStrike 3.1s cubic-bezier(.16,.8,.3,1) both}'
+'@keyframes afcbStrike{0%{opacity:0}9%{opacity:.85}22%{opacity:1}'
 +'46%{opacity:.72}100%{opacity:0}}'
+'.afcb-bolts path{stroke-dasharray:var(--l);stroke-dashoffset:var(--l)}'
+'.afcb-stage.go .afcb-bolts path{animation:afcbDraw 3.1s cubic-bezier(.16,.8,.3,1) both}'
+'@keyframes afcbDraw{0%{stroke-dashoffset:var(--l)}22%,100%{stroke-dashoffset:0}}'

/* ── fireworks: shell climbs on a trail, blooms, sparks arc and droop ──── */
+'.afcb-sky{position:absolute;inset:0;overflow:hidden}'
+'.afcb-shell{position:absolute;width:7px;height:7px;border-radius:50%;background:#F7E8A0;opacity:0;'
 +'box-shadow:0 0 14px rgba(247,232,160,.9),0 14px 18px rgba(247,232,160,.25);'
 +'animation:afcbShell .9s cubic-bezier(.2,.6,.4,1) forwards}'
+'@keyframes afcbShell{0%{opacity:0;transform:translateY(0) scale(.5)}'
 +'14%{opacity:.95}100%{opacity:.2;transform:translateY(var(--rise)) scale(1)}}'
+'.afcb-fw{position:absolute;width:0;height:0}'
+'.afcb-fw b{position:absolute;left:0;top:0;width:260px;height:260px;margin:-130px;border-radius:50%;opacity:0;'
 +'background:radial-gradient(circle,rgba(255,255,255,.55) 0%,rgba(201,240,75,.24) 40%,rgba(201,240,75,0) 70%);'
 +'animation:afcbBloom 1.6s ease-out forwards}'
+'@keyframes afcbBloom{0%{opacity:0;transform:scale(.15)}16%{opacity:.95}100%{opacity:0;transform:scale(1.6)}}'
+'.afcb-fw u{position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px;border-radius:50%;'
 +'border:2px solid rgba(255,255,255,.55);opacity:0;animation:afcbRing 1.1s ease-out forwards}'
+'@keyframes afcbRing{0%{opacity:0;transform:scale(.2)}20%{opacity:.7}100%{opacity:0;transform:scale(6)}}'
+'.afcb-fw i{position:absolute;left:0;top:0;width:5px;height:5px;border-radius:50%;opacity:0;'
 +'animation:afcbSpark var(--sd) cubic-bezier(.12,.7,.35,1) forwards}'
+'@keyframes afcbSpark{0%{opacity:0;transform:translate(0,0) scale(1.2)}'
 +'10%{opacity:1}62%{opacity:.9}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(.3)}}'

/* ── dust, mud and splashes ────────────────────────────────────────────── */
+'.afcb-grit{position:absolute;bottom:5vh;border-radius:42%;opacity:0;'
 +'animation:afcbGrit 2.3s cubic-bezier(.2,.6,.4,1) forwards}'
+'@keyframes afcbGrit{0%{opacity:0;transform:translate(0,0) rotate(0) scale(.4)}'
 +'12%{opacity:.9}100%{opacity:0;transform:translate(var(--tx),var(--ty)) rotate(280deg) scale(1.3)}}'
+'.afcb-dust{position:absolute;bottom:4vh;width:240px;height:130px;border-radius:50%;opacity:0;'
 +'background:radial-gradient(circle,rgba(217,199,168,.75) 0%,rgba(217,199,168,.32) 46%,rgba(217,199,168,0) 72%);'
 +'animation:afcbDust 2.8s ease-out forwards}'
+'@keyframes afcbDust{0%{opacity:0;transform:translate(0,22px) scale(.3)}'
 +'16%{opacity:.95}100%{opacity:0;transform:translate(var(--tx),-46px) scale(2.2)}}'
+'.afcb-splash{position:absolute;bottom:5vh;width:14px;height:9px;border-radius:50% 50% 42% 42%;opacity:0;'
 +'animation:afcbSplash 1.5s cubic-bezier(.15,.65,.4,1) forwards}'
+'@keyframes afcbSplash{0%{opacity:0;transform:translate(0,0) scale(.5) rotate(0)}'
 +'10%{opacity:1}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(1.1) rotate(var(--rot))}}'

/* ── the puddles: they ripple, then soak away on their own ─────────────── */
+'.afcb-puddle{position:absolute;bottom:3vh;width:22vw;min-width:180px;max-width:330px;opacity:0}'
+'.afcb-puddle svg{width:100%;height:auto;display:block}'
+'.afcb-puddle.wet{animation:afcbPuddle 14s ease-out forwards}'
+'@keyframes afcbPuddle{0%{opacity:0;transform:scale(.3)}6%{opacity:.95;transform:scale(1.05)}'
 +'11%{transform:scale(1)}72%{opacity:.85}100%{opacity:0;transform:scale(.88)}}'
+'.afcb-puddle .afcb-rip1{animation:afcbRip 2.4s ease-out infinite}'
+'.afcb-puddle .afcb-rip2{animation:afcbRip 2.4s ease-out .9s infinite}'
+'@keyframes afcbRip{0%{opacity:.6;transform:scale(.4)}100%{opacity:0;transform:scale(1.7)}}'

/* ── the truck: forward the whole way, breaking loose into fishtails ───── */
+'.afcb-truck{position:absolute;bottom:5vh;left:0;width:46vw;min-width:330px;max-width:660px;opacity:0;'
 +'transform:translateX(120vw);transform-origin:50% 78%}'
+'.afcb-truck.land,.afcb-truck.burn,.afcb-truck.grab,.afcb-truck.hurl,'
 +'.afcb-truck.parked,.afcb-truck.open,.afcb-truck.shut{opacity:1}'
+'.afcb-truck svg{width:100%;height:auto;display:block;'
 +'filter:drop-shadow(0 16px 22px rgba(13,17,23,.4))}'
/* ── the saucer: symmetrical, so it has no wrong way round ─────────────── */
+'.afcb-ufo{position:absolute;bottom:52vh;left:0;width:34vw;min-width:260px;max-width:470px;opacity:0;'
 +'transform:translateX(-46vw)}'
+'.afcb-ufo svg{width:100%;height:auto;display:block;'
 +'filter:drop-shadow(0 18px 30px rgba(13,17,23,.35)) drop-shadow(0 0 26px rgba(166,206,57,.35))}'
+'.afcb-ufo.fly{animation:afcbUfoIn 2s cubic-bezier(.3,.5,.3,1) forwards}'
+'@keyframes afcbUfoIn{0%{opacity:0;transform:translateX(-46vw) translateY(-14vh) scale(.7)}'
 +'20%{opacity:1}'
 +'70%{opacity:1;transform:translateX(calc(var(--ufox) + 3vw)) translateY(2vh) scale(1)}'
 +'100%{opacity:1;transform:translateX(var(--ufox)) translateY(0) scale(1)}}'
+'.afcb-ufo.hold{opacity:1;animation:afcbHover 3.4s ease-in-out infinite}'
+'@keyframes afcbHover{0%,100%{opacity:1;transform:translateX(var(--ufox)) translateY(0) rotate(-.6deg)}'
 +'50%{opacity:1;transform:translateX(var(--ufox)) translateY(-1.6vh) rotate(.6deg)}}'
+'.afcb-ufo.away{animation:afcbUfoOut 1.8s cubic-bezier(.5,0,.7,.4) forwards}'
+'@keyframes afcbUfoOut{0%{opacity:1;transform:translateX(var(--ufox)) translateY(0) scale(1)}'
 +'100%{opacity:0;transform:translateX(calc(var(--ufox) + 16vw)) translateY(-42vh) scale(.45)}}'

/* ── the tractor beam ──────────────────────────────────────────────────── */
+'.afcb-beam{position:absolute;bottom:5vh;left:0;width:26vw;min-width:200px;max-width:360px;height:48vh;'
 +'opacity:0;transform:translateX(var(--beamx)) scaleY(.02);transform-origin:50% 0}'
+'.afcb-beam svg{width:100%;height:100%;display:block}'
+'.afcb-beam.on{animation:afcbBeamOn .7s cubic-bezier(.2,.8,.3,1) forwards}'
+'@keyframes afcbBeamOn{0%{opacity:0;transform:translateX(var(--beamx)) scaleY(.02)}'
 +'100%{opacity:1;transform:translateX(var(--beamx)) scaleY(1)}}'
+'.afcb-beam.off{animation:afcbBeamOff .8s cubic-bezier(.5,0,.8,.2) forwards}'
+'@keyframes afcbBeamOff{0%{opacity:1;transform:translateX(var(--beamx)) scaleY(1)}'
 +'100%{opacity:0;transform:translateX(var(--beamx)) scaleY(.02)}}'
+'.afcb-beam.on .afcb-ray1{animation:afcbRay 2.6s ease-in-out infinite}'
+'.afcb-beam.on .afcb-ray2{animation:afcbRay 3.2s ease-in-out .6s infinite}'
+'@keyframes afcbRay{0%,100%{opacity:.1}50%{opacity:.4}}'

/* ── down the beam: it stays fully visible the whole way ───────────────── */
+'.afcb-truck.land{animation:afcbLand 2.8s cubic-bezier(.4,.02,.5,1) forwards}'
+'@keyframes afcbLand{'
 +'0%{opacity:0;transform:translateX(var(--tstop)) translateY(-40vh) rotate(-3deg) scale(.74)}'
 +'10%{opacity:1;transform:translateX(var(--tstop)) translateY(-36vh) rotate(2deg) scale(.77)}'
 +'40%{opacity:1;transform:translateX(calc(var(--tstop) + 1vw)) translateY(-24vh) rotate(-2.5deg) scale(.86)}'
 +'68%{opacity:1;transform:translateX(calc(var(--tstop) - 1vw)) translateY(-10vh) rotate(2deg) scale(.95)}'
 +'84%{opacity:1;transform:translateX(var(--tstop)) translateY(0) rotate(0) scale(1)}'
 +'90%{opacity:1;transform:translateX(var(--tstop)) translateY(-2.5vh) rotate(-1.5deg) scale(1)}'
 +'96%{opacity:1;transform:translateX(var(--tstop)) translateY(0) rotate(1deg) scale(1)}'
 +'100%{opacity:1;transform:translateX(var(--tstop)) translateY(0) rotate(0) scale(1)}}'
+'.afcb-truck.land .afcb-tilt{transform-box:view-box;transform-origin:170px 230px;'
 +'animation:afcbTilt 2.8s ease-in-out forwards}'
+'@keyframes afcbTilt{0%{transform:rotate(0)}62%{transform:rotate(2deg)}'
 +'86%{transform:rotate(-6deg)}93%{transform:rotate(4deg)}100%{transform:rotate(0)}}'
+'.afcb-truck.land .afcb-wh,.afcb-truck.land .afcb-wh2{transform-box:view-box;'
 +'animation:afcbRoll 2.8s ease-out forwards}'
+'.afcb-truck.land .afcb-wh{transform-origin:170px 222px}'
+'.afcb-truck.land .afcb-wh2{transform-origin:440px 222px}'
+'@keyframes afcbRoll{0%{transform:rotate(0)}100%{transform:rotate(180deg)}}'
+'.afcb-truck.land .afcb-driver{animation:afcbJostle .45s ease-in-out 6}'
+'.afcb-truck.burn{animation:afcbBurn 3.4s cubic-bezier(.3,.1,.3,1) forwards}'
+'@keyframes afcbBurn{0%{opacity:1;transform:translateX(var(--tstop)) rotate(0)}'
 +'10%{transform:translateX(calc(var(--tstop) - 2vw)) rotate(-3deg)}'
 +'22%{transform:translateX(calc(var(--tstop) + 3vw)) rotate(2.5deg)}'
 +'34%{transform:translateX(calc(var(--tstop) - 3vw)) rotate(-3deg)}'
 +'46%{transform:translateX(calc(var(--tstop) + 4vw)) rotate(2.5deg)}'
 +'58%{transform:translateX(calc(var(--tstop) - 2vw)) rotate(-2deg)}'
 +'70%{transform:translateX(calc(var(--tstop) + 2vw)) rotate(2deg)}'
 +'82%{transform:translateX(calc(var(--tstop) - 1vw)) rotate(-1.5deg)}'
 +'92%{transform:translateX(var(--tstop)) rotate(1deg)}'
 +'100%{opacity:1;transform:translateX(var(--tstop)) rotate(0)}}'
+'.afcb-truck.burn .afcb-tilt{transform-box:view-box;transform-origin:170px 230px;'
 +'animation:afcbRear 3.4s cubic-bezier(.3,.1,.3,1) forwards}'
+'@keyframes afcbRear{0%{transform:rotate(0)}'
 +'10%{transform:rotate(-16deg)}26%{transform:rotate(-18deg)}'
 +'40%{transform:rotate(-10deg)}54%{transform:rotate(-17deg)}'
 +'70%{transform:rotate(-12deg)}84%{transform:rotate(-15deg)}'
 +'93%{transform:rotate(-2deg)}97%{transform:rotate(3deg)}100%{transform:rotate(0)}}'
+'.afcb-truck.burn .afcb-wh{transform-box:view-box;transform-origin:170px 222px;'
 +'animation:afcbBurnRear 3.4s linear forwards}'
+'.afcb-truck.burn .afcb-wh2{transform-box:view-box;transform-origin:440px 222px;'
 +'animation:afcbBurnFront 3.4s ease-out forwards}'
+'@keyframes afcbBurnRear{0%{transform:rotate(0)}100%{transform:rotate(8600deg)}}'
+'@keyframes afcbBurnFront{0%{transform:rotate(0)}100%{transform:rotate(900deg)}}'
+'.afcb-truck.burn .afcb-driver{animation:afcbJostle .3s ease-in-out 11}'
+'@keyframes afcbJostle{0%,100%{transform:translateY(0) rotate(0)}'
 +'50%{transform:translateY(-2.5px) rotate(-1.2deg)}}'
+'.afcb-truck.parked{transform:translateX(var(--tstop));opacity:1}'
+'.afcb-truck.parked .afcb-driver{opacity:0;transition:opacity .3s}'
/* door swings open, and shuts again behind him */
+'.afcb-door{transform-box:view-box;transform-origin:436px 112px}'
+'.afcb-dooropen{transform-box:view-box;transform-origin:436px 112px;opacity:0;transform:rotate(-26deg) scaleX(.3)}'
+'.afcb-truck.open .afcb-door{animation:afcbDoor .9s cubic-bezier(.3,.9,.3,1) forwards}'
+'@keyframes afcbDoor{0%{opacity:1;transform:scaleX(1)}'
 +'45%{opacity:.15;transform:scaleX(.55)}'
 +'100%{opacity:0;transform:scaleX(.3)}}'
+'.afcb-truck.open .afcb-dooropen{animation:afcbDoorSwing .9s cubic-bezier(.3,.9,.3,1) forwards}'
+'@keyframes afcbDoorSwing{0%{opacity:0;transform:rotate(-26deg) scaleX(.3)}'
 +'40%{opacity:1;transform:rotate(-6deg) scaleX(.8)}'
 +'75%{opacity:1;transform:rotate(4deg) scaleX(1.04)}'
 +'100%{opacity:1;transform:rotate(0) scaleX(1)}}'
+'.afcb-truck.shut .afcb-door{animation:afcbDoorShut .7s cubic-bezier(.4,0,.4,1) forwards}'
+'@keyframes afcbDoorShut{0%{opacity:0;transform:scaleX(.3)}'
 +'55%{opacity:.2;transform:scaleX(.6)}'
 +'100%{opacity:1;transform:scaleX(1)}}'
+'.afcb-truck.shut .afcb-dooropen{animation:afcbDoorFold .7s cubic-bezier(.4,0,.5,1) forwards}'
+'@keyframes afcbDoorFold{0%{opacity:1;transform:rotate(0) scaleX(1)}'
 +'100%{opacity:0;transform:rotate(-26deg) scaleX(.3)}}'
/* he grabs it, reaches back, and hurls it forward and up */
+'.afcb-truck.grab{animation:afcbGrab 2.8s cubic-bezier(.3,.7,.35,1) forwards}'
+'@keyframes afcbGrab{0%{opacity:1;transform:translateX(var(--tstop)) translateY(0) rotate(0) scale(1)}'
 +'14%{transform:translateX(calc(var(--tstop) - 1vw)) translateY(0) rotate(-3deg) scale(.98)}'
 +'26%{transform:translateX(calc(var(--tstop) - 2vw)) translateY(-1vh) rotate(-5deg) scale(.92)}'
 +'48%{transform:translateX(calc(var(--hfront) - 13vw)) translateY(-17vh) rotate(-3deg) scale(.62)}'
 +'58%{transform:translateX(calc(var(--hfront) - 14vw)) translateY(-18vh) rotate(-2deg) scale(.58)}'
 +'84%{transform:translateX(calc(var(--hfront) - 15vw)) translateY(-44vh) rotate(0) scale(.42)}'
 +'100%{opacity:1;transform:translateX(calc(var(--hfront) - 15vw)) translateY(-43vh) rotate(0) scale(.42)}}'
+'.afcb-truck.hurl{animation:afcbHurl 2.8s cubic-bezier(.3,.02,.42,1) forwards}'
+'@keyframes afcbHurl{'
 +'0%{opacity:1;transform:translateX(calc(var(--hfront) - 15vw)) translateY(-43vh) rotate(0) scale(.42)}'
 +'16%{transform:translateX(calc(var(--hfront) - 11vw)) translateY(-37vh) rotate(18deg) scale(.42)}'
 +'34%{transform:translateX(calc(var(--hfront) - 24vw)) translateY(calc(var(--tpy) + 24vh)) rotate(-44deg) scale(.4)}'
 +'56%{transform:translateX(calc((var(--hfront) + var(--tpx)) / 2)) translateY(calc(var(--tpy) + 8vh))'
 +' rotate(-140deg) scale(.36)}'
 +'74%{opacity:1;transform:translateX(var(--tpx)) translateY(var(--tpy)) rotate(-220deg) scale(.32)}'
 +'88%{opacity:1;transform:translateX(var(--tpx)) translateY(var(--tpy)) rotate(-290deg) scale(.12)}'
 +'100%{opacity:0;transform:translateX(var(--tpx)) translateY(var(--tpy)) rotate(-350deg) scale(.015)}}'

/* ── the portal and the disc he throws to open it ──────────────────────── */
+'.afcb-portal{position:absolute;left:2vw;top:3vh;width:26vw;min-width:190px;max-width:360px;'
 +'opacity:0;transform:scale(.02) rotate(-30deg)}'
+'.afcb-portal svg{width:100%;height:auto;display:block}'
+'.afcb-portal.open{animation:afcbPortal 1.1s cubic-bezier(.2,.9,.3,1) forwards}'
+'@keyframes afcbPortal{0%{opacity:0;transform:scale(.02) rotate(-30deg)}'
 +'55%{opacity:1;transform:scale(1.12) rotate(6deg)}100%{opacity:1;transform:scale(1) rotate(0)}}'
+'.afcb-portal.shut{animation:afcbShut 1.1s cubic-bezier(.5,0,.8,.2) forwards}'
+'@keyframes afcbShut{0%{opacity:1;transform:scale(1)}70%{opacity:1;transform:scale(.5) rotate(40deg)}'
 +'100%{opacity:0;transform:scale(.02) rotate(90deg)}}'
+'.afcb-portal .afcb-spin{transform-box:view-box;transform-origin:160px 158px;animation:afcbSp 17s linear infinite}'
+'@keyframes afcbSp{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}'
+'.afcb-disc{position:absolute;bottom:13vh;left:0;width:52px;opacity:0;transform:translateX(var(--hfront))}'
+'.afcb-disc svg{width:100%;height:auto;display:block}'
+'.afcb-disc.fly{animation:afcbDisc 1.15s cubic-bezier(.25,.5,.4,1) forwards}'
+'.afcb-disc.gone{animation:none!important;opacity:0!important}'
+'@keyframes afcbDisc{0%{opacity:0;transform:translateX(var(--hfront)) translateY(0) scale(.4) rotate(0)}'
 +'12%{opacity:1}'
 +'55%{transform:translateX(calc((var(--hfront) + var(--px)) / 2)) translateY(calc(var(--py) - 12vh)) scale(1) rotate(540deg)}'
 +'100%{opacity:1;transform:translateX(var(--px)) translateY(var(--py)) scale(.7) rotate(1080deg)}}'

/* ── the speech bubble ─────────────────────────────────────────────────── */
+'.afcb-say{position:absolute;bottom:43vh;left:0;width:340px;max-width:76vw;opacity:0;'
 +'transform:translateX(var(--sayx)) translate(var(--saysh),10px) scale(.7);transform-origin:50% 110%;'
 +'pointer-events:none}'
+'.afcb-say b{display:block;background:#fff;color:#12161C;border:4px solid #0D1117;border-radius:26px;'
 +'padding:22px 26px 24px;font:400 16px/1.62 Inter,system-ui,-apple-system,sans-serif;'
 +'box-shadow:0 18px 34px rgba(13,17,23,.3);position:relative;z-index:2;text-align:left}'
+'.afcb-say s{position:absolute;left:50%;bottom:-29px;margin-left:-21px;width:42px;height:38px;z-index:3;'
 +'display:block;filter:drop-shadow(0 8px 10px rgba(13,17,23,.18))}'
+'.afcb-say s svg{display:block;width:100%;height:100%}'
+'.afcb-say em{font-style:normal;font-weight:800;color:#5E7A12}'
+'.afcb-say .x{position:absolute;top:8px;right:8px;z-index:4;width:29px;height:29px;border-radius:50%;'
 +'background:#fff;border:3px solid #0D1117;color:#0D1117;font:700 15px/1 Inter,system-ui,sans-serif;'
 +'display:grid;place-items:center;cursor:pointer;pointer-events:auto;padding:0;'
 +'box-shadow:0 5px 12px rgba(13,17,23,.26)}'
+'.afcb-say .x:hover{background:#C9F04B}'
+'.afcb-say .acts{display:block;margin-top:15px;padding-top:14px;border-top:2px solid #ECECE6}'
+'.afcb-say .acts button{display:block;width:100%;margin-top:8px;padding:12px 14px;border-radius:10px;'
 +'font:800 14.5px Inter,system-ui,-apple-system,sans-serif;cursor:pointer;pointer-events:auto;'
 +'text-align:center;line-height:1.25}'
+'.afcb-say .acts .go{background:#A6CE39;color:#0D1117;border:3px solid #0D1117}'
+'.afcb-say .acts .go:hover{background:#C9F04B}'
+'.afcb-say .acts .req{background:#fff;color:#12161C;border:3px solid #0D1117}'
+'.afcb-say .acts .req:hover{background:#F4F4F1}'
+'.afcb-say i{font-style:normal;font-weight:800;color:#B4763C}'
+'.afcb-say u{text-decoration:none;font-weight:700;color:#12161C}'
+'.afcb-say .big{display:block;font-size:19px;font-weight:800;margin-bottom:7px;letter-spacing:-.01em;'
 +'padding-right:34px}'
+'.afcb-say .sm{display:block;margin-top:9px;font-size:14.5px;color:#3D4750}'
+'.afcb-say.in{animation:afcbSayIn .7s cubic-bezier(.3,1.4,.45,1) forwards}'
+'@keyframes afcbSayIn{0%{opacity:0;transform:translateX(var(--sayx)) translate(var(--saysh),16px) scale(.6)}'
 +'100%{opacity:1;transform:translateX(var(--sayx)) translate(var(--saysh),0) scale(1)}}'
+'.afcb-say.out{animation:afcbSayOut .55s ease-in forwards}'
+'@keyframes afcbSayOut{0%{opacity:1;transform:translateX(var(--sayx)) translate(var(--saysh),0) scale(1)}'
 +'100%{opacity:0;transform:translateX(var(--sayx)) translate(var(--saysh),-10px) scale(.9)}}'

/* ── the man on stage ──────────────────────────────────────────────────── */
+'.afcb-hero{position:absolute;bottom:5vh;left:0;width:17vw;min-width:132px;max-width:236px;'
 +'opacity:0;transform-origin:50% 100%}'
+'.afcb-hero svg{width:100%;height:auto;display:block;filter:drop-shadow(0 12px 18px rgba(13,17,23,.35))}'

/* steps down out of the cab instead of popping out of it */
+'.afcb-hero.stepout{animation:afcbStep 1.7s cubic-bezier(.34,.6,.3,1) forwards}'
+'@keyframes afcbStep{0%{opacity:0;transform:translate(calc(var(--hdoor) + 1vw),-19vh) scale(.52)}'
 +'12%{opacity:1}'
 +'38%{opacity:1;transform:translate(calc(var(--hdoor) + .4vw),-12vh) scale(.66)}'
 +'68%{transform:translate(var(--hdoor),-4.5vh) scale(.85)}'
 +'88%{transform:translate(var(--hdoor),.8vh) scale(1.02)}'
 +'100%{opacity:1;transform:translate(var(--hdoor),0) scale(1)}}'
+'.afcb-hero.stepout .afcb-legA{animation:afcbStepLegA 1.7s cubic-bezier(.34,.6,.3,1) forwards}'
+'.afcb-hero.stepout .afcb-shinA{animation:afcbStepShinA 1.7s cubic-bezier(.34,.6,.3,1) forwards}'
+'.afcb-hero.stepout .afcb-legB{animation:afcbStepLegB 1.7s cubic-bezier(.34,.6,.3,1) forwards}'
+'.afcb-hero.stepout .afcb-wave{animation:afcbStepGrab 1.7s ease-out forwards}'
+'@keyframes afcbStepLegA{0%{transform:rotate(26deg)}55%{transform:rotate(-16deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbStepShinA{0%{transform:rotate(-44deg)}55%{transform:rotate(-8deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbStepLegB{0%{transform:rotate(-22deg)}60%{transform:rotate(14deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbStepGrab{0%{transform:rotate(-36deg)}60%{transform:rotate(-18deg)}100%{transform:rotate(0)}}'

/* the flip he pulls off the running board when he is feeling it */
+'.afcb-hero.flip{animation:afcbFlip 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'@keyframes afcbFlip{0%{opacity:1;transform:translate(var(--hdoor),0) rotate(0) scale(1,1)}'
 +'9%{transform:translate(calc(var(--hdoor) - .4vw),1.4vh) rotate(5deg) scale(1.08,.87)}'
 +'20%{transform:translate(calc(var(--hdoor) - 1.6vw),-13vh) rotate(-72deg) scale(.9,1.14)}'
 +'36%{transform:translate(calc(var(--hdoor) - 3vw),-20vh) rotate(-186deg) scale(.95,.95)}'
 +'54%{transform:translate(calc(var(--hdoor) - 4.4vw),-19vh) rotate(-292deg) scale(.94,.96)}'
 +'72%{transform:translate(calc(var(--hdoor) - 5.6vw),-9vh) rotate(-364deg) scale(1.02,.98)}'
 +'86%{transform:translate(calc(var(--hdoor) - 6vw),1.8vh) rotate(-360deg) scale(1.12,.84)}'
 +'94%{transform:translate(calc(var(--hdoor) - 6vw),0) rotate(-360deg) scale(.96,1.05)}'
 +'100%{opacity:1;transform:translate(calc(var(--hdoor) - 6vw),0) rotate(-360deg) scale(1,1)}}'
+'.afcb-hero.flip .afcb-legA,.afcb-hero.flip .afcb-legB{animation:afcbTuckLeg 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-shinA,.afcb-hero.flip .afcb-shinB{animation:afcbTuckShin 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-armA{animation:afcbFlipArmA 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-wave{animation:afcbFlipArmB 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-foreA{animation:afcbFlipForeA 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-foreB{animation:afcbFlipForeB 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-torso{animation:afcbCurl 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'.afcb-hero.flip .afcb-neck{animation:afcbFlipNeck 1.5s cubic-bezier(.32,.12,.3,1) forwards}'
+'@keyframes afcbTuckLeg{0%{transform:rotate(0)}9%{transform:rotate(22deg)}'
 +'22%{transform:rotate(-16deg)}40%{transform:rotate(46deg)}58%{transform:rotate(44deg)}'
 +'76%{transform:rotate(-12deg)}88%{transform:rotate(24deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbTuckShin{0%{transform:rotate(0)}9%{transform:rotate(-30deg)}'
 +'22%{transform:rotate(-10deg)}40%{transform:rotate(-96deg)}58%{transform:rotate(-92deg)}'
 +'76%{transform:rotate(-18deg)}88%{transform:rotate(-40deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbFlipArmA{0%{transform:rotate(0)}9%{transform:rotate(-34deg)}'
 +'22%{transform:rotate(38deg)}40%{transform:rotate(62deg)}58%{transform:rotate(58deg)}'
 +'76%{transform:rotate(10deg)}88%{transform:rotate(-22deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbFlipArmB{0%{transform:rotate(0)}9%{transform:rotate(30deg)}'
 +'22%{transform:rotate(-44deg)}40%{transform:rotate(-66deg)}58%{transform:rotate(-62deg)}'
 +'76%{transform:rotate(-14deg)}88%{transform:rotate(26deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbFlipForeA{0%{transform:rotate(0)}30%{transform:rotate(54deg)}'
 +'62%{transform:rotate(48deg)}88%{transform:rotate(-8deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbFlipForeB{0%{transform:rotate(0)}30%{transform:rotate(-52deg)}'
 +'62%{transform:rotate(-46deg)}88%{transform:rotate(10deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbCurl{0%{transform:rotate(0)}20%{transform:rotate(-9deg)}'
 +'48%{transform:rotate(6deg)}86%{transform:rotate(-5deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbFlipNeck{0%{transform:rotate(0)}20%{transform:rotate(11deg) skewX(-5deg)}'
 +'50%{transform:rotate(-8deg) skewX(4deg)}78%{transform:rotate(6deg) skewX(-3deg)}'
 +'90%{transform:rotate(-4deg)}100%{transform:rotate(0)}}'

/* a real wave, from the shoulder and the elbow */
+'.afcb-hero.hello{transform:translate(var(--hdoor),0);opacity:1;transition:transform .9s ease}'
+'.afcb-hero.hello.moved{transform:translate(var(--hfront),0)}'
+'.afcb-hero.postflip{transform:translate(calc(var(--hdoor) - 6vw),0);opacity:1;transition:transform 1s ease}'
+'.afcb-hero.postflip.moved{transform:translate(var(--hfront),0)}'
+'.afcb-hero.waving .afcb-wave{animation:afcbWaveArm .62s ease-in-out 6}'
+'.afcb-hero.waving .afcb-foreB{animation:afcbWaveFore .62s ease-in-out 6}'
+'@keyframes afcbWaveArm{0%,100%{transform:rotate(-42deg)}50%{transform:rotate(-58deg)}}'
+'@keyframes afcbWaveFore{0%,100%{transform:rotate(16deg)}50%{transform:rotate(-22deg)}}'

/* the walk: hips, knees, shoulders, elbows, a torso that leans into it */
+'.afcb-hero.walking .afcb-legA{animation:afcbLegA .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-legB{animation:afcbLegB .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-shinA{animation:afcbShinA .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-shinB{animation:afcbShinB .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-armA{animation:afcbSwingA .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-foreA{animation:afcbForeSwingA .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-wave{animation:afcbSwingB .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-foreB{animation:afcbForeSwingB .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-torso{animation:afcbLean .66s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-bob{animation:afcbStride .33s ease-in-out infinite}'
+'.afcb-hero.walking .afcb-neck{animation:afcbNeckJog .33s ease-in-out infinite}'
+'@keyframes afcbLegA{0%,100%{transform:rotate(24deg)}50%{transform:rotate(-22deg)}}'
+'@keyframes afcbLegB{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(24deg)}}'
+'@keyframes afcbShinA{0%{transform:rotate(-4deg)}30%{transform:rotate(-38deg)}'
 +'60%{transform:rotate(-6deg)}100%{transform:rotate(-4deg)}}'
+'@keyframes afcbShinB{0%{transform:rotate(-6deg)}30%{transform:rotate(-4deg)}'
 +'60%{transform:rotate(-38deg)}100%{transform:rotate(-6deg)}}'
+'@keyframes afcbSwingA{0%,100%{transform:rotate(-20deg)}50%{transform:rotate(22deg)}}'
+'@keyframes afcbSwingB{0%,100%{transform:rotate(18deg)}50%{transform:rotate(-20deg)}}'
+'@keyframes afcbForeSwingA{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-14deg)}}'
+'@keyframes afcbForeSwingB{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}'
+'@keyframes afcbLean{0%,100%{transform:rotate(-1.6deg)}50%{transform:rotate(1.6deg)}}'
+'@keyframes afcbStride{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}'
+'@keyframes afcbNeckJog{0%,100%{transform:rotate(-2deg) skewX(1deg)}50%{transform:rotate(2.4deg) skewX(-1.4deg)}}'

/* walking off to the corner */
+'.afcb-hero.walkout{animation:afcbWalkOut 2.5s linear forwards}'
+'@keyframes afcbWalkOut{0%{opacity:1;transform:translate(var(--hfront),0) scale(1)}'
 +'100%{opacity:1;transform:translate(var(--hcorner),0) scale(.82)}}'

/* the throw: wind up, whip the arm over, follow through */
+'.afcb-hero.throwing{transform:translate(var(--hfront),0);opacity:1}'
+'.afcb-hero.throwing .afcb-wave{animation:afcbThrowArm 1.15s cubic-bezier(.3,.1,.3,1) forwards}'
+'.afcb-hero.throwing .afcb-foreB{animation:afcbThrowFore 1.15s cubic-bezier(.3,.1,.3,1) forwards}'
+'.afcb-hero.throwing .afcb-torso{animation:afcbThrowLean 1.15s cubic-bezier(.3,.1,.3,1) forwards}'
+'.afcb-hero.throwing .afcb-armA{animation:afcbThrowCounter 1.15s cubic-bezier(.3,.1,.3,1) forwards}'
+'@keyframes afcbThrowCounter{0%{transform:rotate(0)}34%{transform:rotate(-24deg)}'
 +'58%{transform:rotate(26deg)}100%{transform:rotate(6deg)}}'
+'@keyframes afcbThrowArm{0%{transform:rotate(0)}34%{transform:rotate(64deg)}'
 +'58%{transform:rotate(-92deg)}100%{transform:rotate(-16deg)}}'
+'@keyframes afcbThrowFore{0%{transform:rotate(0)}34%{transform:rotate(48deg)}'
 +'58%{transform:rotate(-40deg)}100%{transform:rotate(-8deg)}}'
+'@keyframes afcbThrowLean{0%{transform:rotate(0)}34%{transform:rotate(7deg)}'
 +'58%{transform:rotate(-9deg)}100%{transform:rotate(0)}}'

/* grabbing the truck: arm out, knees loaded, then it comes up with him */
+'.afcb-hero.grabbing{transform:translate(var(--hfront),0);opacity:1}'
+'.afcb-hero.grabbing .afcb-wave{animation:afcbGrabArm 2.8s cubic-bezier(.3,.8,.3,1) forwards}'
+'.afcb-hero.grabbing .afcb-foreB{animation:afcbGrabFore 2.8s cubic-bezier(.3,.8,.3,1) forwards}'
+'.afcb-hero.grabbing .afcb-armA{animation:afcbGrabArmA 2.8s cubic-bezier(.3,.8,.3,1) forwards}'
+'.afcb-hero.grabbing .afcb-foreA{animation:afcbGrabForeA 2.8s cubic-bezier(.3,.8,.3,1) forwards}'
+'@keyframes afcbGrabArmA{0%{transform:rotate(0)}22%{transform:rotate(-40deg)}'
 +'48%{transform:rotate(20deg)}58%{transform:rotate(26deg)}'
 +'84%,100%{transform:rotate(62deg)}}'
+'@keyframes afcbGrabForeA{0%{transform:rotate(0)}30%{transform:rotate(-20deg)}100%{transform:rotate(24deg)}}'
+'.afcb-hero.grabbing .afcb-legA,.afcb-hero.grabbing .afcb-legB{animation:afcbLoad 2.8s ease-out forwards}'
+'.afcb-hero.grabbing .afcb-torso{animation:afcbGrabLean 2.8s ease-out forwards}'
+'.afcb-hero.grabbing .afcb-bob{animation:afcbPush 2.8s ease-out forwards}'
+'@keyframes afcbGrabArm{0%{transform:rotate(0)}22%{transform:rotate(44deg)}'
 +'48%{transform:rotate(-28deg)}58%{transform:rotate(-34deg)}'
 +'84%,100%{transform:rotate(-118deg)}}'
+'@keyframes afcbGrabFore{0%{transform:rotate(0)}30%{transform:rotate(22deg)}100%{transform:rotate(-44deg)}}'
+'@keyframes afcbGrabLean{0%{transform:rotate(0)}35%{transform:rotate(6deg)}100%{transform:rotate(-3deg)}}'
+'@keyframes afcbLoad{0%{transform:rotate(0)}40%{transform:rotate(9deg)}100%{transform:rotate(0)}}'
+'@keyframes afcbPush{0%{transform:translateY(0)}40%{transform:translateY(10px)}100%{transform:translateY(-4px)}}'

/* the hurl: reach way back, then everything forward and up at once */
+'.afcb-hero.hurling{transform:translate(var(--hfront),0);opacity:1}'
+'.afcb-hero.hurling .afcb-wave{animation:afcbHurlArm 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'.afcb-hero.hurling .afcb-foreB{animation:afcbHurlFore 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'.afcb-hero.hurling .afcb-torso{animation:afcbHurlLean 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'.afcb-hero.hurling .afcb-armA{animation:afcbHurlArmA 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'.afcb-hero.hurling .afcb-foreA{animation:afcbHurlForeA 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'@keyframes afcbHurlArmA{0%{transform:rotate(62deg)}22%{transform:rotate(96deg)}'
 +'46%{transform:rotate(-34deg)}100%{transform:rotate(-12deg)}}'
+'@keyframes afcbHurlForeA{0%{transform:rotate(24deg)}22%{transform:rotate(40deg)}'
 +'46%{transform:rotate(-16deg)}100%{transform:rotate(0)}}'
+'.afcb-hero.hurling .afcb-legA{animation:afcbHurlStep 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'.afcb-hero.hurling .afcb-bob{animation:afcbHurlRise 2.8s cubic-bezier(.25,.08,.35,1) forwards}'
+'@keyframes afcbHurlArm{0%{transform:rotate(-118deg)}22%{transform:rotate(-142deg)}'
 +'46%{transform:rotate(-40deg)}70%{transform:rotate(-14deg)}100%{transform:rotate(-8deg)}}'
+'@keyframes afcbHurlFore{0%{transform:rotate(-26deg)}26%{transform:rotate(40deg)}'
 +'46%{transform:rotate(-44deg)}100%{transform:rotate(-30deg)}}'
+'@keyframes afcbHurlLean{0%{transform:rotate(-3deg)}26%{transform:rotate(11deg)}'
 +'46%{transform:rotate(-12deg)}100%{transform:rotate(-5deg)}}'
+'@keyframes afcbHurlStep{0%{transform:rotate(0)}26%{transform:rotate(-14deg)}'
 +'46%{transform:rotate(18deg)}100%{transform:rotate(4deg)}}'
+'@keyframes afcbHurlRise{0%{transform:translateY(0)}26%{transform:translateY(8px)}'
 +'50%{transform:translateY(-14px)}100%{transform:translateY(0)}}'

/* tucking into the corner to become the launcher */
+'.afcb-hero.tuck{animation:afcbTuck 1s cubic-bezier(.4,0,.5,1) forwards}'
+'@keyframes afcbTuck{0%{opacity:1;transform:translate(var(--hcorner),0) scale(.82)}'
 +'100%{opacity:0;transform:translate(calc(var(--hcorner) + 4vw),2vh) scale(.42)}}'

/* ── exit: wave goodbye, open the portal, flip slowly up into it ───────── */
+'.afcb-hero.pop{animation:afcbPop .85s cubic-bezier(.3,1.3,.4,1) forwards}'
+'@keyframes afcbPop{0%{opacity:0;transform:translate(var(--hcorner),3vh) scale(.42)}'
 +'100%{opacity:1;transform:translate(var(--hfront),0) scale(1)}}'
+'.afcb-hero.byebye{transform:translate(var(--hfront),0);opacity:1}'
+'.afcb-hero.byebye .afcb-wave{animation:afcbBye .7s ease-in-out 4}'
+'.afcb-hero.byebye .afcb-foreB{animation:afcbByeFore .7s ease-in-out 4}'
+'@keyframes afcbBye{0%,100%{transform:rotate(-64deg)}50%{transform:rotate(-84deg)}}'
+'@keyframes afcbByeFore{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-26deg)}}'
+'.afcb-hero.crouch{animation:afcbCrouch .85s ease-out forwards}'
+'@keyframes afcbCrouch{0%{opacity:1;transform:translate(var(--hfront),0) scale(1)}'
 +'100%{opacity:1;transform:translate(var(--hfront),2vh) scale(.9)}}'
+'.afcb-hero.crouch .afcb-legA,.afcb-hero.crouch .afcb-legB{animation:afcbLoad .85s ease-out forwards}'
+'.afcb-hero.leap{animation:afcbLeap 4.6s cubic-bezier(.28,.04,.36,1) forwards}'
+'@keyframes afcbLeap{0%{opacity:1;transform:translate(var(--hfront),2vh) scale(.9,.94) rotate(0)}'
 +'8%{transform:translate(var(--hfront),4vh) scale(1.06,.84) rotate(4deg)}'
 +'20%{transform:translate(calc(var(--hfront) - 5vw),-18vh) scale(.92,1.1) rotate(-90deg)}'
 +'34%{transform:translate(calc(var(--hfront) - 12vw),-34vh) scale(.86,.86) rotate(-230deg)}'
 +'48%{transform:translate(calc((var(--hfront) + var(--hpx)) / 2),calc(var(--hpy) - 6vh)) scale(.78,.78) rotate(-390deg)}'
 +'64%{transform:translate(calc(var(--hpx) + 10vw),calc(var(--hpy) - 4vh)) scale(.66,.66) rotate(-560deg)}'
 +'78%{transform:translate(var(--hpx),var(--hpy)) scale(.5,.5) rotate(-690deg)}'
 +'90%{opacity:1;transform:translate(var(--hpx),var(--hpy)) scale(.22,.22) rotate(-780deg)}'
 +'100%{opacity:0;transform:translate(var(--hpx),var(--hpy)) scale(.04,.04) rotate(-840deg)}}'
+'.afcb-hero.leap .afcb-legA,.afcb-hero.leap .afcb-legB{animation:afcbTuckLeg 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-shinA,.afcb-hero.leap .afcb-shinB{animation:afcbTuckShin 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-armA{animation:afcbFlipArmA 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-wave{animation:afcbFlipArmB 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-foreA{animation:afcbFlipForeA 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-foreB{animation:afcbFlipForeB 1.53s ease-in-out 3}'
+'.afcb-hero.leap .afcb-neck{animation:afcbFlipNeck 1.53s ease-in-out 3}'

/* ── skip control ──────────────────────────────────────────────────────── */
+'.afcb-skip{position:absolute;right:18px;top:16px;pointer-events:auto;cursor:pointer;'
 +'background:rgba(13,17,23,.72);color:#F4F4F1;border:1px solid rgba(244,244,241,.3);border-radius:999px;'
 +'padding:8px 16px;font:600 13px Inter,system-ui,sans-serif;letter-spacing:.02em}'
+'.afcb-skip:hover{background:#0D1117}'
+'@media(max-width:640px){.afcb-truck{width:92vw;min-width:0}.afcb-hero{width:30vw;min-width:118px}'
 +'.afcb-portal{width:44vw}.afcb-puddle{width:44vw}'
 +'.afcb-say{width:82vw;bottom:44vh}.afcb-say b{padding:18px 20px 20px;font-size:15px;line-height:1.58}'
 +'.afcb-say .big{font-size:17px}}'
+'@media(prefers-reduced-motion:reduce){.afcb-stage{display:none!important}}';

/* what he says when he steps out — emphasis, not a wall of gray text */
var HELLO_HTML =
  '<b><span class="big">Howdy — I am <em>Zach</em>.</span>'
+ 'That is my real face. Marketing connoisseur, lead gen, SEO, AIO, conversion, '
+ 'full stack — and a contractor before any of it. I help contractors '
+ '<i>get found, get called, and get booked</i>, and I will tell you straight '
+ 'when something is not worth your money.'
+ '<span class="sm">Tell me what is slow. I will tell you how to fix it.</span>'
+ '<span class="acts">'
+ '<button class="go" type="button">Click here to get my help</button>'
+ '<button class="req" type="button">Have a person reach out</button>'
+ '</span></b>'
+ '<button class="x" type="button" aria-label="Close message">&times;</button>'
+ '<s><svg viewBox="0 -6 42 40" aria-hidden="true"><path d="M5 -4 C 7 14 15 24 21 34'
+ ' C 23 22 31 10 37 -4" fill="#fff" stroke="#0D1117" stroke-width="4" stroke-linejoin="round"/></svg></s>';

/* Returns null when the browser asked for no motion — callers just proceed. */
function Cine(){
  if (reduce) return null;

  var stage = el('div', 'afcb-stage');
  stage.innerHTML =
    '<div class="afcb-weather"><div class="afcb-rain"></div></div>'
  + '<div class="afcb-bolts"></div>'
  + '<div class="afcb-sky"></div>'
  + '<div class="afcb-puddle p1">' + mud() + '</div>'
  + '<div class="afcb-puddle p2">' + mud() + '</div>'
  + '<div class="afcb-beam">' + BEAM + '</div>'
  + '<div class="afcb-truck">' + TRUCK + '</div>'
  + '<div class="afcb-ufo">' + UFO + '</div>'
  + '<div class="afcb-portal">' + PORTAL + '</div>'
  + '<div class="afcb-disc">' + DISC + '</div>'
  + '<div class="afcb-hero">' + man() + '</div>'
  + '<div class="afcb-say">' + HELLO_HTML + '</div>'
  + '<button class="afcb-skip" type="button">Skip intro</button>';
  D.body.appendChild(stage);

  var sky     = stage.querySelector('.afcb-sky'),
      weather = stage.querySelector('.afcb-weather'),
      rain    = stage.querySelector('.afcb-rain'),
      bolts   = stage.querySelector('.afcb-bolts'),
      hero    = stage.querySelector('.afcb-hero'),
      truck   = stage.querySelector('.afcb-truck'),
      ufo     = stage.querySelector('.afcb-ufo'),
      beam    = stage.querySelector('.afcb-beam'),
      portal  = stage.querySelector('.afcb-portal'),
      disc    = stage.querySelector('.afcb-disc'),
      say     = stage.querySelector('.afcb-say'),
      pud1    = stage.querySelector('.afcb-puddle.p1'),
      pud2    = stage.querySelector('.afcb-puddle.p2'),
      skip    = stage.querySelector('.afcb-skip'),
      timers  = [], ending = null;

  function mob(){ return (W.innerWidth || 1024) <= 640; }

  /* Layout boxes ignore transforms, so offsetLeft/offsetTop give each
     element's untransformed centre. The difference between that and the
     portal's centre is exactly how far a throw has to travel — in real
     pixels, on whatever screen this happens to be. */
  function aim(){
    try {
      var px = portal.offsetLeft + portal.offsetWidth / 2,
          py = portal.offsetTop + portal.offsetHeight / 2,
          set = [[truck, '--tpx', '--tpy'], [hero, '--hpx', '--hpy'], [disc, '--px', '--py']],
          i, node, cx, cy;
      for (i = 0; i < set.length; i++){
        node = set[i][0];
        if (!node.offsetWidth) continue;
        cx = node.offsetLeft + node.offsetWidth / 2;
        cy = node.offsetTop + node.offsetHeight / 2;
        stage.style.setProperty(set[i][1], Math.round(px - cx) + 'px');
        stage.style.setProperty(set[i][2], Math.round(py - cy) + 'px');
      }
    } catch(e){}
  }
  function at(ms, fn){ timers.push(setTimeout(fn, ms)); }
  function clearAll(){ for (var i=0;i<timers.length;i++) clearTimeout(timers[i]); timers = []; }
  function drop(node, ms){ at(ms, function(){ if (node.parentNode) node.parentNode.removeChild(node); }); }

  var HUE = ['#C9F04B','#F7E8A0','#A6CE39','#FFFFFF','#E8A020','#BFD4E8'];

  /* lightning: lay down fresh bolts, measure each path so the draw is even */
  function strike(count){
    bolts.innerHTML = boltSVG(1200, 700, count);
    var paths = bolts.querySelectorAll('path'), i, len;
    for (i = 0; i < paths.length; i++){
      try { len = Math.ceil(paths[i].getTotalLength()); } catch(e){ len = 1600; }
      paths[i].style.setProperty('--l', len);
      paths[i].style.animationDelay = paths[i].parentNode.style.animationDelay;
    }
  }

  function clouds(n){
    for (var i = 0; i < n; i++){
      var c = el('div', 'afcb-cloud');
      c.innerHTML = CLOUD;
      c.style.width = Math.round(rnd(180, 340)) + 'px';
      c.style.top = Math.round(rnd(-2, 22)) + 'vh';
      c.style.opacity = rnd(.5, .9);
      c.style.setProperty('--cd', rnd(16, 30).toFixed(1) + 's');
      c.style.animationDelay = (-rnd(0, 10)).toFixed(1) + 's';
      weather.appendChild(c);
    }
  }

  function raindrops(n){
    for (var i = 0; i < n; i++){
      var r = el('i');
      r.style.left = rnd(-6, 104).toFixed(1) + 'vw';
      r.style.setProperty('--len', Math.round(rnd(14, 34)) + 'px');
      r.style.setProperty('--dur', rnd(.7, 1.5).toFixed(2) + 's');
      r.style.animationDelay = (-rnd(0, 1.5)).toFixed(2) + 's';
      r.style.opacity = rnd(.35, .8);
      rain.appendChild(r);
    }
  }

  /* one firework: shell climbs on a trail, blooms, sparks arc out and droop */
  function firework(xvw, yvh){
    var sh = el('div', 'afcb-shell');
    sh.style.left = xvw + 'vw';
    sh.style.bottom = '4px';
    sh.style.setProperty('--rise', '-' + (100 - yvh) + 'vh');
    sky.appendChild(sh);
    drop(sh, 980);

    at(880, function(){
      var fw = el('div', 'afcb-fw'), i, n = 30, ang, dist,
          col = pick(HUE), col2 = pick(HUE);
      fw.style.left = xvw + 'vw';
      fw.style.top  = (100 - yvh) + 'vh';
      fw.appendChild(el('b'));
      fw.appendChild(el('u'));
      for (i=0;i<n;i++){
        var s = el('i'), far = (i % 3 === 0);
        ang  = (Math.PI * 2 / n) * i + rnd(-0.1, 0.1);
        dist = far ? rnd(150, 250) : rnd(70, 150);
        s.style.background = (i % 6 === 0) ? '#fff' : (i % 2 ? col : col2);
        s.style.boxShadow = '0 0 10px ' + (i % 2 ? col : col2);
        s.style.width = s.style.height = (far ? 6 : 4) + 'px';
        s.style.setProperty('--tx', Math.round(Math.cos(ang) * dist) + 'px');
        s.style.setProperty('--ty', Math.round(Math.sin(ang) * dist + rnd(40, 110)) + 'px');
        s.style.setProperty('--sd', rnd(1.6, 2.4).toFixed(2) + 's');
        s.style.animationDelay = rnd(0, 0.12) + 's';
        fw.appendChild(s);
      }
      sky.appendChild(fw);
      drop(fw, 3200);
    });
  }

  /* dirt off a braking tire, or mud thrown from a spinning one */
  function grit(xvw, count, spread, muddy){
    for (var i=0;i<count;i++){
      (function(){
        var g = el('div', 'afcb-grit'), sz = rnd(muddy ? 9 : 6, muddy ? 30 : 18);
        g.style.left   = (xvw + rnd(-4, 4)) + 'vw';
        g.style.width  = sz + 'px';
        g.style.height = (sz * rnd(.55, 1)) + 'px';
        g.style.background = muddy
          ? pick(['#3B2816','#4A3323','#5E4128','#2A1B0E'])
          : pick(['#D9C7A8','#C9B392','#E6D9C0']);
        g.style.setProperty('--tx', Math.round(rnd(spread * 0.2, spread) * pick([1,1,1,-1])) + 'px');
        g.style.setProperty('--ty', Math.round(rnd(-190, -50)) + 'px');
        g.style.animationDelay = rnd(0, .35) + 's';
        sky.appendChild(g);
        drop(g, 2800);
      })();
    }
  }

  /* a rolling cloud of dust hanging off the tires */
  function dust(xvw, drift){
    var d = el('div', 'afcb-dust');
    d.style.left = xvw + 'vw';
    d.style.setProperty('--tx', Math.round(drift) + 'px');
    d.style.opacity = rnd(.6, 1);
    sky.appendChild(d);
    drop(d, 3000);
  }

  /* a puff off the stacks — it hangs where he has been, not where he is going */
  function puff(xvw, drift){
    var g = el('div', 'afcb-grit'), sz = rnd(18, 40);
    g.style.left = xvw + 'vw';
    g.style.bottom = '17vh';
    g.style.width = sz + 'px';
    g.style.height = sz * rnd(.7, 1) + 'px';
    g.style.background = pick(['rgba(60,66,74,.5)','rgba(84,92,102,.42)','rgba(44,50,58,.45)']);
    g.style.setProperty('--tx', Math.round(drift) + 'px');
    g.style.setProperty('--ty', Math.round(rnd(-120, -50)) + 'px');
    sky.appendChild(g);
    drop(g, 2600);
  }

  /* streaks off the truck as it leaves his hand */
  function streaks(xvw, yvh, n){
    for (var i=0;i<n;i++){
      var k = el('div', 'afcb-grit');
      k.style.left = (xvw + rnd(-3, 3)) + 'vw';
      k.style.bottom = (yvh + rnd(-6, 6)) + 'vh';
      k.style.width = rnd(30, 70) + 'px';
      k.style.height = '3px';
      k.style.borderRadius = '3px';
      k.style.background = 'rgba(201,240,75,.6)';
      k.style.setProperty('--tx', Math.round(rnd(60, 190)) + 'px');
      k.style.setProperty('--ty', Math.round(rnd(30, 90)) + 'px');
      sky.appendChild(k);
      drop(k, 1400);
    }
  }

  /* wheels hitting standing water: a fan of brown droplets */
  function splash(xvw, count){
    for (var i=0;i<count;i++){
      (function(){
        var s = el('div', 'afcb-splash'), sz = rnd(8, 22);
        s.style.left = (xvw + rnd(-4, 4)) + 'vw';
        s.style.width  = sz + 'px';
        s.style.height = (sz * rnd(.45, .8)) + 'px';
        s.style.background = pick(['#3B2816','#4A3323','#5A3E24','#2A1B0E']);
        s.style.setProperty('--tx', Math.round(rnd(-150, 190)) + 'px');
        s.style.setProperty('--ty', Math.round(rnd(-150, -40)) + 'px');
        s.style.setProperty('--rot', Math.round(rnd(-220, 220)) + 'deg');
        s.style.animationDelay = rnd(0, .18) + 's';
        sky.appendChild(s);
        drop(s, 1900);
      })();
    }
  }

  function reset(){
    stage.className = 'afcb-stage';
    hero.className = 'afcb-hero';
    hero.style.transform = ''; hero.style.opacity = '';
    truck.className = 'afcb-truck';
    truck.style.transform = ''; truck.style.opacity = '';
    ufo.className = 'afcb-ufo'; beam.className = 'afcb-beam';
    portal.className = 'afcb-portal';
    portal.style.left = ''; portal.style.top = '';
    disc.className = 'afcb-disc';
    say.className = 'afcb-say';
    pud1.className = 'afcb-puddle p1'; pud2.className = 'afcb-puddle p2';
    ['--tpx','--tpy','--hpx','--hpy','--px','--py'].forEach(function(v){
      stage.style.removeProperty(v); });
    sky.innerHTML = ''; bolts.innerHTML = ''; rain.innerHTML = '';
    var cl = weather.querySelectorAll('.afcb-cloud'), i;
    for (i=0;i<cl.length;i++) weather.removeChild(cl[i]);
  }
  function finish(done){ clearAll(); reset(); if (done) done(); }

  function hideSay(){ if (say.className.indexOf('out') < 0) say.className = 'afcb-say out'; }
  var sayX   = say.querySelector('.x'),
      sayGo  = say.querySelector('.acts .go'),
      sayReq = say.querySelector('.acts .req');
  if (sayX)   sayX.addEventListener('click', hideSay);
  if (sayGo)  sayGo.addEventListener('click', function(){
    hideSay(); if (typeof C.onHelp === 'function') C.onHelp(); });
  if (sayReq) sayReq.addEventListener('click', function(){
    hideSay(); if (typeof C.onForm === 'function') C.onForm(); });

  skip.addEventListener('click', function(){
    if (ending){ var f = ending; ending = null; f(); }
  });

  var C = {
    stage: stage,
    onHelp: null, onForm: null,

    /* the arrival — long on purpose, skippable at any moment */
    arrive: function(done){
      ending = function(){ finish(done); };
      var m = mob(), flips = Math.random() < .5;
      stage.classList.add('on');
      if (m) stage.classList.add('m');
      clouds(m ? 3 : 5);
      raindrops(m ? 26 : 58);
      strike(m ? 5 : 8);
      void stage.offsetWidth;
      stage.classList.add('go');

      /* two puddles on the route, each one a different shape */
      var w1 = m ? 4 : 10, w2 = m ? 50 : 62;
      pud1.style.left = w1 + 'vw';
      pud2.style.left = w2 + 'vw';
      pud1.style.width = (m ? rnd(34, 46) : rnd(16, 24)).toFixed(1) + 'vw';
      pud2.style.width = (m ? rnd(30, 42) : rnd(13, 21)).toFixed(1) + 'vw';
      at(200,  function(){ pud1.classList.add('wet'); });
      at(1800, function(){ pud2.classList.add('wet'); });

      /* fireworks across the entire width, spaced so nothing pulses */
      var shots = [[14,52],[76,58],[40,68],[88,44],[26,62],[62,50],[8,46],[52,72],[70,64],[34,48],
                   [46,58],[20,70],[82,52],[58,66]];
      shots.forEach(function(p, i){ at(300 + i * 540, function(){ firework(p[0], p[1]); }); });

      /* the delivery: saucer drifts in, beam opens, truck comes down it */
      at(300,  function(){ ufo.classList.add('fly'); });
      at(2300, function(){ ufo.className = 'afcb-ufo hold'; beam.classList.add('on'); });
      at(2900, function(){ truck.className = 'afcb-truck land'; });
      at(4300, function(){ dust(m ? 20 : 30, -90); });
      at(4900, function(){ dust(m ? 34 : 44, 90); });
      at(5500, function(){ splash(w1 + 2, 24); grit(w1 + 2, 24, 360, true);
                           splash(w2 - 2, 22); grit(w2 - 2, 22, 340, true);
                           dust(m ? 22 : 28, -150); dust(m ? 40 : 48, 150); });
      at(5700, function(){ beam.className = 'afcb-beam off'; });
      at(6000, function(){ ufo.className = 'afcb-ufo away'; });
      /* then he lights the rear tyre up — nose high, rocking, mud off the back */
      at(5900, function(){ truck.className = 'afcb-truck burn'; });
      at(6200, function(){ splash(w1 + 3, 22); grit(w1 + 3, 26, 380, true); dust(w1 + 6, -170); });
      at(6600, function(){ grit(w1 + 2, 24, 360, true); puff(m ? 30 : 36, 130); });
      at(7000, function(){ splash(w2 - 4, 22); grit(w2 - 4, 24, 370, true); dust(w2 - 6, 150); });
      at(7400, function(){ grit(w1 + 4, 24, 360, true); dust(w1 + 4, -160); });
      at(7800, function(){ splash(w1 + 1, 20); grit(w1 + 1, 22, 340, true); });
      at(8200, function(){ grit(w2 - 3, 20, 320, true); dust(m ? 30 : 36, 140); });
      at(8600, function(){ grit(m ? 28 : 34, 16, 280, false); puff(m ? 24 : 30, -120); });
      at(9000, function(){ dust(m ? 26 : 32, 110); });

      /* out of the cab */
      at(9500, function(){ truck.className = 'afcb-truck parked open'; });
      at(10100, function(){ hero.style.opacity = '1'; hero.className = 'afcb-hero stepout'; });

      var t;                                   /* when he is settled and talking */
      if (flips){
        at(11800, function(){ hero.className = 'afcb-hero flip'; });
        at(13300, function(){ hero.className = 'afcb-hero postflip waving'; });
        at(13420, function(){ hero.classList.add('moved'); });
        t = 14000;
      } else {
        at(11800, function(){ hero.className = 'afcb-hero hello waving'; });
        at(11860, function(){ hero.classList.add('moved'); });
        t = 12800;
      }
      at(12500, function(){ truck.className = 'afcb-truck parked shut'; });

      /* the introduction */
      at(t,        function(){ say.classList.add('in'); });
      at(t + 8800, function(){ if (say.className.indexOf('out') < 0) say.className = 'afcb-say out'; });

      /* portal first, then the truck goes through it */
      at(t + 9200, function(){ aim(); });
      at(t + 9300, function(){ hero.className = 'afcb-hero throwing'; });
      at(t + 9980, function(){ disc.classList.add('fly'); });
      at(t + 10800, function(){ disc.className = 'afcb-disc gone'; portal.classList.add('open'); });
      at(t + 11400, function(){ hero.className = 'afcb-hero grabbing';
                               truck.className = 'afcb-truck grab'; });
      at(t + 14200, function(){ aim(); });
      at(t + 14300, function(){ hero.className = 'afcb-hero hurling';
                               truck.className = 'afcb-truck hurl'; });
      at(t + 15400, function(){ streaks(m ? 30 : 45, 42, 5); });
      at(t + 16100, function(){ streaks(m ? 24 : 32, 62, 4); });
      at(t + 17300, function(){ portal.className = 'afcb-portal shut'; stage.classList.add('clear'); });

      /* and off to the corner */
      at(t + 17900, function(){ hero.className = 'afcb-hero walkout walking'; });
      at(t + (m ? 19900 : 20200), function(){ hero.className = 'afcb-hero walkout'; });
      at(t + (m ? 21000 : 21300), function(){ hero.className = 'afcb-hero tuck'; });
      at(t + (m ? 21000 : 21300), function(){ ending = null; finish(done); });
      return t + (m ? 21000 : 21300);
    },

    /* the exit: a wave, a portal, and a slow double flip into it */
    exit: function(done){
      ending = function(){ finish(done); };
      var m = mob();
      stage.classList.add('on');
      if (m) stage.classList.add('m');
      void stage.offsetWidth;
      hero.style.opacity = '1';
      hero.classList.add('pop');

      at(900,  function(){ hero.className = 'afcb-hero byebye'; });
      at(3500, function(){ aim(); });
      at(3600, function(){ hero.className = 'afcb-hero throwing'; });
      at(4050, function(){ disc.classList.add('fly'); });
      at(5150, function(){ disc.className = 'afcb-disc gone'; portal.classList.add('open'); });
      at(6200, function(){ aim(); });
      at(6300, function(){ hero.className = 'afcb-hero crouch'; });
      at(7150, function(){ hero.className = 'afcb-hero leap'; });
      at(11600, function(){ portal.className = 'afcb-portal shut'; });
      at(12700, function(){ ending = null; finish(done); });
    },

    kill: function(){ if (ending){ var f = ending; ending = null; f(); } }
  };
  return C;
}

/* ─────────────────────────── STYLES ────────────────────────────────────── */
var CSS = ''
+'.afcb,.afcb *{box-sizing:border-box;margin:0;padding:0}'
+'.afcb{position:fixed;right:20px;bottom:18px;z-index:2147482000;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}'

/* the launcher is the whole man, not a face in a circle */
+'.afcb-btn{position:relative;display:block;width:104px;padding:0;border:0;background:transparent;cursor:pointer}'
+'.afcb-btn:after{content:"";position:absolute;left:50%;bottom:2px;width:78px;height:14px;margin-left:-39px;'
 +'border-radius:50%;background:rgba(13,17,23,.16);filter:blur(4px)}'
+'.afcb-btn svg{position:relative;width:100%;height:auto;display:block;'
 +'filter:drop-shadow(0 10px 16px rgba(13,17,23,.35))}'
+'.afcb-dismiss{position:absolute;top:-4px;right:-6px;z-index:3;width:30px;height:30px;border-radius:50%;'
 +'background:#fff;border:2.5px solid #0D1117;color:#0D1117;font:700 16px/1 Inter,system-ui,sans-serif;'
 +'display:grid;place-items:center;cursor:pointer;padding:0;'
 +'box-shadow:0 6px 14px rgba(13,17,23,.28);transition:transform .18s,background .18s}'
+'.afcb-dismiss:hover{background:#C9F04B;transform:scale(1.12)}'
+'.afcb-dismiss:focus-visible{outline:3px solid #A6CE39;outline-offset:2px}'
+'.afcb.open .afcb-dismiss{opacity:0;pointer-events:none;transition:opacity .2s}'
+'.afcb-dot{position:absolute;top:6px;left:2px;width:22px;height:22px;border-radius:50%;background:#B4763C;'
 +'border:2px solid #fff;color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center;line-height:1}'
+'.afcb.open .afcb-btn{opacity:0!important;pointer-events:none!important;visibility:hidden;'
 +'transform:translateY(14px) scale(.9);'
 +'transition:opacity .25s,transform .25s}'

+'.afcb-r a{color:#5E7A12;font-weight:600;word-break:break-word}'
+'.afcb-tip{position:absolute;bottom:186px;right:0;width:max-content;max-width:min(258px,62vw);'
 +'background:#fff;color:#232A33;'
 +'border:2px solid #0D1117;border-radius:14px 14px 3px 14px;padding:12px 14px;font-size:14px;line-height:1.45;'
 +'box-shadow:0 14px 40px rgba(13,17,23,.22);cursor:pointer;display:none}'
+'.afcb-tip.on{display:block}'
+'.afcb-tip b{display:block;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#B4763C;margin-bottom:2px;white-space:nowrap}'

+'.afcb-p{position:absolute;bottom:0;right:0;width:392px;max-width:calc(100vw - 32px);'
 +'height:min(640px,calc(100vh - 120px));background:#F4F4F1;border-radius:16px;overflow:hidden;'
 +'box-shadow:0 28px 80px rgba(13,17,23,.45);display:none;flex-direction:column}'
+'.afcb-p.on{display:flex}'
+'.afcb-h{background:#0D1117;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:12px;flex:0 0 auto}'
+'.afcb-h .av{width:50px;flex:0 0 50px;display:block;position:relative}'
+'.afcb-h .av svg{width:100%;height:auto;display:block;margin:-16px 0 -20px}'
+'.afcb-h b{font-family:"Barlow Condensed",Impact,sans-serif;font-size:21px;font-weight:800;'
 +'text-transform:uppercase;letter-spacing:.02em;line-height:1;display:block}'
+'.afcb-h i{font-style:normal;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#A6CE39;'
 +'display:flex;align-items:center;gap:6px;margin-top:4px;min-height:13px}'
+'.afcb-h i u{width:6px;height:6px;border-radius:50%;background:#A6CE39;text-decoration:none;flex:0 0 6px}'
/* the credential line cross-fades slowly — no flashing, no sliding */
+'.afcb-cred{display:block;transition:opacity .6s ease}'
+'.afcb-cred.fade{opacity:0}'
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
 +'.afcb-btn:after{width:62px;margin-left:-31px}'
 +'.afcb-p{height:min(580px,calc(100vh - 96px));width:calc(100vw - 24px)}'
 +'.afcb-hello svg{width:140px}'
 +'.afcb-tip{bottom:150px;right:0;max-width:min(240px,66vw);font-size:13px;padding:10px 12px}}'

/* idle life: he breathes, the blade wiggles, the head settles on the neck.
   Slow and continuous — nothing here blinks or flashes. */
+'@media(prefers-reduced-motion:no-preference){'
 +'.afcb-pl{animation:afcbA 4.1s ease-in-out infinite}'
 +'.afcb-pr{animation:afcbB 3.3s ease-in-out infinite}'
 +'.afcb-bob{animation:afcbC 3.6s ease-in-out infinite}'
 +'.afcb-shadow{animation:afcbSh 3.6s ease-in-out infinite}'
 +'.afcb-wave{animation:afcbD 4.1s ease-in-out infinite}'
 +'.afcb-armA{animation:afcbG 5.3s ease-in-out infinite}'
 +'.afcb-neck{animation:afcbE 15s ease-in-out infinite}'
 +'.afcb-head{animation:afcbHd 15s ease-in-out infinite}'
 +'.afcb-foreB{animation:afcbFb 4.1s ease-in-out infinite}'
 +'.afcb-foreA{animation:afcbFa 5.3s ease-in-out infinite}'
 +'.afcb-legA{animation:afcbWt 9s ease-in-out infinite}'
 +'.afcb-legB{animation:afcbWt2 9s ease-in-out infinite}'
 +'.afcb-hat{animation:afcbH 17s ease-in-out infinite}'
 +'.afcb-t s{animation:afcbF 1.3s ease-in-out infinite}'
 +'.afcb-t s:nth-child(2){animation-delay:.18s}.afcb-t s:nth-child(3){animation-delay:.36s}'
 +'.afcb-btn:hover .afcb-bob{animation:afcbC 1.1s ease-in-out infinite}}'
+'@keyframes afcbA{0%,100%{transform:translate(-5px,2px)}35%{transform:translate(4px,-3px)}70%{transform:translate(2px,4px)}}'
+'@keyframes afcbB{0%,100%{transform:translate(4px,3px)}40%{transform:translate(-4px,-2px)}75%{transform:translate(-2px,4px)}}'
+'@keyframes afcbC{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}'
+'@keyframes afcbSh{0%,100%{transform:scale(1)}50%{transform:scale(.93)}}'
+'@keyframes afcbD{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}'
+'@keyframes afcbG{0%,100%{transform:rotate(4deg)}50%{transform:rotate(-6deg)}}'
+'@keyframes afcbE{0%{transform:rotate(0) skewX(0)}3%{transform:rotate(9deg) skewX(-6deg)}'
 +'6%{transform:rotate(-7.5deg) skewX(5deg)}9%{transform:rotate(5deg) skewX(-3deg)}'
 +'12%{transform:rotate(-3deg) skewX(2deg)}15%{transform:rotate(1.4deg)}'
 +'18%,52%{transform:rotate(0)}55%{transform:rotate(-5deg) skewX(3deg)}'
 +'58%{transform:rotate(3.4deg) skewX(-2deg)}61%{transform:rotate(-1.6deg)}'
 +'64%,100%{transform:rotate(0)}}'
+'@keyframes afcbHd{0%,52%{transform:rotate(0)}3%{transform:rotate(-4deg)}'
 +'7%{transform:rotate(3deg)}11%{transform:rotate(-1.4deg)}16%{transform:rotate(0)}'
 +'55%{transform:rotate(2.4deg)}59%{transform:rotate(-1.4deg)}64%,100%{transform:rotate(0)}}'
+'@keyframes afcbFb{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(7deg)}}'
+'@keyframes afcbFa{0%,100%{transform:rotate(3deg)}50%{transform:rotate(-5deg)}}'
+'@keyframes afcbWt{0%,100%{transform:rotate(0)}50%{transform:rotate(1.6deg)}}'
+'@keyframes afcbWt2{0%,100%{transform:rotate(0)}50%{transform:rotate(-1.6deg)}}'
+'@keyframes afcbH{0%,88%,100%{transform:rotate(0)}92%{transform:rotate(-7deg) translateY(-4px)}'
 +'96%{transform:rotate(3deg) translateY(1px)}}'
+'@keyframes afcbF{0%,60%,100%{opacity:.3}30%{opacity:1}}';

/* ─────────────────────────── BUILD ─────────────────────────────────────── */
function build(){
  var st = el('style'); st.textContent = CSS + CINE_CSS; D.head.appendChild(st);

  var w = el('div', 'afcb');
  w.innerHTML =
    '<div class="afcb-tip" role="button" tabindex="0"><b>' + esc(CFG.name) + ' here</b>'
      + 'I am here to help if you need me. Tap any time.</div>'
  + '<div class="afcb-p" role="dialog" aria-label="Chat with ' + esc(CFG.name) + '">'
  +   '<div class="afcb-h"><span class="av">' + man() + '</span>'
  +     '<span><b>' + esc(CFG.name) + '</b><i><u></u>'
  +       '<span class="afcb-cred">' + esc(CREDS[0]) + '</span></i></span>'
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
  + '<button class="afcb-dismiss" type="button" aria-label="Dismiss ' + esc(CFG.name) + '">&times;</button>'
  + '<button class="afcb-btn" type="button" aria-label="Open chat with ' + esc(CFG.name) + '">'
  +   man() + '<span class="afcb-dot">1</span></button>';
  D.body.appendChild(w);

  var panel = w.querySelector('.afcb-p'),
      msgs  = w.querySelector('.afcb-m'),
      qrow  = w.querySelector('.afcb-q'),
      form  = w.querySelector('.afcb-f'),
      input = w.querySelector('.afcb-in input'),
      send  = w.querySelector('.afcb-in button'),
      btn   = w.querySelector('.afcb-btn'),
      dismissBtn = w.querySelector('.afcb-dismiss'),
      tip   = w.querySelector('.afcb-tip'),
      dot   = w.querySelector('.afcb-dot'),
      cred  = w.querySelector('.afcb-cred'),
      opened = false, busy = false, touched = false, loadedAt = Date.now(),
      cine = Cine(), animating = false, dismissed = false;

  /* all four faces preloaded, so swapping one in never blinks a gap */
  (function preload(){
    var k; for (k in MOODS){ if (Object.prototype.hasOwnProperty.call(MOODS, k)){
      try { var i = new W.Image(); i.src = MOODS[k]; } catch(e){} } }
  })();

  /* the credential line under his name, one at a time, slow cross-fade */
  if (cred && !reduce){
    var ci = 0;
    setInterval(function(){
      if (!panel.classList.contains('on')) return;
      cred.classList.add('fade');
      setTimeout(function(){
        ci = (ci + 1) % CREDS.length;
        cred.textContent = CREDS[ci];
        cred.classList.remove('fade');
      }, 600);
    }, 4200);
  }

  function flag(k, v){
    try { if (v !== undefined) sessionStorage.setItem(k, v); return sessionStorage.getItem(k); }
    catch(e){ return null; }
  }

  D.addEventListener('keydown', function(){ touched = true; }, {once:true});
  D.addEventListener('pointerdown', function(){ touched = true; }, {once:true});

  function scroll(){ msgs.scrollTop = msgs.scrollHeight; }
  function bubble(text, who){
    var d = el('div', 'afcb-r ' + who), str = String(text),
        re = /https?:\/\/[^\s)]+/g, m, last = 0, a;
    while ((m = re.exec(str)) !== null){
      if (m.index > last) d.appendChild(D.createTextNode(str.slice(last, m.index)));
      a = el('a'); a.href = m[0]; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = m[0].replace(/^https?:\/\//, '').replace(/\/$/, '');
      d.appendChild(a); last = m.index + m[0].length;
    }
    d.appendChild(D.createTextNode(str.slice(last)));
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
  var sent = 0;
  function lead(d){
    /* three layers before anything leaves the page: a time trap, an
       interaction gate, and a per-visit send cap. The form adds a honeypot
       on top of this, and the endpoint is assembled at call time so it is
       never sitting in the source as plain text. */
    if (Date.now() - loadedAt < 4000){
      say('Give that one more second and try again — just making sure you are a person.');
      return;
    }
    if (!touched){
      say('Tap or type something first and I will send it through.');
      return;
    }
    if (sent >= 3){
      say('That is three already from this page, so I am going to stop before it looks like spam on our end. Call ' + CFG.telView + ' and someone will pick up.');
      return;
    }
    sent++;
    var data = {
      Name: d.Name || '', Phone: d.Phone || '', Company: d.Company || '',
      Message: d.Message || '', BestTime: d.Best || 'not stated',
      Trade: S.trade || 'not stated',
      Numbers: S.ticket ? ('job ' + money(S.ticket) + ', margin ' + S.margin + '%, close ' + S.close + '%') : 'not run',
      Source: 'AFC chat — ' + CFG.name, PageURL: W.location.href,
      _subject: 'AFC chat lead — ' + CFG.name, _template: 'table', _captcha: 'false',
      _honey: '', Elapsed: Math.round((Date.now() - loadedAt) / 1000) + 's on page'
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
      var hello = el('div', 'afcb-hello', man());
      msgs.appendChild(hello);
      say('Howdy. I am ' + CFG.name + ' — I founded this place, and that is my actual face on a tape measure in a hard hat with a pencil behind one ear, which is an odd career, but the numbers work out.\n\nI answer contractor marketing questions, run your break-even cost per lead, and never once take a lunch break. What are you working on?',
        function(){ chips(['Run my numbers','What do you cost?','My phone is not ringing','Tell me a joke']); });
    }
    setTimeout(function(){ if (W.innerWidth > 560) input.focus(); }, 260);
    scroll();
  }

  /* Closing the panel just closes the panel. */
  function close(){
    panel.classList.remove('on'); w.classList.remove('open');
    dismissed = true;
    tip.classList.remove('on');
  }

  /* The X beside him sends him away properly: he opens a portal, flips
     through it, and is gone for the rest of this page. No reappearing on
     its own, no nudge. Loading another page brings him back, and they can
     dismiss him there too. */
  var banished = false;
  function banish(){
    if (banished) return;
    banished = true;
    close();
    w.style.transition = 'opacity .2s, transform .2s';
    w.style.opacity = '0'; w.style.transform = 'translateY(10px) scale(.9)';
    w.style.pointerEvents = 'none';
    setTimeout(function(){ if (w.parentNode) w.parentNode.removeChild(w); }, 220);
    if (!cine){ return; }
    if (cine.kill) cine.kill();
    animating = true;
    cine.exit(function(){
      animating = false;
      if (cine.stage && cine.stage.parentNode) cine.stage.parentNode.removeChild(cine.stage);
    });
  }

  btn.addEventListener('click', function(){ panel.classList.contains('on') ? close() : open(); });
  w.querySelector('.afcb-x').addEventListener('click', close);
  dismissBtn.addEventListener('click', function(e){ e.stopPropagation(); banish(); });
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

  /* the two buttons in his speech bubble */
  if (cine){
    cine.onHelp = function(){ if (cine.kill) cine.kill(); open(); };
    cine.onForm = function(){
      if (cine.kill) cine.kill();
      open();
      setTimeout(function(){
        say('Easiest way to get a human on it. Name, your website and a number, and somebody reaches out — no phone tree, no drip sequence.',
          function(){ api.form(); });
      }, 320);
    };
  }

  /* a small nudge above him once he has landed in the corner */
  function nudge(ms){
    setTimeout(function(){
      if (banished || dismissed || opened || panel.classList.contains('on')) return;
      tip.classList.add('on');
      setTimeout(function(){ tip.classList.remove('on'); }, 11000);
    }, ms);
  }

  /* arrival: lightning, fireworks, a saucer that sets the truck down, mud,
     then he climbs out and walks to the corner */
  if (cine && !(CFG.arriveOnce && flag('afcRivitArrived') === '1') && flag('afcRivitClosed') !== '1'){
    flag('afcRivitArrived', '1');
    animating = true;
    btn.style.opacity = '0'; btn.style.transform = 'scale(.3)'; btn.style.pointerEvents = 'none';
    cine.arrive(function(){
      btn.style.transition = 'opacity .55s cubic-bezier(.2,1,.3,1),transform .55s cubic-bezier(.2,1,.3,1)';
      btn.style.opacity = '1'; btn.style.transform = 'none'; btn.style.pointerEvents = '';
      animating = false;
      nudge(1800);
    });
  } else {
    nudge(4000);
  }

  /* one gentle nudge, once per session, never after he has been closed */
  if (!reduce){
    setTimeout(function(){
      if (banished || dismissed || opened || flag('afcRivitNudged') === '1') return;
      if (panel.classList.contains('on')) return;
      flag('afcRivitNudged', '1');
      tip.classList.add('on');
      setTimeout(function(){ tip.classList.remove('on'); }, 12000);
    }, CFG.nudgeAt);
  }

  W.afcBot = {
    open: open, close: close, ask: submitText, state: S, face: setFace,
    replay: function(){
      if (!cine || animating) return;
      animating = true; panel.classList.remove('on'); w.classList.remove('open');
      btn.style.transition = 'opacity .3s'; btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
      cine.arrive(function(){
        btn.style.transition = 'opacity .55s'; btn.style.opacity = ''; btn.style.pointerEvents = '';
        animating = false;
      });
    },
    portal: function(){ banish(); },
    reset: function(){
      try { sessionStorage.removeItem('afcRivitArrived'); sessionStorage.removeItem('afcRivitClosed');
            sessionStorage.removeItem('afcRivitNudged'); } catch(e){}
    }
  };
}

if (!HAS_DOM){
  if (typeof module !== 'undefined' && module.exports){
    module.exports = { KB:KB, S:S, norm:norm, match:match, nums:nums, respond:respond,
                       fill:fill, A2:A2, L2:L2, byId:byId, CFG:CFG, CREDS:CREDS,
                       MOODS:MOODS, MOOD_OF:MOOD_OF, setFace:setFace, QUOTES:QUOTES, JOKES:JOKES,
                       FULL:FULL, man:man, TRUCK:TRUCK, UFO:UFO, BEAM:BEAM,
                       PORTAL:PORTAL, DISC:DISC, mud:mud, CLOUD:CLOUD,
                       boltSVG:boltSVG, boltPath:boltPath,
                       CSS:CSS, CINE_CSS:CINE_CSS };
  }
  return;
}
if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', build);
else build();

})();
