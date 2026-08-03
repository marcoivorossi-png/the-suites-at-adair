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


// V33 floor-plan initialization is embedded in index.html for reliable deployment.
// This external fallback runs only if the embedded script is unavailable.
document.addEventListener('DOMContentLoaded', () => {
  if (window.__floorPlanInitialized) return;
  window.__floorPlanInitialized = true;
// V31 interactive suite floor plan

const suiteData={
  1:{name:'Front Right Suite',location:'Front-facing location',size:'120 SQ FT',status:'Available',description:'A front-facing private studio with an abundance of natural light.',features:['Strong visibility','Nearest to main entrance','Shampoo bowl and styling chair provided']},
  2:{name:'Front Left Suite',location:'Front-facing location',size:'120 SQ FT',status:'Available',description:'A front-facing private studio with an abundance of natural light.',features:['Strong visibility','Nearest to main entrance','Shampoo bowl and styling chair provided']},
  3:{name:'Right-Side Suite',location:'Right-side location near the coffee bar',size:'115 SQ FT',status:'Available',description:'A private studio positioned beside the shared coffee bar, offering an intimate setting for clients.',features:['Near shared coffee bar','Private studio setting','Build-out flexibility','Shampoo bowl and styling chair provided']},
  4:{name:'Back Left Suite',location:'Back-left private suite',size:'DETAILS AVAILABLE UPON REQUEST',status:'Available',description:'A distinctive rear suite with its own private entrance for added privacy and convenience, plus easy access to the private restroom and coffee bar. A flexible studio designed to accommodate one or two beauty professionals.',features:['Dedicated private entrance','Near private restroom','Spacious rear position with the largest studio','Flexible build-out for one or two professionals','Shampoo bowl and styling chair provided']}
};
function selectSuite(number){
  const data=suiteData[number]; if(!data)return;
  document.querySelectorAll('[data-suite]').forEach(el=>el.classList.toggle('active',el.dataset.suite==number));
  document.querySelector('.suite-detail-number').textContent=number;
  document.querySelector('.suite-detail-eyebrow').textContent='Suite '+number;
  document.getElementById('suiteDetailName').textContent=data.name;
  document.getElementById('suiteDetailLocation').textContent=data.location;
  document.querySelector('.suite-status').textContent=data.status;
  document.getElementById('suiteDetailSize').textContent=data.size;
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


// V34 gallery full-screen lightbox
const galleryModal=document.getElementById('galleryModal');
const galleryModalImage=galleryModal?.querySelector('img');
function openGalleryImage(card){
  const img=card?.querySelector('img');
  if(!img||!galleryModal||!galleryModalImage)return;
  galleryModalImage.src=img.currentSrc||img.src;
  galleryModalImage.alt=img.alt||'Enlarged gallery image';
  galleryModal.hidden=false;
  document.body.style.overflow='hidden';
}
document.querySelectorAll('#gallery .gallery-card').forEach(card=>{
  card.addEventListener('click',()=>openGalleryImage(card));
  card.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      openGalleryImage(card);
    }
  });
});
galleryModal?.querySelector('.gallery-modal-close')?.addEventListener('click',()=>{
  galleryModal.hidden=true;
  document.body.style.overflow='';
});
galleryModal?.addEventListener('click',event=>{
  if(event.target===galleryModal){
    galleryModal.hidden=true;
    document.body.style.overflow='';
  }
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&galleryModal&&!galleryModal.hidden){
    galleryModal.hidden=true;
    document.body.style.overflow='';
  }
});

});
// V52 robust image reveal slider
document.querySelectorAll('[data-ba-slider]').forEach((slider) => {
  const control = slider.querySelector('.ba-control');

  const setSplit = (percentage) => {
    const clamped = Math.max(0, Math.min(100, percentage));
    slider.style.setProperty('--split', `${clamped}%`);
    control.value = String(Math.round(clamped));
  };

  const updateFromPointer = (event) => {
    const rect = slider.getBoundingClientRect();
    const percentage = ((event.clientX - rect.left) / rect.width) * 100;
    setSplit(percentage);
  };

  let dragging = false;

  slider.addEventListener('pointerdown', (event) => {
    dragging = true;
    slider.classList.add('is-dragging');
    slider.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  });

  slider.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    updateFromPointer(event);
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    slider.classList.remove('is-dragging');
    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }
  };

  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);

  slider.addEventListener('keydown', (event) => {
    const current = parseFloat(control.value) || 50;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSplit(current - 2);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSplit(current + 2);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setSplit(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setSplit(100);
    }
  });

  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'slider');
  slider.setAttribute('aria-valuemin', '0');
  slider.setAttribute('aria-valuemax', '100');

  setSplit(50);
});
