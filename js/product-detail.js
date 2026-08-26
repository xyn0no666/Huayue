(function(){'use strict';

  function getProduct(){var data=window.App&&window.App.getData?window.App.getData():null;return(data&&data.products)||(window.APP_DATA&&window.APP_DATA.products)||[]}
  function getCategories(){var data=window.App&&window.App.getData?window.App.getData():null;return(data&&data.categories)||(window.APP_DATA&&window.APP_DATA.categories)||[]}
  function __(key){return window.App&&window.App.__?window.App.__(key):key}

  function getProductId(){
    var params=new URLSearchParams(window.location.search);
    var id=params.get('id');
    if(id)return id;
    var m=window.location.pathname.match(/product-(.+)\.html$/);
    return m?m[1]:'';
  }

  function getCatName(cat){
    var cats=getCategories();
    var found=cats.find(function(c){return c.id===cat});
    return found?found.name:cat;
  }

  function getPowerLabel(pt){
    if(pt==='gasoline')return __('filter.gasoline');
    return pt;
  }

  /* === Dynamic Meta Tag Injection === */
  function setMetaTag(attr,content){
    var el=document.querySelector('meta[property="'+attr+'"],meta[name="'+attr+'"]');
    if(!el){
      el=document.createElement('meta');
      if(attr.indexOf('og:')===0)el.setAttribute('property',attr);
      else el.setAttribute('name',attr);
      document.head.appendChild(el);
    }
    el.setAttribute('content',content);
  }

  function injectMeta(p){
    var catName=getCatName(p.category);
    // Try to get English name for bilingual SEO
    var enCatMap={mower:'Brush Cutter',chainsaw:'Chainsaw',blower:'Leaf Blower'};
    var enCat=enCatMap[p.category]||p.category;
    var enName=p.name;var enDesc=p.description;
    if(window.APP_DATA_EN){var enP=(window.APP_DATA_EN.products||[]).find(function(x){return x.id===p.id});if(enP){enName=enP.name;enDesc=enP.description}}
    var title=enName+' '+enCat+' — 华悦园林 Huayue Garden Machinery';
    var url='https://xyn0no666.github.io/Huayue/product-'+p.id+'.html';
    document.title=title;
    setMetaTag('description',enDesc);
    setMetaTag('og:title',title);
    setMetaTag('og:description',enDesc);
    setMetaTag('og:image','https://xyn0no666.github.io/Huayue/'+p.image);
    setMetaTag('og:url',url);
    setMetaTag('og:type','product');
    setMetaTag('twitter:card','summary_large_image');
    setMetaTag('twitter:title',title);
    setMetaTag('twitter:description',enDesc);
    setMetaTag('twitter:image','https://xyn0no666.github.io/Huayue/'+p.image);
    // Canonical
    var can=document.querySelector('link[rel="canonical"]');
    if(can)can.setAttribute('href',url);
  }

  function injectProductSchema(p){
    var existing=document.getElementById('productSchemaJsonLd');
    if(existing)existing.remove();
    var schema={
      '@context':'https://schema.org',
      '@type':'Product',
      'name':p.name,
      'description':p.description,
      'image':'https://xyn0no666.github.io/Huayue/'+p.image,
      'sku':p.id,
      'category':getCatName(p.category),
      'brand':{'@type':'Brand','name':'华悦园林'},
      'manufacturer':{'@type':'Organization','name':'华悦园林机械'},
      'offers':{
        '@type':'Offer',
        'price':(p.price||0).toString(),
        'priceCurrency':'USD',
        'availability':'https://schema.org/InStock',
        'eligibleQuantity':{'@type':'QuantitativeValue','value':p.moq||'1','unitText':'台'}
      }
    };
    var script=document.createElement('script');
    script.id='productSchemaJsonLd';
    script.type='application/ld+json';
    script.textContent=JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /* === Bind Events (for pre-rendered pages) === */
  function bindEvents(p){
    var qtyInput=document.getElementById('detailQty');
    if(qtyInput){
      document.querySelectorAll('[data-detail-qty]').forEach(function(btn){
        btn.addEventListener('click',function(){
          var v=parseInt(qtyInput.value)||1;
          if(this.getAttribute('data-detail-qty')==='plus')v++;
          else v=Math.max(1,v-1);
          qtyInput.value=v;
        });
      });
      qtyInput.addEventListener('change',function(){
        var v=parseInt(this.value);
        if(isNaN(v)||v<1)this.value=1;
      });
    }
    var addBtn=document.getElementById('detailAddToCart');
    if(addBtn){
      addBtn.addEventListener('click',function(){
        var qty=parseInt(document.getElementById('detailQty').value)||1;
        if(window.App&&window.App.Cart){
          window.App.Cart.add(p.id,qty);
        }
      });
    }
  }

  /* === Full Render (JS fallback) === */
  function render(){
    var id=getProductId();
    var products=getProduct();
    var p=products.find(function(x){return x.id===id});

    var container=document.getElementById('productDetailContent');
    var breadCat=document.getElementById('breadcrumbCat');
    var breadName=document.getElementById('breadcrumbName');

    if(!p){
      if(container){
        container.innerHTML='<div class="product-detail__error">'+
          '<h2>'+__('products.noResults')+'</h2>'+
          '<p>'+__('products.noResults')+'</p>'+
          '<a href="products.html" class="btn btn--primary btn--lg">'+__('products.all')+'</a>'+
        '</div>';
      }
      return;
    }

    // Breadcrumb
    if(breadCat)breadCat.textContent=getCatName(p.category);
    if(breadName)breadName.textContent=p.name;

    // Inject meta + schema
    injectMeta(p);
    injectProductSchema(p);

    // Content
    var certsHTML=(p.certifications||[]).map(function(c){return '<span class="product-detail__cert">'+c+'</span>'}).join('');
    var specsHTML=Object.entries(p.specs).map(function(e){
      var key=__('spec.'+e[0]);
      return '<tr><td>'+key+'</td><td>'+e[1]+'</td></tr>';
    }).join('');
    var featuresHTML=(p.features||[]).map(function(f){return '<li>'+f+'</li>'}).join('');

    var html='<div class="product-detail__layout">'+

      // Left: Image
      '<div>'+
        '<div class="product-detail__image-wrapper">'+
          '<img src="'+p.image+'" alt="'+p.name+'" loading="lazy" decoding="async" width="600" height="600" onerror="this.parentElement.style.background=\'var(--color-border)\';this.style.display=\'none\'">'+
          (certsHTML?'<div class="product-detail__certs">'+certsHTML+'</div>':'')+
        '</div>'+
      '</div>'+

      // Right: Info
      '<div>'+
        '<div class="product-detail__category">'+getCatName(p.category)+' · '+getPowerLabel(p.powerType)+'</div>'+
        '<h1 class="product-detail__name">'+p.name+'</h1>'+
        '<p class="product-detail__desc">'+p.description+'</p>'+

        // Specs
        '<div class="product-detail__specs">'+
          '<h3 class="product-detail__specs-title">'+__('detail.specs')+'</h3>'+
          '<table class="product-detail__specs-table"><tbody>'+specsHTML+'</tbody></table>'+
        '</div>'+

        // Features
        '<div class="product-detail__features">'+
          '<h3 class="product-detail__features-title">'+__('detail.features')+'</h3>'+
          '<ul class="product-detail__features-list">'+featuresHTML+'</ul>'+
        '</div>'+

        // Trade Info
        '<div class="product-detail__trade">'+
          '<div class="product-detail__trade-grid">'+
            (p.moq?'<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">'+__('detail.moq')+'</div><div class="product-detail__trade-item__value">'+p.moq+'</div></div>':'')+
            (p.leadTime?'<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">'+__('detail.leadTime')+'</div><div class="product-detail__trade-item__value">'+p.leadTime+'</div></div>':'')+
            (p.price?'<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">'+__('detail.price')+'</div><div class="product-detail__trade-item__value">¥'+p.price.toLocaleString()+' / '+__('common.unit')+'</div></div>':'')+
          '</div>'+
        '</div>'+

        // Quantity + Add to Cart
        '<div class="product-detail__qty-row">'+
          '<div class="product-detail__qty-selector">'+
            '<button class="product-detail__qty-btn" data-detail-qty="minus" aria-label="'+__('cart.decrease')+'">−</button>'+
            '<input type="number" class="product-detail__qty-input" id="detailQty" value="1" min="1" max="9999">'+
            '<button class="product-detail__qty-btn" data-detail-qty="plus" aria-label="'+__('cart.increase')+'">+</button>'+
          '</div>'+
        '</div>'+
        '<div class="product-detail__cta">'+
          '<button class="btn btn--primary btn--lg" id="detailAddToCart" data-cart-add="'+p.id+'">'+__('cart.add')+'</button>'+
          '<a href="contact.html?tab=inquiry" class="btn btn--gold-outline btn--lg">'+__('detail.askQuestion')+'</a>'+
        '</div>'+
      '</div>'+
    '</div>';

    if(container)container.innerHTML=html;
    bindEvents(p);
  }

  /* === Init === */
  function init(){
    var id=getProductId();
    var products=getProduct();
    var p=products.find(function(x){return x.id===id});

    if(!p){
      render(); // Show error
      return;
    }

    // Inject meta regardless (for pre-rendered pages too)
    injectMeta(p);
    injectProductSchema(p);

    var container=document.getElementById('productDetailContent');
    // If page has pre-rendered content (>1 child nodes), skip render, bind events only
    if(container&&container.children.length>0){
      bindEvents(p);
      return;
    }

    // SPA fallback: full render
    render();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  // Always re-render on language change (i18n text updates)
  document.addEventListener('lang:changed',function(){render()});
})();
