(function(){'use strict';
  window.App=window.App||{};
  var A=window.App;

  /* === Helpers === */
  A.debounce=function(fn,ms){var t;return function(){clearTimeout(t);t=setTimeout(fn.bind.apply(fn,[this].concat([].slice.call(arguments))),ms)}};
  A.throttle=function(fn,ms){var last=0;return function(){var now=Date.now();if(now-last>=ms){last=now;fn.apply(this,arguments)}}};

  /* === Smooth Scroll === */
  function initSmoothScroll(){
    document.addEventListener('click',function(e){
      var a=e.target.closest('[data-scroll-to]');
      if(!a)return;
      e.preventDefault();
      var el=document.querySelector(a.getAttribute('data-scroll-to'));
      if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  /* === Header Scroll Effect === */
  function initHeaderScroll(){
    var header=document.querySelector('.site-header');
    if(!header)return;
    var ticking=false;
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(function(){ticking=false;
        header.classList.toggle('site-header--scrolled',window.scrollY>20);
      });ticking=true;}
    },{passive:true});
  }

  /* === Mobile Menu === */
  function initMobileMenu(){
    var btn=document.querySelector('.hamburger');
    var nav=document.querySelector('.header__nav');
    if(!btn||!nav)return;
    btn.addEventListener('click',function(){
      var open=!nav.classList.contains('header__nav--open');
      nav.classList.toggle('header__nav--open',open);
      btn.classList.toggle('is-open',open);
      btn.setAttribute('aria-expanded',open);
      document.body.style.overflow=open?'hidden':'';
    });
    document.addEventListener('click',function(e){
      if(nav.classList.contains('header__nav--open')&&!nav.contains(e.target)&&!btn.contains(e.target)){
        nav.classList.remove('header__nav--open');btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded','false');document.body.style.overflow='';
      }
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('header__nav--open');btn.classList.remove('is-open');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''}});
  }

  /* === Active Nav Detection === */
  function initActiveNav(){
    var path=window.location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.header__nav-link').forEach(function(l){
      if(l.getAttribute('href')===path)l.classList.add('header__nav-link--active');
    });
  }

  /* === IntersectionObserver Factory === */
  A.createObserver=function(callback,options){
    if(!('IntersectionObserver' in window)){callback([]);return null}
    return new IntersectionObserver(callback,Object.assign({threshold:0.1,rootMargin:'0px 0px -40px 0px'},options));
  };

  /* === Fade-in on scroll === */
  function initFadeIn(){
    var els=document.querySelectorAll('.fade-in');
    if(!els.length)return;
    var obs=A.createObserver(function(entries){
      entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
    });
    els.forEach(function(el){obs.observe(el)});
  }

  /* === Toast === */
  A.toast=function(msg,type){
    type=type||'success';
    var t=document.querySelector('.toast');
    if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}
    t.textContent=msg;t.className='toast toast--'+type+' toast--visible';
    clearTimeout(t._tid);t._tid=setTimeout(function(){t.classList.remove('toast--visible')},3000);
  };

  /* === FAB Buttons === */
  function initFab(){
    if(document.querySelector('.fab-stack'))return;
    var html='<div class="fab-stack">'+
      '<a href="https://wa.me/86138xxxxxxxx" target="_blank" rel="noopener" class="fab-btn fab-btn--whatsapp" aria-label="WhatsApp">'+
        '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'+
        '<span class="fab-tooltip">WhatsApp</span>'+
      '</a>'+
      '<button class="fab-btn fab-btn--wechat" aria-label="WeChat" id="fabWechatBtn">'+
        '<svg viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/><path d="M14.176 14.005c-.543 0-1.049.327-1.27.792-.448-.195-.966-.354-1.537-.46-.22-.04-.258-.174-.165-.342.557-1.01 1.594-1.705 2.783-1.92.322-.059.647-.074.982-.05.154.011.298.001.433-.046.37-.13.771-.194 1.191-.194.087 0 .173.003.26.01.07.006.115.01.138.01.202 0 .346-.131.338-.327-.03-.738-.424-1.424-1.034-1.83-.47-.313-1.026-.484-1.622-.484-1.316 0-2.442.623-3.167 1.661-1.443-1.064-2.184-3.11-1.895-5.114.04-.28.081-.557.123-.833.03-.193-.088-.363-.284-.363-.255 0-.534.033-.828.095-2.21.467-4.042 2.089-4.865 4.237-.53 1.384-.572 2.787-.144 4.054.416 1.23 1.278 2.183 2.415 2.674.97.419 2.11.524 3.286.316.11-.02.178-.087.178-.194 0-.179 1.382-.011 1.732-.05.448-.05.844-.19 1.162-.401.13-.087.039-.263-.134-.263h-.001z" fill="#fff"/></svg>'+
        '<span class="fab-tooltip">WeChat</span>'+
      '</button>'+
      '<div class="fab-wechat-popover" id="fabWechatPop">'+
        '<div class="fab-wechat-popover__qr">'+(window.App&&window.App.__?window.App.__('fab.wechatQr'):'微信扫码<br>添加好友').replace(/\n/g,'<br>')+'</div>'+
        '<span>'+(window.App&&window.App.__?window.App.__('fab.wechatAccount'):'公众号：华悦园林机械')+'</span>'+
      '</div>'+
      '<a href="mailto:export\x40huayueyuanlin.com" class="fab-btn fab-btn--email" aria-label="Email">'+
        '<svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'+
        '<span class="fab-tooltip">Email</span>'+
      '</a>'+
    '</div>';
    var div=document.createElement('div');
    div.innerHTML=html;
    while(div.firstChild)document.body.appendChild(div.firstChild);
    var wcBtn=document.getElementById('fabWechatBtn');
    var wcPop=document.getElementById('fabWechatPop');
    if(wcBtn&&wcPop){
      wcBtn.addEventListener('click',function(e){e.preventDefault();wcPop.classList.toggle('fab-wechat-popover--visible')});
      document.addEventListener('click',function(e){if(!wcBtn.contains(e.target)&&!wcPop.contains(e.target))wcPop.classList.remove('fab-wechat-popover--visible')});
    }
  }

  /* === Init === */
  A.Core={init:function(){
    initHeaderScroll();initMobileMenu();initActiveNav();initSmoothScroll();initFadeIn();initFab();
  }};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',A.Core.init)}
  else{A.Core.init()}
})();
