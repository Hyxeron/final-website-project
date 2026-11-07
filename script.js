(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],
doc=(t,c,x)=>{const n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n},
S=(()=>{let m={},live=1;try{localStorage.setItem('_','1');localStorage.removeItem('_')}catch(e){live=0}
const rd=k=>{try{return live?localStorage.getItem(k):m[k]??null}catch(e){return m[k]??null}},
wr=(k,v)=>{try{live?localStorage.setItem(k,v):m[k]=v}catch(e){m[k]=v}},
rm=k=>{try{live?localStorage.removeItem(k):delete m[k]}catch(e){delete m[k]}};
return{get(k,d){try{const v=rd(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>wr(k,JSON.stringify(v)),del:rm}})();

const UK='btlow.users.v1',SK='btlow.session.v1',JK='btlow.journal.v1',
users=()=>S.get(UK,[]),session=()=>{const s=S.get(SK,null);return s&&s.name?s:null},
initials=n=>String(n||'?').trim().charAt(0).toUpperCase(),
hash=t=>{t='btlow::'+t;let a=2166136261,b=5381;for(let i=0;i<t.length;i++){const c=t.charCodeAt(i);a=((a^c)*16777619)>>>0;b=((b<<5)+b+c)>>>0}return a.toString(16)+b.toString(16)};

let toastT;
const toast=m=>{const t=$('#toast');if(!t)return;$('span',t).textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),3600)};

function buildLogo(){
const s=$('#logo');if(!s)return;
const NS='http://www.w3.org/2000/svg',cx=375,cy=375,R=250,LEAF='M0 0C11-12 27-14 36 0 27 14 11 12 0 0Z',
mk=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p.appendChild(e);return e};
let n=0;
const branch=(g,a0,a1,c)=>{
for(let i=0;i<c;i++){
const t=c>1?i/(c-1):0,a=(a0+(a1-a0)*t)*Math.PI/180,r=R+(i%2?4:-4),x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r,dir=a1>a0?1:-1,mx=-Math.sin(a)*dir+Math.cos(a)*.4,my=Math.cos(a)*dir+Math.sin(a)*.4,
p=mk('path',{d:LEAF,fill:'var(--leaf)',opacity:(.55+.4*Math.sin(Math.PI*t)).toFixed(2),class:'leaf',transform:`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(Math.atan2(my,mx)*180/Math.PI).toFixed(1)}) scale(${((.62+.5*Math.sin(Math.PI*t))*(i%2?.86:1)).toFixed(2)})`},g);
p.style.animationDelay=(n++*.035).toFixed(2)+'s';
if(i%3===0)mk('circle',{cx:(cx+Math.cos(a)*(r-22)).toFixed(1),cy:(cy+Math.sin(a)*(r-22)).toFixed(1),r:5,fill:'var(--red)',opacity:.7,class:'leaf'},g).style.animationDelay=(n*.035).toFixed(2)+'s';
}};
branch($('#leavesLeft'),96,264,15);branch($('#leavesRight'),84,-84,15);
const SP='M0-15C1.7-5.4 5.4-1.7 15 0 5.4 1.7 1.7 5.4 0 15-1.7 5.4-5.4 1.7-15 0-5.4-1.7-1.7-5.4 0-15Z';
[[375,96,1.15,0],[258,128,.7,.9],[492,128,.7,1.7],[168,214,.5,2.4],[582,214,.5,1.2],[128,560,.45,2.9],[622,560,.45,.6]]
.forEach(([x,y,k,d])=>mk('path',{d:SP,fill:d?'var(--sand-deep)':'var(--red)',class:'star',transform:`translate(${x} ${y}) scale(${k})`},$('#stars')).style.animationDelay=d+'s');
}

function initReveal(){
const box=$('.page-inner');if(!box)return;
const items=$$('.eyebrow,.page-title,.page-lede,.rule,.pic,.claim,.sub-title,.prose>p,.plain>li,.numbered>li,.card,.note,.pull,.timeline .item,.tags,.end-mark,.jform,.kform,.kcanvas',box);
if(!items.length)return;
items.forEach(i=>i.classList.add('reveal'));
if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver'in window)){items.forEach(i=>i.classList.add('in'));return}
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{root:$('#content'),rootMargin:'-30px 0px -30px 0px'});
items.forEach(i=>io.observe(i));
}

function applyAuth(u){
const app=$('.app'),area=$('#content'),locked=!u;
app.classList.toggle('is-locked',locked);
document.body.classList.toggle('authed',!locked);
if(area){if('inert'in area)area.inert=locked;locked?area.setAttribute('aria-hidden','true'):area.removeAttribute('aria-hidden')}
['#userName','#drawerName'].forEach(s=>{if($(s))$(s).textContent=u?u.name:'Reader'});
['#userAvatar','#drawerAvatar'].forEach(s=>{if($(s))$(s).textContent=u?initials(u.name):'B'});
renderJournal();
}

const openM=id=>{closeDrawer();const m=$('#'+id);if(!m)return;m.classList.add('open');setTimeout(()=>{const i=$('input',m);i&&i.focus()},240)},
closeM=()=>$$('.modal.open').forEach(m=>m.classList.remove('open')),
switchM=(a,b)=>{$('#'+a)?.classList.remove('open');setTimeout(()=>openM(b),60)};

function fieldErr(i,msg){const f=i.closest('.field');if(!f)return;f.classList.toggle('has-error',!!msg);const e=$('.field-error',f);if(e)e.textContent=msg||''}
function clearF(form){$$('.field',form).forEach(f=>f.classList.remove('has-error'));$$('.field-error',form).forEach(e=>e.textContent='');const m=$('.form-msg',form);if(m){m.className='form-msg';m.textContent=''}}
function formMsg(form,txt,kind){const m=$('.form-msg',form);if(m){m.textContent=txt;m.className='form-msg show '+(kind||'error')}}

function signup(e){
e.preventDefault();const f=e.currentTarget;clearF(f);
const n=$('[name=name]',f),p=$('[name=password]',f),c=$('[name=confirm]',f),ag=$('[name=agree]',f),
name=n.value.trim().replace(/\s+/g,' '),pw=p.value;let ok=1;
if(name.length<2||name.length>40){fieldErr(n,'Please write your name, two letters or more.');ok=0}
else if(users().some(u=>u.name.toLowerCase()===name.toLowerCase())){fieldErr(n,'That name already has an account. Try logging in.');ok=0}
if(pw.length<8){fieldErr(p,'Use at least 8 characters.');ok=0}
else if(!/[A-Za-z]/.test(pw)||!/[0-9]/.test(pw)){fieldErr(p,'Mix in at least one letter and one number.');ok=0}
if(c.value!==pw){fieldErr(c,'The two passwords do not match.');ok=0}
if(ag&&!ag.checked){formMsg(f,'Please tick the box to continue.');ok=0}
if(!ok)return;
const list=users();list.push({name,password:hash(pw),createdAt:Date.now()});S.set(UK,list);
S.set(SK,{name,at:Date.now()});applyAuth(session());
f.reset();const mt=$('.meter i',f);if(mt)mt.style.width=0;
closeM();toast('Welcome, '+name.split(' ')[0]+'. The pages are open.');
}

function login(e){
e.preventDefault();const f=e.currentTarget;clearF(f);
const n=$('[name=name]',f),p=$('[name=password]',f),name=n.value.trim().replace(/\s+/g,' ');
if(name.length<2)return fieldErr(n,'Write the name you signed up with.');
if(!p.value)return fieldErr(p,'Enter your password.');
const u=users().find(x=>x.name.toLowerCase()===name.toLowerCase());
if(!u)return formMsg(f,'No account found under that name. You can sign up in a moment.');
if(u.password!==hash(p.value))return fieldErr(p,'That password does not match this account.');
S.set(SK,{name:u.name,at:Date.now()});applyAuth(session());
f.reset();closeM();toast('Welcome back, '+u.name.split(' ')[0]+'.');
}

function logout(){S.del(SK);applyAuth(null);closeDrawer();toast('You have been logged out. The pages are blurred again.')}

function renderJournal(){
const list=$('#jList');if(!list)return;
const me=session(),all=S.get(JK,{}),items=(me&&all[me.name])||[];
list.textContent='';
if(!items.length)return list.append(doc('p','jempty','No entries yet. The first one is always the hardest.'));
[...items].reverse().forEach(it=>{
const a=doc('article','jentry');
a.append(doc('h4','',it.title),doc('time','',new Date(it.at).toLocaleString([],{dateStyle:'medium',timeStyle:'short'})),doc('p','',it.text));
const b=doc('button','jdel');
b.type='button';b.dataset.id=it.id;b.setAttribute('aria-label','Delete entry');
b.innerHTML='<svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>';
a.append(b);list.append(a);
});
}

function initJournal(){
const f=$('#jForm'),list=$('#jList'),txt=$('#jText'),cnt=$('#jCount');
if(!f)return;
const count=()=>{if(cnt&&txt)cnt.textContent=txt.value.length+' / '+txt.maxLength};
txt.addEventListener('input',count);count();
f.addEventListener('submit',e=>{
e.preventDefault();const me=session();if(!me)return;
const ti=$('#jTitle'),title=ti.value.trim(),text=txt.value.trim();
if(!title||!text)return toast('An entry needs a title and a sentence.');
const all=S.get(JK,{});(all[me.name]=all[me.name]||[]).push({id:Date.now().toString(36),title,text,at:Date.now()});
S.set(JK,all);ti.value='';txt.value='';count();renderJournal();toast('Entry saved. Only you can read it.');
});
list.addEventListener('click',e=>{
const b=e.target.closest('.jdel');if(!b)return;
const me=session(),all=S.get(JK,{});
all[me.name]=(all[me.name]||[]).filter(i=>i.id!==b.dataset.id);
S.set(JK,all);renderJournal();toast('Entry deleted.');
});
}

function initCard(){
const cv=$('#kCanvas');if(!cv)return;
const x=cv.getContext('2d'),W=cv.width,H=cv.height,SERIF='Georgia,"Times New Roman",serif',
T={sand:['#f7f3ec','#a83a2c','#2b2622','#dccdba'],ink:['#24201c','#dccdba','#f7f3ec','#5a4f45'],red:['#a83a2c','#f7f3ec','#fff3e9','#e9b7ae']},
spark=(cx,cy,r,c)=>{x.fillStyle=c;x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx+r*.18,cy-r*.18,cx+r,cy);x.quadraticCurveTo(cx+r*.18,cy+r*.18,cx,cy+r);x.quadraticCurveTo(cx-r*.18,cy+r*.18,cx-r,cy);x.quadraticCurveTo(cx-r*.18,cy-r*.18,cx,cy-r);x.fill()},
flame=(cx,top,h,c)=>{x.fillStyle=c;x.beginPath();x.moveTo(cx,top);x.bezierCurveTo(cx-h*.3,top+h*.55,cx-h*.52,top+h*.62,cx-h*.52,top+h*.75);x.bezierCurveTo(cx-h*.52,top+h*.95,cx-h*.26,top+h,cx,top+h);x.bezierCurveTo(cx+h*.26,top+h,cx+h*.52,top+h*.95,cx+h*.52,top+h*.75);x.bezierCurveTo(cx+h*.52,top+h*.62,cx+h*.3,top+h*.55,cx,top);x.fill()},
wrap=(t,cx,y,max,lh)=>{x.textAlign='center';let line='',n=0;
t.split(/\s+/).filter(Boolean).forEach(w=>{const test=line?line+' '+w:w;
if(x.measureText(test).width>max&&line){x.fillText(line,cx,y+n*lh);line=w;n++}else line=test});
x.fillText(line,cx,y+n*lh);return y+n*lh};

function draw(){
const [bg,accent,fg,soft]=T[$('#kTheme').value]||T.sand,
to=($('#kTo').value||'A friend').trim()||'A friend',
msg=($('#kMsg').value||'').trim()||'You were kind today when nobody was watching.';
x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;
x.fillStyle=bg;x.fillRect(0,0,W,H);
x.strokeStyle=soft;x.lineWidth=3;x.strokeRect(70,70,W-140,H-140);
x.globalAlpha=.45;x.strokeStyle=accent;x.lineWidth=2;x.strokeRect(88,88,W-176,H-176);
x.globalAlpha=1;x.fillStyle=accent;
x.font='600 30px '+SERIF;x.letterSpacing='11px';x.textAlign='center';
x.fillText('A KINDNESS CARD',W/2+5,198);
x.letterSpacing='0px';
flame(W/2,286,214,accent);
flame(W/2,344,132,bg);
x.fillStyle=fg;x.font='600 26px '+SERIF;x.letterSpacing='12px';
x.fillText('TO',W/2+6,616);x.letterSpacing='0px';
let size=82;x.font=`italic 600 ${size}px ${SERIF}`;
while(x.measureText(to).width>W-360&&size>40){size-=6;x.font=`italic 600 ${size}px ${SERIF}`}
x.fillText(to,W/2,706);
x.strokeStyle=soft;x.lineWidth=2;x.beginPath();x.moveTo(W/2-90,760);x.lineTo(W/2+90,760);x.stroke();
x.fillStyle=fg;x.font='44px '+SERIF;
wrap(msg,W/2,856,W-300,66);
spark(W/2,H-268,18,accent);
x.fillStyle=fg;x.font='600 26px '+SERIF;x.letterSpacing='10px';x.fillText('UNA ANG GINOO',W/2+5,H-186);x.letterSpacing='0px';
x.globalAlpha=.6;x.fillStyle=fg;x.font='26px '+SERIF;x.fillText('Be the Light of the World',W/2,H-134);x.globalAlpha=1;
}

['#kTo','#kMsg','#kTheme'].forEach(s=>{const n=$(s);if(n){n.addEventListener('input',draw);n.addEventListener('change',draw)}});
$('#kDown').addEventListener('click',()=>{
const a=document.createElement('a');a.download='kindness-card.png';a.href=cv.toDataURL('image/png');a.click();
toast('Card saved to your downloads.');
});
draw();
}

const VERSES=[
['Whatever you do, work heartily, as for the Lord and not for men.','Colossians 3:23'],
['The fear of the Lord is the beginning of knowledge.','Proverbs 1:7'],
['Let your light shine before others, so that they may see your good works.','Matthew 5:16'],
['Do your best to present yourself to God as one approved, a worker who has no need to be ashamed.','2 Timothy 2:15'],
['In all your ways acknowledge him, and he will make straight your paths.','Proverbs 3:6'],
['An intelligent heart acquires knowledge, and the ear of the wise seeks knowledge.','Proverbs 18:15'],
['Ask, and it will be given to you; seek, and you will find.','Matthew 7:7'],
['Do not be conformed to this world, but be transformed by the renewal of your mind.','Romans 12:2'],
['Commit your work to the Lord, and your plans will be established.','Proverbs 16:3'],
['Give instruction to a wise man, and he will be still wiser.','Proverbs 9:9'],
['All Scripture is breathed out by God and profitable for teaching and for training in righteousness.','2 Timothy 3:16'],
['The beginning of wisdom is this: get wisdom, and whatever you get, get insight.','Proverbs 4:7'],
['Wisdom is better than jewels, and all that you may desire cannot compare with her.','Proverbs 8:11'],
['Let the words of my mouth and the meditation of my heart be acceptable in your sight.','Psalm 19:14'],
['The heart of him who has understanding seeks knowledge.','Proverbs 15:14']
];

function initVerses(){
const nodes=$$('.verse');if(!nodes.length)return;
let i=Math.floor(Math.random()*VERSES.length);
const paint=()=>{const [text,ref]=VERSES[i];nodes.forEach(n=>{n.textContent='';n.append(doc('q','',text),doc('cite','',ref))})};
paint();
setInterval(()=>{
nodes.forEach(n=>n.classList.add('swap'));
setTimeout(()=>{let j=i;while(j===i)j=Math.floor(Math.random()*VERSES.length);i=j;paint();nodes.forEach(n=>n.classList.remove('swap'))},340);
},7000);
}

let idleT;
function initIdle(){
const wake=()=>{document.body.classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>document.body.classList.add('idle'),500)};
['pointermove','pointerdown','keydown','wheel','scroll','touchstart'].forEach(ev=>addEventListener(ev,wake,{passive:true,capture:true}));
wake();
}

function openDrawer(){const s=$('#sidebar');s.classList.add('open');$('#scrim').classList.add('show');$('#burger').setAttribute('aria-expanded','true')}
function closeDrawer(){const s=$('#sidebar');if(!s)return;s.classList.remove('open');$('#scrim').classList.remove('show');$('#burger').setAttribute('aria-expanded','false')}

function initUI(){
$('#burger').addEventListener('click',()=>$('#sidebar').classList.contains('open')?closeDrawer():openDrawer());
$('#scrim').addEventListener('click',closeDrawer);
$('.user-chip').addEventListener('click',()=>{if(innerWidth<=900)openDrawer()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();closeM()}});
addEventListener('resize',()=>{if(innerWidth>900)closeDrawer()});

document.addEventListener('click',e=>{
const a=e.target.closest('[data-auth]');
if(a){e.preventDefault();openM(a.dataset.auth==='signup'?'signupModal':'loginModal');return}
const c=e.target.closest('[data-close]');if(c)return closeM();
const s=e.target.closest('[data-switch]');if(s)return switchM(s.closest('.modal').id,s.dataset.switch);
const n=e.target.closest('a[data-nav]');
if(!n||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;
e.preventDefault();closeDrawer();
if(n.classList.contains('active'))return $('#content').scrollTo({top:0,behavior:'smooth'});
$('.app').classList.add('leaving');
setTimeout(()=>location.href=n.getAttribute('href'),220);
});

$$('.modal').forEach(m=>m.addEventListener('mousedown',e=>{if(e.target===m)closeM()}));
$('#signupForm').addEventListener('submit',signup);
$('#loginForm').addEventListener('submit',login);
$('#logoutBtn').addEventListener('click',logout);
$('#drawerLogout').addEventListener('click',logout);
$$('.modal input').forEach(i=>i.addEventListener('input',()=>{const f=i.closest('.field');if(f&&f.classList.contains('has-error'))fieldErr(i,'')}));
$$('.eye-btn').forEach(b=>b.addEventListener('click',()=>{
const i=$('input',b.closest('.input-wrap')),show=i.type==='password';
i.type=show?'text':'password';b.setAttribute('aria-label',show?'Hide password':'Show password');
b.querySelector('use').setAttribute('href',show?'#i-eye-off':'#i-eye');
}));
const pw=$('#signupForm [name=password]'),bar=$('#signupForm .meter i');
if(pw&&bar)pw.addEventListener('input',()=>{
const v=pw.value;let sc=(v.length>=8)+(v.length>=12)+(/[A-Z]/.test(v)&&/[a-z]/.test(v))+/[0-9]/.test(v)+/[^A-Za-z0-9]/.test(v),
w=Math.min(100,sc*20);
bar.style.width=w+'%';bar.style.background=w<=40?'var(--red)':w<=60?'#c07a35':'var(--leaf)';
});
}

initUI();initIdle();initVerses();initJournal();initCard();initReveal();applyAuth(session());
$('#content').scrollTop=0;
window.BTLOW={toast,store:S};
})();
