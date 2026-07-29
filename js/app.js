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
