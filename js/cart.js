(function(){'use strict';
  var STORAGE_KEY='huayuegarden_cart';
  var items=[];
  var isOpen=false;

  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}catch(e){}}
  function load(){try{var raw=localStorage.getItem(STORAGE_KEY);if(raw)items=JSON.parse(raw);}catch(e){items=[]}}

  function notify(){document.dispatchEvent(new CustomEvent('cart:updated',{detail:{count:getCount(),items:items.slice()}}))}
  function notifyOpen(){document.dispatchEvent(new CustomEvent(isOpen?'cart:opened':'cart:closed'))}

  function getProduct(id){return (window.APP_DATA&&window.APP_DATA.products||[]).find(function(p){return p.id===id})}

  function add(productId,qty){
    qty=qty||1;
    var existing=items.find(function(i){return i.productId===productId});
    if(existing){existing.quantity+=qty}else{
      var p=getProduct(productId);if(!p)return;
      items.push({
        productId:productId,
        name:p.name,
        image:p.image,
        category:p.category||'',
        quantity:qty,
        price:p.price||0,
        moq:p.moq||'咨询',
        leadTime:p.leadTime||'咨询'
      });
    }
    save();notify();renderPanel();
  }

  function remove(productId){
    items=items.filter(function(i){return i.productId!==productId});
    save();notify();renderPanel();
  }

  function updateQty(productId,qty){
    if(qty<=0){remove(productId);return}
    var item=items.find(function(i){return i.productId===productId});
    if(item){item.quantity=qty;save();notify();renderPanel()}
  }

  function getCount(){return items.reduce(function(s,i){return s+i.quantity},0)}

  function togglePanel(){isOpen=!isOpen;updatePanelState();notifyOpen()}
  function openPanel(){isOpen=true;updatePanelState();notifyOpen()}
  function closePanel(){isOpen=false;updatePanelState();notifyOpen()}

  function updatePanelState(){
    var overlay=document.querySelector('.cart-overlay');
    var panel=document.querySelector('.cart-panel');
    if(overlay)overlay.classList.toggle('cart-overlay--visible',isOpen);
    if(panel)panel.classList.toggle('cart-panel--open',isOpen);
    document.body.style.overflow=isOpen?'hidden':'';
  }

  function getCategoryLabel(cat){
    var m={mower:'割灌机',chainsaw:'油锯',blower:'吹风机'};
    return m[cat]||cat||'';
  }

  function renderPanel(){
    var panel=document.querySelector('.cart-panel');
    if(!panel)return;
    var itemsEl=panel.querySelector('.cart-panel__items');
    var footerEl=panel.querySelector('.cart-panel__footer');
    if(!itemsEl||!footerEl)return;

    if(items.length===0){
      itemsEl.innerHTML='<div class="cart-panel__empty">'+
        '<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1" opacity="0.25">'+
          '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>'+
          '<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'+
        '</svg>'+
        '<p style="margin-top:var(--space-2)">购物车为空</p>'+
        '<a href="products.html" style="color:var(--color-gold);font-size:0.8125rem;margin-top:12px;display:inline-block">去选购产品</a>'+
      '</div>';
      footerEl.innerHTML='<div class="cart-panel__total"><span class="cart-panel__total-label">购物车</span><span class="cart-panel__total-amount">暂无商品</span></div>';
    }else{
      itemsEl.innerHTML=items.map(function(i){
        var img=i.image||'';
        var catLabel=getCategoryLabel(i.category);
        var itemTotal=(i.price||0)*i.quantity;
        return '<div class="cart-item">'+
          '<div class="cart-item__image"><img src="'+img+'" alt="'+i.name+'" onerror="this.style.display=\'none\'"></div>'+
          '<div class="cart-item__info">'+
            '<div class="cart-item__name">'+i.name+(catLabel?' <span class="cart-item__cat">'+catLabel+'</span>':'')+'</div>'+
            '<div class="cart-item__meta">MOQ: '+i.moq+' | 交期: '+i.leadTime+'</div>'+
            '<div class="cart-item__price">$'+(i.price||0).toLocaleString()+' / 台</div>'+
            '<div class="cart-item__qty">'+
              '<button data-cart-qty="'+i.productId+'" data-delta="-1" aria-label="减少">−</button>'+
              '<span>'+i.quantity+'</span>'+
              '<button data-cart-qty="'+i.productId+'" data-delta="1" aria-label="增加">+</button>'+
            '</div>'+
          '</div>'+
          '<div class="cart-item__right">'+
            '<div class="cart-item__subtotal">$'+itemTotal.toLocaleString()+'</div>'+
            '<button class="cart-item__remove" data-cart-remove="'+i.productId+'" aria-label="移除">删除</button>'+
          '</div>'+
        '</div>';
      }).join('');
      var total=items.reduce(function(s,i){return s+(i.price||0)*i.quantity},0);
      footerEl.innerHTML='<div class="cart-panel__total"><span class="cart-panel__total-label">合计 '+items.length+' 款 / '+getCount()+' 台</span><span class="cart-panel__total-amount">$'+total.toLocaleString()+'</span></div>'+
        '<a href="checkout.html" class="btn btn--primary btn--block">去结算</a>'+
        '<a href="products.html" style="display:block;text-align:center;margin-top:8px;font-size:0.8125rem;color:var(--color-gold)">继续选购</a>';
    }
    updateBadge();
  }

  function updateBadge(){
    var badge=document.querySelector('.header__cart-count');
    if(!badge)return;
    var count=items.length;
    badge.textContent=count;
    badge.classList.toggle('header__cart-count--visible',count>0);
  }

  function injectPanelDOM(){
    if(document.querySelector('.cart-panel'))return;
    var html='<div class="cart-overlay" data-cart-close></div>'+
      '<div class="cart-panel">'+
        '<div class="cart-panel__header"><h3 class="cart-panel__title">购物车</h3><button class="cart-panel__close" data-cart-close aria-label="关闭">✕</button></div>'+
        '<div class="cart-panel__items"></div>'+
        '<div class="cart-panel__footer"></div>'+
      '</div>';
    var div=document.createElement('div');
    div.innerHTML=html;
    while(div.firstChild)document.body.appendChild(div.firstChild);
  }

  function bindEvents(){
    injectPanelDOM();
    document.addEventListener('click',function(e){
      var addBtn=e.target.closest('[data-cart-add]');
      if(addBtn){e.preventDefault();add(addBtn.getAttribute('data-cart-add'));showToast();return}

      var removeBtn=e.target.closest('[data-cart-remove]');
      if(removeBtn){e.preventDefault();remove(removeBtn.getAttribute('data-cart-remove'));return}

      var qtyBtn=e.target.closest('[data-cart-qty]');
      if(qtyBtn){e.preventDefault();var pid=qtyBtn.getAttribute('data-cart-qty');var d=parseInt(qtyBtn.getAttribute('data-delta'));var item=items.find(function(i){return i.productId===pid});if(item)updateQty(pid,item.quantity+d);return}

      var toggleBtn=e.target.closest('[data-cart-toggle]');
      if(toggleBtn){e.preventDefault();togglePanel();return}

      var closeBtn=e.target.closest('[data-cart-close]');
      if(closeBtn){e.preventDefault();closePanel();return}

      var checkoutBtn=e.target.closest('[data-cart-checkout]');
      if(checkoutBtn){if(items.length===0){e.preventDefault();return}}
    });

    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&isOpen){closePanel()}
    });

    document.addEventListener('cart:updated',function(){updateBadge()});
  }

  function showToast(){
    var existing=document.querySelector('.cart-toast');
    if(existing){existing.remove()}
    var toast=document.createElement('div');
    toast.className='cart-toast';
    toast.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:6px"><polyline points="20 6 9 17 4 12"/></svg>已加入购物车';
    document.body.appendChild(toast);
    requestAnimationFrame(function(){toast.classList.add('cart-toast--visible')});
    setTimeout(function(){
      toast.classList.remove('cart-toast--visible');
      setTimeout(function(){if(toast.parentNode)toast.remove()},300);
    },1800);
  }

  function init(){
    load();bindEvents();renderPanel();updateBadge();
  }

  window.App=window.App||{};
  window.App.Cart={add:add,remove:remove,updateQty:updateQty,getCount:getCount,toggle:togglePanel,open:openPanel,close:closePanel,isOpen:function(){return isOpen}};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
