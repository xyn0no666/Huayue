(function(){'use strict';
  function getProducts(){return (window.App&&window.App.getData().products)||[]}
  function getCategories(){return (window.App&&window.App.getData().categories)||[]}
  function __(key){return window.App&&window.App.__?window.App.__(key):key}
  function getCatName(cat){var cats=getCategories();var found=cats.find(function(c){return c.id===cat});return found?found.name:cat}
  function getPowerLabel(pt){if(pt==='gasoline')return __('filter.gasoline');return pt}
  var filters={category:'all',powerType:'all',engine:'all',search:'',sort:'default'};
  var compareList=[];

  /* === Filter Logic === */
  function getFilteredProducts(){
    var filtered=getProducts().slice();
    if(filters.category!=='all')filtered=filtered.filter(function(p){return p.category===filters.category});
    if(filters.powerType!=='all')filtered=filtered.filter(function(p){return p.powerType===filters.powerType});
    if(filters.engine!=='all'){
      filtered=filtered.filter(function(p){
        if(filters.engine==='honda')return p.specs.engine&&p.specs.engine.toLowerCase().indexOf('honda')!==-1;
        if(filters.engine==='kawasaki')return p.specs.engine&&p.specs.engine.toLowerCase().indexOf('kawasaki')!==-1;
        if(filters.engine==='brushless')return p.specs.motor&&p.specs.motor.indexOf('无刷')!==-1;
        return true;
      });
    }
    if(filters.search)filtered=filtered.filter(function(p){return p.name.toLowerCase().includes(filters.search.toLowerCase())});
    var sorts={
      'default':function(a,b){return 0},
      'popular':function(a,b){return (b.certifications||[]).length-(a.certifications||[]).length},
      'name':function(a,b){return a.name.localeCompare(b.name,'zh')}
    };
    filtered.sort(sorts[filters.sort]||sorts['default']);
    return filtered;
  }

  /* === Render === */
  function render(){
    var f=getFilteredProducts();
    var grid=document.getElementById('productsGrid');
    var count=document.getElementById('productsCount');
    var empty=document.getElementById('productsEmpty');
    if(!grid)return;

    grid.innerHTML=f.map(function(p){return createProductCardHTML(p)}).join('');
    if(count)count.textContent=__('products.count').replace('{count}',f.length);
    if(empty)empty.style.display=f.length===0?'block':'none';

    grid.querySelectorAll('[data-quickview]').forEach(function(btn){
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
        var p=getProducts().find(function(x){return x.id===this.getAttribute('data-quickview')});
        if(p)showQuickView(p);
      });
    });

    grid.querySelectorAll('[data-compare]').forEach(function(btn){
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
        toggleCompare(this.getAttribute('data-compare'));
      });
    });

    updateURL();
    updateCompareUI();
  }

  function createProductCardHTML(p){
    var certsHTML=(p.certifications||[]).map(function(c){return '<span class="cert-tag">'+c+'</span>'}).join('');
    var infoHTML='';
    if(p.moq)infoHTML+='<span>MOQ: '+p.moq+'</span>';

    return '<div class="product-card">'+
      '<a href="product-'+p.id+'.html" class="product-card__image" style="display:block"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy" decoding="async" width="400" height="300" onerror="this.style.display=\'none\';this.parentElement.style.background=\'var(--color-border)\'">'+
        (certsHTML?'<div class="product-card__certs">'+certsHTML+'</div>':'')+
        '<button class="product-card__quickview" data-quickview="'+p.id+'" aria-label="'+__('home.quickView')+'">'+
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'+
        '</button>'+
      '</a>'+
      '<div class="product-card__body">'+
        '<div class="product-card__category">'+getCatName(p.category)+' · '+getPowerLabel(p.powerType)+'</div>'+
        '<h3 class="product-card__name"><a href="product-'+p.id+'.html">'+p.name+'</a></h3>'+
        '<div class="product-card__specs"><span>'+getKeySpec(p)+'</span></div>'+
        '<div class="product-card__meta">'+infoHTML+'</div>'+
        '<div class="product-card__footer">'+
          '<button class="btn btn--outline btn--sm" data-cart-add="'+p.id+'" style="flex:1">'+__('cart.add')+'</button>'+
          '<button class="btn btn--sm compare-check" data-compare="'+p.id+'" aria-label="'+__('compare.add')+'" style="padding:0 8px">'+
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'+
          '</button>'+
        '</div>'+
      '</div>'+
    '</div>';
  }

  function getKeySpec(p){if(p.specs.displacement)return p.specs.displacement;if(p.specs.motor)return p.specs.motor;return p.specs.power||''}

  /* === Quick View Modal === */
  function showQuickView(p){
    var existing=document.querySelector('.quickview-overlay');
    if(existing)existing.remove();
    var certsHTML=(p.certifications||[]).map(function(c){return '<span class="badge" style="background:var(--color-gold);color:var(--color-text);margin-right:4px">'+c+'</span>'}).join('');
    var html='<div class="quickview-overlay" data-qv-close>'+
      '<div class="quickview" onclick="event.stopPropagation()">'+
        '<button class="quickview__close" data-qv-close>&times;</button>'+
        '<div class="quickview__image"><img src="'+p.image+'" alt="'+p.name+'" onerror="this.parentElement.style.background=\'var(--color-border)\';this.style.display=\'none\'"></div>'+
        '<div class="quickview__body">'+
          '<span class="tag">'+getCatName(p.category)+' · '+p.powerType+'</span>'+
          '<h3>'+p.name+'</h3>'+
          '<p style="color:var(--color-text-light);font-size:0.8125rem;margin-bottom:var(--space-2)">'+p.description+'</p>'+
          '<div class="quickview__specs">'+Object.entries(p.specs).map(function(e){return '<span><strong>'+__('spec.'+e[0])+'</strong>: '+e[1]+'</span>'}).join('')+'</div>'+
          '<ul class="quickview__features">'+p.features.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul>'+
          (certsHTML?'<div style="margin-bottom:var(--space-2)">'+certsHTML+'</div>':'')+
          (p.moq?'<div style="font-size:0.8125rem;color:var(--color-text-light);margin-bottom:4px"><strong>MOQ:</strong> '+p.moq+'</div>':'')+
          '<div class="quickview__footer">'+
            '<span style="font-family:var(--font-heading);font-size:1.125rem;color:var(--color-gold-dark)">'+__('home.factoryPrice')+'</span>'+
            '<a href="contact.html?tab=quote" class="btn btn--primary">'+__('home.sendInquiry')+'</a>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>';
    var div=document.createElement('div');div.innerHTML=html;
    while(div.firstChild)document.body.appendChild(div.firstChild);
    document.body.style.overflow='hidden';
    var overlay=document.querySelector('.quickview-overlay');
    overlay.addEventListener('click',function(e){if(e.target===this)closeQuickView()});
    overlay.querySelectorAll('[data-qv-close]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();closeQuickView()})});
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){closeQuickView();document.removeEventListener('keydown',esc)}});
  }

  function closeQuickView(){
    var overlay=document.querySelector('.quickview-overlay');
    if(overlay)overlay.remove();
    document.body.style.overflow='';
  }

  /* === Filter Binding === */
  function bindFilterRadio(name,prop){
    var container=document.getElementById(name);
    if(!container)return;
    container.querySelectorAll('input[type="radio"]').forEach(function(input){
      input.addEventListener('change',function(){
        filters[prop]=this.value;
        container.querySelectorAll('.filter-option').forEach(function(opt){opt.classList.toggle('filter-option--active',opt.querySelector('input').checked)});
        render();
      });
    });
  }

  function initFilters(){
    bindFilterRadio('filterCategory','category');
    bindFilterRadio('filterPower','powerType');
    bindFilterRadio('filterEngine','engine');
    var sort=document.getElementById('filterSort');
    if(sort)sort.addEventListener('change',function(){filters.sort=this.value;render()});
    var search=document.getElementById('filterSearch');
    if(search)search.addEventListener('input',(window.App&&window.App.debounce)?window.App.debounce(function(){filters.search=this.value;render()},300):function(){filters.search=this.value;render()});
    var reset=document.getElementById('filterReset');
    if(reset)reset.addEventListener('click',function(){
      filters={category:'all',powerType:'all',engine:'all',search:'',sort:'default'};
      document.querySelectorAll('.filter-options input[value="all"]').forEach(function(r){r.checked=true});
      document.querySelectorAll('.filter-option').forEach(function(o){o.classList.toggle('filter-option--active',o.querySelector('input[value="all"]')!==null&&o.querySelector('input').value==='all')});
      if(sort)sort.value='default';
      if(search)search.value='';
      render();
    });
  }

  /* === URL Sync === */
  function updateURL(){
    var params=[];
    if(filters.category!=='all')params.push('category='+filters.category);
    if(filters.powerType!=='all')params.push('powerType='+filters.powerType);
    var qs=params.length?'?'+params.join('&'):window.location.pathname;
    if(window.location.search!==(params.length?'?'+params.join('&'):''))history.replaceState(null,'',qs);
  }

  function readURL(){
    var search=window.location.search.replace('?','');
    if(!search)return;
    search.split('&').forEach(function(pair){
      var parts=pair.split('=');
      if(parts.length===2&&filters.hasOwnProperty(parts[0])){
        filters[parts[0]]=decodeURIComponent(parts[1]);
        var radio=document.querySelector('input[name="'+(parts[0]==='powerType'?'powerType':parts[0])+'"][value="'+filters[parts[0]]+'"]');
        if(radio){radio.checked=true;var opt=radio.closest('.filter-option');if(opt){opt.classList.add('filter-option--active');opt.parentElement.querySelectorAll('.filter-option').forEach(function(o){if(o!==opt)o.classList.remove('filter-option--active')})}}
      }
    });
  }

  /* === Mobile Filter Toggle === */
  function initMobileFilter(){
    var sidebar=document.getElementById('filterSidebar');
    var toggle=document.getElementById('filterToggle');
    if(!sidebar||!toggle)return;
    var overlay=document.createElement('div');
    overlay.className='filter-overlay';
    document.body.appendChild(overlay);
    function open(){sidebar.classList.add('filter-sidebar--open');overlay.classList.add('filter-overlay--visible');document.body.style.overflow='hidden'}
    function close(){sidebar.classList.remove('filter-sidebar--open');overlay.classList.remove('filter-overlay--visible');document.body.style.overflow=''}
    toggle.addEventListener('click',open);
    overlay.addEventListener('click',close);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&sidebar.classList.contains('filter-sidebar--open'))close()});
  }

  /* === JSON-LD Structured Data === */
  function injectJSONLD(){
    var existing=document.getElementById('productsJsonLd');
    if(existing)existing.remove();
    var products=getProducts();
    var script=document.createElement('script');
    script.id='productsJsonLd';
    script.type='application/ld+json';
    script.textContent=JSON.stringify({
      '@context':'https://schema.org',
      '@type':'ItemList',
      'numberOfItems':products.length,
      'itemListElement':products.map(function(p,i){
        return {
          '@type':'ListItem',
          'position':i+1,
          'item':{
            '@type':'Product',
            'name':p.name,
            'category':getCatName(p.category),
            'description':p.description,
            'image':'https://xyn0no666.github.io/Huayue/'+p.image,
            'url':'https://xyn0no666.github.io/Huayue/product-'+p.id+'.html',
            'offers':{
              '@type':'Offer',
              'price':p.price||0,
              'priceCurrency':'USD',
              'availability':'https://schema.org/InStock',
              'eligibleQuantity':{'@type':'QuantitativeValue','value':p.moq||1,'unitText':'台'}
            },
            'manufacturer':{
              '@type':'Organization',
              'name':'华悦园林'
            }
          }
        };
      })
    });
    document.head.appendChild(script);
  }

  /* === Product Comparison === */
  function toggleCompare(id){
    var idx=compareList.indexOf(id);
    if(idx!==-1){compareList.splice(idx,1)}else{
      if(compareList.length>=4){if(window.App&&window.App.toast)window.App.toast(__('compare.limit'));return}
      compareList.push(id);
    }
    updateCompareUI();
  }

  function updateCompareUI(){
    // Update check button states
    document.querySelectorAll('[data-compare]').forEach(function(btn){
      var id=btn.getAttribute('data-compare');
      var active=compareList.indexOf(id)!==-1;
      btn.classList.toggle('compare-check--active',active);
      btn.setAttribute('aria-label',active?__('compare.remove'):__('compare.add'));
    });
    renderCompareBar();
  }

  function renderCompareBar(){
    var existing=document.querySelector('.compare-bar');
    if(existing)existing.remove();
    if(compareList.length===0)return;

    var bar=document.createElement('div');
    bar.className='compare-bar';
    if(compareList.length>=2)bar.classList.add('compare-bar--ready');
    bar.innerHTML='<div class="compare-bar__inner">'+
      '<div class="compare-bar__info">'+
        '<span>'+__('compare.bar').replace('{count}',compareList.length)+'</span>'+
        '<div class="compare-bar__thumbs">'+compareList.map(function(id){
          var p=getProducts().find(function(x){return x.id===id});
          return p?'<img src="'+p.image+'" alt="'+p.name+'" width="36" height="27">':'';
        }).join('')+'</div>'+
      '</div>'+
      '<div class="compare-bar__actions">'+
        '<button class="btn btn--primary btn--sm" id="compareAction" '+(compareList.length<2?'disabled':'')+'>'+__('compare.bar').replace('{count}',compareList.length)+'</button>'+
        '<button class="btn btn--sm" id="compareClear" style="background:transparent;color:var(--color-text-light)">'+__('compare.clear')+'</button>'+
      '</div>'+
    '</div>';
    document.body.appendChild(bar);

    document.getElementById('compareAction').addEventListener('click',function(){
      if(compareList.length>=2)showCompareModal();
    });
    document.getElementById('compareClear').addEventListener('click',function(){
      compareList=[];updateCompareUI();
    });
  }

  function showCompareModal(){
    var products=compareList.map(function(id){return getProducts().find(function(p){return p.id===id})}).filter(Boolean);
    if(products.length<2)return;

    var specKeys=[];
    products.forEach(function(p){Object.keys(p.specs).forEach(function(k){if(specKeys.indexOf(k)===-1)specKeys.push(k)})});

    var existing=document.querySelector('.compare-overlay');
    if(existing)existing.remove();

    var html='<div class="compare-overlay" data-compare-close>'+
      '<div class="compare-modal">'+
        '<div class="compare-modal__header">'+
          '<h2>'+__('compare.title')+'</h2>'+
          '<button class="compare-modal__close" data-compare-close>&times;</button>'+
        '</div>'+
        '<div class="compare-modal__body">'+
          '<table class="compare-table">'+
            '<thead><tr><th></th>'+products.map(function(p){return '<th><img src="'+p.image+'" alt="'+p.name+'" width="120" height="90" loading="lazy"><div class="compare-table__name">'+p.name+'</div></th>'}).join('')+'</tr></thead>'+
            '<tbody>'+
              // Price row
              '<tr><td class="compare-table__label">'+__('compare.price')+'</td>'+products.map(function(p){return '<td class="compare-table__price">¥'+(p.price||0).toLocaleString()+'</td>'}).join('')+'</tr>'+
              // Category row
              '<tr><td class="compare-table__label">'+__('products.category')+'</td>'+products.map(function(p){return '<td>'+getCatName(p.category)+'</td>'}).join('')+'</tr>'+
              // Spec rows
              specKeys.map(function(key){
                return '<tr><td class="compare-table__label">'+key+'</td>'+products.map(function(p){return '<td>'+(p.specs[key]||'—')+'</td>'}).join('')+'</tr>';
              }).join('')+
              // Certifications
              '<tr><td class="compare-table__label">Source</td>'+products.map(function(p){return '<td>'+(p.certifications||[]).join(', ')+'</td>'}).join('')+'</tr>'+
              // Action row
              '<tr><td class="compare-table__label"></td>'+products.map(function(p){return '<td><a href="contact.html?tab=quote" class="btn btn--primary btn--sm">'+__('compare.inquire')+'</a></td>'}).join('')+'</tr>'+
            '</tbody>'+
          '</table>'+
        '</div>'+
      '</div>'+
    '</div>';

    var div=document.createElement('div');div.innerHTML=html;
    while(div.firstChild)document.body.appendChild(div.firstChild);
    document.body.style.overflow='hidden';

    var overlay=document.querySelector('.compare-overlay');
    overlay.addEventListener('click',function(e){if(e.target===this)closeCompare()});
    overlay.querySelectorAll('[data-compare-close]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();closeCompare()})});
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){closeCompare();document.removeEventListener('keydown',esc)}});
  }

  function closeCompare(){
    var overlay=document.querySelector('.compare-overlay');
    if(overlay)overlay.remove();
    document.body.style.overflow='';
  }

  /* === Init === */
  function init(){
    readURL();initFilters();initMobileFilter();render();injectJSONLD();
  }

  window.App=window.App||{};
  window.App.Products={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  document.addEventListener('lang:changed',function(){render();injectJSONLD();});
})();
