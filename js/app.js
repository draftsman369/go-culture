/* ---------- Rendering ---------- */
const TABS=[['home','home','Accueil'],['decouverte','cards','Découverte'],['creer','plus','Créer'],['quests','target','Quêtes'],['profil','user','Profil']];
function render(){
  $('#phone').classList.toggle('simple', P==='rene');
  document.querySelectorAll('[data-persona]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.persona===P)));
  $('#note').textContent = P==='rene' ? "Prototype cliquable · données d'exemple · mode simple de René, 65 ans" : "Prototype cliquable · données d'exemple · parcours de Magalie, 19 ans";
  if(P==='rene'){
    $('#screen').innerHTML=(RV[R.screen]||RV.rhome)(); $('#nav').hidden=true; $('#sheet').innerHTML='';
  } else {
    const sc=S.screen;
    $('#screen').innerHTML=(V[sc]||V.home)();
    $('#sheet').innerHTML = S.notif ? sheetHTML() : '';
    $('#nav').hidden = ['welcome','booked','trip','souvenir','tcpass'].includes(sc);
    const cur = ['sortie','trajet','search','playlist'].includes(sc) ? 'home' : sc==='creerok' ? 'creer' : sc;
    $('#nav').innerHTML = TABS.map(([k,i,l])=>`<button data-tab="${k}" class="${k==='creer'?'plus':''}" ${cur===k?'aria-current="page"':''}>${k==='creer'?`<span class="pbub">${ic(i)}</span>`:ic(i)}${l}</button>`).join('');
  }
  clearInterval(qrTimer);
  if($('#qr')) drawQR();
  if($('#dcard')) attachSwipe($('#dcard'));
}
const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
function deckNext(kind){
  const el=$('#dcard');
  const done=()=>{ if(kind==='like' && !S.favs.includes(S.dIdx)){S.favs.push(S.dIdx);toast('Ajouté à tes favoris')} S.dHist.push(S.dIdx); S.dIdx++; render(); };
  if(!el || reduceMotion()) return done();
  el.classList.remove('drag');
  el.style.transform=`translateX(${kind==='like'?460:-460}px) rotate(${kind==='like'?18:-18}deg)`;
  setTimeout(done,200);
}
function attachSwipe(el){
  let x0=null, dx=0, id=null;
  const like=$('#slike'), nope=$('#snope');
  el.addEventListener('pointerdown',e=>{x0=e.clientX;dx=0;id=e.pointerId;try{el.setPointerCapture(id)}catch(_){}el.classList.add('drag')});
  el.addEventListener('pointermove',e=>{ if(x0===null) return; dx=e.clientX-x0; el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`; like.style.opacity=Math.max(0,Math.min(1,dx/90)); nope.style.opacity=Math.max(0,Math.min(1,-dx/90)); });
  const end=()=>{ if(x0===null) return; x0=null; el.classList.remove('drag');
    if(dx>90) deckNext('like'); else if(dx<-90) deckNext('pass');
    else if(Math.abs(dx)<6) openDeck(S.dIdx);
    else { el.style.transform=''; like.style.opacity=0; nope.style.opacity=0; } };
  el.addEventListener('pointerup',end); el.addEventListener('pointercancel',()=>{dx=0;end()});
}
function openDeck(i){ const c=DECK[i]; go('trajet',{sortie:c.s,trajetId:c.t,from:'decouverte',mode:'covoit',tracks:[],tq:''}); }
let qrTimer;
function drawQR(){
  const el=$('#qr'); if(!el) return; let n=30;
  const paint=()=>{let h='';for(let y=0;y<21;y++)for(let x=0;x<21;x++){const f=(x<7&&y<7)||(x>13&&y<7)||(x<7&&y>13);const fx=x%14,fy=y%14;const ring=f&&((fx===0||fx===6||fy===0||fy===6)||(fx>=2&&fx<=4&&fy>=2&&fy<=4));h+=`<i class="${f?(ring?'on':''):(Math.random()>.5?'on':'')}"></i>`}el.innerHTML=h};
  paint();
  qrTimer=setInterval(()=>{const cd=$('#cd');if(!cd||!document.body.contains(el)){clearInterval(qrTimer);return}n--;if(n<=0){n=30;paint()}cd.textContent=n},1000);
}

/* ---------- Events ---------- */
document.addEventListener('input',e=>{
  if(e.target.id==='q'){S.q=e.target.value;$('#results').innerHTML=resultsHTML()}
  if(e.target.id==='tq'){S.tq=e.target.value;$('#tresults').innerHTML=tresultsHTML()}
  if(e.target.id==='cq'){S.cr.q=e.target.value;$('#crres').innerHTML=crResults()}
  if(e.target.id==='crt'){S.cr.titre=e.target.value}
  if(e.target.id==='crmsg'){S.cr.message=e.target.value;const c=$('#crmsgc');if(c)c.textContent=e.target.value.length}
  if(e.target.id==='crh'){S.cr.heure=e.target.value}
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && S.notif){ S.notif=false; render(); } });
document.addEventListener('change',e=>{
  if(e.target.id==='crrdv'){S.cr.rdv=e.target.value}
  if(e.target.id==='rq'){R.q=e.target.value;$('#rresults').innerHTML=rresultsHTML()}
});
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  const d=b.dataset;
  if(d.persona){P=d.persona;render();$('#screen').scrollTop=0;return}
  if(P==='rene'){handleR(d);return}
  if(d.role){S.role=d.role;render();return}
  if(d.filter){S.filter=d.filter;render();const q=$('#q');return}
  if(d.tab){const t=d.tab;
    if(t==='trajets'){ if(S.booked&&S.tripStep<3) go('trip'); else {toast('Cherche un lieu pour trouver un trajet');go('search')} return}
    go(t);return}
  if(d.sortie){go('sortie',{sortie:d.sortie,mode:'covoit',from:'home',tcUsed:false});return}
  if(d.venue){go('sortie',{sortie:d.venue,mode:'covoit',from:'search',tcUsed:false});return}
  if(d.mode){S.mode=d.mode;render();return}
  if(d.trajet){go('trajet',{trajetId:d.trajet,tracks:[],tq:''});return}
  if(d.dopen!==undefined){openDeck(+d.dopen);return}
  if(d.crvenue){S.cr.venue=d.crvenue;S.cr.err='';render();return}
  if(d.crmode){const cr=S.cr,k=d.crmode;
    if(cr.modes.includes(k)) cr.modes=cr.modes.filter(x=>x!==k); else if(cr.modes.length<3) cr.modes=[...cr.modes,k]; else toast('3 modes maximum par trajet');
    const car=cr.modes.includes('voiture'); cr.places = car ? Math.min(Math.max(cr.places,1),4) : Math.max(cr.places,2);
    cr.err='';render();return}
  if(d.crwho){S.cr.who=d.crwho;render();return}
  if(d.crfilt){const f=d.crfilt;S.cr.filtres=S.cr.filtres.includes(f)?S.cr.filtres.filter(x=>x!==f):[...S.cr.filtres,f];render();return}
  if(d.crvalid){S.cr.valid=d.crvalid;render();return}
  if(d.crtag){const g=d.crtag;S.cr.tags=S.cr.tags.includes(g)?S.cr.tags.filter(x=>x!==g):[...S.cr.tags,g];render();return}
  if(d.crphoto){S.cr.photo=d.crphoto;render();return}
  if(d.addtrack){if(S.tracks.length<3){S.tracks.push(d.addtrack);const c=CAT(d.addtrack);render();toast('« '+c.t+' » ajouté à la playlist')}return}
  if(d.rmtrack){S.tracks=S.tracks.filter(x=>x!==d.rmtrack);render();return}
  if(d.go){ if(d.step!==undefined) S.tripStep=+d.step; go(d.go); return}
  switch(d.act){
    case 'playlist': S.playlist=true;render();toast('3 sons ajoutés à la playlist');break;
    case 'book': S.booked=true;S.tripStep=0;S.passUsed=false;go('booked');break;
    case 'bus': S.tcUsed=false;go('tcpass');toast('Billet couplé acheté');break;
    case 'tccaisse': S.tcUsed=true;S.quests.zero=1;S.sorties++;S.co2+=co2For(S.sortie,true);render();toast('Réduction appliquée · quête Zéro voiture');break;
    case 'scan1': S.tripStep=1;render();toast('Départ validé avec '+curT().nom);break;
    case 'arrive': S.tripStep=2;S.passUsed=false;render();toast('Pass trajet reçu');break;
    case 'caisse': S.passUsed=true;S.passTime=nowHM();render();toast('−3 € appliqués · trajet validé');break;
    case 'souvenir': {const t=curT();S.tripStep=3;
      if(t.age>=50){S.quests.pont=1;S.lastQuest='Pont des générations'} else {S.lastQuest='Nouveau co-voyageur'}
      S.collectif=Math.min(100,S.collectif+1);S.sorties++;S.euros+=3;S.co2+=co2For(S.sortie);S.cards++;S.reward=null;go('souvenir');break;}
    case 'keep': S.reward='keep';render();break;
    case 'give': S.reward='give';render();break;
    case 'crew': S.crew = S.sortie==='louvre' ? 'Les Amis du Louvre' : 'La Bande à '+curT().nom;render();toast('Équipage « '+S.crew+' » créé');break;
    case 'story': toast('Carte prête à partager en story');break;
    case 'crnext': { const cr=S.cr;
      if(cr.step===1 && !cr.venue){cr.err='Choisis d\'abord un lieu dans la liste.';render();break}
      if(cr.step===2 && !cr.modes.length){cr.err='Choisis au moins un mode de transport.';render();break}
      if(cr.step===4 && !cr.titre.trim()){cr.err='Donne un titre à ta sortie.';render();break}
      cr.err=''; cr.step++;
      if(cr.step===4 && !cr.titre){const v=VENUES.find(x=>x.id===cr.venue);cr.titre=(cr.modes.length===1?MODES[cr.modes[0]][2]:'Trajet mixte vers')+' '+v.nom}
      render();$('#screen').scrollTop=0;break; }
    case 'crprev': if(S.cr.step>1){S.cr.step--;S.cr.err='';render();$('#screen').scrollTop=0} else go('home');break;
    case 'crminus': S.cr.places=Math.max(S.cr.modes.includes('voiture')?1:2,S.cr.places-1);render();break;
    case 'crplus': S.cr.places=Math.min(S.cr.modes.includes('voiture')?4:12,S.cr.places+1);render();break;
    case 'crplaylist': S.cr.playlist=!S.cr.playlist;render();break;
    case 'crpublish': { const cr=S.cr, v=VENUES.find(x=>x.id===cr.venue), base=getSortie(v.id);
      S.myCount++; const id='mine'+S.myCount, tid='magalie'+S.myCount;
      const org={id:tid, nom:'Magalie', age:19, init:'M', photo:'images/magalie.webp', col:'var(--pink)', ink:'var(--pink-ink)', h:fmtH(cr.heure), places:cr.places, note:'4,9', tag:cr.tags[0]||'Organisatrice', depart:cr.rdv, duree:v.temps, part:cr.modes.includes('voiture')?'1,50 €':cr.modes.includes('bus')?'Billet de transport':'Gratuit', retour:'—', modes:[...cr.modes], msg:cr.message.trim(), mine:true,
        music:cr.playlist?[{t:'Pookie',a:'Aya Nakamura'},{t:'Bruxelles je t’aime',a:'Angèle'},{t:'Santé',a:'Stromae'}]:[], common:'Angèle'};
      SORTIES[id]={titre:cr.titre.trim(), quand:v.quand, lieu:base.lieu, icon:v.icon, img:cr.photo==='lieu'?base.img:cr.photo, imgAlt:'Photo de couverture de la sortie', bg:base.bg, ink:base.ink, prix:base.prix, dispo:'Sortie créée par toi', trajets:[org], bus:base.bus, km:v.km};
      DECK.unshift({s:id,t:tid,mine:true}); S.mine.push({s:id,t:tid}); S.favs=S.favs.map(i=>i+1); S.dIdx=0; S.dHist=[]; S.cr=CRSTART();
      go('creerok'); break; }
    case 'crnew': S.cr=CRSTART(); go('creer'); break;
    case 'crsee': S.cr=CRSTART(); S.dIdx=0; S.dHist=[]; go('decouverte'); break;
    case 'share': toast('Lien de ta sortie copié (simulation)'); break;
    case 'dpass': deckNext('pass');break;
    case 'dlike': deckNext('like');break;
    case 'dback': if(S.dHist.length){S.dIdx=S.dHist.pop();render()} else toast('Tu es au début des trajets');break;
    case 'dopen': openDeck(S.dIdx);break;
    case 'dreset': S.dIdx=0;S.dHist=[];render();break;
    case 'notif': S.notif=true; S.notifSeen=true; render(); { const x=$('#sheet-x'); if(x&&x.focus) x.focus(); } break;
    case 'notifclose': S.notif=false; render(); break;
    case 'chal': S.notif=false; render(); toast('Défi ajouté à tes quêtes'); break;
    case 'spotify': S.spotify=true;render();toast('Spotify connecté (simulation)');break;
    case 'listen': toast('Ouverture de la playlist dans Spotify (simulation)');break;
    case 'reset': S=START();render();break;
  }
});
function rr(){render();$('#screen').scrollTop=0}
function handleR(d){
  if(d.rgo){R.screen=d.rgo;if(d.rstep!==undefined)R.step=+d.rstep;rr();return}
  if(d.rsortie){R.sortie=d.rsortie;R.err=false;render();return}
  if(d.rmusic){R.music=d.rmusic;render();return}
  switch(d.ract){
    case 'minus': R.places=Math.max(1,R.places-1);render();break;
    case 'plus': R.places=Math.min(4,R.places+1);render();break;
    case 'propose': if(!R.sortie){R.err=true;render();return} R.proposed=true;R.booked=false;R.step=0;R.screen='rproposed';rr();break;
    case 'simbook': R.booked=true;R.screen='rhome';rr();toast('Nouveau SMS : Magalie a réservé une place');break;
    case 'scanned': R.step=1;rr();toast('Départ validé avec Magalie');break;
    case 'arrived': R.step=2;rr();break;
    case 'visit': R.visit=true;R.step=3;R.passUsed=false;R.screen='rpass';rr();toast('Pass trajet reçu par SMS');break;
    case 'drop': R.visit=false;R.step=3;R.screen='rdrop';rr();break;
    case 'caisse': R.passUsed=true;render();toast('Réduction de 3 € appliquée');break;
    case 'done': R.screen='rnew';R.reward=null;R.souvenirs++;rr();break;
    case 'keep': R.reward='keep';render();break;
    case 'give': R.reward='give';render();break;
    case 'reset': R=RSTART();rr();break;
  }
}
render();
