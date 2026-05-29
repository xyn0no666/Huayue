(function(){'use strict';
  function getFaq(){return (window.App&&window.App.getData().faq)||[]}
  function getGuides(){return (window.App&&window.App.getData().guides)||[]}
  function getProducts(){return (window.App&&window.App.getData().products)||[]}
  function __(key){return window.App&&window.App.__?window.App.__(key):key}
  var currentCat='all';

  /* === FAQ Rendering === */
  function renderFAQ(data){
    var container=document.getElementById('faqAccordion');
    if(!container)return;
    container.innerHTML=data.map(function(item,idx){
      return '<div class="accordion__item" data-faq-cat="'+item.cat+'">'+
        '<button class="accordion__trigger" aria-expanded="false" aria-controls="faq-panel-'+idx+'">'+
          '<span>'+item.q+'</span>'+
          '<span class="accordion__icon"></span>'+
        '</button>'+
        '<div class="accordion__panel" id="faq-panel-'+idx+'" role="region">'+
          '<div class="accordion__panel-inner">'+item.a+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
    bindAccordion();
  }

  function bindAccordion(){
    document.querySelectorAll('.accordion__trigger').forEach(function(btn){
      btn.addEventListener('click',function(){
        var item=this.closest('.accordion__item');
        var panel=item.querySelector('.accordion__panel');
        var isOpen=item.classList.contains('accordion__item--open');

        // Close others (accordion mode)
        document.querySelectorAll('.accordion__item--open').forEach(function(open){
          if(open!==item){open.classList.remove('accordion__item--open');open.querySelector('.accordion__panel').style.maxHeight='0';open.querySelector('.accordion__trigger').setAttribute('aria-expanded','false')}
        });

        if(isOpen){item.classList.remove('accordion__item--open');panel.style.maxHeight='0';this.setAttribute('aria-expanded','false')}
        else{item.classList.add('accordion__item--open');panel.style.maxHeight=panel.scrollHeight+'px';this.setAttribute('aria-expanded','true')}
      });
    });
  }

  /* === FAQ Filtering === */
  function filterFAQ(cat){
    currentCat=cat;
    var items=document.querySelectorAll('.accordion__item');
    items.forEach(function(item){
      if(cat==='all'||item.getAttribute('data-faq-cat')===cat){item.style.display=''}
      else{item.style.display='none'}
    });
    document.querySelectorAll('.faq-cat-btn').forEach(function(b){b.classList.toggle('faq-cat-btn--active',b.getAttribute('data-faq-cat')===cat)});
  }

  function initFAQCats(){
    document.querySelectorAll('.faq-cat-btn').forEach(function(btn){
      btn.addEventListener('click',function(){filterFAQ(this.getAttribute('data-faq-cat'))});
    });
  }

  /* === FAQ Search === */
  function initFAQSearch(){
    var input=document.getElementById('faqSearch');
    if(!input)return;
    input.addEventListener('input',function(){
      var q=this.value.toLowerCase();
      document.querySelectorAll('.accordion__item').forEach(function(item){
        var text=(item.textContent||'').toLowerCase();
        item.style.display=text.includes(q)?'':'none';
      });
    });
  }

  /* === Guides Rendering === */
  function renderGuides(){
    var grid=document.getElementById('guidesGrid');
    if(!grid)return;
    var icons=['🌿','🪓','❄️','⚡'];
    grid.innerHTML=getGuides().map(function(g,i){
      var imgHtml=g.image
        ?'<img src="'+g.image+'" alt="'+g.title+'" loading="lazy" style="width:100%;height:100%;object-fit:cover">'
        :icons[i];
      return '<a href="'+(g.url||'#')+'" class="guide-card">'+
        '<div class="guide-card__image">'+imgHtml+'</div>'+
        '<div class="guide-card__body">'+
          '<div class="guide-card__time">'+__('support.readTime')+g.readTime+'</div>'+
          '<h3 class="guide-card__title">'+g.title+'</h3>'+
          '<p class="guide-card__desc">'+g.desc+'</p>'+
          '<span class="guide-card__link">'+__('support.readMore')+'</span>'+
        '</div>'+
      '</a>';
    }).join('');
  }

  /* === Manual Downloads === */
  function renderManuals(filter){
    filter=filter||'all';
    var list=document.getElementById('manualList');
    if(!list)return;
    var prods=getProducts();
    var filtered=(filter==='all')?prods:prods.filter(function(p){return p.category===filter});
    list.innerHTML=filtered.map(function(p){
      return '<div class="manual-item">'+
        '<div class="manual-item__icon">📄</div>'+
        '<div class="manual-item__info"><div class="manual-item__name">'+p.name+'</div><div class="manual-item__meta">PDF · '+(p.specs.displacement||p.specs.motor||'')+'</div></div>'+
        '<button class="manual-item__download" data-manual-download="'+p.id+'">'+__('support.download')+'</button>'+
      '</div>';
    }).join('');
    if(filtered.length===0){list.innerHTML='<p class="u-text-center" style="color:var(--color-text-muted);padding:var(--space-5)">'+__('support.noProduct')+'</p>'}
  }

  function initManualFilter(){
    var sel=document.getElementById('manualFilter');
    if(!sel)return;
    sel.addEventListener('change',function(){renderManuals(this.value)});
  }

  /* === Init === */
  function init(){
    renderFAQ(getFaq());renderGuides();renderManuals();initFAQCats();initFAQSearch();initManualFilter();
  }

  window.App=window.App||{};
  window.App.Support={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  document.addEventListener('lang:changed',function(){
    renderFAQ(getFaq());renderGuides();renderManuals();
  });
})();
