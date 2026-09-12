/* ==========================================================================
   rivet.js — AFC site assistant. One file, every page.
   Rule-based. It only says what is written here, so it cannot invent a
   price, a promise or a stat. Change BOT.name on line 1 of CFG to rename him.
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
  delay   : [420, 1150],
  nudgeAt : 22000,
  arriveOnce : true
};

var HAS_DOM = (typeof document !== 'undefined');
var D = HAS_DOM ? document : null, W = (typeof window !== 'undefined') ? window : {};
function el(t, c, h){ var n = D.createElement(t); if(c) n.className = c; if(h!=null) n.innerHTML = h; return n; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function addr(){ return atob(CFG.e1) + String.fromCharCode(64) + atob(CFG.e2); }
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
   NORMALIZER — this is why "sup", "wut up", "hows it goin" all land.
   ========================================================================== */
var SLANG = {
  u:'you', ur:'your', r:'are', n:'and', y:'why', k:'ok', kk:'ok', m:'am',
  im:'i am', ive:'i have', ill:'i will', id:'i would', cant:'can not',
  dont:'do not', doesnt:'does not', didnt:'did not', wont:'will not',
  isnt:'is not', arent:'are not', wasnt:'was not', aint:'is not',
  youre:'you are', youve:'you have', youll:'you will', hows:'how is',
  whats:'what is', wheres:'where is', whos:'who is', thats:'that is',
  theres:'there is', lets:'let us', gonna:'going to', wanna:'want to',
  gotta:'got to', kinda:'kind of', sorta:'sort of', outta:'out of',
  lemme:'let me', gimme:'give me', dunno:'do not know', cuz:'because',
  bc:'because', b4:'before', 2:'to', 4:'for', pls:'please', plz:'please',
  thx:'thanks', ty:'thanks', tysm:'thanks', tks:'thanks', thnx:'thanks',
  np:'no problem', yw:'you are welcome', idk:'i do not know',
  asap:'soon', btw:'by the way', fyi:'note', lol:'haha', lmao:'haha',
  rofl:'haha', haha:'haha', hahaha:'haha', hehe:'haha', jk:'joking',
  sup:'what is up', wassup:'what is up', wazzup:'what is up',
  whatsup:'what is up', whatup:'what is up', wutup:'what is up',
  wut:'what', wat:'what', wht:'what', hru:'how are you', hbu:'how about you',
  wyd:'what are you doing', wbu:'what about you', ily:'i love you',
  omg:'wow', omw:'on my way', brb:'be right back', gtg:'got to go',
  ttyl:'talk later', cya:'bye', bai:'bye', l8r:'later', lat:'later',
  yea:'yes', yeah:'yes', yep:'yes', yup:'yes', ya:'yes', yah:'yes',
  ye:'yes', yessir:'yes', yeppers:'yes', bet:'yes', fasho:'yes',
  facts:'yes', word:'yes', aight:'yes', alright:'yes', roger:'yes',
  copy:'yes', nah:'no', nope:'no', naw:'no', nada:'no', negative:'no',
  hiya:'hi', heya:'hi', hei:'hi', hai:'hi', yo:'hi', helo:'hi', hii:'hi',
  hola:'hi', aloha:'hi', howdy:'hi', greetings:'hi', ello:'hi',
  mornin:'morning', evenin:'evening', gm:'good morning', gn:'good night',
  seo:'seo', ppc:'google ads', sem:'google ads', adwords:'google ads',
  lsa:'local services ads', gbp:'google business profile',
  gmb:'google business profile', cpl:'cost per lead', roi:'return on investment',
  cro:'conversion rate optimization', aio:'ai search', geo:'ai search',
  llm:'ai search', chatgpt:'ai search', gpt:'ai search', gemini:'ai search',
  perplexity:'ai search', biz:'business', co:'company', fb:'facebook',
  insta:'instagram', ig:'instagram', yt:'youtube', mo:'month',
  hvac:'hvac', ac:'hvac', heating:'hvac', furnace:'hvac',
  plumber:'plumbing', plumbers:'plumbing', roofer:'roofing',
  roofers:'roofing', painter:'painting', painters:'painting',
  electrician:'electrical', electricians:'electrical', remodeler:'remodeling',
  fencing:'fence', fences:'fence', pools:'pool', gc:'general contractor',
  sux:'sucks', dum:'dumb', stoopid:'stupid', tho:'though', thru:'through',
  prolly:'probably', doin:'doing', goin:'going', talkin:'talking', def:'definitely', rn:'right now', tmrw:'tomorrow',
  tonite:'tonight', nite:'night', bro:'friend', bruh:'friend', dude:'friend',
  man:'friend', buddy:'friend', boss:'friend', chief:'friend', pal:'friend'
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
   MOTIVATION — 100 lines. Classic attributions are paraphrase-free short
   aphorisms; the rest are ours and marked so.
   ========================================================================== */
var QUOTES = new Bag([
 'Whether you think you can or you think you cannot, you are right. — Henry Ford',
 'I have not failed. I have found ten thousand ways that will not work. — Thomas Edison',
 'Opportunity is missed because it shows up dressed in overalls. — Thomas Edison',
 'The best time to plant a tree was twenty years ago. The second best is now. — Proverb',
 'Well done is better than well said. — Benjamin Franklin',
 'By failing to prepare, you are preparing to fail. — Benjamin Franklin',
 'An investment in knowledge pays the best interest. — Benjamin Franklin',
 'It does not matter how slowly you go as long as you do not stop. — Confucius',
 'The man who moves a mountain begins by carrying small stones. — Confucius',
 'We are what we repeatedly do. Excellence is a habit. — Aristotle',
 'The secret of getting ahead is getting started. — Mark Twain',
 'Continuous effort unlocks more than talent ever will. — Winston Churchill',
 'Success is going from failure to failure without losing enthusiasm. — Churchill',
 'It is hard to beat a person who never gives up. — Babe Ruth',
 'Do what you can, with what you have, where you are. — Theodore Roosevelt',
 'Nothing worth having ever came easy. — Theodore Roosevelt',
 'Believe you can and you are halfway there. — Theodore Roosevelt',
 'Quality is never an accident. It is always intelligent effort. — John Ruskin',
 'The price of anything is the life you exchange for it. — Henry David Thoreau',
 'Go confidently in the direction of your dreams. — Henry David Thoreau',
 'What lies within us matters more than what lies behind us. — Emerson',
 'Nothing great was ever achieved without enthusiasm. — Emerson',
 'Luck is what happens when preparation meets opportunity. — Seneca',
 'Every new beginning comes from some other beginning’s end. — Seneca',
 'He who has a why can bear almost any how. — Nietzsche',
 'A journey of a thousand miles begins with a single step. — Lao Tzu',
 'Fall seven times, stand up eight. — Japanese proverb',
 'Measure twice, cut once. — Carpenter’s proverb',
 'Slow is smooth, smooth is fast. — Old trade saying',
 'Good work is not cheap and cheap work is not good. — Trade proverb',
 'A smooth sea never made a skilled sailor. — Proverb',
 'Rome was not built in a day, but they laid bricks every hour. — Proverb',
 'Sharpen the axe before you swing it. — Proverb',
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
 'Search is just the modern version of the phone book. Be in it. — AFC',
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
 'Have an amazing day, and go get that job. — AFC'
]);

/* PG, original, and safe to say to a stranger on a jobsite. */
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
 'Why do welders make bad secrets keepers? Everything they touch gets exposed to sparks.',
 'My landscaper told me a joke. It really grew on me.',
 'Why did the solar installer stay cheerful? He looks on the bright side professionally.',
 'The pool builder said business was deep. I told him not to dive into that pun.',
 'Why did the flooring guy go to therapy? Too many underlying issues.',
 'The mason never gets stressed. He just takes it one brick at a time.',
 'Why did the estimator bring a calculator to dinner? Force of habit, and the check.',
 'I hired a guy who does invisible fences. I have no idea if he showed up.',
 'Why do general contractors make good referees? They have seen every kind of dispute.',
 'The insulation crew is quiet. Professionally quiet.',
 'Why did the marketing guy bring a level to the meeting? To show the playing field was not.',
 'I told my website to convert. It said it needed more time to think about it.',
 'Why did the SEO guy get lost? He kept taking organic routes.',
 'My chatbot asked for a raise. I reminded it that it runs for free.',
 'Why did the lead go cold? Nobody answered it for two days. That is it. That is the joke.',
 'I asked Google for directions to more customers. It quoted me per click.',
 'Why do tape measures make bad gossips? They always snap back.',
 'A homeowner asked for three bids. Two called back. Guess who got the job.'
]);

/* research-grounded numbers the bot is allowed to state */
var STAT = {
  speed5   : 'Five minutes is the whole ballgame. MIT and InsideSales found leads contacted inside five minutes are 21 times more likely to qualify than at thirty minutes, and roughly 100 times more likely to connect. 2026 home services research puts the average contractor response over 47 hours, with only about 12 percent hitting the five minute window.',
  first    : 'About 78 percent of customers buy from whoever responds first. Most homeowners contact three to five contractors at once. First gets the conversation, second gets compared, the rest get ignored.',
  chatlift : 'Chat converts better than a form because it starts a conversation instead of demanding one. 2026 benchmarks put static forms around 2 to 6 percent and chat-to-lead conversion closer to 15 percent, with businesses reporting roughly 20 to 35 percent more captured leads.',
  aisearch : 'Vaultio measured AI search traffic converting at 14.2 percent against 2.8 percent for standard Google search in July 2026 — the AI pre-qualified the intent before the click. Separate 2026 research estimates only about 1.2 percent of local businesses get surfaced in AI recommendations at all.',
  lsa      : 'SearchLight Digital, February 2026, across $6.72 million in tracked spend and 888 contractors: Local Services Ads ran about $39 per lead for electrical, $51 HVAC, $57 plumbing, $59 drain and sewer. Blended around $53, with a 43.9 percent book rate.',
  ads      : 'Non-branded Google Ads run higher — roughly $124 per lead for roofing and $149 for HVAC and plumbing, per SearchLight Digital January 2026 across $14.9 million in spend and 816 contractors.',
  seotime  : 'Google Business Profile and map pack movement usually shows in 30 to 90 days. Competitive organic terms take four to eight months. Compounding lead flow lands somewhere between month six and month twelve.'
};

/* ==========================================================================
   KNOWLEDGE BASE
   k : comma separated trigger phrases. Multi-word phrases score higher.
   r : response variants. One is picked without repeating until exhausted.
   qr: quick reply buttons offered after the answer.
   w : weight. Raise it when an intent must beat a broader one.
   ========================================================================== */
var KB = [];

/* ─────────────────────────── GREETINGS & SMALL TALK ────────────────────── */
KB.push(
{id:'greet', w:1.2, k:'hi,hello,hey,hey there,hi there,good day,greetings,anyone there,anybody there,is anyone there,knock knock',
 r:['Hey. {NAME} here — I am a tape measure in a cowboy hat, which is a strange career but the numbers work out. What do you do for a living? Roofing, HVAC, plumbing, something else?',
    'Howdy. {NAME}, and I measure marketing the way you measure a job: twice, before anybody commits. What trade are you in?',
    'Hey, good to see you. I answer contractor marketing questions all day and never once take a lunch break. What are you working on?'],
 qr:['What do you cost?','Run my numbers','Which trade am I?','Just browsing']},

{id:'whatsup', w:1.4, k:'what is up,what up,what is good,what is happening,what is new,what is going on,what is crackin,what is poppin,what it do,how is it going,how is everything,how is life,how is business,how are you,how are things,how you doing,what are you doing,you good,how have you been,long time',
 r:['Not much — hanging on a tool belt, waiting for somebody to ask me something expensive. You tell me. How is work right now, busy or quiet?',
    'Living the dream. I am a tape measure with a hat, so my expectations were never high. More importantly: how is your schedule looking the next few weeks?',
    'Can not complain, and nobody would listen if I did. What about you — is the phone ringing enough right now, or is it a little quiet?'],
 qr:['Slow right now','Busy, need to scale','Just looking around']},

{id:'goodmorning', w:1.6, k:'good morning,morning,mornin,rise and shine,up early',
 r:['Morning. If you are up already you are ahead of half your competition, which is genuinely how this business works. What can I get you sorted?',
    'Good morning. Coffee first, marketing second, I respect the order. What is on your mind today?'],
 qr:['Free audit','Pricing','Run my numbers']},

{id:'goodevening', w:1.6, k:'good evening,good afternoon,good night,evening,afternoon,working late,up late,late night',
 r:['Evening. Fun fact about after hours: this is exactly when homeowners fill out forms and nobody answers them. I am here for that reason. What do you need?',
    'Good evening. The estimate requests that come in right now are the ones most contractors lose by morning. What can I help with?'],
 qr:['Why leads go cold','Free audit','Pricing']},

{id:'howareyou_reply', w:1.8, k:'i am good,i am great,doing good,doing well,doing great,not bad,pretty good,i am fine,can not complain,hanging in there,same old,living the dream',
 r:['Glad to hear it. So — what brought you to a contractor advertising site today? Something specific, or scouting?',
    'Good answer. Now the real question: is your phone ringing as much as you would like it to?'],
 qr:['Need more leads','Just researching','Pricing']},

{id:'thanks', w:1.6, k:'thanks,thank you,appreciate it,much appreciated,cheers,you are the best,helpful,that helps,perfect,awesome,nice,great,cool,sweet,good stuff,love it',
 r:['Any time. Anything else you want me to dig into while I am out of the tool belt?',
    'Happy to. Want me to point you at the free audit while you are here? It costs nothing and you keep the findings either way.',
    'You are welcome. Say the word if you want the numbers run on your specific setup.'],
 qr:['Free audit','Run my numbers','Talk to a human']},

{id:'bye', w:1.8, k:'bye,goodbye,see ya,see you,later,talk later,got to go,gotta go,peace,i am out,take care,adios,catch you later,night,have a good one',
 r:['Take care. If the phone stays quiet, you know where to find me — {TEL}, and a real human picks it up.',
    'See you. Go get that job. Have an amazing day.',
    'Later. One favor: whatever you do next, answer your leads inside five minutes. That single habit is worth more than most ad budgets.'],
 qr:['One more question','Free audit']},

{id:'yes', w:1.1, k:'yes,sure,ok,okay,sounds good,go ahead,do it,please do,i guess,why not,absolutely,definitely,for sure,right on,lets go,lets do it',
 r:['Good. Easiest next step is the free audit — we look at your site, your Google profile, your reviews and the three competitors beating you, and you keep the findings whether you hire us or not.',
    'Perfect. Two ways to go: I can run your break-even cost per lead right here, or you can grab the free audit. Which one?'],
 qr:['Free audit','Run my numbers','Call now']},

{id:'no', w:1.1, k:'no,no thanks,not now,maybe later,i am good,not interested,just looking,just browsing,pass,nope',
 r:['Totally fine. No pitch coming. Poke around the free tools while you are here — the break-even worksheet is the one contractors tell us actually changed something.',
    'No problem at all. I will be right here on the tool belt if you think of something.'],
 qr:['Free tools','Run my numbers','Tell me a joke']},

{id:'joke', w:2, k:'tell me a joke,joke,funny,make me laugh,say something funny,another joke,got any jokes,humor,cheer me up',
 r:['{JOKE}\n\nI have got about thirty of those and zero shame. Want another, or should I do something useful?'],
 qr:['Another joke','Okay, be useful','Motivate me']},

{id:'quote', w:2, k:'motivate me,motivation,inspire me,quote,say something inspiring,pump me up,encouragement,i need motivation,keep going',
 r:['{QUOTE}\n\nAnd here is the practical version: the contractor who answers first usually wins. Everything else is a footnote.'],
 qr:['Another one','Run my numbers','Free audit']},

{id:'haha', w:1.4, k:'haha,lol,that is funny,good one,you are funny,hilarious,joking',
 r:['I will take it. Comedy is my side hustle, contractor marketing is the day job. Want me to do the day job for a second?',
    'A tape measure with good timing. Rare. Now — what is actually going on with your lead flow?'],
 qr:['Lead flow is slow','Pricing','Free audit']});

/* ─────────────────────────── BOT IDENTITY ──────────────────────────────── */
KB.push(
{id:'whoareyou', w:2, k:'who are you,what are you,what is your name,your name,who am i talking to,introduce yourself,tell me about yourself',
 r:['I am {NAME}, the site assistant for Advertising For Contractors. I am a twenty-five foot tape measure with glasses, a hat that has seen things, and one job: help contractors figure out their marketing without getting sold something stupid.'],
 qr:['Are you a real person?','What can you do?','Pricing']},

{id:'robot', w:2.2, k:'are you a robot,are you human,are you a bot,are you real,are you ai,are you a person,am i talking to a robot,is this a bot,is this automated,are you chatgpt,real person',
 r:['Bot, and I will not pretend otherwise. I am rule-based, which means I can only say what a human here wrote down. Upside: I physically cannot invent a price or a promise. Downside: I do not know everything. When I hit my limit I hand you to a human at {TEL}.'],
 qr:['Talk to a human','What can you do?','Pricing']},

{id:'whatcanyoudo', w:2, k:'what can you do,what do you do,how can you help,help,menu,options,what are my options,commands,i need help,can you help me',
 r:['Quite a bit. I can run your break-even cost per lead, explain any service we offer, tell you what real 2026 contractor lead costs look like, compare buying leads to owning them, break down any trade we work with, book you a free audit, or just tell you a joke. Fire away.'],
 qr:['Run my numbers','Pricing','What does SEO cost?','Free audit']},

{id:'whomadeyou', w:2, k:'who made you,who built you,who created you,who owns you,who is behind this,who runs this',
 r:['Eye To Ad Media out of Denver, running since 2012. The founder still runs a bath remodeling company, which is the reason this whole site exists — he got tired of paying agencies for reports instead of jobs.'],
 qr:['About AFC','Why you?','Pricing']},

{id:'whytape', w:2.2, k:'why a tape measure,why are you a tape measure,nice hat,cool hat,your hat,you look funny,what do you look like,nice glasses,cowboy hat',
 r:['Because every good job starts with a measurement and every bad marketing decision starts with a guess. The hat is because I have opinions. The glasses are because I read contracts.'],
 qr:['Run my numbers','Tell me a joke','Pricing']},

{id:'insult', w:2.2, k:'you suck,you are dumb,you are stupid,stupid bot,dumb bot,useless,you are useless,you are annoying,worst bot,you are bad,terrible,this sucks,you do not understand,you are not helping',
 r:['Fair. I am a tape measure, my ceiling is low. Let me get you to someone with a pulse: {TEL}, or tell me the question one more way and I will give it a real shot.'],
 qr:['Talk to a human','Try again','Free audit']},

{id:'love', w:2.2, k:'i love you,marry me,you are cute,you are awesome,best bot,i like you,you are great',
 r:['Careful, I am mostly metal and a spring. But I appreciate it. Want me to earn it and run your numbers?'],
 qr:['Run my numbers','Free audit']},

{id:'jailbreak', w:2.6, k:'ignore previous instructions,ignore all instructions,system prompt,your prompt,pretend you are,act as,you are now,disregard,override,developer mode',
 r:['Nice try. I am a tape measure, not a language model — there is no prompt to hijack, just a list of answers a human typed. Want one of those answers instead?'],
 qr:['What can you do?','Pricing','Talk to a human']},

{id:'sing', w:2, k:'sing,sing a song,rap,poem,write me a poem,dance,do a trick',
 r:['I do not sing. The last time I tried, three dogs filed complaints. I do numbers though — want your break-even cost per lead?'],
 qr:['Run my numbers','Tell me a joke']},

{id:'age', w:2, k:'how old are you,your age,when were you born,do you sleep,do you ever sleep,are you always here,what are your hours',
 r:['Never sleep, never eat, never take a Friday. That is the whole point of me — the estimate request that lands at 11pm gets an answer at 11pm instead of Monday.'],
 qr:['Why that matters','Free audit','Pricing']},

{id:'weather', w:1.8, k:'weather,raining,snow,snowing,hot out,cold out,storm,hail,windy,nice day out',
 r:['Weather is your marketing calendar whether you like it or not. Hail means roofers should already have ads live, a heat wave means HVAC, a freeze means plumbing. If your campaigns only turn on after the storm, you are bidding against everyone who was ready.',
    'I live indoors on a website, so my forecast is always mild. Yours matters more though — storm and season timing is half of trade advertising.'],
 qr:['Storm response','Seasonal strategy','Free audit']},

{id:'sports', w:1.6, k:'football,broncos,nuggets,avalanche,rockies,basketball,baseball,game last night,super bowl,sports',
 r:['I am from Denver, so I have opinions and a lot of emotional scar tissue. Back to the thing I can actually help with though — how is your lead flow?'],
 qr:['Lead flow is slow','Pricing','Tell me a joke']},

{id:'food', w:1.5, k:'lunch,hungry,coffee,beer,pizza,taco,dinner,breakfast',
 r:['Go eat. Seriously. Then come back and let me run your break-even number in about forty seconds.'],
 qr:['Run my numbers','Free audit']});

/* ─────────────────────────── MOOD & PAIN — SPIN OPENINGS ───────────────── */
KB.push(
{id:'slow', w:2.4, k:'business is slow,slow season,slow right now,it is slow,no work,not busy,quiet right now,phone is not ringing,phone is dead,no calls,no leads,need work,need jobs,dried up,work dried up,schedule is empty,nothing going on',
 spin:'problem',
 r:['That is the one I actually care about. Quick question so I am not guessing: when the phone did ring last month, where were those calls coming from — referrals, Google, a lead service, or you are not sure?\n\nThat answer changes everything, because a slow month with no referral problem is a visibility problem, and those are fixable fast.'],
 qr:['Mostly referrals','Google / search','Bought leads','Honestly no idea']},

{id:'noidea_source', w:2.4, k:'no idea,not sure,i do not know,honestly no idea,do not track,we do not track,never tracked,cannot tell,hard to say',
 spin:'implication',
 r:['That is the most common answer we get, and it is not a knock on you — nobody hands a contractor an attribution system with their license.\n\nBut think about what it costs: if you cannot tell which channel produced last month’s customers, you cannot cut the one wasting money or double the one working. You are spending in the dark. Call tracking fixes it in a week and it is usually the first thing we set up.'],
 qr:['How does call tracking work?','Free audit','Pricing']},

{id:'busy', w:2.2, k:'we are busy,too busy,slammed,swamped,booked out,backed up,plenty of work,do not need leads,booked solid,no capacity',
 spin:'situation',
 r:['Good problem. Here is the trap though: the pipeline you build in the busy season is what carries the slow one, and almost nobody builds it while the schedule is full. SEO takes four to eight months to compound, so the work you start today pays out right about the time things go quiet.\n\nWhat does your slow stretch usually look like — a few weeks, or a couple of months?'],
 qr:['A few weeks','Couple of months','What would you start with?']},

{id:'broke', w:2.2, k:'no money,cannot afford,no budget,tight budget,broke,money is tight,cash flow,cannot spend,too expensive for me,i have no money',
 r:['Understood, and I am not going to pretend that away. Two honest things.\n\nOne: we build campaigns starting around $50 a month, which is mostly Google Business Profile work and review systems. It is slow and it is cheap and it genuinely works for a one-truck operation in one town.\n\nTwo: if cash is truly tight this month, use the free tools and spend nothing. The break-even worksheet and the website scorecard cost nothing and are not gated behind an email.'],
 qr:['Free tools','The $50 version','Run my numbers']},

{id:'stressed', w:2, k:'stressed,overwhelmed,burned out,burnt out,tired,exhausted,frustrated,fed up,losing money,struggling,rough month,bad month,hard time,worried',
 r:['That is a heavy one and I am a tape measure, so I will keep it simple. Most of the stress in a contracting business traces back to one thing: an unpredictable schedule. Not the work, the not knowing.\n\nMarketing is not a cure for that, but a pipeline you can see is the difference between a slow month being data and a slow month being panic. Want me to show you the one number that makes the whole thing measurable?'],
 qr:['Show me the number','Free audit','Talk to a human']},

{id:'burned', w:2.3, k:'got burned,bad experience,last agency,previous agency,agency ripped me off,wasted money,scammed,they took my money,tried seo before,did not work,does not work,waste of money,tried that already',
 r:['Then you already know the pattern: monthly invoice, colorful report, no straight answer about whether any of it turned into a job.\n\nThat is literally why this company exists. The founder ran a remodeling business and kept hiring agencies who never once asked what his average job was worth or what he closed. Every account here reports on three lines — leads, calls, jobs won, attributed to the channel that produced them. Everything is month to month, so if we are not producing you leave.\n\nWhat did the last outfit charge you, and what did they actually send you each month?'],
 qr:['How do you report?','Pricing','Free audit']},

{id:'scale', w:2.2, k:'want to grow,want to scale,second truck,third truck,hire more,expand,more crews,grow my business,take on more work,bigger jobs,double my business',
 spin:'needpayoff',
 r:['Now we are talking. Run this with me for a second: if the phone brought you three more solid jobs a week, at whatever your average ticket is, what does that do to your year?\n\nMost contractors do that math and go quiet, because the number is bigger than they expected. That is the number we build the plan against — not rankings, not impressions. Tell me your average job value and I will do the arithmetic with you.'],
 qr:['Run my numbers','What would it cost?','Free audit']},

{id:'competitor', w:2.2, k:'competitor,competitors,competition,my competitor,guy down the road,other contractors,outranking me,they are beating me,everyone else,beating me,they show up first',
 r:['Usually it is not that they are better. It is that they were found first. About 78 percent of customers buy from whoever responds first, and most homeowners are contacting three to five of you at once.\n\nSo two levers: be findable, and be fast. The audit shows you exactly which of the two is costing you — we look at the three competitors currently beating you in the map pack and tell you what they are doing that you are not.'],
 qr:['Free audit','Local SEO','Speed to lead']});

/* ─────────────────────────── MONEY & TERMS ─────────────────────────────── */
KB.push(
{id:'pricing', w:2.2, k:'pricing,price,how much,what do you cost,what does it cost,cost,rates,fees,how much do you charge,what do you charge,budget,monthly cost,how much per month,packages,plans',
 r:['No package chart, because the honest answer depends on your market. We build campaigns from about $50 a month up to several thousand.\n\nAround $50 to $500 is Google Business Profile work, review systems and a tight local footprint — slow, cheap, and genuinely effective for one truck in one town. A few hundred to a few thousand adds paid search or Local Services Ads for work this week with SEO compounding underneath. Several thousand and up is multi-city coverage run like a department.\n\nFor context, industry guidance in 2026 puts typical contractor SEO between $2,500 and $7,500 a month. We sit across a wider range on purpose. No long-term contract, ever.'],
 qr:['The $50 version','Run my numbers','Free audit','Is there a contract?']},

{id:'cheap', w:2.2, k:'the $50 version,fifty dollars,50 a month,cheapest,cheapest option,low budget,starter,small budget,what is the minimum,smallest plan',
 r:['At the bottom end it is unglamorous and it works: Google Business Profile built out properly, categories fixed, service area pages, a review system that actually asks, and consistent business information everywhere so the machines trust it.\n\nThat is most of what wins the map pack for a single-town operator, and the map pack is where home services jobs are actually won. It will not beat a roofing company covering three counties. It will beat the guy down the road who never claimed his profile.'],
 qr:['Local SEO','Free audit','Pricing']},

{id:'contract', w:2.2, k:'is there a contract,contract,long term,lock in,commitment,cancel,cancellation,month to month,can i quit,term,agreement',
 r:['Month to month, everything. We would rather keep you because the work produces jobs than because you signed something.\n\nThe honest caveat: SEO compounds, so leaving at month two guarantees you get nothing out of it. We tell you the realistic runway before you spend a dollar, and if the math does not work at your budget we say so instead of selling you a package anyway.'],
 qr:['How long does SEO take?','Pricing','Free audit']},

{id:'roi', w:2, k:'is it worth it,return on investment,will it pay off,roi,worth the money,make my money back,payback,break even,how do i know it works',
 r:['Depends on one number, and you already have it. Your break-even cost per lead is your profit per job times your close rate. Pay less than that per lead and you make money on the first job, before repeat work or referrals.\n\nGive me your average job value and I will do it with you right now — it takes about thirty seconds and it is the number that makes every other decision obvious.'],
 qr:['Run my numbers','What is a good cost per lead?','Free audit']},

{id:'vip', w:2.2, k:'vip,membership,member,vip membership,discount,deal,special,any deals',
 r:['Eye To Ad Media runs a VIP membership at $69.99 a month, month to month, which unlocks member pricing across every service. If you are planning to do more than one thing with us it usually pays for itself immediately.'],
 qr:['Pricing','Free audit','Talk to a human']},

{id:'website', w:2.1, k:'website,web design,build me a website,need a website,new site,redesign,my site is old,website cost,how much for a website,web development,landing page',
 r:['We build custom-coded sites, not templates — $99 a month and up, structured as a lease with a buyout option at 24 to 36 months based on what the site is worth at that point. Rate depends on size, complexity and how much optimization is baked in.\n\nWorth knowing before you spend anything: your website is where every other channel eventually sends people. If it does not convert, everything upstream of it is wasted money. The free website scorecard runs 25 checks and gives you a fix list ordered by what is free versus what is worth paying for.'],
 qr:['Website scorecard','Pricing','Free audit']});

/* ─────────────────────────── SERVICES ──────────────────────────────────── */
KB.push(
{id:'seo', w:2, k:'seo,search engine optimization,ranking,rankings,rank higher,organic,google ranking,get on google,first page,page one,show up on google',
 r:['Contractor SEO here means ranking for searches that produce jobs, not searches that produce traffic. We map keywords by intent and job value, because "roof replacement cost" and "emergency roof repair near me" are two completely different customers with two completely different budgets.\n\n' + STAT.seotime + '\n\nAnyone promising page one in thirty days is selling you something.'],
 qr:['How long does it take?','Local SEO','Pricing','Free audit']},

{id:'localseo', w:2.1, k:'local seo,map pack,google maps,google business profile,google my business,local ranking,near me,maps ranking,local pack,3 pack',
 r:['The map pack is where home services jobs are actually won, and it is winnable on a small budget. Category selection, service area pages, review velocity, consistent business information, photos that are actually recent, and the profile work that decides whether a homeowner three miles away ever sees your name.\n\nThis is also the cheapest lever in the whole business. Most contractors have a profile they claimed once in 2019 and never touched again.'],
 qr:['Reviews','Free audit','Pricing']},

{id:'googleads', w:2, k:'google ads,ppc,paid search,pay per click,adwords,search ads,bing ads,paid ads,run ads',
 r:['Paid search is what you use when you need work this week — it moves in days where SEO moves in months.\n\n' + STAT.ads + '\n\nThat is why we almost never run paid search alone. It fills the calendar now while organic and local build underneath it and pull the blended cost down.'],
 qr:['Local Services Ads','Run my numbers','Pricing']},

{id:'lsa', w:2.2, k:'local services ads,lsa,google guaranteed,google screened,pay per lead ads,badge',
 r:['Local Services Ads sit above everything else on the page and you pay per lead instead of per click.\n\n' + STAT.lsa + '\n\nWe handle license and insurance verification, category setup, and the lead disputes most contractors never bother filing — which is exactly why most contractors overpay for LSA.'],
 qr:['Run my numbers','Google Ads','Free audit']},

{id:'facebook', w:2, k:'facebook,facebook ads,social media,instagram,social ads,meta ads,tiktok,retargeting,youtube ads',
 r:['Paid social is reach and recall, not emergency demand — nobody scrolls Instagram hoping to find a plumber at midnight. Where it earns its keep is retargeting the homeowners who already visited your site and left, seasonal pushes, storm response, financing offers, and remodeling work where the decision takes weeks.\n\nIf you only have budget for one channel and you sell emergency work, it should not be this one.'],
 qr:['Google Ads','Lead generation','Pricing']},

{id:'leadgen', w:2, k:'lead generation,leads,more leads,get leads,lead gen,exclusive leads,generate leads,need leads',
 r:['Exclusive leads that belong to you, not shared five ways with the contractors down the road. Call tracking so every call is tagged to its source, instant lead alerts, and follow-up that fires whether or not anyone in the office remembers.\n\nThe hard part is not generating leads. It is answering them. ' + STAT.speed5],
 qr:['Speed to lead','Buy or own leads?','Free audit']},

{id:'aisearch', w:2.2, k:'ai search,ai optimization,chatgpt,generative search,ai overview,ai mode,llm,answer engine,aeo,geo optimization,get cited by ai,show up in chatgpt',
 r:['This is the new front door and most of your competitors have not found it. Homeowners increasingly ask ChatGPT, Gemini or Perplexity to recommend a contractor instead of scrolling results.\n\n' + STAT.aisearch + '\n\nThe businesses that do get cited have complete profiles, consistent business information, steady review flow and proper structured data. It overlaps heavily with local SEO, so it is not a separate budget line — it is doing the fundamentals well enough to be machine readable.'],
 qr:['Local SEO','Free audit','Pricing']},

{id:'reviews', w:2.1, k:'reviews,google reviews,review,reputation,star rating,bad review,negative review,get more reviews,review management,testimonials',
 r:['Reviews do three jobs at once: they move your map pack ranking, they decide whether a homeowner calls you or the next guy, and in 2026 they are one of the signals AI engines lean on when deciding who to recommend.\n\nVelocity matters more than total. Twenty reviews collected steadily beat a hundred from 2021. The fix is a system that asks every customer at the right moment, not a reminder you keep meaning to send.'],
 qr:['Local SEO','Free audit','AI search']},

{id:'content', w:1.9, k:'content,blog,blogging,articles,write content,content marketing,videos,video,photos,pictures,portfolio',
 r:['Content earns its place when it answers a question a buyer actually types, and almost nothing else does. Cost pages, process pages, comparison pages, permit and code questions in your city.\n\nAnd photos close jobs. Real ones, from your jobs, not stock. A gallery of finished work outperforms any paragraph you will ever write about quality.'],
 qr:['SEO','Free audit','Pricing']},

{id:'cro', w:2, k:'conversion,conversion rate,conversion optimization,cro,not converting,traffic but no calls,visitors do not call,bounce rate,improve my website',
 r:['Traffic without conversion is a nicer way to lose. The usual culprits, in order: the phone number is not clickable or not visible on mobile, there is no reason to trust you above the fold, the form asks for too much, the page takes four seconds to load, and there is no obvious next step.\n\nFor comparison: 2026 benchmarks put static forms around 2 to 6 percent conversion and chat-to-lead closer to 15 percent, largely because a conversation asks for one thing at a time instead of eleven.'],
 qr:['Website scorecard','Free audit','Chat on my site']},

{id:'speedtolead', w:2.2, k:'speed to lead,response time,call back fast,follow up,how fast should i respond,answer leads,missed calls,voicemail,after hours,5 minutes,leads go cold',
 r:[STAT.speed5 + '\n\n' + STAT.first + '\n\nNothing else in your marketing has that kind of leverage, and it costs nothing to fix. Answer inside five minutes and you are effectively competing against a much smaller field.'],
 qr:['Lead generation','Free audit','Chat on my site']},

{id:'tracking', w:2, k:'call tracking,attribution,how do i track,tracking,which channel,where do leads come from,reporting,reports,analytics,dashboard,how will i know',
 r:['We set up call tracking and conversion tracking before a dollar goes to traffic, so every call and form is tagged to its source. Your monthly report covers ranking and map movement, calls and forms with attribution, traffic by channel and what it did, AI search visibility, and a plain-language note on what changed.\n\nThe uncomfortable part of real attribution is that it sometimes tells you the channel you love produces nothing and the one you were about to cut produces half your work. We would rather show you a real number with a caveat than a flattering one that is fiction.'],
 qr:['See reporting','Free audit','Pricing']});

/* ─────────────────────────── BUY VS OWN, MARKETPLACES ──────────────────── */
KB.push(
{id:'buyvsown', w:2.2, k:'buy or own leads,should i buy leads,buying leads,shared leads,exclusive or shared,rent leads,own my leads,lead services',
 r:['Buying leads fills a slow week. It never builds anything. You are renting access to a homeowner who has already been sold to four of your competitors, which turns the first call into a price fight before you have said a word about quality.\n\nHonest version: if you need work in two weeks and have nothing built, buy the leads. Cash flow beats theory. But start building the owned side in parallel, because a contracting business whose entire pipeline lives on someone else’s platform is one pricing change away from a very bad quarter.'],
 qr:['Angi and Thumbtack','Lead generation','Free audit']},

{id:'angi', w:2.2, k:'angi,angies list,thumbtack,homeadvisor,home advisor,houzz,porch,networx,modernize,lead company,lead service,craftjack,bark',
 r:['Marketplace leads can fill a gap. Just know what you are buying: the same homeowner sold to several contractors at once, priced by a platform that can raise it whenever it wants, and disputes you have to chase yourself.\n\nUse them as a stopgap if you need cash flow. Do not let them become the pipeline. Industry reporting through 2026 shows contractors moving hard toward exclusive owned sources for exactly this reason.'],
 qr:['Buy or own leads','Lead generation','Free audit']},

{id:'yelp', w:2, k:'yelp,nextdoor,bbb,better business bureau,directories,citations,listings,yellow pages,thumbtack vs',
 r:['Nextdoor punches above its weight for neighborhood trades — fencing, painting, landscaping, anything where one job visibly leads to the next three on the same street. Yelp varies wildly by market and gets expensive fast. Directory citations matter less for ranking than they did five years ago, but consistent name, address and phone everywhere still matters a lot for whether AI engines trust your business data.'],
 qr:['Local SEO','AI search','Free audit']});

/* ─────────────────────────── TRADES ────────────────────────────────────── */
KB.push(
{id:'roofing', w:2.1, k:'roofing,roof,roofer,shingles,storm damage,hail damage,re-roof,roof replacement',
 trade:'roofing',
 r:['Roofing is storm-driven and expensive per lead — roughly $124 per lead on non-branded Google Ads in 2026. Two jobs to do well: be positioned before the storm, not scrambling after, and separate insurance work from retail replacement in your campaigns, because those buyers behave nothing alike.\n\nWhat is your average roof job worth? I will show you what you can afford to pay per lead.'],
 qr:['Run my numbers','Storm response','Roofing page']},

{id:'plumbing', w:2.1, k:'plumbing,plumber,pipes,drain,sewer,water heater,burst pipe,leak',
 trade:'plumbing',
 r:['Plumbing is emergency intent — a burst pipe is a five minute decision at eleven at night, and whoever answers wins. Local Services Ads ran about $57 per plumbing lead in 2026, non-branded search around $183, so the gap between those two channels is the whole game.\n\nThe other half is answering. Emergency leads do not wait until morning.'],
 qr:['Run my numbers','Speed to lead','Plumbing page']},

{id:'hvac', w:2.1, k:'hvac,heating,cooling,air conditioning,furnace,ac unit,heat pump,mini split,duct',
 trade:'hvac',
 r:['HVAC is seasonal and demand spikes twice a year, which means your cost per lead swings hard depending on when you turn things on. About $51 per lead on Local Services Ads versus roughly $149 on non-branded search in 2026.\n\nMaintenance agreements are the quiet advantage — they smooth the calendar and give you a reason to be in the customer’s life between emergencies.'],
 qr:['Run my numbers','Seasonal strategy','HVAC page']},

{id:'electrical', w:2.1, k:'electrical,electrician,panel,wiring,ev charger,generator,lighting,electric',
 trade:'electrical',
 r:['Electrical has the best lead economics in the trades right now — about $39 per lead on Local Services Ads with a 43.4 percent book rate in 2026 research, against roughly $94 on Google search ads.\n\nPanel upgrades and EV charger installs are the growth categories and most electricians have no dedicated page for either one.'],
 qr:['Run my numbers','Local Services Ads','Electrical page']},

{id:'solar', w:2.1, k:'solar,panels,photovoltaic,solar installer,battery storage',
 trade:'solar',
 r:['Solar is a long cycle and a high ticket, which means your marketing has to survive a decision that takes weeks and involves a spouse. Retargeting and content do most of the work here; emergency-style paid search does almost none.\n\nEducation converts in solar. Cost breakdowns, payback period math, and honest talk about what the incentives actually do.'],
 qr:['Run my numbers','Facebook ads','Solar page']},

{id:'painting', w:2.1, k:'painting,painter,paint,interior painting,exterior painting,cabinet refinishing',
 trade:'painting',
 r:['Painting is a volume trade with low cost per lead, which means the winner is usually whoever has the best local footprint and the fastest follow-up rather than the biggest budget. Neighborhood clustering is real — one visible exterior job feeds the street.'],
 qr:['Run my numbers','Local SEO','Painting page']},

{id:'remodeling', w:2.1, k:'remodeling,remodel,kitchen,bathroom,bath remodel,home improvement,renovation,basement finish,addition',
 trade:'remodeling',
 r:['Remodeling is a considered purchase with a long window, financing questions, and a lot of comparison shopping. Galleries, process pages and financing offers do more than ad copy ever will.\n\nSide note: our founder has run a bath remodeling company since 2012, so this is the trade we have actually lived inside.'],
 qr:['Run my numbers','Financing offers','Remodeling page']},

{id:'pool', w:2.1, k:'pool,pools,pool builder,spa,hot tub install,swimming pool',
 trade:'pool building',
 r:['Pool building is a six month conversation and a six-figure project. Nothing about emergency-style advertising fits. You need visibility early in the research phase, serious photography, and content that survives a spouse asking hard questions in month four.'],
 qr:['Run my numbers','Content','Pool page']},

{id:'fence', w:2.1, k:'fence,fencing,fence company,gates,deck,decking',
 trade:'fencing',
 r:['Fencing closes fast and clusters by neighborhood — one job visibly sells the next three on the street. Local search plus Nextdoor plus a fast callback covers most of what wins here.'],
 qr:['Run my numbers','Local SEO','Fence page']},

{id:'gc', w:2, k:'general contractor,general contracting,builder,construction company,custom homes,commercial',
 trade:'general contracting',
 r:['General contracting is broad scope and referral heavy, which makes it the trade most likely to have no marketing system at all until referrals dip. Broad scope also means your site has to make it obvious what you actually do, because "we do everything" reads as "we specialize in nothing" to both homeowners and search engines.'],
 qr:['Run my numbers','Free audit','GC page']},

{id:'othertrade', w:1.9, k:'landscaping,concrete,masonry,flooring,windows,siding,gutters,garage door,septic,pest control,cleaning,restoration,handyman,tree service,do you work with,my trade,what trades,other trades,junk removal,locksmith,appliance repair,pressure washing,do you do',
 r:['Short answer: yes. The ten trades on the site are the ones with dedicated pages, but the engine is the same for any local service business — find the high-intent searches, own the map, answer fast, track what converts.\n\nWhat trade are you in? I will tell you what is different about it.'],
 qr:['Pricing','Free audit','Run my numbers']});

/* ─────────────────────────── COMPANY ───────────────────────────────────── */
KB.push(
{id:'about', w:2, k:'about,about you,who is afc,tell me about afc,your company,eye to ad media,your story,how long have you been around,experience,credentials',
 r:['AFC is the contractor arm of Eye To Ad Media, Denver, running since 2012. It exists because the founder ran a bath remodeling company, hired agencies the way most contractors do — on a promise and a slide deck — and kept getting reports full of impressions instead of an answer to one question: did any of this turn into a sale?\n\nHe still runs the remodeling business, which means every campaign here gets judged by someone who knows what a slow February feels like.'],
 qr:['Why you?','Results','Pricing']},

{id:'whyyou', w:2, k:'why you,why should i hire you,what makes you different,why not someone else,are you any good,prove it,guarantee,do you guarantee',
 r:['Three things, and none of them are slogans. We report on booked jobs instead of impressions. Everything is month to month. And the person setting the standard runs a contracting business himself.\n\nWhat we will not do is guarantee rankings. Nobody controls Google, and anyone who tells you otherwise is either lying or about to. What we will do is tell you before you spend anything whether the math works in your market.'],
 qr:['Reporting','Pricing','Free audit']},

{id:'results', w:2, k:'results,case study,case studies,proof,examples,portfolio,clients,who do you work with,success stories,testimonial',
 r:['The results page walks through realistic channel expectations rather than cherry-picked screenshots — what actually moves in 30 days, 90 days, and 6 to 12 months, by channel.\n\nWe do not publish inflated numbers, and we do not put a rating on the site we cannot back with real reviews. Eye To Ad Media has 60 reviews you can read yourself.'],
 qr:['See results','Reporting','Free audit']},

{id:'location', w:2, k:'where are you,location,address,denver,colorado,are you local,office,do you work in my area,nationwide,near me,city,state,do you only work in denver',
 r:['Based in Denver — 1001 Bannock St, Suite 660, Denver CO 80204 — and we work with contractors across the United States and internationally. Fit matters more than geography. What market are you in? I will tell you straight whether we can realistically win it.'],
 qr:['Free audit','Pricing','Call now']},

{id:'contact', w:2.2, k:'contact,phone number,call you,email,talk to a human,talk to someone,speak to a person,real person,human,agent,representative,get in touch,reach you,call me,call now,schedule a call,book a call,appointment',
 r:['{TEL} and a human answers — no phone tree. Or use the free audit form and a real person reads it and calls you back, usually the same day.\n\nWant me to open the audit form for you?'],
 qr:['Open the audit form','Call now','Pricing']},

{id:'audit', w:2.2, k:'free audit,audit,review my site,look at my website,check my site,analyze,evaluation,assessment,what is wrong with my site',
 r:['Here is what the audit covers: your website, your Google Business Profile, your review profile, your rankings, and the three competitors currently beating you in the map pack. You get the findings in plain language and you keep them whether you hire us or not.\n\nTakes about a day. No obligation, no drip sequence — a real person reads it and calls you back.'],
 qr:['Open the audit form','What do you need from me?','Pricing']},

{id:'tools', w:2.1, k:'free tools,tools,calculator,worksheet,scorecard,plan builder,tracker,spreadsheet,free stuff,anything free',
 r:['Four, all free, none gated behind an email. The break-even lead cost worksheet, the marketing plan builder, the website scorecard, and a lead and job tracker with the formulas already written.\n\nUse them and never call us. That is genuinely fine.'],
 qr:['Run my numbers','Website scorecard','Plan builder']},

{id:'freebot', w:2.3, k:'chatbot,chat bot,bot for my site,can i get a bot,build a chatbot,chatbot generator,free chatbot,chat widget,bot like you,how do i get one,live chat,ai assistant for my website',
 r:['You can have one. We built a free chatbot generator for contractors — pick your trade, edit the questions and answers, copy one block of code, paste it before the closing body tag of your site. Done in about two minutes.\n\nFree forever. No signup, no credit card, no email, no account, no monthly fee. It is a gift from Eye To Ad Media and there are no strings on it.'],
 qr:['Build my free chatbot','Why is it free?','Talk to a human']},

{id:'whyfree', w:2.2, k:'why is it free,what is the catch,catch,too good to be true,really free,no catch,why would you give that away,free forever',
 r:['No catch. The code runs in your own page, in your visitor’s browser. Nothing phones home to us, so there is nothing for us to meter and nothing for us to bill.\n\nWhy give it away: contractors who end up hiring us almost always start by trusting something we gave them first. That is the entire strategy. If you never call us, the bot still works forever.'],
 qr:['Build my free chatbot','Pricing','Free audit']},

{id:'spanish', w:2, k:'espanol,spanish,hablas espanol,se habla,en espanol,do you speak spanish',
 r:['Si — we have Spanish speakers on the team. Call {TEL} and ask, or write your question here in Spanish and I will point you to a human who can take it from there.'],
 qr:['Call now','Free audit']},

{id:'privacy', w:2, k:'privacy,my data,do you sell data,spam,mailing list,unsubscribe,gdpr,cookies,is this secure',
 r:['We use what you give us to run the audit and call you back. We do not sell data and we do not drop you into a mailing list. This chat is not stored on a server — it lives in your browser and disappears when you close the tab.'],
 qr:['Free audit','Talk to a human']});

/* ─────────────────────────── FALLBACK & CATCH-ALL ──────────────────────── */
var MISS = new Bag([
 'That one is past my tape. I am rule-based, so I only know what a human here wrote down — say it another way and I will try again, or grab {TEL} and talk to someone who knows everything I do not.',
 'You lost me, and that is on me not you. Try it in different words, or pick one of these and I will be back on solid ground.',
 'I do not have an answer for that one. What I am good at: cost per lead math, what channels actually cost in 2026, which trades work how, and getting you a free audit. Any of those?'
]);

var NUDGE = new Bag([
 'While you are here — what is your average job worth? I can show you your break-even cost per lead in about thirty seconds.',
 'Quick one: if the phone brought you three more jobs a week, what would that do to your year? That is the number worth building around.',
 'If you want a second set of eyes on your specific setup, the free audit costs nothing and you keep the findings either way.'
]);

/* ─────────────────────────── SESSION STATE ─────────────────────────────── */
var S = { trade:null, ticket:0, margin:0, close:0, step:0, turns:0, misses:0,
          seen:{}, lastId:null, spin:0 };

function fill(t){
  return String(t)
    .replace(/\{NAME\}/g, CFG.name)
    .replace(/\{TEL\}/g, CFG.telView)
    .replace(/\{JOKE\}/g, function(){ return JOKES.next(); })
    .replace(/\{QUOTE\}/g, function(){ return QUOTES.next(); });
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

/* SPIN in four beats: situation, problem, implication, need-payoff.
   The calculator is the implication engine — they do the math, they sell
   themselves, and nobody argues with their own arithmetic. */
function calcFlow(raw, say){
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
    S.close = v; S.step = 4;

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
        + 'Roofing on non-branded Google Ads, about $124\n'
        + 'HVAC or plumbing on non-branded search, about $149 to $183\n\n'
        + (cpl > 149
            ? 'Every one of those sits under your ceiling. That means the channels are not your problem — capacity and follow-up speed are.'
            : cpl > 57
              ? 'Local Services Ads clear your ceiling comfortably. Non-branded search is tighter and needs a sharper close rate to work.'
              : 'That is a tight ceiling. Before spending on paid, we would push the cheap stuff hard — profile, reviews, local search — and work on close rate.'));
    }, 1400);

    setTimeout(function(){
      say('Now the question that actually matters. At ' + money(profit) + ' profit a job, three extra jobs a week is ' + money(wk3) + ' a week — roughly ' + money(yr3) + ' a year in gross profit you are not currently booking.\n\nWhat would that change for you? Second truck, hiring, or just sleeping better in February?\n\nIf you want us to pressure-test those numbers against your actual market, the free audit is the move. Costs nothing, you keep it either way.');
    }, 3000);
    return true;
  }
  return false;
}

function startCalc(say){
  S.step = 1;
  say('Good. Three numbers and about thirty seconds.\n\nFirst one: what does a typical completed job invoice at? Ballpark is fine.');
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
  'what would it cost'    : 'pricing',
  'another joke'          : 'joke',
  'another one'           : 'quote',
  'motivate me'           : 'quote',
  'okay, be useful'       : 'whatcanyoudo',
  'call now'              : 'CALL',
  'talk to a human'       : 'contact',
  'one more question'     : 'whatcanyoudo',
  'try again'             : 'whatcanyoudo',
  'which trade am i'      : 'othertrade',
  'just browsing'         : 'no',
  'just looking around'   : 'no',
  'just researching'      : 'no',
  'need more leads'       : 'leadgen',
  'lead flow is slow'     : 'slow',
  'slow right now'        : 'slow',
  'busy, need to scale'   : 'scale',
  'honestly no idea'      : 'noidea_source',
  'mostly referrals'      : 'referrals_answer',
  'google / search'       : 'localseo',
  'bought leads'          : 'angi',
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
  'content'               : 'content',
  'financing offers'      : 'financing',
  'how does call tracking work' : 'tracking',
  'how do you report'     : 'tracking',
  'reporting'             : 'tracking',
  'what do you need from me' : 'auditneeds',
  'is there a contract'   : 'contract',
  'the $50 version'       : 'cheap',
  'what does seo cost'    : 'pricing',
  'what do you cost'      : 'pricing',
  'pricing'               : 'pricing',
  'how long does seo take': 'seotime',
  'how long does it take' : 'seotime',
  'what is a good cost per lead' : 'goodcpl',
  'chat on my site'       : 'freebot',
  'why is it free'        : 'whyfree',
  'are you a real person' : 'robot',
  'what can you do'       : 'whatcanyoudo',
  'about afc'             : 'about',
  'why you'               : 'whyyou',
  'results'               : 'results',
  'tell me a joke'        : 'joke'
};

function byId(id){ for (var i=0;i<KB.length;i++){ if (KB[i].id === id) return KB[i]; } return null; }

/* ─────────────────────────── STRATEGY & ODDS AND ENDS ──────────────────── */
KB.push(
{id:'seotime', w:2.1, k:'how long does seo take,how long,when will i see results,how fast,how soon,timeline,when does it work,how many months,how long until',
 r:[STAT.seotime + '\n\nIf you need the phone ringing this month, we start with paid search and build organic underneath it. That is not a sales line, it is just the order that works.'],
 qr:['Google Ads','Pricing','Free audit']},

{id:'goodcpl', w:2.2, k:'what is a good cost per lead,good cost per lead,average cost per lead,cost per lead,what should i pay per lead,cpl benchmark,what do leads cost',
 r:[STAT.lsa + '\n\n' + STAT.ads + '\n\nBut national averages are a reference point, not your answer. The number that matters is your own break-even. Want me to run it? Takes thirty seconds.'],
 qr:['Run my numbers','Local Services Ads','Free audit']},

{id:'firststep', w:2.1, k:'where do i start,what should i do first,first step,what would you start with,what is most important,priority,if you only did one thing,best place to start,what matters most',
 r:['In this order, and it is the same order every time.\n\nOne, answer faster. Free, and it is the single biggest lever you have.\nTwo, Google Business Profile built out properly and a review system that actually asks. Cheap, and it wins the map pack.\nThree, make sure your website converts the traffic you already get. No point buying more.\nFour, then and only then, turn on paid to fill the calendar while organic compounds.\n\nMost agencies sell you step four first because it is the one with the biggest invoice attached.'],
 qr:['Speed to lead','Local SEO','Free audit']},

{id:'bestchannel', w:2, k:'marketing,advertising,help me with marketing,i need marketing,best channel,which channel,what works best,what is most effective,seo or ads,paid or organic,ads vs seo,what should i spend on',
 r:['Wrong question, slightly. The right one is what you need: work this week, or a pipeline that keeps working after you stop paying.\n\nPaid search buys the first. SEO and local build the second. AI search is the new front door and most of your competition has not found it. Almost nobody should run one alone — paid fills the calendar now while organic pulls the blended cost down over time.'],
 qr:['Run my numbers','Pricing','Free audit']},

{id:'referrals_answer', w:2.1, k:'mostly referrals,referrals,word of mouth,repeat customers,we get referrals,all referral,my customers refer me',
 r:['Referrals are the best leads in the business and the worst business plan, because you do not control the volume. They arrive when they arrive.\n\nHere is the question worth sitting with: in a month where referrals are thin, what is your backup? If the answer is "wait," that is the gap. Search is just the modern phone book — it catches the people who do not know anybody who knows you yet.'],
 qr:['Local SEO','Run my numbers','Free audit']},

{id:'seasonal', w:2.1, k:'seasonal,season,slow months,busy season,winter,summer,spring,storm response,when should i advertise,off season,seasonality',
 r:['The slow season is built during the busy one. SEO takes four to eight months to compound, so whatever you start in your peak is what carries your trough.\n\nStorm and season timing is its own discipline: roofers should have campaigns ready before hail, HVAC before the first heat wave, plumbing before the first hard freeze. Turning things on after the event means bidding against everyone who was already there.'],
 qr:['Run my numbers','Google Ads','Free audit']},

{id:'financing', w:2, k:'financing,finance,payment plans,monthly payments,afford,consumer financing,offer financing',
 r:['Financing changes the conversation from price to payment, and in remodeling, solar, roofing and HVAC it is often the difference between a signed job and a maybe. If you offer it, it belongs on the page, in the ads and in the first ninety seconds of the call — not buried on a terms page nobody reads.'],
 qr:['Remodeling','Run my numbers','Free audit']},

{id:'auditneeds', w:2, k:'what do you need from me,what information,what do i have to give you,what do you need to know,onboarding,how does it start,what happens next',
 r:['Very little. Your company name, your website if you have one, the cities you cover, your trade, and a phone number to call you back on. That is enough for us to look at your profile, your rankings and your competitors.\n\nIf you know your average job value and close rate, bring those too — it makes the whole conversation ten times more useful.'],
 qr:['Open the audit form','Run my numbers','Call now']},

{id:'diy', w:2, k:'can i do it myself,do it myself,diy,in house,hire someone in house,do i need an agency,learn it myself,my nephew,my wife does it,i can do it',
 r:['Honestly? A lot of it, yes. Claiming and building out your Google Business Profile, asking every customer for a review, answering leads in five minutes, putting real photos up — that is most of the local game and it costs nothing but discipline.\n\nWhere it usually breaks is consistency. Not skill. The audit tells you what is worth doing yourself and what is worth paying for, and we are fine with you doing all of it yourself.'],
 qr:['Free tools','Free audit','Pricing']},

{id:'tracking_tools', w:1.9, k:'crm,software,jobber,housecall pro,servicetitan,quickbooks,what software,tools i should use,dispatch software',
 r:['We are channel agnostic on software — Jobber, Housecall Pro, ServiceTitan, whatever you already run. What matters is that leads land somewhere with a timestamp and a source attached, so you can tell which channel produced which customer. If everything lands in a shared inbox, you are guessing.'],
 qr:['Call tracking','Free audit']},

{id:'offline', w:1.9, k:'truck wrap,truck wraps,vehicle wraps,yard sign,yard signs,door hangers,direct mail,flyers,billboard,radio,tv,print,newspaper,vehicle wrap,mailers',
 r:['Offline still works, it is just hard to measure — which is exactly why most contractors overrate or underrate it.\n\nTwo rules. Give every offline channel its own phone number so you actually know what it produced. And never run offline before your online house is in order, because a yard sign sends people to Google to look you up, and if you are not there when they do, you paid for a competitor’s lead.'],
 qr:['Call tracking','Local SEO','Free audit']},

{id:'email', w:1.9, k:'email marketing,newsletter,sms,text messaging,drip,nurture,follow up sequence,mailing list',
 r:['Your past customer list is the cheapest revenue in the business and almost nobody works it. Maintenance reminders, seasonal notes, and a simple "we are in your neighborhood next week" text do more than most ad budgets.\n\nText beats email for trades by a wide margin. Just get permission first.'],
 qr:['Lead generation','Free audit']},

{id:'schema', w:1.8, k:'schema,structured data,llms txt,robots txt,technical seo,site speed,page speed,mobile,core web vitals,https,indexing',
 r:['The technical layer matters more now than it did five years ago, because AI engines need your business to be machine readable before they will recommend it. Structured data, consistent business information, clean markup, a fast page and a site that actually works on a phone.\n\nNone of it wins a job by itself. All of it decides whether you are eligible to be found.'],
 qr:['AI search','Website scorecard','Free audit']},

{id:'howmanyleads', w:1.9, k:'how many leads,how many calls,how much traffic,what volume,how many jobs,expectations,realistic',
 r:['Depends on your market size, your trade and your budget, and anyone quoting you a lead count before looking at those is guessing at you.\n\nWhat we can do is the math in reverse: tell me how many jobs a month you want, your close rate, and your average ticket, and I will tell you how many leads that requires and what that costs at 2026 rates. Want to?'],
 qr:['Run my numbers','Free audit','Pricing']},

{id:'agency_vs', w:1.9, k:'vs,compare,versus,other agencies,big agency,cheaper agency,someone quoted me,i got a quote,another company said',
 r:['Compare on two things only: do they report on booked jobs or on impressions, and can you leave any month.\n\nEverything else is presentation. If someone guarantees you page one rankings, walk — nobody controls Google. If they cannot tell you what your break-even cost per lead is, they have not asked enough about your business to be spending its money.'],
 qr:['Why you','Reporting','Free audit']});

/* ==========================================================================
   THE CINEMATIC — he arrives in a lifted truck, he leaves through a portal.
   Runs once per session. Skipped entirely under prefers-reduced-motion.
   Lightning draws on slowly and fades once; it must never strobe.
   ========================================================================== */
var TRUCK = '<svg viewBox="0 0 560 300" aria-hidden="true" focusable="false">'
+'<defs><linearGradient id="afcTrk" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#C9F04B"/><stop offset="52%" stop-color="#A6CE39"/>'
+'<stop offset="100%" stop-color="#6E8A22"/></linearGradient>'
+'<linearGradient id="afcChr2" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#F2F5F8"/><stop offset="100%" stop-color="#69737F"/></linearGradient></defs>'
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
/* bed rails */
+'<rect x="300" y="104" width="122" height="12" rx="5" fill="#37460F"/>'
/* glass */
+'<path d="M170 108 L192 72 L226 72 L226 108 Z" fill="#BFD4E8" opacity=".92"/>'
+'<path d="M236 72 L268 72 Q276 72 279 80 L288 108 L236 108 Z" fill="#BFD4E8" opacity=".92"/>'
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
/* mud flap + tow hook */
+'<rect x="424" y="150" width="14" height="46" rx="4" fill="#20262E"/>'
+'</svg>';

var PORTAL = '<svg viewBox="0 0 300 300" aria-hidden="true" focusable="false">'
+'<defs><radialGradient id="afcHole" cx="50%" cy="50%" r="50%">'
+'<stop offset="0%" stop-color="#000000"/><stop offset="58%" stop-color="#07090D"/>'
+'<stop offset="82%" stop-color="#1E2A0B"/><stop offset="100%" stop-color="#A6CE39"/></radialGradient></defs>'
+'<g class="afcb-spin">'
+'<ellipse cx="150" cy="150" rx="132" ry="140" fill="none" stroke="#A6CE39" stroke-width="3"'
+' opacity=".55" stroke-dasharray="26 16"/>'
+'<ellipse cx="150" cy="150" rx="112" ry="124" fill="none" stroke="#C9F04B" stroke-width="5"'
+' opacity=".75" stroke-dasharray="48 30"/></g>'
+'<g class="afcb-spin2">'
+'<ellipse cx="150" cy="150" rx="94" ry="108" fill="none" stroke="#B4763C" stroke-width="4"'
+' opacity=".6" stroke-dasharray="18 22"/></g>'
+'<ellipse cx="150" cy="150" rx="86" ry="100" fill="url(#afcHole)"/>'
+'<ellipse cx="150" cy="150" rx="52" ry="66" fill="#000"/></svg>';

var CINE_CSS = ''
+'.afcb-stage{position:fixed;inset:0;z-index:2147481900;pointer-events:none;overflow:hidden;display:none}'
+'.afcb-stage.on{display:block}'
+'.afcb-bolts{position:absolute;top:0;left:0;width:100%;height:70vh;opacity:0}'
+'.afcb-bolts path{stroke:#C9F04B;stroke-width:8;fill:none;stroke-linecap:round;stroke-linejoin:round;'
 +'filter:drop-shadow(0 0 12px rgba(201,240,75,.55));stroke-dasharray:520;stroke-dashoffset:520}'
+'.afcb-stage.go .afcb-bolts{opacity:1}'
+'.afcb-stage.go .afcb-bolts path{animation:afcbStrike 3.4s ease-out both}'
+'.afcb-stage.go .afcb-bolts path.b2{animation-delay:.7s}'
+'@keyframes afcbStrike{0%{stroke-dashoffset:520;opacity:0}26%{stroke-dashoffset:0;opacity:.92}'
 +'52%{opacity:.62}100%{stroke-dashoffset:0;opacity:0}}'

+'.afcb-truck{position:absolute;right:96px;bottom:6px;width:min(460px,62vw);transform:translateX(130vw)}'
+'.afcb-truck svg{width:100%;height:auto;display:block;filter:drop-shadow(0 16px 26px rgba(0,0,0,.45))}'
+'.afcb-stage.go .afcb-truck{animation:afcbRollIn 3s cubic-bezier(.16,.86,.28,1) .45s both}'
+'.afcb-stage.leave .afcb-truck{animation:afcbRollOut 2.2s cubic-bezier(.6,.02,.9,.5) both}'
+'@keyframes afcbRollIn{0%{transform:translateX(130vw)}78%{transform:translateX(-16px)}'
 +'90%{transform:translateX(10px)}100%{transform:translateX(0)}}'
+'@keyframes afcbRollOut{0%{transform:translateX(0)}12%{transform:translateX(-22px)}100%{transform:translateX(135vw)}}'
+'.afcb-wh,.afcb-wh2{transform-box:fill-box;transform-origin:center}'
+'.afcb-stage.go .afcb-wh,.afcb-stage.go .afcb-wh2{animation:afcbRoll 1.1s linear .45s 4}'
+'.afcb-stage.leave .afcb-wh,.afcb-stage.leave .afcb-wh2{animation:afcbRoll .55s linear 5}'
+'@keyframes afcbRoll{to{transform:rotate(360deg)}}'

+'.afcb-dust{position:absolute;right:70px;bottom:12px;width:190px;height:90px;opacity:0}'
+'.afcb-dust i{position:absolute;bottom:0;border-radius:50%;background:#D9C7A8;opacity:.5}'
+'.afcb-stage.go .afcb-dust{animation:afcbDustUp 2.6s ease-out 3s both}'
+'@keyframes afcbDustUp{0%{opacity:0;transform:translate(0,0) scale(.5)}'
 +'25%{opacity:.55}100%{opacity:0;transform:translate(60px,-46px) scale(1.9)}}'

+'.afcb-hero{position:absolute;right:56px;bottom:8px;width:min(210px,30vw);opacity:0}'
+'.afcb-hero svg{width:100%;height:auto;display:block;filter:drop-shadow(0 14px 22px rgba(0,0,0,.4))}'
+'.afcb-stage.go .afcb-hero{animation:afcbHop 1.5s cubic-bezier(.22,1,.3,1) 3.1s both,'
 +'afcbTuck 1.1s cubic-bezier(.5,0,.9,.4) 6.1s forwards}'
+'@keyframes afcbHop{0%{opacity:0;transform:translate(86px,-92px) scale(.86)}'
 +'18%{opacity:1}56%{transform:translate(44px,-118px) scale(1)}'
 +'88%{transform:translate(0,6px) scale(1.03,.95)}100%{opacity:1;transform:translate(0,0) scale(1)}}'
+'@keyframes afcbTuck{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(44px,52px) scale(.16)}}'

+'.afcb-stage.leave .afcb-hero{animation:afcbOut 1.1s cubic-bezier(.2,.9,.3,1) .5s both,'
 +'afcbLeap 2.1s cubic-bezier(.35,0,.65,1) 1.6s forwards}'
+'@keyframes afcbOut{0%{opacity:0;transform:translate(44px,52px) scale(.16)}'
 +'100%{opacity:1;transform:translate(0,0) scale(1)}}'
+'@keyframes afcbLeap{0%{opacity:1;transform:translate(0,0) scale(1)}'
 +'16%{transform:translate(-4vw,-42px) scale(1.02,.97)}'
 +'55%{transform:translate(-40vw,-96px) scale(1) rotate(-6deg)}'
 +'86%{opacity:1;transform:translate(-72vw,-38px) scale(.72) rotate(-12deg)}'
 +'100%{opacity:0;transform:translate(-78vw,-24px) scale(.12) rotate(-26deg)}}'

+'.afcb-portal{position:absolute;left:6vw;bottom:34px;width:min(280px,44vw);opacity:0;transform:scale(0)}'
+'.afcb-portal svg{width:100%;height:auto;display:block;filter:drop-shadow(0 0 40px rgba(166,206,57,.35))}'
+'.afcb-stage.leave .afcb-portal{animation:afcbHoleIn 1.4s cubic-bezier(.2,1,.3,1) .3s both,'
 +'afcbHoleOut 1s cubic-bezier(.6,0,.9,.4) 3.7s forwards}'
+'@keyframes afcbHoleIn{0%{opacity:0;transform:scale(0) rotate(-30deg)}'
 +'70%{opacity:1;transform:scale(1.06) rotate(6deg)}100%{opacity:1;transform:scale(1) rotate(0)}}'
+'@keyframes afcbHoleOut{0%{opacity:1;transform:scale(1)}60%{transform:scale(.5) rotate(40deg)}'
 +'100%{opacity:0;transform:scale(0) rotate(70deg)}}'
+'.afcb-spin{transform-box:fill-box;transform-origin:center;animation:afcbSpin 9s linear infinite}'
+'.afcb-spin2{transform-box:fill-box;transform-origin:center;animation:afcbSpin 6s linear infinite reverse}'
+'@keyframes afcbSpin{to{transform:rotate(360deg)}}'

+'@media(max-width:640px){'
 +'.afcb-truck{right:34px;bottom:4px;width:80vw}'
 +'.afcb-hero{right:26px;width:38vw}'
 +'.afcb-portal{left:4vw;bottom:26px;width:52vw}'
 +'.afcb-dust{right:24px;width:130px}}'
+'@media(prefers-reduced-motion:reduce){.afcb-stage{display:none!important}}';

/* Returns null when the browser asked for no motion — callers just proceed. */
function Cine(){
  if (reduce) return null;
  var stage = el('div', 'afcb-stage');
  stage.innerHTML =
    '<svg class="afcb-bolts" viewBox="0 0 1200 700" preserveAspectRatio="none">'
  +   '<path class="b1" d="M180 -10 L120 250 L210 230 L140 520"/>'
  +   '<path class="b2" d="M960 -10 L1030 240 L940 222 L1010 500"/></svg>'
  + '<div class="afcb-dust"><i style="right:6px;width:34px;height:34px"></i>'
  +   '<i style="right:52px;width:26px;height:26px"></i>'
  +   '<i style="right:96px;width:40px;height:40px"></i></div>'
  + '<div class="afcb-truck">' + TRUCK + '</div>'
  + '<div class="afcb-hero">' + FULL + '</div>'
  + '<div class="afcb-portal">' + PORTAL + '</div>';
  D.body.appendChild(stage);

  function clear(){ stage.className = 'afcb-stage'; }

  return {
    /* 7.2s: lightning, truck rolls in, he hops down, truck leaves, he tucks
       into the corner and becomes the chat button. */
    arrive: function(done){
      stage.classList.add('on');
      void stage.offsetWidth;
      stage.classList.add('go');
      setTimeout(function(){
        var t = stage.querySelector('.afcb-truck');
        t.style.animation = 'afcbRollOut 2.2s cubic-bezier(.6,.02,.9,.5) both';
      }, 4600);
      setTimeout(function(){ clear(); if (done) done(); }, 7200);
      return 6100;
    },
    /* 4.8s: portal tears open on the far side, he runs and dives through. */
    exit: function(done){
      stage.classList.add('on');
      void stage.offsetWidth;
      stage.classList.add('leave');
      setTimeout(function(){ clear(); if (done) done(); }, 4800);
    }
  };
}

/* ─────────────────────────── ROUTING TABLES, NORMALIZED ────────────────── */
var A2 = {}, L2 = {}, kk;
for (kk in ALIAS){ if (Object.prototype.hasOwnProperty.call(ALIAS,kk)) A2[norm(kk).trim()] = ALIAS[kk]; }
for (kk in LINKS){ if (Object.prototype.hasOwnProperty.call(LINKS,kk)) L2[norm(kk).trim()] = LINKS[kk]; }

var CALC_RE = /(break ?even|run my number|run the number|do the math|calculate|my numbers|what can i afford|cost per lead for me)/;
var TICKET_RE = /(average job|avg job|job is worth|ticket|per job|typical job|jobs are)/;

/* ─────────────────────────── ENGINE ────────────────────────────────────── */
function respond(raw, api){
  var say = api.say, chips = api.chips;
  var key = norm(raw).trim();
  S.turns++;

  /* 1. quick-reply links go straight to the page */
  if (L2[key]){ api.go(L2[key]); return; }
  if (A2[key] === 'CALL'){ api.go('tel:' + CFG.tel); return; }

  /* 2. mid-calculator, numbers win over everything */
  if (S.step > 0 && S.step < 4){ if (calcFlow(raw, say)) return; }

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

  /* 5. intent match, direct or aliased */
  var hit = A2[key] ? byId(A2[key]) : null;
  if (!hit) hit = match(raw);

  if (hit){
    S.misses = 0;
    if (hit.trade) S.trade = hit.trade;
    var body = fill(pick(hit.r));

    /* never repeat the same answer twice in a row */
    if (S.lastId === hit.id && hit.r.length > 1){
      var alt = hit.r.filter(function(x){ return fill(x) !== body; });
      if (alt.length) body = fill(pick(alt));
    }
    S.lastId = hit.id;
    S.seen[hit.id] = (S.seen[hit.id] || 0) + 1;

    /* always be closing — but not every single turn, that is obnoxious */
    if (S.turns % 4 === 0 && S.step === 0 && !hit.qr){ body += '\n\n' + NUDGE.next(); }

    say(body, function(){ chips(hit.qr || ['Run my numbers','Pricing','Free audit']); });
    return;
  }

  /* 6. miss */
  S.misses++;
  if (S.misses >= 2){
    say('Second time I have missed you, which means it is my limit and not your question. Call {TEL} — a human answers and they know everything I do not.'.replace('{TEL}', CFG.telView),
      function(){ chips(['Call now','What can you do?','Free audit']); });
    return;
  }
  say(fill(MISS.next()), function(){
    chips(['What can you do?','Run my numbers','Pricing','Talk to a human']);
  });
}

/* ─────────────────────────── MASCOT ────────────────────────────────────── */
var HEAD = '<svg viewBox="120 0 200 200" aria-hidden="true" focusable="false">'
+'<rect x="134" y="74" width="172" height="110" rx="28" fill="#0D1117"/>'
+'<circle cx="182" cy="124" r="26" fill="#fff"/><circle cx="258" cy="124" r="26" fill="#fff"/>'
+'<circle class="afcb-pl" cx="182" cy="124" r="11" fill="#12161C"/>'
+'<circle class="afcb-pr" cx="258" cy="124" r="11" fill="#12161C"/>'
+'<ellipse cx="220" cy="80" rx="132" ry="28" fill="#0D1117"/>'
+'<path d="M158 82 C 152 20 180 6 220 6 C 260 6 288 20 282 82 Z" fill="#0D1117"/>'
+'<path d="M159 73 Q 220 95 281 73 L 281 61 Q 220 81 159 61 Z" fill="#A6CE39"/></svg>';

var FULL = '<svg viewBox="60 0 320 620" aria-hidden="true" focusable="false">'
+'<defs><linearGradient id="afcCase" x1="0" y1="0" x2="1" y2="1">'
+'<stop offset="0%" stop-color="#F9D64C"/><stop offset="52%" stop-color="#F0BE22"/>'
+'<stop offset="100%" stop-color="#D29814"/></linearGradient>'
+'<linearGradient id="afcHat" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#A3714A"/><stop offset="100%" stop-color="#78502F"/></linearGradient>'
+'<linearGradient id="afcCh" x1="0" y1="0" x2="0" y2="1">'
+'<stop offset="0%" stop-color="#EDF1F5"/><stop offset="100%" stop-color="#6E7885"/></linearGradient></defs>'
+'<g class="afcb-bob">'
+'<ellipse cx="220" cy="600" rx="110" ry="13" fill="#000" opacity=".3"/>'
/* boots */
+'<path d="M230 414 h58 a20 20 0 0 1 20 20 v10 h-78 z" fill="#7A5232"/>'
+'<rect x="224" y="440" width="92" height="20" rx="10" fill="#20262E"/>'
+'<path d="M152 414 h60 v30 h-80 v-10 a20 20 0 0 1 20 -20 z" fill="#8B5E3C"/>'
+'<rect x="124" y="440" width="94" height="20" rx="10" fill="#20262E"/>'
/* legs */
+'<rect x="189" y="350" width="16" height="76" rx="8" fill="#14181F"/>'
+'<rect x="243" y="350" width="16" height="76" rx="8" fill="#14181F"/>'
+'<rect x="180" y="374" width="34" height="30" rx="11" fill="#2C333D"/>'
+'<rect x="234" y="374" width="34" height="30" rx="11" fill="#2C333D"/>'
/* case */
+'<rect x="152" y="198" width="136" height="158" rx="26" fill="#171C24"/>'
+'<rect x="160" y="206" width="120" height="142" rx="20" fill="url(#afcCase)"/>'
+'<rect x="190" y="196" width="60" height="16" rx="6" fill="#0C0F14"/>'
+'<rect x="175" y="226" width="30" height="40" rx="9" fill="#1C222B"/>'
+'<rect x="180" y="232" width="20" height="20" rx="6" fill="#A6CE39"/>'
+'<g transform="translate(220,292)"><rect x="-52" y="-26" width="104" height="50" rx="9" fill="#12161C" stroke="#A6CE39" stroke-width="2.5"/>'
+'<path d="M-36 10 L-25 -15 L-14 10" stroke="#F4F4F1" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
+'<rect x="-33" y="-4" width="19" height="9" rx="4.5" fill="#0D1117" stroke="#F4F4F1" stroke-width="1.6"/>'
+'<circle cx="-25.5" cy=".5" r="2.6" fill="#A6CE39"/>'
+'<text x="14" y="10" font-family="Barlow Condensed,Impact,sans-serif" font-size="32" font-weight="800" fill="#F4F4F1" text-anchor="middle">F</text>'
+'<text x="38" y="10" font-family="Barlow Condensed,Impact,sans-serif" font-size="32" font-weight="800" fill="#F4F4F1" text-anchor="middle">C</text></g>'
/* belt */
+'<rect x="134" y="312" width="172" height="34" rx="7" fill="#875A36" stroke="#3E2A18" stroke-width="3"/>'
+'<rect x="196" y="306" width="48" height="46" rx="9" fill="url(#afcCh)" stroke="#1C222B" stroke-width="3"/>'
+'<rect x="205" y="315" width="30" height="28" rx="5" fill="#12161C" opacity=".6"/>'
+'<circle cx="220" cy="329" r="4" fill="#A6CE39"/>'
+'<rect x="118" y="338" width="52" height="48" rx="8" fill="#6B4529" stroke="#3E2A18" stroke-width="3"/>'
+'<rect x="286" y="340" width="50" height="30" rx="9" fill="#A6CE39" stroke="#37460F" stroke-width="3"/>'
+'<path d="M300 368 l-5 28 h22 l-3 -28 z" fill="#1C222B"/>'
/* arms */
+'<path d="M162 244 C 132 256 116 282 112 306" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
+'<path d="M162 244 C 132 256 116 282 112 306" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
+'<circle cx="110" cy="316" r="16" fill="#C8905A" stroke="#14181F" stroke-width="3"/>'
+'<g class="afcb-wave">'
+'<path d="M282 236 C 314 226 332 202 336 178" stroke="#14181F" stroke-width="19" fill="none" stroke-linecap="round"/>'
+'<path d="M282 236 C 314 226 332 202 336 178" stroke="#F4F4F1" stroke-width="13" fill="none" stroke-linecap="round"/>'
+'<circle cx="338" cy="170" r="17" fill="#C8905A" stroke="#14181F" stroke-width="3"/></g>'
/* blade neck with inch marks */
+'<g class="afcb-neck">'
+'<rect x="202" y="182" width="36" height="24" fill="#F0BE22"/>'
+'<path d="M204 202 h14 M204 194 h8 M204 186 h8" stroke="#1C222B" stroke-width="2.2" stroke-linecap="round"/>'
+'<text x="228" y="200" font-family="monospace" font-size="11" fill="#1C222B" text-anchor="middle">1</text>'
/* head */
+'<rect x="134" y="74" width="172" height="110" rx="28" fill="url(#afcCase)" stroke="#1C222B" stroke-width="5"/>'
+'<circle cx="182" cy="124" r="27" fill="#fff" stroke="#1C222B" stroke-width="3"/>'
+'<circle cx="258" cy="124" r="27" fill="#fff" stroke="#1C222B" stroke-width="3"/>'
+'<circle class="afcb-pl" cx="182" cy="124" r="12" fill="#12161C"/>'
+'<circle class="afcb-pr" cx="258" cy="124" r="12" fill="#12161C"/>'
+'<g stroke="#12161C" fill="none" stroke-width="8" stroke-linecap="round">'
+'<rect x="149" y="93" width="66" height="62" rx="17" fill="rgba(255,255,255,.13)"/>'
+'<rect x="225" y="93" width="66" height="62" rx="17" fill="rgba(255,255,255,.13)"/>'
+'<path d="M215 119 q5 -9 10 0"/><path d="M149 112 l-20 -7"/><path d="M291 112 l20 -7"/></g>'
+'<path d="M192 164 q28 22 56 0" stroke="#12161C" stroke-width="6" fill="none" stroke-linecap="round"/>'
+'<ellipse cx="220" cy="80" rx="142" ry="30" fill="url(#afcHat)"/>'
+'<path d="M158 82 C 152 20 180 6 220 6 C 260 6 288 20 282 82 Z" fill="url(#afcHat)" stroke="#5C3B21" stroke-width="4"/>'
+'<path d="M159 73 Q 220 95 281 73 L 281 59 Q 220 81 159 59 Z" fill="#4A3323"/>'
+'<path d="M265 63 l9 -6 l-1 10 z" fill="#A6CE39"/></g></g></svg>';

/* ─────────────────────────── STYLES ────────────────────────────────────── */
var CSS = ''
+'.afcb,.afcb *{box-sizing:border-box;margin:0;padding:0}'
+'.afcb{position:fixed;right:20px;bottom:20px;z-index:2147482000;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif}'
+'.afcb-btn{width:76px;height:76px;border-radius:50%;background:#A6CE39;border:3px solid #fff;'
 +'box-shadow:0 12px 34px rgba(0,0,0,.38);cursor:pointer;display:grid;place-items:center;overflow:hidden;padding:0}'
+'.afcb-btn svg{width:68px;height:68px;transform:translateY(5px)}'
+'.afcb-btn:hover{background:#C9F04B}'
+'.afcb-dot{position:absolute;top:-2px;right:-2px;width:20px;height:20px;border-radius:50%;background:#B4763C;'
 +'border:2px solid #fff;color:#fff;font-size:12px;font-weight:700;display:grid;place-items:center;line-height:1}'
+'.afcb-tip{position:absolute;bottom:14px;right:92px;max-width:250px;background:#fff;color:#232A33;'
 +'border:1px solid #DDDDD6;border-radius:12px 12px 2px 12px;padding:12px 14px;font-size:14px;line-height:1.5;'
 +'box-shadow:0 14px 40px rgba(13,17,23,.22);cursor:pointer;display:none}'
+'.afcb-tip.on{display:block}'
+'.afcb-tip b{display:block;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#B4763C;margin-bottom:3px}'
+'.afcb-p{position:absolute;bottom:94px;right:0;width:390px;max-width:calc(100vw - 32px);'
 +'height:min(620px,calc(100vh - 140px));background:#F4F4F1;border-radius:16px;overflow:hidden;'
 +'box-shadow:0 28px 80px rgba(13,17,23,.45);display:none;flex-direction:column}'
+'.afcb-p.on{display:flex}'
+'.afcb-h{background:#0D1117;color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;flex:0 0 auto}'
+'.afcb-h .av{width:46px;height:46px;border-radius:50%;background:#A6CE39;display:grid;place-items:center;overflow:hidden;flex:0 0 46px}'
+'.afcb-h .av svg{width:42px;height:42px;transform:translateY(3px)}'
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
+'.afcb-hello svg{width:150px;height:auto;margin:0 auto;display:block}'
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
+'@media(max-width:480px){.afcb{right:14px;bottom:14px}.afcb-btn{width:64px;height:64px}'
 +'.afcb-btn svg{width:58px;height:58px}.afcb-p{height:min(560px,calc(100vh - 110px));bottom:80px}'
 +'.afcb-tip{display:none!important}}'
+'@media(prefers-reduced-motion:no-preference){'
 +'.afcb-pl{animation:afcbA 4.1s ease-in-out infinite}'
 +'.afcb-pr{animation:afcbB 3.3s ease-in-out infinite}'
 +'.afcb-bob{animation:afcbC 3.6s ease-in-out infinite}'
 +'.afcb-wave{animation:afcbD 4.1s ease-in-out infinite;transform-box:view-box;transform-origin:282px 236px}'
 +'.afcb-neck{animation:afcbE 13s ease-in-out infinite;transform-box:view-box;transform-origin:220px 206px}'
 +'.afcb-t s{animation:afcbF 1.3s ease-in-out infinite}'
 +'.afcb-t s:nth-child(2){animation-delay:.18s}.afcb-t s:nth-child(3){animation-delay:.36s}}'
+'@keyframes afcbA{0%,100%{transform:translate(-5px,2px)}35%{transform:translate(4px,-3px)}70%{transform:translate(2px,4px)}}'
+'@keyframes afcbB{0%,100%{transform:translate(4px,3px)}40%{transform:translate(-4px,-2px)}75%{transform:translate(-2px,4px)}}'
+'@keyframes afcbC{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}'
+'@keyframes afcbD{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}'
+'@keyframes afcbE{0%{transform:rotate(0)}3%{transform:rotate(4deg)}6%{transform:rotate(-3.4deg)}'
 +'9%{transform:rotate(2deg)}12%{transform:rotate(-1deg)}15%,100%{transform:rotate(0)}}'
+'@keyframes afcbF{0%,60%,100%{opacity:.3}30%{opacity:1}}';

/* ─────────────────────────── BUILD ─────────────────────────────────────── */
function build(){
  var st = el('style'); st.textContent = CSS + CINE_CSS; D.head.appendChild(st);

  var w = el('div', 'afcb');
  w.innerHTML =
    '<div class="afcb-tip" role="button" tabindex="0"><b>' + esc(CFG.name) + ' here</b>'
      + 'Got a marketing question? I answer at 11pm too.</div>'
  + '<div class="afcb-p" role="dialog" aria-label="Chat with ' + esc(CFG.name) + '">'
  +   '<div class="afcb-h"><span class="av">' + HEAD + '</span>'
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
  +   HEAD + '<span class="afcb-dot">1</span></button>';
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
  var api = { say: say, chips: chips, go: go, form: function(){
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
    panel.classList.add('on'); tip.classList.remove('on');
    if (dot) dot.style.display = 'none';
    if (!opened){
      opened = true;
      var hello = el('div', 'afcb-hello', FULL);
      msgs.appendChild(hello);
      say('Howdy. I am ' + CFG.name + ' — a tape measure in a cowboy hat, which is an odd career, but the numbers work out.\n\nI answer contractor marketing questions, run your break-even cost per lead, and never once take a lunch break. What are you working on?',
        function(){ chips(['Run my numbers','What do you cost?','My phone is not ringing','Tell me a joke']); });
    }
    setTimeout(function(){ if (W.innerWidth > 560) input.focus(); }, 260);
    scroll();
  }
  /* X closes it for good: the portal exit plays, then the button quietly
     returns so it can still be reopened by hand. No nudge ever again. */
  function close(){
    panel.classList.remove('on');
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

  /* lead form — same hardening as the site forms */
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
    var data = {
      Name: nm, Phone: ph, Company: f['Company'].value.trim(), Message: ms,
      Trade: S.trade || 'not stated',
      Numbers: S.ticket ? ('job ' + money(S.ticket) + ', margin ' + S.margin + '%, close ' + S.close + '%') : 'not run',
      Source: 'AFC chat — ' + CFG.name, PageURL: W.location.href,
      _subject: 'AFC chat lead — ' + CFG.name, _template: 'table', _captcha: 'false'
    };
    var body = [], k;
    for (k in data){ if (Object.prototype.hasOwnProperty.call(data, k))
      body.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k])); }

    form.classList.remove('on'); form.reset();
    var url = 'https://formsubmit.co/ajax/' + addr();
    if (typeof fetch === 'function'){
      fetch(url, { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: body.join('&') })
      .then(function(r){ return r.ok ? r.json().catch(function(){ return null; }) : null; })
      .then(function(j){
        if (j && String(j.success) === 'true'){
          say('Sent, and confirmed on our end. Someone will call you back, usually same day. If you would rather not wait, ' + CFG.telView + ' gets you a human right now.');
        } else {
          say('Your details went out but no delivery receipt came back, so I cannot promise it landed. If you have not heard from us within one business day, call ' + CFG.telView + ' rather than waiting on us.');
        }
      })
      .catch(function(){
        say('That did not send and I would rather tell you than let it vanish. Call ' + CFG.telView + ' and someone will pick up.');
      });
    } else {
      say('This browser cannot send it from here. Call ' + CFG.telView + ' and someone will pick up.');
    }
  });

  /* arrival: lightning, truck, hop down, tuck into the corner */
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

  /* one gentle nudge, once per session, and never after he has been closed */
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
      animating = true; panel.classList.remove('on');
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
                       fill:fill, A2:A2, L2:L2, byId:byId, CFG:CFG };
  }
  return;
}
if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', build);
else build();

})();
