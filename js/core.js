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
      '<button class="fab-btn fab-btn--phone" aria-label="Phone" id="fabPhoneBtn">'+
        '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'+
        '<span class="fab-tooltip">Phone</span>'+
      '</button>'+
      '<div class="fab-phone-popover" id="fabPhonePop">'+
        '<div class="fab-phone-popover__number">19862905209</div>'+
        '<button class="fab-phone-popover__copy" id="fabPhoneCopy">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'+
          ' 复制'+
        '</button>'+
        '<span class="fab-phone-popover__copied" id="fabPhoneCopied">已复制 ✓</span>'+
      '</div>'+
      '<button class="fab-btn fab-btn--wechat" aria-label="WeChat" id="fabWechatBtn">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'+
        '<span class="fab-tooltip">微信</span>'+
      '</button>'+
      '<div class="fab-wechat-popover" id="fabWechatPop">'+
        '<div class="fab-wechat-popover__qr"><img src="assets/images/wechat-qr.jpg" alt="微信二维码" style="width:120px;height:120px;display:block;margin:0 auto"></div>'+
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
    // Phone popover
    var phBtn=document.getElementById('fabPhoneBtn');
    var phPop=document.getElementById('fabPhonePop');
    var phCopy=document.getElementById('fabPhoneCopy');
    var phCopied=document.getElementById('fabPhoneCopied');
    if(phBtn&&phPop){
      phBtn.addEventListener('click',function(e){e.preventDefault();phPop.classList.toggle('fab-phone-popover--visible');phCopied.style.display='none'});
      document.addEventListener('click',function(e){if(!phBtn.contains(e.target)&&!phPop.contains(e.target))phPop.classList.remove('fab-phone-popover--visible')});
      if(phCopy){
        phCopy.addEventListener('click',function(e){
          e.stopPropagation();
          navigator.clipboard.writeText('19862905209').then(function(){
            phCopy.style.display='none';phCopied.style.display='block';
            setTimeout(function(){phCopy.style.display='';phCopied.style.display='none'},2000);
          }).catch(function(){});
        });
      }
    }
  }

  /* === Contact Popup === */
  function isContactOnline(){
    var now=new Date();
    var day=now.getDay();
    var hour=now.getHours();
    return day>=1&&day<=6&&hour>=8&&hour<18;
  }

  function initContactPopup(){
    if(document.querySelector('.contact-bubble'))return;

    var online=isContactOnline();
    var __=window.App&&window.App.__?window.App.__:function(k){return k;};

    var html=''+
      '<button class="contact-bubble" id="contactBubble" aria-label="'+__('contactPopup.title')+'">'+
        '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'+
        '<span class="contact-bubble__dot'+(online?'':' contact-bubble__dot--offline')+'"></span>'+
      '</button>'+
      '<div class="contact-popup" id="contactPopup" role="dialog" aria-label="'+__('contactPopup.title')+'">'+
        '<div class="contact-popup__header">'+
          '<div class="contact-popup__title">'+__('contactPopup.title')+'</div>'+
          '<button class="contact-popup__close" id="contactPopupClose" aria-label="'+__('common.close')+'">&times;</button>'+
        '</div>'+
        '<div class="contact-popup__intro">'+
          __(online?'contactPopup.intro':'contactPopup.intro')+
          '<div class="contact-popup__status">'+
            '<span class="contact-popup__status-dot'+(online?'':' contact-popup__status-dot--offline')+'"></span>'+
            (online?__('contactPopup.online'):__('contactPopup.offline'))+
          '</div>'+
        '</div>'+
        '<div class="contact-popup__list">'+
          '<a href="tel:19862905209" class="contact-popup__item">'+
            '<div class="contact-popup__item-icon contact-popup__item-icon--phone"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>'+
            '<div class="contact-popup__item-body"><div class="contact-popup__item-label">'+__('contactPopup.ph.label')+'</div><div class="contact-popup__item-value">'+__('contactPopup.ph.val')+'</div></div>'+
            '<span class="contact-popup__item-arrow">&rarr;</span>'+
          '</a>'+
          '<a href="https://wa.me/8619862905209" target="_blank" rel="noopener" class="contact-popup__item">'+
            '<div class="contact-popup__item-icon contact-popup__item-icon--whatsapp"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>'+
            '<div class="contact-popup__item-body"><div class="contact-popup__item-label">'+__('contactPopup.wa.label')+'</div><div class="contact-popup__item-value">'+__('contactPopup.wa.val')+'</div></div>'+
            '<span class="contact-popup__item-arrow">&rarr;</span>'+
          '</a>'+
          '<a href="mailto:export@huayueyuanlin.com" class="contact-popup__item">'+
            '<div class="contact-popup__item-icon contact-popup__item-icon--email"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>'+
            '<div class="contact-popup__item-body"><div class="contact-popup__item-label">'+__('contactPopup.em.label')+'</div><div class="contact-popup__item-value">'+__('contactPopup.em.val')+'</div></div>'+
            '<span class="contact-popup__item-arrow">&rarr;</span>'+
          '</a>'+
          '<button class="contact-popup__item" id="contactWcBtn">'+
            '<div class="contact-popup__item-icon contact-popup__item-icon--wechat"><svg viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348z"/><path d="M14.176 14.005c-.543 0-1.049.327-1.27.792-.448-.195-.966-.354-1.537-.46-.22-.04-.258-.174-.165-.342.557-1.01 1.594-1.705 2.783-1.92.322-.059.647-.074.982-.05.154.011.298.001.433-.046.37-.13.771-.194 1.191-.194.087 0 .173.003.26.01.07.006.115.01.138.01.202 0 .346-.131.338-.327-.03-.738-.424-1.424-1.034-1.83-.47-.313-1.026-.484-1.622-.484-1.316 0-2.442.623-3.167 1.661-1.443-1.064-2.184-3.11-1.895-5.114.04-.28.081-.557.123-.833.03-.193-.088-.363-.284-.363-.255 0-.534.033-.828.095-2.21.467-4.042 2.089-4.865 4.237-.53 1.384-.572 2.787-.144 4.054.416 1.23 1.278 2.183 2.415 2.674.97.419 2.11.524 3.286.316.11-.02.178-.087.178-.194 0-.179 1.382-.011 1.732-.05.448-.05.844-.19 1.162-.401.13-.087.039-.263-.134-.263h-.001z" fill="#fff"/></svg></div>'+
            '<div class="contact-popup__item-body"><div class="contact-popup__item-label">'+__('contactPopup.wc.label')+'</div><div class="contact-popup__item-value">'+__('contactPopup.wc.val')+'</div></div>'+
            '<span class="contact-popup__item-arrow">&rarr;</span>'+
          '</button>'+
        '</div>'+
      '</div>';

    var container=document.createElement('div');
    container.innerHTML=html;
    while(container.firstChild)document.body.appendChild(container.firstChild);

    var bubble=document.getElementById('contactBubble');
    var popup=document.getElementById('contactPopup');
    var closeBtn=document.getElementById('contactPopupClose');
    var wcBtn=document.getElementById('contactWcBtn');
    var isOpen=false;

    function openPopup(){
      popup.classList.add('contact-popup--open');
      bubble.style.display='none';
      isOpen=true;
    }

    function closePopup(){
      popup.classList.remove('contact-popup--open');
      bubble.style.display='flex';
      isOpen=false;
    }

    bubble.addEventListener('click',openPopup);
    closeBtn.addEventListener('click',closePopup);

    // Click outside to close
    document.addEventListener('click',function(e){
      if(isOpen&&!popup.contains(e.target)&&!bubble.contains(e.target)){
        closePopup();
      }
    });

    // ESC to close
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&isOpen){closePopup();bubble.focus()}
    });

    // WeChat row -> show QR popover from FAB
    if(wcBtn){
      wcBtn.addEventListener('click',function(e){
        e.stopPropagation();
        var fabWc=document.getElementById('fabWechatBtn');
        if(fabWc){fabWc.click()}
      });
    }

    // Rebuild on language change
    document.addEventListener('lang:changed',function(){
      var p=document.getElementById('contactPopup');
      if(p){p.remove()}var b=document.getElementById('contactBubble');
      if(b){b.remove()}
      initContactPopup();
    });
  }

  /* === Service Worker (PWA) === */
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(function(){});
  }

  /* === Theme Toggle (Dark/Light Mode) === */
  var THEME_KEY='huayue-theme';
  var sysDark=window.matchMedia('(prefers-color-scheme: dark)');

  function getTheme(){
    var saved=localStorage.getItem(THEME_KEY);
    if(saved==='dark'||saved==='light')return saved;
    return sysDark.matches?'dark':'light';
  }

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme',t);
    localStorage.setItem(THEME_KEY,t);
  }

  function initTheme(){
    applyTheme(getTheme());
    var btn=document.getElementById('themeToggle');
    if(btn){
      btn.addEventListener('click',function(){
        var current=document.documentElement.getAttribute('data-theme');
        applyTheme(current==='dark'?'light':'dark');
      });
    }
    // Listen for system changes (only matters if user hasn't manually toggled)
    sysDark.addEventListener('change',function(e){
      // Always follow system on change if nothing saved or following system
      var saved=localStorage.getItem(THEME_KEY);
      if(!saved||(saved!=='dark'&&saved!=='light')){
        applyTheme(e.matches?'dark':'light');
      }else{
        applyTheme(saved);
      }
    });
  }

  /* === Cookie Consent === */
  var COOKIE_KEY='huayue-cookie';

  function initCookieBanner(){
    if(localStorage.getItem(COOKIE_KEY))return;
    var banner=document.getElementById('cookieBanner');
    if(!banner)return;
    // Delay slightly so the banner animates in after page load
    setTimeout(function(){banner.classList.add('cookie-banner--visible')},400);
    banner.addEventListener('click',function(e){
      var btn=e.target.closest('[data-cookie]');
      if(!btn)return;
      var val=btn.getAttribute('data-cookie');
      localStorage.setItem(COOKIE_KEY,val);
      if(val==='essential'){
        // Disable GA tracking
        window['ga-disable-G-XXXXXXXXXX']=true;
      }
      banner.classList.remove('cookie-banner--visible');
      setTimeout(function(){banner.remove()},600);
    });
  }

  /* === Init === */
  A.Core={init:function(){
    initHeaderScroll();initMobileMenu();initActiveNav();initSmoothScroll();initFadeIn();initFab();initTheme();initCookieBanner();
  }};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',A.Core.init)}
  else{A.Core.init()}
})();
