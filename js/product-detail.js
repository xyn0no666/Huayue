(function(){'use strict';

  function getProduct(){var data=window.App&&window.App.getData?window.App.getData():null;return(data&&data.products)||(window.APP_DATA&&window.APP_DATA.products)||[]}
  function getCategories(){var data=window.App&&window.App.getData?window.App.getData():null;return(data&&data.categories)||(window.APP_DATA&&window.APP_DATA.categories)||[]}
  function __(key){return window.App&&window.App.__?window.App.__(key):key}

  function getProductId(){
    var params=new URLSearchParams(window.location.search);
    return params.get('id')||'';
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
    document.title=p.name+' — '+(window.App&&window.App.__?window.App.__('meta.index.title'):'华悦园林');

    // Content
    var certsHTML=(p.certifications||[]).map(function(c){return '<span class="product-detail__cert">'+c+'</span>'}).join('');
    var specsHTML=Object.entries(p.specs).map(function(e){
      var key=__('spec.'+e[0]);
      return '<tr><td>'+key+'</td><td>'+e[1]+'</td></tr>';
    }).join('');
    var featuresHTML=(p.features||[]).map(function(f){return '<li>'+f+'</li>'}).join('');

    // 3D viewer button for blower and chainsaw products
    var view3dPages = { blower:'blower-3d.html', chainsaw:'chainsaw-3d.html' };
    var view3dPage = view3dPages[p.category];
    var view3dHTML = view3dPage
      ? '<a href="'+view3dPage+'" class="product-detail__view-3d" title="360°三维查看">'+
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+
            '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>'+
            '<polyline points="3.27 6.96 12 12.01 20.73 6.96"/>'+
            '<line x1="12" y1="22.08" x2="12" y2="12"/>'+
          '</svg>'+
          '360° 三维查看'+
        '</a>'
      : '';

    var html='<div class="product-detail__layout">'+

      // Left: Image
      '<div>'+
        '<div class="product-detail__image-wrapper">'+
          '<img src="'+p.image+'" alt="'+p.name+'" onerror="this.parentElement.style.background=\'var(--color-border)\';this.style.display=\'none\'">'+
          (certsHTML?'<div class="product-detail__certs">'+certsHTML+'</div>':'')+
          view3dHTML+
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

    // Bind quantity selector
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

    // Bind add to cart
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

  function init(){render();}

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  document.addEventListener('lang:changed',function(){render()});
})();
