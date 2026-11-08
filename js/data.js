/* Données de démo : lieux, conducteurs, sorties, modes de transport, CO2, offres et défis */
/* Example venues around Lens (demo data) */
const VENUES = [
  {id:'louvre',  nom:'Louvre-Lens',           ville:'Lens',              type:'Musée',   icon:'museum', temps:'5 min',  trajets:4, quand:'Samedi 7 nov. · 14 h', km:4},
  {id:'neufbis', nom:'9-9 bis',               ville:'Oignies',           type:'Musée',   icon:'museum', temps:'20 min', trajets:2, quand:'Samedi 7 nov. · 15 h', km:15, img:'images/9-9bis.jpg', alt:'Chevalements et bâtiments en briques du site minier du 9-9 bis'},
  {id:'conservation', nom:'Centre de conservation du Louvre', ville:'Liévin', type:'Musée', icon:'museum', temps:'10 min', trajets:1, quand:'Mercredi 11 nov. · 14 h', km:5, img:'images/centre-conservation.jpg', alt:"Porte vitrée du Centre de conservation du Louvre, ouvert sur rendez-vous"},
  {id:'lewarde', nom:'Centre historique minier', ville:'Lewarde',         type:'Musée',   icon:'museum', temps:'30 min', trajets:2, quand:'Dimanche 8 nov. · 14 h', km:30, img:'images/lewarde.jpg', alt:'Bâtiment en briques et chevalement du Centre historique minier de Lewarde'},
  {id:'cine',    nom:'Cinéma de Lens',        ville:'Lens',              type:'Cinéma',  icon:'ticket', temps:'5 min',  trajets:2, quand:'Dimanche 8 nov. · 15 h', km:3},
  {id:'cinearras',nom:"Cinéma d'Arras",       ville:'Arras',             type:'Cinéma',  icon:'ticket', temps:'25 min', trajets:1, quand:'Vendredi 6 nov. · 20 h', km:20},
  {id:'lille',   nom:'Salle de concert',      ville:'Lille',             type:'Concert', icon:'mic',    temps:'40 min', trajets:2, quand:'Samedi 7 nov. · 21 h', km:40},
  {id:'theatre', nom:"Théâtre d'Arras",       ville:'Arras',             type:'Théâtre', icon:'masks',  temps:'25 min', trajets:1, quand:'Samedi 7 nov. · 20 h 30', km:20}
];
const TYPECOL = {'Musée':['var(--violet)','var(--violet-ink)'],'Cinéma':['var(--lime)','var(--lime-ink)'],'Concert':['var(--pink)','var(--pink-ink)'],'Théâtre':['var(--ochre)','var(--ochre-ink)']};
const RENE  = {id:'rene', nom:'René', age:65, init:'R', photo:'images/rene.webp', bgSize:'300% auto', pos:'55% 54%', col:'var(--ochre)', ink:'var(--ochre-ink)', h:'14 h 00', places:2, note:'4,9', tag:'Fan de musées', depart:'Place Jean Jaurès', duree:'12 min', part:'1,50 €', retour:'18 h',
  music:[{t:'On ira tous au paradis',a:'Michel Polnareff'},{t:'Alors on danse',a:'Stromae'},{t:'Santé',a:'Stromae'}], common:'Stromae'};
const INES = {id:'ines', nom:'Inès', age:24, init:'I', col:'var(--lime)', ink:'var(--lime-ink)', h:'19 h 15', places:3, note:'4,7', tag:'Cinéphile', depart:'Gare de Lens', duree:'25 min', part:'2 €', retour:'23 h',
  music:[{t:'La grenade',a:'Clara Luciani'},{t:'One More Time',a:'Daft Punk'},{t:'Basique',a:'Orelsan'}], common:'Daft Punk'};
/* Discovery drivers (with profile photos) */
const NAIA = {id:'naia', nom:'Naïa', age:23, init:'N', photo:'images/naia.jpg', col:'var(--violet)', ink:'var(--violet-ink)', h:'14 h 30', places:3, note:'4,9', tag:'Étudiante en design', depart:'Lens centre', duree:'10 min', part:'1,50 €', retour:'18 h 30',
  music:[{t:'Djadja',a:'Aya Nakamura'},{t:'Pookie',a:'Aya Nakamura'},{t:'Bruxelles je t’aime',a:'Angèle'}], common:'Aya Nakamura'};
const HUGO = {id:'hugo', nom:'Hugo', age:24, init:'H', photo:'images/hugo.jpg', col:'var(--lime)', ink:'var(--lime-ink)', h:'19 h 30', places:3, note:'4,8', tag:'Fan de rap', depart:'Liévin', duree:'40 min', part:'3 €', retour:'00 h 45',
  music:[{t:'La quête',a:'Orelsan'},{t:'Au DD',a:'PNL'},{t:'Basique',a:'Orelsan'}], common:'Orelsan'};
const YASMINE = {id:'yasmine', nom:'Yasmine', age:21, init:'Y', photo:'images/yasmine.jpg', col:'var(--pink)', ink:'var(--pink-ink)', h:'19 h 20', places:2, note:'5,0', tag:'Cinéphile', depart:'Gare de Lens', duree:'25 min', part:'2 €', retour:'23 h',
  music:[{t:'La grenade',a:'Clara Luciani'},{t:'Tout oublier',a:'Angèle'},{t:'Papaoutai',a:'Stromae'}], common:'Angèle'};
const LEA = {id:'lea', nom:'Léa', age:25, init:'L', photo:'images/lea.jpg', col:'var(--ochre)', ink:'var(--ochre-ink)', h:'19 h 45', places:2, note:'4,9', tag:'Passionnée de théâtre', depart:'Gare de Lens', duree:'25 min', part:'2 €', retour:'23 h 30',
  music:[{t:'One More Time',a:'Daft Punk'},{t:'Santé',a:'Stromae'},{t:'La grenade',a:'Clara Luciani'}], common:'Stromae'};
const ANTOINE = {id:'antoine', nom:'Antoine', age:32, init:'A', photo:'images/antoine.jpg', col:'var(--violet)', ink:'var(--violet-ink)', h:'14 h 00', places:3, note:'4,9', tag:"Amateur d'art", depart:'Gare de Lens', duree:'30 min', part:'3 €', retour:'18 h 30',
  music:[{t:'One More Time',a:'Daft Punk'},{t:'La grenade',a:'Clara Luciani'},{t:'Papaoutai',a:'Stromae'}], common:'Clara Luciani'};
const KENZO = {id:'kenzo', nom:'Kenzo', age:20, init:'K', photo:'images/kenzo.jpg', col:'var(--pink)', ink:'var(--pink-ink)', h:'14 h 30', places:3, note:'4,8', tag:'Fan de rap', depart:'Liévin', duree:'10 min', part:'1 €', retour:'18 h',
  music:[{t:'Au DD',a:'PNL'},{t:'Pookie',a:'Aya Nakamura'},{t:'La quête',a:'Orelsan'}], common:'PNL'};
const PH = t => t && t.photo ? `background-image:url('${t.photo}');background-size:${t.bgSize||'cover'};background-position:${t.pos||'center 22%'};color:transparent` : '';
const sarah = (h, duree, part, tag, retour) => ({id:'sarah', nom:'Sarah', age:22, init:'S', col:'var(--pink)', ink:'var(--pink-ink)', h, places:2, note:'4,8', tag, depart:'Gare de Lens', duree, part, retour,
  music:[{t:'Balance ton quoi',a:'Angèle'},{t:'Djadja',a:'Aya Nakamura'},{t:'Tout oublier',a:'Angèle'}], common:'Angèle'});

/* Demo song catalog for the shared trip playlist */
const EXTRA = () => {
SORTIES.aeronef = {titre:'Miki + Jäde', quand:'Vendredi 13 nov. · 20 h', lieu:"L'Aéronef, Lille", icon:'mic', img:'images/concert.jpg', imgAlt:'Deux jeunes allongés dans l’herbe sous un ciel bleu', bg:'var(--pink)', ink:'var(--pink-ink)', prix:'22 € · −3 € avec ton Pass trajet', dispo:'2 voitures partent de Lens',
  trajets:[sarah('19 h 00','40 min','2,50 €','Fan de pop','00 h 30')], bus:{ligne:'Train Lens → Lille', duree:'45 min', prix:'Billet couplé', icon:'train'}};
SORTIES.cinearras = {titre:'Ciné du vendredi', quand:'Vendredi 6 nov. · 20 h', lieu:"Cinéma d'Arras", icon:'ticket', img:'images/header.webp', imgAlt:'Deux jeunes partent en road trip en voiture', bg:'var(--lime)', ink:'var(--lime-ink)', prix:'8 € · −3 € avec ton Pass trajet', dispo:'1 trajet proposé',
  trajets:[INES], bus:{ligne:'Train Lens → Arras', duree:'35 min', prix:'Billet couplé', icon:'train'}};
};
VENUES.push({id:'aeronef', nom:"L'Aéronef", ville:'Lille', type:'Concert', icon:'mic', temps:'40 min', trajets:2, quand:'Vendredi 13 nov. · 20 h', km:40});
const DECK = [{s:'aeronef',t:'sarah'},{s:'louvre',t:'naia'},{s:'lille',t:'hugo'},{s:'cinearras',t:'yasmine'},{s:'theatre',t:'lea'},{s:'lewarde',t:'antoine'},{s:'cine',t:'kenzo'}];
const CATALOG = [
  {id:'c1',t:'Santé',a:'Stromae'},{id:'c2',t:'Bruxelles je t’aime',a:'Angèle'},{id:'c3',t:'Pookie',a:'Aya Nakamura'},
  {id:'c4',t:'La quête',a:'Orelsan'},{id:'c5',t:'One More Time',a:'Daft Punk'},{id:'c6',t:'La grenade',a:'Clara Luciani'},
  {id:'c7',t:'Au DD',a:'PNL'},{id:'c8',t:'Papaoutai',a:'Stromae'},{id:'c9',t:'Tout oublier',a:'Angèle'},{id:'c10',t:'Basique',a:'Orelsan'}];
const CAT = id => CATALOG.find(c=>c.id===id);

const SORTIES = {
  louvre:{titre:'Expo au Louvre-Lens', quand:'Samedi 7 nov. · 14 h', lieu:'Louvre-Lens', icon:'museum', img:'images/louvre-lens-ext.webp', imgAlt:'Façade en verre du Louvre-Lens au coucher du soleil', bg:'var(--violet)', ink:'var(--violet-ink)', prix:'10 € · −3 € avec ton Pass trajet', dispo:'4 voitures partent de Lens',
    trajets:[RENE, sarah('13 h 30','8 min','1 €','Étudiante en art','17 h 30')], bus:{ligne:'Bus · arrêt Louvre-Lens', duree:'25 min', prix:'1,10 €', icon:'bus'}},
  lille:{titre:'Concert à Lille', quand:'Samedi 7 nov. · 21 h', lieu:'Salle de concert, Lille', icon:'mic', bg:'var(--pink)', ink:'var(--pink-ink)', prix:'18 € · −3 € avec ton Pass trajet', dispo:'Train + 2 covoits dispo',
    trajets:[sarah('19 h 45','40 min','3 €','Fan de rap','00 h 30')], bus:{ligne:'Train Lens → Lille', duree:'40 min', prix:'Billet couplé', icon:'train'}}
};
function getSortie(id){
  if(SORTIES[id]) return SORTIES[id];
  const v = VENUES.find(x=>x.id===id) || VENUES[0];
  const c = TYPECOL[v.type];
  const titre = v.type==='Musée' ? 'Expo · '+v.nom : v.type==='Cinéma' ? 'Séance · '+v.nom : v.type+' · '+v.nom;
  return SORTIES[id] = {titre, quand:v.quand, lieu:v.nom+(v.nom.includes(v.ville)?'':', '+v.ville), icon:v.icon, img:v.img, imgAlt:v.alt, bg:c[0], ink:c[1],
    prix:'−3 € avec ton Pass trajet', dispo:v.trajets+' trajet'+(v.trajets>1?'s':'')+' proposé'+(v.trajets>1?'s':''),
    trajets:[sarah(v.quand.split('·')[1].trim(), v.temps, v.ville==='Lens'?'1 €':'2,50 €', 'Curieuse de tout', '23 h')],
    bus:{ligne: v.ville==='Lens' ? 'Bus · réseau local' : 'Train + bus', duree: v.temps.replace(/\d+/, n => String(+n+10)), prix:'Billet couplé', icon: v.ville==='Lens'?'bus':'train'}};
}

/* Custom outings ("Créer") */
const MODES = {voiture:['car','Voiture',"Covoit' vers",'Voiture'], velo:['bike','Vélo','Bande à vélo vers','Bande à vélo'], skate:['skate','Skate / trott.','Bande en skate vers','Bande en skate'], pied:['walk','À pied','Balade à pied vers','À pied'], bus:['bus','Transports','En transports vers','Transports en commun']};
const WHO = {tous:'Ouverte à tous', equipage:'Mon équipage', amis:'Mes amis'};
const WHOD = {tous:'Visible par tout le monde dans Découverte', equipage:'Seulement les membres de tes équipages', amis:'Seulement les personnes que tu invites'};
const FILTRES = ['Entre femmes','Membres de ma fac','18-25 ans'];
const TAGS = ['Chill','Débutants bienvenus','Sportif','Sortie du soir','Première fois'];
const RDV = ['Gare de Lens','Lens centre','Place Jean Jaurès','Liévin','Avion'];
const CRSTART = () => ({step:1, q:'', venue:null, modes:[], rdv:'Gare de Lens', heure:'13:30', places:3, who:'tous', filtres:[], valid:'direct', photo:'lieu', titre:'', message:'', tags:[], playlist:true, err:''});
const modeList = t => t.modes || [t.mode || 'voiture'];
const modeLabel = arr => arr.length===1 ? MODES[arr[0]][3] : arr.map(k=>MODES[k][1]).join(' → ');
const fmtH = h => h ? h.replace(':',' h ') : '—';
/* CO2 avoided: car ~0.2 kg CO2/km (ADEME order of magnitude), round trip, one fewer solo car; transit ~70 % of that */
const KG_KM = 0.2;
const kmOf = sid => { const s=SORTIES[sid]; if(s && s.km) return s.km; const v=VENUES.find(x=>x.id===sid); return v ? v.km : 10; };
const co2For = (sid, transit) => Math.round(kmOf(sid)*2*KG_KM*(transit?0.7:1));
EXTRA();
SORTIES.louvre.trajets.push(NAIA);
SORTIES.lille.trajets.push(HUGO);
SORTIES.cinearras.trajets.push(YASMINE);
getSortie('theatre').trajets.push(LEA);
getSortie('lewarde').trajets.push(ANTOINE);
getSortie('cine').trajets.push(KENZO);
/* Partner news shown when the bell is tapped (demo content, except the ADEME tool and the study figure) */
const NEWS = [
  {kind:'Challenge', src:'ADEME', col:'var(--lime)', title:'Novembre sans voiture solo', text:'Fais 4 sorties en covoit, en transports ou en bande ce mois-ci.', reward:'100 ★ et le badge Éco-héros', until:"Jusqu'au 30 nov.", prog:[2,4], cta:'Je relève le défi'},
  {kind:'Offre', src:'Louvre-Lens', col:'var(--violet)', title:"−50 % sur l'expo pour les voitures pleines", text:'Viens à 3 ou plus en covoit : chaque personne paie son entrée à moitié prix.', reward:'Avec ton Pass trajet', until:'Ce week-end', cta:"J'en profite", sortie:'louvre'},
  {kind:'Offre', src:'Centre historique minier', col:'var(--ochre)', title:'Le conducteur entre gratuitement', text:'Tu emmènes au moins 2 personnes à Lewarde ? Ton entrée est offerte.', reward:'Entrée offerte', until:"Jusqu'au 15 nov.", cta:"J'en profite", sortie:'lewarde'},
  {kind:'Challenge', src:'9-9 bis', col:'var(--pink)', title:'Défi bande à vélo', text:'Venez à 4 ou plus à vélo jusqu’au 9-9 bis : une boisson offerte à toute la bande.', reward:'Boisson offerte et 30 ★', until:'Tout le mois', prog:[0,1], cta:'Je relève le défi'},
  {kind:'Offre', src:'Cinéma de Lens', col:'var(--lime)', title:'Popcorn offert pour 2 places', text:'Pour toute séance réservée avec un trajet partagé Go’Cultur.', reward:'Popcorn offert', until:'Tous les jeudis', cta:"J'en profite", sortie:'cine'}
];
