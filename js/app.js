const h=document.getElementById('hdr'); addEventListener('scroll',()=>h.classList.toggle('scrolled',scrollY>40));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.getElementById('interestForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const button=form.querySelector('button[type="submit"]');
  const success=document.getElementById('success');
  const error=document.getElementById('formError');
  success.hidden=true; error.hidden=true; button.disabled=true; button.textContent='Sending…';
  try{
    const payload=Object.fromEntries(new FormData(form).entries());
    const response=await fetch('/api/inquiry',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    if(!response.ok) throw new Error('Submission failed');
    form.reset(); success.hidden=false; success.scrollIntoView({behavior:'smooth',block:'nearest'});
  }catch(err){
    error.hidden=false;
  }finally{
    button.disabled=false; button.textContent='Request Information';
  }
});


// V31 interactive suite floor plan
const suiteData={
  1:{name:'Front Right Suite',location:'Front-facing location',status:'Available',description:'A bright private studio with front window exposure and convenient access near the main entrance.',features:['Front window exposure','White box ready','Build-out flexibility']},
  2:{name:'Front Left Suite',location:'Front-facing location',status:'Available',description:'A welcoming front suite with natural light, strong visibility, and a private professional atmosphere.',features:['Front window exposure','White box ready','Build-out flexibility']},
  3:{name:'Right-Side Suite',location:'Right-side location near the coffee bar',status:'Available',description:'A private studio positioned beside the shared coffee bar, offering an intimate setting for clients.',features:['Near shared coffee bar','Private studio setting','Build-out flexibility']},
  4:{name:'Left-Side Suite',location:'Left-side location',status:'Available',description:'A flexible private suite with a comfortable footprint and separation from the front entry.',features:['Private studio setting','Flexible service layout','White box ready']},
  5:{name:'Rear Suite',location:'Rear location near shared amenities',status:'Available',description:'A distinctive rear suite with a spacious feel and convenient proximity to the private restroom and coffee bar.',features:['Near shared amenities','Spacious rear position','Build-out flexibility']}
};
function selectSuite(number){
  const data=suiteData[number]; if(!data)return;
  document.querySelectorAll('[data-suite]').forEach(el=>el.classList.toggle('active',el.dataset.suite==number));
  document.querySelector('.suite-detail-number').textContent=number;
  document.querySelector('.suite-detail-eyebrow').textContent='Suite '+number;
  document.getElementById('suiteDetailName').textContent=data.name;
  document.getElementById('suiteDetailLocation').textContent=data.location;
  document.querySelector('.suite-status').textContent=data.status;
  document.getElementById('suiteDetailSize').textContent='Dimensions coming soon';
  document.getElementById('suiteDetailDescription').textContent=data.description;
  document.getElementById('suiteDetailFeatures').innerHTML=data.features.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('requestSuite').textContent='Request Suite '+number;
  document.getElementById('requestSuite').dataset.suite=number;
}
document.querySelectorAll('.suite-choice,.suite-marker').forEach(btn=>btn.addEventListener('click',()=>selectSuite(btn.dataset.suite)));
document.getElementById('requestSuite')?.addEventListener('click',e=>{
  const number=e.currentTarget.dataset.suite||'1';
  const hidden=document.getElementById('preferred-suite');
  const message=document.getElementById('message');
  hidden.value='Suite '+number;
  if(!message.value.trim()) message.value=`I am interested in learning more about Suite ${number}.`;
  document.getElementById('apply').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>document.getElementById('full-name')?.focus(),650);
});
const planModal=document.getElementById('planModal');
document.getElementById('planExpand')?.addEventListener('click',()=>{planModal.hidden=false;document.body.style.overflow='hidden'});
planModal?.querySelector('.plan-modal-close')?.addEventListener('click',()=>{planModal.hidden=true;document.body.style.overflow=''});
planModal?.addEventListener('click',e=>{if(e.target===planModal){planModal.hidden=true;document.body.style.overflow=''}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&planModal&&!planModal.hidden){planModal.hidden=true;document.body.style.overflow=''}});
selectSuite(1);
