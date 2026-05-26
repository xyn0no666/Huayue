(function(){'use strict';
  var certs=(window.APP_DATA&&window.APP_DATA.certifications)||[];

  function renderCerts(){
    var grid=document.getElementById('certsGrid');
    if(!grid)return;
    if(!certs.length){
      grid.style.display='none';return;
    }
    grid.innerHTML=certs.map(function(c){
      return '<div class="cert-card fade-in">'+
        '<div class="cert-card__icon">'+
          '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-dark)" stroke-width="1.5">'+
            '<circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>'+
          '</svg>'+
        '</div>'+
        '<h3>'+c.name+'</h3>'+
        '<p>'+c.desc+'</p>'+
      '</div>';
    }).join('');
  }

  function init(){
    renderCerts();
  }

  window.App=window.App||{};
  window.App.Brand={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
