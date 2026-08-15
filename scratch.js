/* ══════════════════════════════════════════════════════════════════════
   AFC SCRATCH TICKET — advertisingforcontractors.com
   Shared across every page. Root file, beside rivet.js.

   MOUNT
     <div data-afc-scratch></div>
     <script src="/scratch.js" defer></script>
   Nothing renders unless that div exists, so pages opt in individually.

   RULES THIS ENFORCES
     · One scratch per browser, ever. The prize is drawn and written to
       storage on the FIRST stroke, before anything is visible, so a
       refresh mid-scratch cannot re-roll it. Reloading afterwards shows
       the same prize and the same code.
     · Prizes must be redeemed by phone on 1-800-481-8638. The code is
       cosmetic to the visitor and meaningful to whoever answers — it
       encodes which prize was won, so nobody can claim the 15% by
       reading it out wrong.
     · Nothing is stored until the visitor actually scratches. Loading a
       page that carries the ticket writes nothing. That keeps the
       storage strictly functional under the Colorado Privacy Act rather
       than something needing consent.
     · If localStorage is unavailable (private mode, blocked), the ticket
       still works for the session and says so rather than silently
       letting somebody re-roll.

   HONEST NOTE FOR WHOEVER MAINTAINS THIS
     Clearing site data resets the lock. There is no way around that on a
     static site and it does not matter, because redemption runs through
     a human on the phone. The lock exists to stop casual re-rolling, not
     to be a security boundary. Do not describe it to clients as one.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MOUNT = document.querySelector('[data-afc-scratch]');
  if (!MOUNT) return;

  var PHONE      = '1-800-481-8638';
  var TEL        = '18004818638';
  var KEY        = 'afc_scratch_v1';
  var VALID_DAYS = 30;

  /* ── Prizes ────────────────────────────────────────────────────────
     `w` is the weight, not a percentage — the draw normalises them.
     Edit freely; the code letter must stay unique so phone staff can
     read the prize off the code.                                     */
  var PRIZES = [
    { id: 'seo5',   c: 'A', w: 30, label: '5% off SEO',
      line: '5% off your first 6 months of SEO',
      note: 'Applied to any ongoing SEO or AI search engagement.' },

    { id: 'seo10',  c: 'B', w: 24, label: '10% off SEO',
      line: '10% off your first 6 months of SEO',
      note: 'Applied to any ongoing SEO or AI search engagement.' },

    { id: 'audit',  c: 'C', w: 18, label: 'Priority website analysis',
      line: 'Front-of-queue website & competitor analysis',
      note: 'We audit for anyone who asks — this jumps you to the front of the queue and adds a competitor teardown.' },

    { id: 'logo',   c: 'D', w: 13, label: 'Free logo',
      line: 'A free logo with any SEO campaign',
      note: 'Original mark, source files included. Requires an active SEO campaign.' },

    { id: 'seo15',  c: 'E', w: 9,  label: '15% off SEO',
      line: '15% off your first 6 months of SEO',
      note: 'The largest discount on the ticket.' },

    { id: 'bot',    c: 'F', w: 6,  label: 'Free chatbot',
      line: 'A free custom chatbot with any website build',
      note: 'Trained on your trade, your services and your service area. Requires a website purchase.' }
  ];

  /* Exposed for testing. Declared here rather than at the foot of the file
     because several paths below return early — no canvas support, or a
     visitor who already scratched — and an export at the bottom would
     simply never run for them. */
  window.AFCScratch = { PRIZES: PRIZES, pick: pick, makeCode: makeCode, byId: byId };

  /* ── Storage, defensively ─────────────────────────────────────── */
  var canStore = (function () {
    try {
      var k = '__afc_t';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();
  var session = null; /* fallback when storage is blocked */

  function read() {
    if (!canStore) return session;
    try {
      var raw = window.localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function write(o) {
    session = o;
    if (!canStore) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  /* ── Draw ─────────────────────────────────────────────────────── */
  function pick() {
    var total = 0, i;
    for (i = 0; i < PRIZES.length; i++) total += PRIZES[i].w;
    var r = rnd() * total, acc = 0;
    for (i = 0; i < PRIZES.length; i++) {
      acc += PRIZES[i].w;
      if (r < acc) return PRIZES[i];
    }
    return PRIZES[0];
  }
  function rnd() {
    if (window.crypto && window.crypto.getRandomValues) {
      var a = new Uint32Array(1);
      window.crypto.getRandomValues(a);
      return a[0] / 4294967296;
    }
    return Math.random();
  }
  function byId(id) {
    for (var i = 0; i < PRIZES.length; i++) if (PRIZES[i].id === id) return PRIZES[i];
    return null;
  }

  /* Code shape: AFC-<prize letter><4 chars>. Ambiguous characters are
     excluded because these get read aloud down a phone line. */
  function makeCode(prize) {
    var alphabet = '34679ACDEFHJKLMNPQRTUVWXY', out = '';
    for (var i = 0; i < 4; i++) out += alphabet.charAt(Math.floor(rnd() * alphabet.length));
    return 'AFC-' + prize.c + out;
  }

  function expiryFrom(ts) { return ts + VALID_DAYS * 86400000; }
  function fmt(ts) {
    var d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  /* ── Styles ───────────────────────────────────────────────────── */
  var CSS = ''
  + '.afcs{max-width:760px;margin:0 auto}'
  + '.afcs *{box-sizing:border-box}'
  + '.afcs-card{background:var(--ink,#0D1117);border-radius:10px;overflow:hidden;'
  +   'box-shadow:0 24px 70px rgba(13,17,23,.28);border:1px solid rgba(255,255,255,.10)}'
  + '.afcs-top{padding:22px 26px 18px;border-bottom:1px dashed rgba(255,255,255,.18);'
  +   'display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}'
  + '.afcs-eyebrow{font-family:var(--mono,monospace);font-size:.66rem;letter-spacing:.2em;'
  +   'text-transform:uppercase;color:var(--amber,#B4763C);margin-bottom:8px}'
  + '.afcs-top h3{font-family:var(--display,sans-serif);font-weight:800;text-transform:uppercase;'
  +   'font-size:clamp(1.4rem,3.4vw,1.9rem);line-height:1.03;color:#fff;margin:0;letter-spacing:-.005em}'
  + '.afcs-top p{font-size:.93rem;color:#A9B3BF;margin:10px 0 0;line-height:1.6;max-width:46ch}'
  + '.afcs-no{font-family:var(--mono,monospace);font-size:.68rem;letter-spacing:.14em;'
  +   'color:var(--lime,#A6CE39);white-space:nowrap;padding-top:4px}'
  /* perforation */
  + '.afcs-perf{height:14px;background:var(--ink,#0D1117);position:relative}'
  + '.afcs-perf::before,.afcs-perf::after{content:"";position:absolute;top:50%;width:22px;height:22px;'
  +   'background:var(--paper,#F4F4F1);border-radius:50%;transform:translateY(-50%)}'
  + '.afcs-perf::before{left:-11px}.afcs-perf::after{right:-11px}'
  /* scratch area */
  + '.afcs-stage{position:relative;margin:0 26px 4px;border-radius:8px;overflow:hidden;'
  +   'background:#151A21;border:1px solid rgba(255,255,255,.09);touch-action:none}'
  + '.afcs-prize{padding:34px 24px;text-align:center;min-height:210px;display:flex;'
  +   'flex-direction:column;align-items:center;justify-content:center;gap:10px}'
  + '.afcs-won{font-family:var(--mono,monospace);font-size:.68rem;letter-spacing:.22em;'
  +   'text-transform:uppercase;color:var(--lime,#A6CE39)}'
  + '.afcs-line{font-family:var(--display,sans-serif);font-weight:800;text-transform:uppercase;'
  +   'font-size:clamp(1.7rem,5vw,2.6rem);line-height:1.02;color:#fff;max-width:18ch}'
  + '.afcs-note{font-size:.9rem;color:#9AA4B0;line-height:1.55;max-width:44ch;margin:0}'
  + '.afcs-canvas{position:absolute;inset:0;width:100%;height:100%;cursor:crosshair;'
  +   'transition:opacity .55s ease;z-index:2;display:block}'
  + '.afcs-canvas.gone{opacity:0;pointer-events:none}'
  /* code block */
  + '.afcs-code{margin:18px 26px 0;background:rgba(166,206,57,.10);'
  +   'border:1px solid rgba(166,206,57,.42);border-radius:8px;padding:18px 20px;'
  +   'display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}'
  + '.afcs-code-l{font-family:var(--mono,monospace);font-size:.66rem;letter-spacing:.16em;'
  +   'text-transform:uppercase;color:#9AA4B0;margin-bottom:6px}'
  + '.afcs-code-n{font-family:var(--mono,monospace);font-size:clamp(1.3rem,4vw,1.75rem);'
  +   'font-weight:600;color:var(--lime,#A6CE39);letter-spacing:.09em}'
  + '.afcs-copy{font-family:var(--mono,monospace);font-size:.72rem;font-weight:600;'
  +   'letter-spacing:.1em;text-transform:uppercase;background:transparent;color:#C6CDD6;'
  +   'border:1px solid rgba(255,255,255,.26);border-radius:5px;padding:9px 14px;cursor:pointer;'
  +   'transition:border-color .15s,color .15s}'
  + '.afcs-copy:hover{border-color:var(--lime,#A6CE39);color:var(--lime,#A6CE39)}'
  /* actions + terms */
  + '.afcs-act{padding:20px 26px 0;display:flex;gap:12px;flex-wrap:wrap}'
  + '.afcs-btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;'
  +   'font-family:var(--display,sans-serif);font-size:1.08rem;font-weight:700;letter-spacing:.045em;'
  +   'text-transform:uppercase;text-decoration:none;padding:15px 26px;border-radius:4px;'
  +   'border:2px solid transparent;cursor:pointer;line-height:1;transition:transform .16s,background .16s}'
  + '.afcs-btn-go{background:var(--lime,#A6CE39);color:var(--ink,#0D1117);box-shadow:0 5px 0 #7EA323}'
  + '.afcs-btn-go:hover{background:var(--lime-hi,#C9F04B);transform:translateY(-2px)}'
  + '.afcs-btn-line{border-color:rgba(255,255,255,.42);color:#fff;background:rgba(255,255,255,.05)}'
  + '.afcs-btn-line:hover{border-color:var(--lime,#A6CE39);color:var(--lime,#A6CE39)}'
  + '.afcs-terms{padding:20px 26px 24px;font-family:var(--mono,monospace);font-size:.71rem;'
  +   'line-height:1.85;color:#77828F}'
  + '.afcs-terms b{color:#B7C0CB;font-weight:600}'
  + '.afcs-hint{font-family:var(--mono,monospace);font-size:.72rem;letter-spacing:.05em;'
  +   'color:#8A939E;text-align:center;padding:12px 26px 0}'
  + '.afcs-reveal{display:block;margin:14px auto 0;font-family:var(--mono,monospace);font-size:.72rem;'
  +   'letter-spacing:.1em;text-transform:uppercase;background:none;border:0;color:#8A939E;'
  +   'text-decoration:underline;cursor:pointer;padding:6px}'
  + '.afcs-reveal:hover{color:var(--lime,#A6CE39)}'
  + '.afcs-expired{margin:18px 26px 0;background:rgba(180,118,60,.12);'
  +   'border:1px solid rgba(180,118,60,.44);border-radius:8px;padding:15px 18px;'
  +   'font-size:.9rem;color:#E0A468;line-height:1.6}'
  + '@media(max-width:600px){.afcs-stage{margin:0 16px 4px}.afcs-code,.afcs-expired{margin:16px 16px 0}'
  +   '.afcs-act{padding:18px 16px 0}.afcs-top,.afcs-terms{padding-left:18px;padding-right:18px}'
  +   '.afcs-btn{width:100%}}'
  + '@media(prefers-reduced-motion:reduce){.afcs-canvas{transition:none}}';

  var styleEl = document.createElement('style');
  styleEl.setAttribute('data-afc-scratch-css', '');
  styleEl.appendChild(document.createTextNode(CSS));
  document.head.appendChild(styleEl);

  /* ── Markup ───────────────────────────────────────────────────── */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  var wrap  = el('section', 'afcs');
  wrap.setAttribute('aria-label', 'Scratch-off offer');
  var card  = el('div', 'afcs-card');

  var top = el('div', 'afcs-top');
  var topL = el('div');
  topL.appendChild(el('div', 'afcs-eyebrow', 'One ticket &middot; one scratch'));
  topL.appendChild(el('h3', null, 'Scratch it. Whatever&rsquo;s under there is yours.'));
  topL.appendChild(el('p', null,
    'Six offers on the ticket, one of them is yours, and there is no second go &mdash; '
    + 'so if you get the 5% rather than the 15%, that is the one you keep. '
    + 'Redeem it by calling ' + PHONE + '.'));
  top.appendChild(topL);
  top.appendChild(el('div', 'afcs-no', 'NO. ' + String(Math.floor(rnd() * 900000) + 100000)));
  card.appendChild(top);
  card.appendChild(el('div', 'afcs-perf'));

  var stage = el('div', 'afcs-stage');
  var prize = el('div', 'afcs-prize');
  var won   = el('div', 'afcs-won', 'You won');
  var line  = el('div', 'afcs-line', '');
  var note  = el('p', 'afcs-note', '');
  prize.appendChild(won); prize.appendChild(line); prize.appendChild(note);
  stage.appendChild(prize);
  var canvas = document.createElement('canvas');
  canvas.className = 'afcs-canvas';
  canvas.setAttribute('role', 'button');
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('aria-label', 'Scratch to reveal your offer. Activating this reveals it immediately.');
  stage.appendChild(canvas);
  card.appendChild(stage);

  var hint = el('div', 'afcs-hint', 'Drag across the panel to scratch');
  card.appendChild(hint);
  var revealBtn = el('button', 'afcs-reveal', 'Or just reveal it');
  revealBtn.type = 'button';
  card.appendChild(revealBtn);

  var codeBox = el('div', 'afcs-code');
  codeBox.style.display = 'none';
  var codeL = el('div');
  codeL.appendChild(el('div', 'afcs-code-l', 'Your redemption code'));
  var codeN = el('div', 'afcs-code-n', '');
  codeL.appendChild(codeN);
  var copyBtn = el('button', 'afcs-copy', 'Copy');
  copyBtn.type = 'button';
  codeBox.appendChild(codeL);
  codeBox.appendChild(copyBtn);
  card.appendChild(codeBox);

  var expiredBox = el('div', 'afcs-expired', '');
  expiredBox.style.display = 'none';
  card.appendChild(expiredBox);

  var act = el('div', 'afcs-act');
  act.style.display = 'none';
  var callBtn = el('a', 'afcs-btn afcs-btn-go', 'Call ' + PHONE + ' to redeem');
  callBtn.href = 'tel:' + TEL;
  var auditBtn = el('a', 'afcs-btn afcs-btn-line', 'Get the free audit first');
  auditBtn.href = '/free-contractor-marketing-audit/';
  act.appendChild(callBtn); act.appendChild(auditBtn);
  card.appendChild(act);

  var terms = el('div', 'afcs-terms', '');
  card.appendChild(terms);

  var live = el('div', 'afcs-sr');
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';
  card.appendChild(live);

  wrap.appendChild(card);
  MOUNT.appendChild(wrap);

  /* ── State ────────────────────────────────────────────────────── */
  var state = read();
  var current = state && byId(state.p) ? byId(state.p) : null;
  var drawn = false;      /* prize committed to storage */
  var revealed = false;

  function commit() {
    if (drawn || current) return;
    current = pick();
    var ts = Date.now();
    write({ p: current.id, code: makeCode(current), t: ts, v: 1 });
    state = read() || { p: current.id, code: makeCode(current), t: ts };
    drawn = true;
  }

  function paintPrize() {
    line.innerHTML = current.line;
    note.innerHTML = current.note;
  }

  function termsHtml() {
    var expTs = expiryFrom(state.t);
    var expired = Date.now() > expTs;
    return 'Terms: one ticket per company. <b>Redeemable by phone only on '
      + '<a href="tel:' + TEL + '" style="color:var(--lime,#A6CE39);text-decoration:none">' + PHONE
      + '</a></b> &mdash; quote your code. Valid for new engagements, cannot be combined with another '
      + 'offer or applied to work already quoted. Discounts apply to the first six months. '
      + '<b>Expires ' + fmt(expTs) + '</b>' + (expired ? ' &mdash; expired.' : '.')
      + '<br>Your result is stored in this browser so the ticket cannot be scratched twice. '
      + 'Nothing was stored until you scratched, nothing is sent to us, and clearing your browser '
      + 'data removes it.'
      + (canStore ? '' : '<br><b>Note:</b> your browser is blocking storage, so this result only '
          + 'lasts for this visit. Write the code down.');
  }

  function finish() {
    if (revealed) return;
    revealed = true;
    canvas.classList.add('gone');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.tabIndex = -1;
    hint.style.display = 'none';
    revealBtn.style.display = 'none';
    codeN.textContent = state.code;
    codeBox.style.display = 'flex';
    act.style.display = 'flex';
    terms.innerHTML = termsHtml();
    if (Date.now() > expiryFrom(state.t)) {
      expiredBox.innerHTML = 'This ticket is past its ' + VALID_DAYS + '-day window. '
        + 'Call ' + PHONE + ' anyway &mdash; we will usually still honour it, we would just '
        + 'rather say that on the phone than pretend the date does not exist.';
      expiredBox.style.display = 'block';
    }
    live.textContent = 'Revealed: ' + current.label + '. Your code is '
      + state.code.split('').join(' ') + '. Call ' + PHONE + ' to redeem.';
    setTimeout(function () { if (canvas.parentNode) canvas.parentNode.removeChild(canvas); }, 700);
  }

  /* Returning visitor — already scratched, show it and skip the canvas */
  if (current && state && state.code) {
    paintPrize();
    hint.textContent = 'You have already scratched this ticket';
    finish();
    wireCopy();
    return;
  }

  /* ── Canvas ───────────────────────────────────────────────────── */
  var ctx = canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) { commit(); paintPrize(); finish(); wireCopy(); return; }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var started = false;

  function sizeCanvas() {
    var r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    canvas.width  = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFoil(r.width, r.height);
  }

  function paintFoil(w, h) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0,   '#2A323C');
    g.addColorStop(.35, '#3C4550');
    g.addColorStop(.5,  '#4A5561');
    g.addColorStop(.65, '#3C4550');
    g.addColorStop(1,   '#272E37');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* brushed texture */
    ctx.strokeStyle = 'rgba(255,255,255,.035)';
    ctx.lineWidth = 1;
    for (var i = 0; i < h; i += 3) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i + 6); ctx.stroke();
    }

    /* the level device from the logo's "A" */
    var cx = w / 2, cy = h / 2 - 22;
    ctx.fillStyle = 'rgba(166,206,57,.55)';
    ctx.fillRect(cx - 34, cy - 2, 46, 4);
    ctx.beginPath(); ctx.arc(cx + 16, cy, 6, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,.62)';
    ctx.textAlign = 'center';
    ctx.font = '700 ' + Math.max(13, Math.min(17, w / 26)) + 'px "IBM Plex Mono",monospace';
    ctx.fillText('SCRATCH HERE', cx, cy + 34);
    ctx.fillStyle = 'rgba(255,255,255,.30)';
    ctx.font = '500 11px "IBM Plex Mono",monospace';
    ctx.fillText('ONE SCRATCH ONLY', cx, cy + 56);
  }

  sizeCanvas();
  window.addEventListener('resize', function () { if (!started && !revealed) sizeCanvas(); });

  var last = null, moves = 0;

  function pos(e) {
    var r = canvas.getBoundingClientRect();
    var t = (e.touches && e.touches[0]) || e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  function scratchTo(p) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 46;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    ctx.arc(p.x, p.y, 23, 0, Math.PI * 2);
    ctx.fill();
    last = p;
  }

  /* Sampled coarsely — reading every pixel on every move would stutter
     badly on a phone, and we only need a rough percentage. */
  function cleared() {
    var w = canvas.width, h = canvas.height;
    if (!w || !h) return 0;
    var d;
    try { d = ctx.getImageData(0, 0, w, h).data; } catch (e) { return 0; }
    var step = 32, hit = 0, seen = 0;
    for (var i = 3; i < d.length; i += 4 * step) {
      seen++;
      if (d[i] < 120) hit++;
    }
    return seen ? hit / seen : 0;
  }

  function begin(e) {
    if (revealed) return;
    started = true;
    commit();          /* prize is fixed here — before anything is visible */
    paintPrize();
    if (e.cancelable) e.preventDefault();
    last = pos(e);
    scratchTo(last);
    document.addEventListener('mousemove', move);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('mouseup', end);
    document.addEventListener('touchend', end);
  }
  function move(e) {
    if (revealed) return;
    if (e.cancelable) e.preventDefault();
    scratchTo(pos(e));
    if (++moves % 9 === 0 && cleared() > 0.48) finish();
  }
  function end() {
    last = null;
    document.removeEventListener('mousemove', move);
    document.removeEventListener('touchmove', move);
    document.removeEventListener('mouseup', end);
    document.removeEventListener('touchend', end);
    if (!revealed && cleared() > 0.42) finish();
  }

  canvas.addEventListener('mousedown', begin);
  canvas.addEventListener('touchstart', begin, { passive: false });

  /* Keyboard and anyone who would rather not drag. Same single draw. */
  function instant() {
    if (revealed) return;
    commit();
    paintPrize();
    finish();
  }
  revealBtn.addEventListener('click', instant);
  canvas.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); instant(); }
  });

  wireCopy();

  function wireCopy() {
    copyBtn.addEventListener('click', function () {
      var code = codeN.textContent;
      function done(ok) {
        copyBtn.textContent = ok ? 'Copied' : 'Select it';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { done(true); },
                                                 function () { done(false); });
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = code; ta.style.cssText = 'position:fixed;left:-9999px';
          document.body.appendChild(ta); ta.select();
          done(document.execCommand('copy'));
          document.body.removeChild(ta);
        } catch (e) { done(false); }
      }
    });
  }
})();
