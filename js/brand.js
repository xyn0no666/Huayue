(function(){'use strict';
  var certs=(window.APP_DATA&&window.APP_DATA.certifications)||[];

  function renderCerts(){
    var grid=document.getElementById('certsGrid');
    if(!grid)return;
    if(!certs.length){
      grid.style.display='none';return;
    }
    grid.innerHTML=certs.map(function(c){
      var detail='';
      if(c.id) detail+='<span class="cert-card__id">'+c.id+'</span>';
      if(c.issuer) detail+='<span class="cert-card__issuer">发证机构: '+c.issuer+'</span>';
      return '<div class="cert-card fade-in">'+
        '<div class="cert-card__icon">'+
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" stroke-width="1.5">'+
            '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>'+
          '</svg>'+
        '</div>'+
        '<h3>'+c.name+'</h3>'+
        '<p class="cert-card__desc">'+c.desc+'</p>'+
        (detail?'<div class="cert-card__meta">'+detail+'</div>':'')+
      '</div>';
    }).join('');
  }

  function init(){
    renderCerts();
    initFadeIn();
  }

  function initFadeIn(){
    var els=document.querySelectorAll('.fade-in');
    if(!els.length)return;
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },{threshold:0.15});
    els.forEach(function(el){observer.observe(el)});
  }

  window.App=window.App||{};
  window.App.Brand={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
