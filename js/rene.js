/* ---------- René, simple mode ---------- */
let P = 'lina';
const RSTART = () => ({screen:'rhome', q:'', sortie:null, places:2, music:'pass', err:false, proposed:false, booked:false, step:0, visit:null, passUsed:false, reward:null, souvenirs:4});
let R = RSTART();
const RS = Object.fromEntries(VENUES.map(v=>[v.id,{t:v.nom, ville:v.ville, q:v.quand, icon:v.icon}]));
const rico = (n, bg, fg) => `<div class="ico" style="background:${bg};color:${fg}">${ic(n)}</div>`;
const rback = (to='rhome') => `<button class="back" data-rgo="${to}" aria-label="Retour">${ic('back')}</button>`;
const smsTxt = () => `Go CULTURE : Magalie, 19 ans, a réservé une place dans votre voiture pour ${RS[R.sortie||'louvre'].q.toLowerCase()}. Rendez-vous place Jean Jaurès.`;

function rresultsHTML(){
  const q = norm(R.q.trim());
  let list = VENUES.filter(v => !q || norm(v.nom+' '+v.ville+' '+v.type).includes(q));
  if(!q) list = list.slice(0,3);
  if(R.sortie && !list.some(v=>v.id===R.sortie)) list = [VENUES.find(v=>v.id===R.sortie), ...list];
  const head = q ? '' : '<p class="sub" style="margin:0">Près de chez vous</p>';
  if(!list.length) return `<div class="rcard"><b>Aucun lieu trouvé</b><div class="sub">Essayez « musée », « cinéma » ou le nom d'une ville.</div></div>`;
  return head + list.map(v=>`<button class="bigbtn tap" data-rsortie="${v.id}" aria-pressed="${R.sortie===v.id}">${rico(v.icon,'var(--r-soft)','var(--r-main)')}<span style="min-width:0">${v.nom}<br><span class="sub">${v.ville} · ${v.quand}</span></span></button>`).join('');
}

const RV = {
rhome(){ return `
  <div class="hero" role="img" aria-label="Deux personnes partent en voiture"><span class="brand blogo"><img src="images/logo-noir.png" alt="Go'Cultur"></span></div>
  <div class="row" style="gap:12px"><span class="av" style="width:60px;height:60px;font-size:20px;border:2px solid var(--fg);${PH(RENE)}" role="img" aria-label="Photo de profil de René">R</span><h1>Bonjour René</h1></div>
  <p class="sub" style="margin:0">Que souhaitez-vous faire&nbsp;?</p>
  ${R.booked && R.step<3 ? `<div class="sms"><b>Nouveau message</b><br>${smsTxt()}</div>`:''}
  <button class="bigbtn main tap" data-rgo="rpropose">${rico('car','rgba(255,255,255,.16)','#fff')}Proposer un trajet</button>
  <button class="bigbtn tap" data-rgo="rtrips">${rico('calendar','var(--r-sun)','var(--r-sun-ink)')}Mes trajets</button>
  <button class="bigbtn tap" data-rgo="rsouv">${rico('star','var(--r-rose)','var(--r-rose-ink)')}Mes souvenirs</button>
  <div style="flex:1"></div>
  <div class="rcard" style="background:var(--r-soft);border-color:var(--r-soft)"><b>Besoin d'aide&nbsp;?</b><div class="sub">Un proche peut gérer vos trajets avec vous grâce au compte aidant.</div></div>`},

rpropose(){ return `
  <div class="top">${rback()}<span class="sub">Proposer un trajet</span></div>
  <h2>Où allez-vous&nbsp;?</h2>
  <label class="search" for="rq">${ic('search')}<input id="rq" type="search" placeholder="Musée, cinéma, ville…" value="${esc(R.q)}" autocomplete="off" aria-label="Rechercher un lieu culturel"></label>
  <div class="list" id="rresults" style="gap:12px">${rresultsHTML()}</div>
  ${R.err?'<div class="err">Choisissez d\'abord un lieu dans la liste</div>':''}
  <h2 style="margin-top:6px">Combien de places libres&nbsp;?</h2>
  <div class="rcard stepper"><button data-ract="minus" aria-label="Une place de moins">−</button><b aria-live="polite">${R.places}</b><button data-ract="plus" aria-label="Une place de plus">+</button></div>
  <h2 style="margin-top:6px">Musique pendant le trajet</h2>
  <button class="bigbtn tap" data-rmusic="pass" aria-pressed="${R.music==='pass'}" style="font-size:18px;padding:14px 16px">${rico('music','var(--r-rose)','var(--r-rose-ink)')}Les passagers choisissent</button>
  <button class="bigbtn tap" data-rmusic="calme" aria-pressed="${R.music==='calme'}" style="font-size:18px;padding:14px 16px">${rico('moon','var(--r-soft)','var(--r-main)')}Ambiance calme</button>
  <p class="sub" style="margin:0">Départ de chez vous : place Jean Jaurès, Lens</p>
  <button class="btn btn-main tap" data-ract="propose">Proposer mon trajet</button>`},

rproposed(){ return `
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;text-align:center">
    <div class="pulse" style="background:var(--r-main);color:#fff">${ic('check')}</div>
    <h1>C'est en ligne&nbsp;!</h1>
    <p class="sub" style="margin:0">Votre trajet vers ${RS[R.sortie].t} est proposé avec ${R.places} place${R.places>1?'s':''}.<br>Nous vous prévenons par SMS dès qu'une personne réserve.</p>
  </div>
  <button class="btn btn-main tap" data-ract="simbook">Simuler : quelqu'un réserve</button>
  <button class="btn btn-ghost tap" data-rgo="rhome">Retour à l'accueil</button>`},

rtrips(){ if(!R.proposed) return `
  <div class="top">${rback()}<span class="sub">Mes trajets</span></div>
  <h2>Pas encore de trajet</h2><p class="sub" style="margin:0">Proposez votre premier trajet, cela prend une minute.</p>
  <div style="flex:1"></div><button class="btn btn-main tap" data-rgo="rpropose">Proposer un trajet</button>`;
  const s=RS[R.sortie]; return `
  <div class="top">${rback()}<span class="sub">Mes trajets</span></div>
  <div class="rcard">
    <div class="row">${rico(s.icon,'var(--r-soft)','var(--r-main)')}<div><b>${s.t}</b><div class="sub">${s.q}</div></div></div>
    <div style="border-top:2px solid var(--r-line);margin:14px 0 12px"></div>
    ${R.booked ? `<div class="row"><span class="av mag" style="width:46px;height:46px;font-size:17px;background:var(--r-rose);color:var(--r-rose-ink)">M</span><div><b>Magalie, 19 ans</b><div class="sub">Profil vérifié · 4,8</div></div></div>`
               : `<div class="sub">En attente de passagers</div>`}
  </div>
  ${R.booked ? `<div class="rcard" style="background:var(--r-soft);border-color:var(--r-soft)"><b>Rappels prévus</b><div class="sub">Un SMS la veille et un SMS 1 h avant le départ.</div></div>
     <div style="flex:1"></div><button class="btn btn-main tap" data-rgo="rday" data-rstep="0">C'est le jour J (démo)</button>`
   : `<div style="flex:1"></div><button class="btn btn-main tap" data-ract="simbook">Simuler : quelqu'un réserve</button>`}`},

rday(){ const st=R.step;
  if(st===0) return `
    <div class="top">${rback('rtrips')}<span class="sub">Jour J · départ</span></div>
    <h2>Montrez ce code à Magalie</h2>
    <div class="rcard" style="text-align:center"><div class="qr" id="qr" aria-label="Votre QR code"></div></div>
    <p class="sub" style="margin:0;text-align:center">Ou dites-lui ces 4 chiffres :</p>
    <div class="code4" aria-label="Code 4 7 2 9"><span>4</span><span>7</span><span>2</span><span>9</span></div>
    <div style="flex:1"></div><button class="btn btn-main tap" data-ract="scanned">Magalie a scanné le code</button>`;
  if(st===1) return `
    <div class="top">${rback('rtrips')}<span class="sub">Jour J · en route</span></div>
    <h1>Bonne route&nbsp;!</h1>
    <div class="pulse" style="background:var(--r-soft);color:var(--r-main)">${ic('check')}</div>
    <p style="margin:0;text-align:center;font-weight:600">Vous n'avez rien à faire.</p>
    <p class="sub" style="margin:0;text-align:center">Le téléphone vérifie tout seul que vous voyagez ensemble. Gardez-le simplement dans la voiture.</p>
    <div class="rcard" style="background:var(--r-soft);border-color:var(--r-soft)"><div class="row">${rico(R.music==='pass'?'music':'moon','var(--r-card)','var(--r-main)')}<div><b>${R.music==='pass'?'La playlist de Magalie passe dans la voiture':'Ambiance calme'}</b><div class="sub">${R.music==='pass'?'Elle a choisi 3 sons pour le trajet.':'Pas de playlist, comme vous l\'avez demandé.'}</div></div></div></div>
    <div style="flex:1"></div><button class="btn btn-main tap" data-ract="arrived">Nous sommes arrivés</button>`;
  return `
    <div class="top">${rback('rtrips')}<span class="sub">Jour J · arrivée</span></div>
    <h2>Vous restez sur place&nbsp;?</h2>
    <button class="bigbtn tap" data-ract="visit">${rico(RS[R.sortie].icon,'var(--r-soft)','var(--r-main)')}Oui, je visite aussi</button>
    <button class="bigbtn tap" data-ract="drop">${rico('car','var(--r-sun)','var(--r-sun-ink)')}Non, je dépose seulement Magalie</button>
    <p class="sub" style="margin:0">Dans les deux cas, votre trajet compte.</p>`},

rpass(){ const s=RS[R.sortie]; return `
  <div class="top">${rback('rhome')}<span class="sub">Votre Pass trajet</span></div>
  <h2>Montrez ce Pass à la caisse</h2>
  <div class="sms"><b>SMS reçu</b><br>Go CULTURE : votre Pass trajet pour ${s.t}. Code caisse : 8153. Réduction : −3 €.</div>
  ${passHTML({who:'René', lieu:s.t, date:dateOf(s.q), mode:'Covoiturage · 2 pers.', used:R.passUsed, usedMsg:'Trajet validé pour vous et Magalie.', simple:true})}
  <div style="flex:1"></div>
  ${R.passUsed ? `<button class="btn btn-main tap" data-ract="done">Voir mon souvenir</button>` : `<button class="btn btn-main tap" data-ract="caisse">Simuler : la caisse valide</button>`}`},

rdrop(){ return `
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;text-align:center">
    <div class="pulse" style="background:var(--r-main);color:#fff">${ic('check')}</div>
    <h1>Merci René&nbsp;!</h1>
    <p class="sub" style="margin:0">Magalie montre son Pass trajet à la caisse. Votre trajet est validé dès qu'il est scanné.</p>
    <div class="sms" style="text-align:left"><b>SMS reçu</b><br>Go CULTURE : le Pass de Magalie a été scanné. Votre trajet est validé. Merci&nbsp;!</div>
  </div>
  <button class="btn btn-main tap" data-ract="done">Voir mon souvenir</button>`},

rnew(){ const s=RS[R.sortie]; return `
  <h2>Votre souvenir</h2>
  <div class="polaroid" style="border:2px solid var(--r-line)">
    <div class="photo" style="height:150px;background:var(--r-main);color:#fff"><div class="big">${ic(s.icon,'width="130" height="130"')}</div><div style="font-family:var(--display);font-size:22px;font-weight:700">${s.t}</div><div style="font-size:14px">${dateOf(s.q)}</div></div>
    <div style="font-size:16px;margin-top:10px">Avec Magalie, 19 ans</div>
  </div>
  ${R.reward===null ? `
    <div class="rcard" style="background:var(--r-soft);border-color:var(--r-soft)"><b>Bravo, vous gagnez une place offerte</b><div class="sub">Pour avoir voyagé avec une autre génération.</div></div>
    <button class="bigbtn tap" data-ract="keep">${rico('ticket','var(--r-sun)','var(--r-sun-ink)')}Je la garde</button>
    <button class="bigbtn tap" data-ract="give">${rico('gift','var(--r-rose)','var(--r-rose-ink)')}Je l'offre à un jeune</button>`
  : `<div class="rcard"><b>${R.reward==='give'?'Merci pour ce beau geste':'Place enregistrée'}</b><div class="sub">${R.reward==='give'?'Votre place ira à un jeune de Lens par une association partenaire.':'Elle vous attend à l\'accueil de tous les lieux partenaires.'}</div></div>
     <div style="flex:1"></div><button class="btn btn-main tap" data-rgo="rhome">Retour à l'accueil</button>`}`},

rsouv(){ const k=['museum','ticket','mic','museum']; return `
  <div class="top">${rback()}<span class="sub">Mes souvenirs</span></div>
  <h2>${R.souvenirs} sorties partagées</h2>
  <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px">${Array.from({length:R.souvenirs}).map((_,i)=>`<div style="background:var(--r-card);border:2px solid var(--r-line);border-radius:14px;padding:7px 7px 18px;transform:rotate(${i%2?2:-2}deg)"><div style="background:${i%2?'var(--r-rose)':'var(--r-soft)'};color:${i%2?'var(--r-rose-ink)':'var(--r-main)'};border-radius:9px;aspect-ratio:1;display:flex;align-items:center;justify-content:center">${ic(k[i%4],'width="40" height="40"')}</div></div>`).join('')}</div>
  <div style="flex:1"></div>
  <button class="btn btn-ghost tap" data-ract="reset">Recommencer la démo</button>`}
};
