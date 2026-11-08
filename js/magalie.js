/* Parcours de Magalie (19 ans) : état S, navigation et écrans (objet V) */
function crResults(){
  const q = norm(S.cr.q.trim());
  const list = VENUES.filter(v => !q || norm(v.nom+' '+v.ville+' '+v.type).includes(q)).slice(0,6);
  if(!list.length) return `<div class="card" style="background:var(--panel2)"><b>Aucun lieu trouvé</b><div class="sub">Essaie « musée », « cinéma » ou une ville.</div></div>`;
  return list.map(v=>{const c=TYPECOL[v.type];return `<button class="opt tap" data-crvenue="${v.id}" aria-pressed="${S.cr.venue===v.id}"><div class="row"><div class="ico" style="background:${c[0]};color:${c[1]};border:1.5px solid var(--fg)">${ic(v.icon)}</div><div style="min-width:0"><b>${v.nom}</b><div class="sub">${v.type} · ${v.ville} · ${v.quand}</div></div></div></button>`}).join('');
}
const START = () => ({
  screen:'welcome', role:'passager', mode:'covoit', sortie:'louvre', trajetId:'rene', from:'home',
  q:'', filter:'Tout', tq:'', tracks:[], spotify:false, dIdx:0, dHist:[], favs:[], cr:CRSTART(), myCount:0, mine:[], booked:false, tripStep:0, passUsed:false, tcUsed:false, reward:null, crew:null, playlist:false, lastQuest:'',
  quests:{plein:2, pont:0, retour:0, combo:1, zero:0}, collectif:72,
  sorties:3, euros:11, co2:26, cards:3
});
let S = START();
const curS = () => getSortie(S.sortie);
const curT = () => curS().trajets.find(x=>x.id===S.trajetId) || curS().trajets[0];
const dateOf = q => q.split('·')[0].trim();
const allTracks = () => [...curT().music.map(m=>({...m, by:curT()})), ...S.tracks.map(id=>({...CAT(id), id, by:null}))];
const trkRow = m => `<div class="trk"><span class="av${m.by?'':' mag'}" style="width:28px;height:28px;font-size:11px;background:${m.by?m.by.col:'var(--pink)'};color:${m.by?m.by.ink:'var(--pink-ink)'};${PH(m.by)}">${m.by?m.by.init:'M'}</span><div style="min-width:0;flex:1"><b>${m.t}</b><div class="sub">${m.a}</div></div>${m.by?'':`<button class="addbtn rm" data-rmtrack="${m.id}" aria-label="Retirer ${m.t}">${ic('x')}</button>`}</div>`;
function tresultsHTML(){
  if(S.tracks.length>=3) return `<div style="padding:8px 0"><b>Tes 3 sons sont dans la playlist</b><div class="sub">Retire un son pour en choisir un autre.</div></div>`;
  const q=norm(S.tq.trim());
  const list=CATALOG.filter(c=>!S.tracks.includes(c.id)&&(!q||norm(c.t+' '+c.a).includes(q))).slice(0,5);
  if(!list.length) return `<div class="sub" style="padding:8px 0">Aucun son trouvé.</div>`;
  return list.map(c=>`<div class="trk"><div style="min-width:0;flex:1"><b>${c.t}</b><div class="sub">${c.a}</div></div><button class="addbtn" data-addtrack="${c.id}" aria-label="Ajouter ${c.t}">${ic('plus')}</button></div>`).join('');
}
const nowHM = () => { const d=new Date(); return d.getHours()+' h '+String(d.getMinutes()).padStart(2,'0'); };

function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2400)}
function go(screen, extra={}){S.notif=false; Object.assign(S, extra, {screen}); render(); $('#screen').scrollTop=0}

function sheetHTML(){
  return `<div class="sheet-bg"><button class="scrim" data-act="notifclose" aria-label="Fermer les actus"></button>
  <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-t">
    <div class="grab" aria-hidden="true"></div>
    <div class="between"><h2 id="sheet-t">Offres et défis du moment</h2><button class="back" id="sheet-x" data-act="notifclose" aria-label="Fermer">${ic('x')}</button></div>
    <p class="sub" style="margin:0">Offres d'exemple imaginées pour la démo.</p>
    ${NEWS.map(n=>`<article class="news"><div class="between"><div class="src"><span style="width:10px;height:10px;border-radius:50%;background:${n.col};border:1.5px solid var(--fg)"></span>${n.src}</div><span class="pill" style="background:${n.kind==='Offre'?'var(--pink)':'var(--lime)'};color:var(--fg);border:1.5px solid var(--fg);font-size:11px;padding:2px 9px">${n.kind}</span></div>
      <h3>${n.title}</h3><p>${n.text}</p>
      ${n.prog ? `<div><div class="bar" style="margin-top:2px"><i style="width:${Math.max(4,Math.round(n.prog[0]/n.prog[1]*100))}%;background:var(--pink)"></i></div><div class="sub" style="margin-top:4px">${n.prog[0]}/${n.prog[1]} ${n.prog[1]>1?'sorties':'sortie'}</div></div>` : ''}
      <div class="between" style="gap:8px;flex-wrap:wrap"><span class="row" style="gap:6px;font-size:13px;font-weight:700"><span style="width:16px;height:16px;flex:none">${ic('gift','width="16" height="16"')}</span>${n.reward}</span><span class="sub">${n.until}</span></div>
      ${n.sortie ? `<button class="cta" data-sortie="${n.sortie}">${n.cta}</button>` : `<button class="cta" data-act="chal">${n.cta}</button>`}</article>`).join('')}
  </div></div>`;
}
const topbar = (title, to='home') => `<div class="top"><button class="back" data-go="${to}" aria-label="Retour">${ic('back')}</button><span class="sub">${title}</span></div>`;

function passHTML({who, lieu, date, mode, used, usedMsg, simple}){
  return `<div class="pass">
    <div class="pass-head"><span>Pass trajet</span><span>−3 €</span></div>
    <div class="pass-body">
      <div><span>${simple?'Voyageur':'Voyageuse'}</span><b>${who}</b></div>
      <div><span>Lieu</span><b>${lieu}</b></div>
      <div><span>Date</span><b>${date}</b></div>
      <div><span>Trajet</span><b>${mode}</b></div>
    </div>
    ${simple ? `<p style="margin:6px 16px 8px;text-align:center;font-size:15px;color:var(--paper-muted)">Code caisse</p><div class="code4" aria-label="Code 8 1 5 3" style="padding-bottom:16px"><span>8</span><span>1</span><span>5</span><span>3</span></div>`
             : `<div class="qr" id="qr" aria-label="QR code du Pass trajet"></div><div class="pass-foot">Nouveau code dans <span id="cd">30</span> s · usage unique · valable aujourd'hui</div>`}
    ${used ? `<div class="used">${ic('check')}<b>Réduction appliquée</b><span style="font-size:${simple?17:13}px">${usedMsg}</span></div>` : ''}
  </div>`;
}

function resultsHTML(){
  const q = norm(S.q.trim());
  const list = VENUES.filter(v => (S.filter==='Tout' || v.type===S.filter) && (!q || norm(v.nom+' '+v.ville+' '+v.type).includes(q)));
  if(!list.length) return `<div class="card" style="background:var(--panel2)"><b>Aucun lieu trouvé</b><div class="sub">Essaie « musée », « cinéma » ou le nom d'une ville.</div></div>`;
  return list.map(v=>{const c=TYPECOL[v.type];return `<button class="card tap" data-venue="${v.id}"><div class="row"><div class="ico" style="background:${c[0]};color:${c[1]}">${ic(v.icon)}</div><div style="min-width:0;flex:1"><b>${v.nom}</b><div class="sub">${v.type} · ${v.ville} · ${v.temps} de Lens</div><div style="font-size:12px;color:var(--pink-deep);font-weight:600;margin-top:2px">${v.trajets} trajet${v.trajets>1?'s':''} proposé${v.trajets>1?'s':''}</div></div></div></button>`}).join('');
}

const V = {
welcome(){ return `
  <div class="hero" style="height:250px" role="img" aria-label="Deux jeunes partent en road trip en voiture"><span class="brand blogo big"><img src="images/logo-noir.png" alt="Go'Cultur"></span></div>
  <div style="flex:1;display:flex;flex-direction:column;gap:14px;justify-content:center">
    <h1 style="font-size:27px">Fais le plein<br>de culture.</h1>
    <p class="sub" style="font-size:15px;margin:0">Partage la route vers les expos, concerts et ciné près de chez toi. Gagne des places en remplissant les voitures.</p>
    <p style="font-weight:600;margin:6px 0 0">Tu es plutôt…</p>
    <button class="role tap" data-role="passager" aria-pressed="${S.role==='passager'}"><div class="row"><div class="ico" style="background:var(--pink);color:var(--pink-ink)">${ic('ticket')}</div><div><b>Je cherche un trajet</b><div class="sub">Pas de voiture, pas de souci</div></div></div></button>
    <button class="role tap" data-role="conducteur" aria-pressed="${S.role==='conducteur'}"><div class="row"><div class="ico" style="background:var(--ochre);color:var(--ochre-ink)">${ic('car')}</div><div><b>J'ai une voiture</b><div class="sub">Remplis-la, partage les frais</div></div></div></button>
  </div>
  <button class="btn btn-main tap" data-go="home">C'est parti</button>`},

home(){ const q=S.quests; return `
  <div class="hero" role="img" aria-label="Deux jeunes partent en road trip en voiture"><span class="hero-chip">Lens · jeudi</span><button class="hero-bell" data-act="notif" aria-label="Actus des partenaires${S.notifSeen?'':', 5 nouvelles'}">${ic('bell')}${S.notifSeen?'':'<span class="dot" aria-hidden="true">5</span>'}</button><span class="brand blogo"><img src="images/logo-noir.png" alt="Go'Cultur"></span></div>
  <h1>Salut Magalie, on sort où ce week-end&nbsp;?</h1>
  <button class="search" data-go="search">${ic('search')}<span class="sub" style="padding:11px 0;font-size:15px">Un lieu, une expo, une ville…</span></button>
  ${S.booked && S.tripStep<3 ? `<button class="card tap" data-go="trip" style="background:var(--teal);color:var(--teal-ink)"><div class="between"><b>Ton prochain trajet</b><span class="pill" style="background:var(--teal-ink);color:var(--teal)">${curT().h}</span></div><div style="font-size:13px">Avec ${curT().nom} · ${curT().depart} → ${curS().lieu}</div></button>`:''}
  <button class="card tap" data-tab="quests" style="background:var(--lime);color:var(--lime-ink)">
    <div class="between"><span class="pill" style="background:var(--lime-ink);color:var(--lime)">${ic('target','width="14" height="14"')} Quête du mois</span><span style="font-weight:600">${Math.min(q.plein,3)}/3</span></div>
    <h3 style="margin-top:10px">Voiture pleine</h3>
    <div style="font-size:13px">Viens à 3 dans une voiture, gagne ta place de ciné</div>
  </button>
  <h3 style="margin-top:6px">Expos près de toi</h3>
  ${["louvre","neufbis","conservation","lewarde"].map(k=>{const s=getSortie(k);return `<button class="card tap" data-sortie="${k}"><div class="row"><div class="ico" style="border:1.5px solid var(--fg);${s.img?`background:center/cover no-repeat url('${s.img}')`:`background:${s.bg};color:${s.ink}`}">${s.img?"":ic(s.icon)}</div><div style="min-width:0"><b>${s.lieu}</b><div class="sub">${s.quand}</div><div style="font-size:12px;color:var(--pink-deep);font-weight:600;margin-top:2px">${s.dispo}</div></div></div></button>`}).join("")}
  <h3 style="margin-top:6px">Concerts et sorties</h3>
  ${['lille','cinearras'].map(k=>{const s=getSortie(k);return `<button class="card tap" data-sortie="${k}"><div class="row"><div class="ico" style="background:${s.bg};color:${s.ink}">${ic(s.icon)}</div><div style="min-width:0"><b>${s.titre}</b><div class="sub">${s.quand}</div><div style="font-size:12px;color:var(--pink-deep);font-weight:600;margin-top:2px">${s.dispo}</div></div></div></button>`}).join('')}
  <div class="card" style="background:var(--panel2)"><div class="row"><div class="ico" style="background:var(--ink);color:var(--teal)">${ic('leaf')}</div><div><b>${S.co2} kg de CO₂ évités</b><div class="sub">depuis que tu partages tes trajets</div></div></div></div>`},

creer(){
  const cr=S.cr, st=cr.step, v=VENUES.find(x=>x.id===cr.venue);
  const head=`<div class="top"><button class="back" data-act="crprev" aria-label="Retour">${ic('back')}</button><span class="sub">Créer une sortie · ${st<5?'étape '+st+' sur 4':'aperçu'}</span></div><div class="steps" aria-hidden="true">${[1,2,3,4].map(i=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div>`;
  const err = cr.err ? `<div class="crerr" role="alert">${cr.err}</div>` : '';
  const next = (label='Suivant') => `<button class="btn btn-main tap" data-act="crnext">${label}</button>`;
  if(st===1) return `${head}<h1>Où on va&nbsp;?</h1>
    <label class="search" for="cq">${ic('search')}<input id="cq" type="search" placeholder="Un lieu, une ville…" value="${esc(cr.q)}" autocomplete="off" aria-label="Rechercher un lieu culturel"></label>
    <div class="list" id="crres">${crResults()}</div>${err}${next()}`;
  if(st===2){
    const ms=cr.modes, soft=ms.length>0 && ms.every(k=>['velo','skate','pied'].includes(k)), mins=v?parseInt(v.temps):0, car=ms.includes('voiture');
    return `${head}<h1>Comment on y va&nbsp;?</h1>
    <p class="sub" style="margin:0">Choisis un ou plusieurs modes, dans l'ordre du trajet.</p>
    <div class="modegrid" role="group" aria-label="Modes de transport">${Object.entries(MODES).map(([k,m])=>{const i=ms.indexOf(k);return `<button class="modebtn tap" data-crmode="${k}" aria-pressed="${i>=0}">${i>=0&&ms.length>1?`<span class="ord" aria-hidden="true">${i+1}</span>`:''}${ic(m[0])}${m[1]}</button>`}).join('')}</div>
    ${ms.length>1 ? `<div class="card" style="background:var(--panel2)"><b>Trajet mixte : ${modeLabel(ms)}</b><div class="sub">Explique les étapes dans ton message à l'étape 4 (où on change de mode, à quelle heure).</div></div>` : ''}
    ${soft && mins>15 ? `<div class="warn"><b>${v.nom} est à ${v.temps} de Lens en voiture.</b> Sans voiture ni transports, ça risque d'être long. Ajoute le train ou la voiture pour une partie du trajet&nbsp;?</div>` : ''}
    <label class="fld" for="crrdv">Point de rendez-vous<select id="crrdv">${RDV.map(r=>`<option ${cr.rdv===r?'selected':''}>${r}</option>`).join('')}</select></label>
    <label class="fld" for="crh">Heure de départ<input id="crh" type="time" value="${cr.heure}"></label>
    ${ms.length ? `<div class="fld">${car?'Places dans la voiture':'Taille de la bande'}<div class="card stepper2"><button data-act="crminus" aria-label="Une place de moins">−</button><b aria-live="polite">${cr.places}</b><button data-act="crplus" aria-label="Une place de plus">+</button></div></div>` : ''}
    ${err}${next()}`;
  }
  if(st===3) return `${head}<h1>Avec qui&nbsp;?</h1>
    ${Object.entries(WHO).map(([k,l])=>`<button class="opt tap" data-crwho="${k}" aria-pressed="${cr.who===k}"><b>${l}</b><div class="sub">${WHOD[k]}</div></button>`).join('')}
    <h3>Filtres de confiance</h3>
    <div class="chips" role="group" aria-label="Filtres de confiance">${FILTRES.map(f=>`<button data-crfilt="${f}" aria-pressed="${cr.filtres.includes(f)}">${f}</button>`).join('')}</div>
    <h3>Pour rejoindre</h3>
    <div class="seg" role="group" aria-label="Comment rejoindre"><button data-crvalid="direct" aria-pressed="${cr.valid==='direct'}">Directement</button><button data-crvalid="demande" aria-pressed="${cr.valid==='demande'}">Sur demande</button></div>
    ${next()}`;
  if(st===4){
    const base=getSortie(v.id);
    const opts=[['lieu',base.img,'Photo du lieu'],['images/header.webp','images/header.webp','Photo road trip'],['images/concert.jpg','images/concert.jpg','Photo concert']];
    return `${head}<h1>L'ambiance</h1>
    <div class="fld">Photo de couverture<div class="row" style="gap:10px">${opts.map(([k,src,l])=>`<button class="thumb" data-crphoto="${k}" aria-pressed="${cr.photo===k}" aria-label="${l}" style="${src?`background-image:url('${src}')`:`background:${base.bg};color:${base.ink}`}">${src?'':ic(v.icon)}</button>`).join('')}</div></div>
    <label class="fld" for="crt">Titre de la sortie<input id="crt" type="text" maxlength="40" value="${esc(cr.titre)}" placeholder="Bande à vélo vers le Louvre-Lens"></label>
    <label class="fld" for="crmsg">Ton message<span class="sub" style="font-weight:400">Raconte comment la sortie va se passer : le programme, les étapes, l'ambiance.</span><textarea id="crmsg" maxlength="280" placeholder="On se retrouve à 13 h 30 à la gare de Lens. Vélo jusqu'à la gare, train jusqu'à Lille, puis concert ! On boit un verre après si vous êtes chauds.">${esc(cr.message)}</textarea><span class="sub" style="font-weight:400;text-align:right"><span id="crmsgc">${cr.message.length}</span>/280</span></label>
    <div class="fld">Tags<div class="chips" role="group" aria-label="Tags">${TAGS.map(tg=>`<button data-crtag="${tg}" aria-pressed="${cr.tags.includes(tg)}">${tg}</button>`).join('')}</div></div>
    <button class="opt tap" data-act="crplaylist" aria-pressed="${cr.playlist}"><div class="between"><span class="row" style="gap:8px"><span style="width:20px;height:20px;flex:none">${ic('music','width="20" height="20"')}</span><b>Playlist du trajet</b></span><span class="sub">${cr.playlist?'Activée':'Désactivée'}</span></div></button>
    ${err}${next("Voir l'aperçu")}`;
  }
  const base=getSortie(v.id), img = cr.photo==='lieu' ? base.img : cr.photo;
  return `${head}<h1>Aperçu</h1><p class="sub" style="margin:0">Voilà comment ta sortie apparaîtra dans Découverte.</p>
    <div class="dcard" style="height:340px;cursor:default;${img?`background-image:url('${img}')`:`background-color:${base.bg}`}">
      ${img?'<span class="vh">Photo de couverture de la sortie</span>':`<div class="dicon" style="color:${base.ink}">${ic(v.icon)}</div>`}
      <span class="pill dpill"><span class="av mag" style="width:20px;height:20px;font-size:10px">M</span>Organisé par toi · ${cr.places} places</span>
      <div class="dinfo"><h2>${esc(cr.titre)}</h2><div class="dm">${v.quand}</div><div class="dp">${base.lieu.replace(', ',' – ')}</div><div class="dt">${modeLabel(cr.modes)} · départ ${cr.rdv} · ${fmtH(cr.heure)}</div></div>
    </div>
    ${cr.message.trim() ? `<div class="card"><div class="row" style="gap:8px"><span class="av mag" style="width:28px;height:28px">M</span><b>Le mot de Magalie</b></div><p class="msg">${esc(cr.message.trim())}</p></div>` : ''}
    <div class="row" style="flex-wrap:wrap;gap:6px">${cr.tags.map(tg=>`<span class="pill" style="background:var(--lime);color:var(--lime-ink);border:1.5px solid var(--fg)">${tg}</span>`).join('')}<span class="pill" style="background:#fff;border:1.5px solid var(--fg)">${WHO[cr.who]}${cr.valid==='demande'?' · sur demande':''}</span>${cr.filtres.map(f=>`<span class="pill" style="background:#fff;border:1.5px solid var(--fg)">${f}</span>`).join('')}</div>
    <button class="btn btn-main tap" data-act="crpublish">Publier ma sortie</button>
    <button class="btn btn-ghost tap" data-act="crprev">Modifier</button>`;
},

creerok(){ return `
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:center">
    <div class="pulse" style="background:var(--lime);color:var(--lime-ink)">${ic('check')}</div>
    <h1>Ta sortie est en ligne&nbsp;!</h1>
    <p class="sub" style="margin:0">Elle apparaît en premier dans Découverte. Tu seras prévenue dès que quelqu'un la rejoint.</p>
  </div>
  <button class="btn btn-main tap" data-act="crsee">Voir dans Découverte</button>
  <button class="btn btn-ghost tap" data-act="crnew">Créer une autre sortie</button>`},

decouverte(){
  const head = `<div class="dhead"><img class="logoimg" src="images/logo.png" alt="Go'Cultur"><div class="row" style="gap:2px"><button class="iconbtn" data-act="notif" aria-label="Actus des partenaires${S.notifSeen?'':', 5 nouvelles'}">${ic('bell','style="fill:currentColor"')}${S.notifSeen?'':'<span class="dot" aria-hidden="true">5</span>'}</button><button class="iconbtn" data-go="search" aria-label="Filtres">${ic('sliders')}</button></div></div>`;
  if(S.dIdx >= DECK.length) return `${head}
    <div class="card" style="text-align:center;padding:24px 16px"><h2>Tu as tout vu&nbsp;!</h2><p class="sub" style="margin:8px 0 0">De nouveaux trajets arrivent chaque jour.</p></div>
    <h3>Tes favoris (${S.favs.length})</h3>
    ${S.favs.length ? S.favs.map(i=>{const c=DECK[i],s=getSortie(c.s),t=s.trajets.find(x=>x.id===c.t)||s.trajets[0];return `<button class="card tap" data-dopen="${i}"><div class="row"><span class="av" style="background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span><div style="min-width:0"><b>${s.titre}</b><div class="sub">${s.quand} · avec ${t.nom}</div></div></div></button>`}).join('') : '<p class="sub" style="margin:0">Aucun favori pour l’instant. Touche l’étoile pour garder un trajet.</p>'}
    <button class="btn btn-main tap" data-act="dreset">Revoir les trajets</button>`;
  const c=DECK[S.dIdx], s=getSortie(c.s), t=s.trajets.find(x=>x.id===c.t)||s.trajets[0];
  return `${head}
  ${(()=>{const usePh = t.photo && !c.mine; return `<div class="dcard" id="dcard" style="${usePh?`background-image:url('${t.photo}');background-position:center 20%`:s.img?`background-image:url('${s.img}')`:`background-color:${s.bg}`}">
    ${usePh ? `<span class="vh">Photo de ${t.nom}, conducteur du trajet</span>` : s.img ? `<span class="vh">${s.imgAlt}</span>` : `<div class="dicon" style="color:${s.ink}">${ic(s.icon)}</div>`}`})()}
    <span class="pill dpill"><span class="av" style="width:20px;height:20px;font-size:10px;background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span>${c.mine?'Organisé par toi':t.nom+', '+t.age+' ans'} · ${t.places} places</span>
    <span class="dstamp like" id="slike">Garder</span><span class="dstamp nope" id="snope">Passer</span>
    <div class="dinfo"><h2>${s.titre}</h2><div class="dm">${s.quand}</div><div class="dp">${s.lieu.replace(', ',' – ')}</div><div class="dt">${modeLabel(modeList(t))} · départ ${t.depart} · ${t.h} · ${t.part}</div></div>
  </div>
  <div class="dbtns">
    <button class="dbtn sm" data-act="dback" aria-label="Revenir au trajet précédent">${ic('refresh')}</button>
    <button class="dbtn" data-act="dpass" aria-label="Passer ce trajet">${ic('x')}</button>
    <button class="dbtn" data-act="dlike" aria-label="Garder ce trajet en favori">${ic('star','style="fill:currentColor"')}</button>
  </div>
  ${t.msg ? `<div class="card"><div class="row" style="gap:8px"><span class="av" style="width:28px;height:28px;font-size:11px;background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span><b>Le mot de ${t.nom}</b></div><p class="msg">${esc(t.msg)}</p></div>` : ''}
  <button class="btn btn-main tap" data-act="dopen">Voir le trajet</button>
  <h3 style="color:var(--pink-deep)">Top 3 de la playlist de ${t.nom}</h3>
  <div class="top3">${t.music.slice(0,3).map(m=>`<div class="row"><div class="cover">${ic('music')}</div><div style="min-width:0"><b>${m.t}</b><span>${m.a}</span></div></div>`).join('')}</div>
  <p class="sub" style="margin:0;text-align:center">Glisse la carte à droite pour garder, à gauche pour passer.</p>`;
},

search(){ return `
  <h1>Où veux-tu aller&nbsp;?</h1>
  <label class="search" for="q">${ic('search')}<input id="q" type="search" placeholder="Louvre-Lens, cinéma, Lille…" value="${esc(S.q)}" autocomplete="off" aria-label="Rechercher un lieu culturel"></label>
  <div class="chips" role="group" aria-label="Type de lieu">${['Tout','Musée','Cinéma','Concert','Théâtre'].map(c=>`<button data-filter="${c}" aria-pressed="${S.filter===c}">${c}</button>`).join('')}</div>
  <div class="list" id="results">${resultsHTML()}</div>`},

sortie(){ const s=curS(); return `
  ${topbar('Sortie', S.from)}
  ${s.img ? `<div class="venue-img" style="background-image:url('${s.img}')"><span class="vh">${s.imgAlt}</span><span class="pill">${s.lieu}</span>
      <div class="venue-info"><h2>${s.titre}</h2><div style="margin-top:2px">${s.quand} · <b>${s.prix.replace(' avec ton Pass trajet',' en covoit')}</b></div></div></div>`
  : `<div class="card" style="background:${s.bg};color:${s.ink};padding:18px"><div style="width:40px;height:40px;margin-bottom:10px">${ic(s.icon,'width="40" height="40"')}</div><h2>${s.titre}</h2><div style="font-size:14px">${s.quand}</div><div style="font-size:13px;margin-top:6px;font-weight:600">${s.prix}</div></div>`}
  <h3>Comment tu y vas&nbsp;?</h3>
  <div class="seg" role="group" aria-label="Mode de transport"><button data-mode="covoit" aria-pressed="${S.mode==='covoit'}">Covoiturage</button><button data-mode="tc" aria-pressed="${S.mode==='tc'}">Transports en commun</button></div>
  ${S.mode==='covoit' ? s.trajets.map(t=>`<button class="card tap" data-trajet="${t.id}"><div class="between"><div class="row"><span class="av" style="background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span><div><b>${t.nom}, ${t.age} ans</b><div class="sub">${t.depart} · ${t.h}</div></div></div><div style="text-align:right"><b>${t.part}</b><div class="sub">${t.places} place${t.places>1?'s':''}</div></div></div>${t.age>=50?`<div style="margin-top:8px"><span class="pill" style="background:var(--teal);color:var(--teal-ink)">Quête Pont des générations</span></div>`:''}</button>`).join('')
  : `<div class="card"><div class="row"><div class="ico" style="background:var(--teal);color:var(--teal-ink)">${ic(s.bus.icon)}</div><div><b>${s.bus.ligne}</b><div class="sub">${s.bus.duree} · ${s.bus.prix}</div></div></div><div style="margin-top:8px"><span class="pill" style="background:var(--lime);color:var(--lime-ink)">Quête Zéro voiture</span></div></div>
     <p class="sub" style="margin:0">Ton billet sert aussi de Pass trajet : tu le montres à la caisse pour ta réduction.</p>
     <button class="btn btn-main tap" data-act="bus">Acheter le billet couplé</button>`}
  <p class="sub" style="margin:0">Pas de trajet qui te va&nbsp;? Active une alerte, on te prévient dès qu'une place se libère.</p>`},

trajet(){ const t=curT(), s=curS(); return `
  ${topbar('Trajet vers '+s.lieu,'sortie')}
  <h2>${dateOf(s.quand)}, ${t.h}</h2>
  <div class="sub">${t.depart} → ${s.lieu} · ${t.duree}</div>
  <div class="card">
    <div class="row"><span class="av" style="width:48px;height:48px;font-size:17px;background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span><div><b style="font-size:16px">${t.nom}, ${t.age} ans</b><div class="sub row" style="gap:4px"><span style="width:14px;height:14px;display:inline-block">${ic('star','width="14" height="14"')}</span>${t.note} · profil vérifié</div></div></div>
    <div class="row" style="flex-wrap:wrap;gap:6px;margin-top:10px"><span class="pill" style="background:${t.col};color:${t.ink}">${t.tag}</span>${t.age>=50?'<span class="pill" style="background:var(--teal);color:var(--teal-ink)">Pont des générations</span>':''}</div>
    <div class="row" style="gap:6px;margin-top:10px;font-size:13px"><span style="width:16px;height:16px;flex:none">${ic('music','width="16" height="16"')}</span>${S.spotify ? `<span>Vous aimez tous les deux <b>${t.common}</b></span>` : `<span class="sub">Connecte Spotify pour voir vos goûts en commun</span>`}</div>
  </div>
  ${modeList(t).length>1 || t.mine ? `<div class="card" style="background:var(--panel2)"><div class="row" style="gap:8px;flex-wrap:wrap">${modeList(t).map((k,i)=>`${i?'<span aria-hidden="true">→</span>':''}<span class="pill" style="background:#fff;border:1.5px solid var(--fg)">${ic(MODES[k][0],'width="14" height="14"')} ${MODES[k][1]}</span>`).join('')}</div></div>` : ''}
  ${t.msg ? `<div class="card"><b>Le mot de ${t.nom}</b><p class="msg">${esc(t.msg)}</p></div>` : ''}
  <div class="grid3"><div class="stat"><span class="sub">Places</span><b>${t.places}</b></div><div class="stat"><span class="sub">Ta part</span><b>${t.part}</b></div><div class="stat"><span class="sub">Retour</span><b style="font-size:18px">${t.retour}</b></div></div>
  <button class="card tap" data-go="playlist" style="background:var(--lime);color:var(--lime-ink)"><div class="between"><div class="row"><span style="width:22px;height:22px;flex:none">${ic('music','width="22" height="22"')}</span><div><b>Playlist du trajet</b><div style="font-size:13px">${S.tracks.length ? S.tracks.length+'/3 de tes sons ajoutés · '+allTracks().length+' sons au total' : 'Ajoute 3 sons avant de partir'}</div></div></div><span style="width:18px;height:18px;transform:rotate(180deg);flex:none">${ic('back','width="18" height="18"')}</span></div></button>
  <div class="card" style="background:var(--panel2)"><div class="row"><span style="width:20px;height:20px;color:var(--lime);flex:none">${ic('pin','width="20" height="20"')}</span><span style="font-size:13px">Rendez-vous ${t.depart}. À l'arrivée, tu reçois ton Pass trajet pour la réduction à la caisse.</span></div></div>
  <div style="flex:1"></div>
  ${t.mine ? `<button class="btn btn-main tap" data-act="share">Partager ma sortie</button>` : `<button class="btn btn-main tap" data-act="book">Je monte à bord</button>`}`},

playlist(){ const t=curT(), s=curS(), all=allTracks(); return `
  ${topbar('Playlist du trajet','trajet')}
  <h2>${t.depart} → ${s.lieu}</h2>
  <div class="sub">${dateOf(s.quand)} · playlist collaborative</div>
  ${S.spotify ? `<div class="card" style="background:var(--panel2)"><div class="row"><div class="ico" style="background:var(--lime);color:var(--lime-ink)">${ic('check')}</div><div><b>Spotify connecté</b><div class="sub">Goût en commun avec ${t.nom} : <b>${t.common}</b></div></div></div></div>`
    : `<button class="card tap" data-act="spotify" style="background:var(--fg);color:#fff"><div class="row"><div class="ico" style="background:var(--lime);color:var(--lime-ink)">${ic('music')}</div><div><b>Connecter Spotify</b><div style="font-size:13px;color:#E6E1EA">Pour créer la playlist sur ton compte et voir vos goûts en commun</div></div></div></button>`}
  <h3>Dans la playlist (${all.length})</h3>
  <div class="card" style="padding:4px 12px">${all.map(trkRow).join('')}</div>
  <h3>Ajoute tes sons (${S.tracks.length}/3)</h3>
  <label class="search" for="tq">${ic('search')}<input id="tq" type="search" placeholder="Un titre, un artiste…" value="${esc(S.tq)}" autocomplete="off" aria-label="Rechercher un son"></label>
  <div class="card" style="padding:4px 12px" id="tresults">${tresultsHTML()}</div>
  <p class="sub" style="margin:0">Dans la voiture, ${t.nom} lance la playlist. Avec Spotify Premium, vous pouvez aussi ajouter des sons en direct avec Spotify Jam.</p>
  <button class="btn btn-main tap" data-go="trajet">C'est bon</button>`},

booked(){ const t=curT(); return `
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:center">
    <div class="pulse" style="background:var(--lime);color:var(--lime-ink)">${ic('check')}</div>
    <h1>C'est réservé&nbsp;!</h1>
    <p class="sub" style="font-size:15px;margin:0">${t.nom} t'attend ${dateOf(curS().quand).toLowerCase()} à ${t.h}, ${t.depart}.<br>Tu recevras un rappel la veille et 1 h avant.</p>
    <div class="card" style="text-align:left"><div class="row"><span class="av" style="background:${t.col};color:${t.ink};${PH(t)}">${t.init}</span><div><b>${t.nom}, ${t.age} ans</b><div class="sub">Envoie-lui un petit mot&nbsp;?</div></div></div></div>
  </div>
  <button class="btn btn-main tap" data-go="trip" data-step="0">Simuler le jour J</button>
  <button class="btn btn-ghost tap" data-go="home">Retour à l'accueil</button>`},

trip(){ const st=S.tripStep, t=curT(), s=curS(); const bars=`<div class="steps" aria-label="Étape ${st+1} sur 3">${[0,1,2].map(i=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div>`;
  if(st===0) return `${topbar('Jour J · départ')}${bars}
    <h2>Scanne le QR code de ${t.nom}</h2><p class="sub" style="margin:0">Il change toutes les 30 secondes. Ça prouve que vous partez ensemble.</p>
    <div class="card" style="text-align:center"><div class="qr" id="qr" aria-label="QR code de ${t.nom}"></div><div class="sub">Code de ${t.nom} · se renouvelle dans <span id="cd">30</span> s</div></div>
    <div style="flex:1"></div><button class="btn btn-main tap" data-act="scan1">Scanner</button>`;
  if(st===1) return `${topbar('Jour J · en route')}${bars}
    <h2>En route vers ${s.lieu}</h2>
    <div class="pulse">${ic('bt')}</div>
    <p style="text-align:center;font-weight:600;margin:0">Vous êtes ensemble</p>
    <p class="sub" style="text-align:center;margin:0">Vos téléphones restent proches. On vérifie que vous êtes ensemble, pas où vous êtes.</p>
    <div class="track"><div>${ic('check')} Départ validé</div><div>${ic('check')} Proximité OK pendant le trajet</div><div>${ic('music')} En cours : ${(()=>{const a=allTracks(),m=a[a.length-1];return m.t+' · '+m.a})()}</div></div>
    <div style="flex:1"></div><button class="btn btn-main tap" data-act="arrive">On est arrivés</button>`;
  return `${topbar('Jour J · arrivée')}${bars}
    <h2>Ton Pass trajet est arrivé</h2>
    <p class="sub" style="margin:0">Montre-le à la caisse pour avoir ta réduction. Le scan valide aussi le trajet de ${t.nom}.</p>
    ${passHTML({who:'Magalie', lieu:s.lieu, date:dateOf(s.quand), mode:'Covoiturage · 2 pers.', used:S.passUsed, usedMsg:`Pass utilisé à ${S.passTime}. Trajet validé pour toi et ${t.nom}.`})}
    <div style="flex:1"></div>
    ${S.passUsed ? `<button class="btn btn-main tap" data-act="souvenir">Voir ma carte souvenir</button>` : `<button class="btn btn-main tap" data-act="caisse">Simuler : la caisse scanne</button>`}`;
},

tcpass(){ const s=curS(); return `
  ${topbar('Billet couplé','sortie')}
  <h2>Ton billet et ton Pass trajet</h2>
  <p class="sub" style="margin:0">${s.bus.ligne} · ${s.bus.duree}. Montre ce Pass à la caisse en arrivant.</p>
  ${passHTML({who:'Magalie', lieu:s.lieu, date:dateOf(s.quand), mode:s.bus.icon==='train'?'Train':'Bus', used:S.tcUsed, usedMsg:'Quête Zéro voiture validée.'})}
  <div style="flex:1"></div>
  ${S.tcUsed ? `<button class="btn btn-main tap" data-go="quests">Voir mes quêtes</button>` : `<button class="btn btn-main tap" data-act="tccaisse">Simuler : la caisse scanne</button>`}`},

souvenir(){ const t=curT(), s=curS(); return `
  <div class="between"><button class="back" data-go="home" aria-label="Fermer">${ic('back')}</button><span class="sub">Nouvelle carte souvenir</span><span style="width:36px"></span></div>
  <div class="polaroid">
    <div class="photo" style="background:${s.bg};color:${s.ink}"><div class="big">${ic(s.icon,'width="130" height="130"')}</div><div style="width:26px;height:26px">${ic(s.icon,'width="26" height="26"')}</div><div style="font-family:var(--display);font-size:20px;font-weight:700">${s.lieu}</div><div style="font-size:12px">${dateOf(s.quand)}</div></div>
    <div class="row" style="margin-top:12px"><span class="av" style="background:${t.col};color:${t.ink};border:2px solid var(--paper);${PH(t)}">${t.init}</span><span class="av mag" style="background:var(--pink);color:var(--pink-ink);border:2px solid var(--paper);margin-left:-18px">M</span><span style="font-size:13px">${t.nom} et Magalie</span></div>
    <div style="font-size:12px;margin-top:6px;color:var(--paper-muted)">${allTracks().length} sons partagés · ${co2For(S.sortie)} kg de CO₂ évités · ${t.duree} de route</div>
    <span class="pill" style="background:var(--lime);color:var(--lime-ink);margin-top:8px">Quête réussie : ${S.lastQuest}</span>
  </div>
  ${S.reward===null ? `
    <div class="card" style="background:var(--lime);color:var(--lime-ink)"><div class="row"><div class="ico" style="background:var(--lime-ink);color:var(--lime)">${ic('ticket')}</div><div><b>Tu gagnes une place offerte</b><div style="font-size:13px">Tu la gardes ou tu l'offres à un jeune qui ne peut pas sortir&nbsp;?</div></div></div></div>
    <div class="row"><button class="btn btn-ghost tap" data-act="keep">La garder</button><button class="btn tap" data-act="give" style="background:var(--pink);color:var(--pink-ink)">L'offrir</button></div>`
  : S.reward==='give' ? `<div class="card" style="background:var(--pink);color:var(--pink-ink)"><div class="row"><div class="ico" style="background:var(--pink-ink);color:var(--pink)">${ic('gift')}</div><div><b>Merci Magalie</b><div style="font-size:13px">Ta place est partie à un jeune de Lens via une association partenaire.</div></div></div></div>`
  : `<div class="card" style="background:var(--panel2)"><div class="row"><div class="ico" style="background:var(--lime);color:var(--lime-ink)">${ic('ticket')}</div><div><b>Place ajoutée à ton profil</b><div class="sub">Utilisable dans tous les lieux partenaires</div></div></div></div>`}
  ${S.crew ? `<div class="card" style="background:var(--panel2)"><div class="row"><div class="ico" style="background:var(--ochre);color:var(--ochre-ink)">${ic('users')}</div><div><b>Équipage créé</b><div class="sub">${S.crew} · ${t.nom} et toi</div></div></div></div>`
           : `<button class="card tap" data-act="crew"><div class="row"><div class="ico" style="background:var(--ochre);color:var(--ochre-ink)">${ic('users')}</div><div><b>Le trajet t'a plu&nbsp;?</b><div class="sub">Crée un équipage avec ${t.nom} pour vos prochaines sorties</div></div></div></button>`}
  <button class="card tap" data-act="listen"><div class="between"><div class="row"><div class="ico" style="background:var(--fg);color:var(--lime)">${ic('music')}</div><div><b>Playlist du trajet</b><div class="sub">${allTracks().length} sons · ${t.nom} et Magalie</div></div></div><span class="pill" style="background:var(--lime);color:var(--lime-ink);border:1.5px solid var(--fg)">Écouter sur Spotify</span></div></button>
  <button class="btn btn-main tap" data-act="story">${ic('share','width="18" height="18" style="vertical-align:-3px;margin-right:6px"')}Partager en story</button>`},

quests(){ const q=S.quests; const Q=[
    {k:'plein',ic:'car',t:'Voiture pleine',n:3,r:'1 place de ciné',c:'var(--lime)'},
    {k:'pont',ic:'users',t:'Pont des générations',n:1,r:'1 place offerte',c:'var(--teal)'},
    {k:'zero',ic:'bus',t:'Zéro voiture',n:1,r:'1 boisson offerte',c:'var(--ochre)'},
    {k:'retour',ic:'moon',t:'Retour assuré',n:1,r:'Backstage concert',c:'var(--pink)'},
    {k:'combo',ic:'train',t:'Le combo',n:1,r:'1 place de concert',c:'var(--violet)'}];
  return `<h1>Quêtes de novembre</h1><p class="sub" style="margin:0">Toutes se font en covoit ou en transports en commun.</p>
  ${Q.map(x=>{const v=Math.min(q[x.k],x.n),done=v>=x.n;return `<div class="card"><div class="between"><span class="row" style="gap:8px;font-weight:600"><span style="width:20px;height:20px;color:${x.c}">${ic(x.ic,'width="20" height="20"')}</span>${x.t}</span><span style="color:var(--fg);font-weight:700">${done?'Réussie':v+'/'+x.n}</span></div><div class="bar"><i style="width:${Math.max(4,Math.round(v/x.n*100))}%;background:${x.c}"></i></div><div class="sub" style="margin-top:6px">Récompense : ${x.r}</div></div>`}).join('')}
  <div class="card" style="background:var(--violet-ink)"><div class="sub" style="color:var(--violet)">Défi collectif · Louvre-Lens</div><b style="font-size:16px">${S.collectif} / 100 voitures pleines</b><div class="bar" style="background:rgba(255,255,255,.2)"><i style="width:${S.collectif}%;background:var(--violet)"></i></div><div class="sub" style="margin-top:6px;color:var(--violet)">À 100, soirée spéciale offerte à tous les participants</div></div>`},

profil(){ return `
  <div class="row"><span class="av mag" style="width:72px;height:72px;font-size:20px;background:var(--pink);color:var(--pink-ink);border-width:2px" role="img" aria-label="Photo de profil de Magalie">M</span><div><h2>Magalie, 19 ans</h2><div class="sub">BTS · Lens · profil vérifié</div></div></div>
  <div class="grid3"><div class="stat"><span class="sub">Sorties</span><b>${S.sorties}</b></div><div class="stat"><span class="sub">Économisés</span><b>${S.euros} €</b></div><div class="stat"><span class="sub">CO₂ évité</span><b>${S.co2} kg</b></div></div>
  <h3>Mes cartes souvenirs</h3>
  <div class="grid3">${Array.from({length:S.cards}).map((_,i)=>{const c=[['var(--violet)','var(--violet-ink)','museum'],['var(--pink)','var(--pink-ink)','mic'],['var(--teal)','var(--teal-ink)','ticket']][i%3];return `<div style="background:var(--paper);border-radius:10px;padding:5px 5px 14px;transform:rotate(${i%2?2:-2}deg)"><div style="background:${c[0]};color:${c[1]};border-radius:6px;aspect-ratio:1;display:flex;align-items:center;justify-content:center">${ic(c[2],'width="26" height="26"')}</div></div>`}).join('')}</div>
  <h3>Mes équipages</h3>
  ${S.crew?`<div class="card"><div class="row"><div class="ico" style="background:var(--ochre);color:var(--ochre-ink)">${ic('users')}</div><div><b>${S.crew}</b><div class="sub">${curT().nom} et toi · 1 sortie</div></div></div></div>`:`<div class="card" style="background:var(--panel2)"><div class="sub">Pas encore d'équipage. Après un trajet qui t'a plu, tu pourras en créer un.</div></div>`}
  <h3>Mes sorties créées</h3>
  ${S.mine.length ? S.mine.map(mm=>{const s=getSortie(mm.s),t=s.trajets[0];return `<div class="card"><div class="row"><div class="ico" style="background:var(--pink);color:var(--pink-ink);border:1.5px solid var(--fg)">${ic(MODES[modeList(t)[0]][0])}</div><div style="min-width:0"><b>${esc(s.titre)}</b><div class="sub">${s.quand} · ${modeLabel(modeList(t))}</div></div></div></div>`}).join('') : `<div class="card" style="background:var(--panel2)"><div class="sub">Tu n'as pas encore créé de sortie. Touche le bouton + pour en organiser une.</div></div>`}
  <div class="card" style="background:var(--panel2)"><div class="between"><span>Mode simple</span><span class="pill" style="background:var(--line);color:var(--muted)">Désactivé</span></div><div class="sub" style="margin-top:4px">Gros boutons et rappels SMS, pensé pour les seniors.</div></div>
  <button class="btn btn-ghost tap" data-act="reset">Recommencer la démo</button>`}
};
