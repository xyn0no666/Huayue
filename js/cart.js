(function(){'use strict';
  var STORAGE_KEY='huayuegarden_inquiry';
  var items=[];
  var isOpen=false;

  function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}catch(e){}}
  function load(){try{var raw=localStorage.getItem(STORAGE_KEY);if(raw)items=JSON.parse(raw);}catch(e){items=[]}}

  function notify(){document.dispatchEvent(new CustomEvent('inquiry:updated',{detail:{count:getCount(),items:items.slice()}}))}
  function notifyOpen(){document.dispatchEvent(new CustomEvent(isOpen?'inquiry:opened':'inquiry:closed'))}

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
          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'+
          '<line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'+
        '</svg>'+
        '<p>询价篮为空</p>'+
        '<a href="products.html" style="color:var(--color-gold);font-size:0.8125rem;margin-top:12px;display:inline-block">去产品中心浏览</a>'+
      '</div>';
      footerEl.innerHTML='<div class="cart-panel__total"><span class="cart-panel__total-label">询价篮</span><span class="cart-panel__total-amount">暂无产品</span></div>';
    }else{
      itemsEl.innerHTML=items.map(function(i){
        var img=i.image||'';
        var catLabel=getCategoryLabel(i.category);
        return '<div class="cart-item">'+
          '<div class="cart-item__image"><img src="'+img+'" alt="'+i.name+'" onerror="this.style.display=\'none\'"></div>'+
          '<div class="cart-item__info">'+
            '<div class="cart-item__name">'+i.name+(catLabel?' <span class="cart-item__cat">'+catLabel+'</span>':'')+'</div>'+
            '<div class="cart-item__meta">MOQ: '+i.moq+' | 交期: '+i.leadTime+'</div>'+
            '<div class="cart-item__qty">'+
              '<button data-cart-qty="'+i.productId+'" data-delta="-1" aria-label="减">−</button>'+
              '<span>'+i.quantity+' 台</span>'+
              '<button data-cart-qty="'+i.productId+'" data-delta="1" aria-label="加">+</button>'+
            '</div>'+
          '</div>'+
          '<button class="cart-item__remove" data-cart-remove="'+i.productId+'" aria-label="移除">✕</button>'+
        '</div>';
      }).join('');
      footerEl.innerHTML='<div class="cart-panel__total"><span class="cart-panel__total-label">已选 '+items.length+' 款 / '+getCount()+' 台</span><span class="cart-panel__total-amount">需询价确认</span></div>'+
        '<p style="font-size:0.6875rem;color:var(--color-text-muted);margin-bottom:var(--space-2)">点击下方按钮，我们将根据数量和定制需求为您报价</p>'+
        '<a href="contact.html?tab=quote" class="btn btn--primary btn--block" data-cart-checkout>提交询价</a>'+
        '<a href="products.html" style="display:block;text-align:center;margin-top:8px;font-size:0.8125rem;color:var(--color-gold)">继续添加产品</a>';
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
        '<div class="cart-panel__header"><h3 class="cart-panel__title">询价篮</h3><button class="cart-panel__close" data-cart-close aria-label="关闭">✕</button></div>'+
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
      if(addBtn){e.preventDefault();add(addBtn.getAttribute('data-cart-add'));showToast(addBtn);return}

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

    document.addEventListener('inquiry:updated',function(){updateBadge()});
  }

  function showToast(btn){
    var existing=document.querySelector('.cart-toast');
    if(existing){existing.remove()}
    var toast=document.createElement('div');
    toast.className='cart-toast';
    toast.textContent='已加入询价篮';
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
  window.App.Inquiry={add:add,remove:remove,updateQty:updateQty,getCount:getCount,toggle:togglePanel,open:openPanel,close:closePanel,isOpen:function(){return isOpen}};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
