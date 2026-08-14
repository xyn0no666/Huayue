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
    var __=window.App&&window.App.__?window.App.__:function(k){return k;};
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
          ' '+__('fab.tooltip.copyPhone')+
        '</button>'+
        '<span class="fab-phone-popover__copied" id="fabPhoneCopied">'+__('fab.copied')+'</span>'+
      '</div>'+
      '<a href="https://wa.me/8619862905209" target="_blank" rel="noopener" class="fab-btn fab-btn--whatsapp" aria-label="WhatsApp">'+
        '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'+
        '<span class="fab-tooltip">WhatsApp</span>'+
      '</a>'+
      '<button class="fab-btn fab-btn--wechat" aria-label="WeChat" id="fabWechatBtn">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>'+
        '<span class="fab-tooltip">'+__('fab.tooltip.wechat')+'</span>'+
      '</button>'+
      '<div class="fab-wechat-popover" id="fabWechatPop">'+
        '<div class="fab-wechat-popover__qr"><img src="assets/images/wechat-qr.jpg" alt="'+__('fab.wechatQrAlt')+'" style="width:120px;height:120px;display:block;margin:0 auto"></div>'+
        '<button class="fab-phone-popover__copy" id="fabWcCopy" style="margin-top:6px">'+
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'+
          ' '+__('fab.tooltip.copyWechat')+
        '</button>'+
        '<span style="display:none;font-size:0.75rem;color:var(--color-success);font-weight:600" id="fabWcCopied">'+__('fab.copied')+'</span>'+
      '</div>'+
      '<a href="mailto:3539576340@qq.com" class="fab-btn fab-btn--email" aria-label="Email">'+
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

    // WeChat ID copy
    var wcCopy=document.getElementById('fabWcCopy');
    var wcCopied=document.getElementById('fabWcCopied');
    if(wcCopy){
      wcCopy.addEventListener('click',function(e){
        e.stopPropagation();
        navigator.clipboard.writeText('HuayueGarden').then(function(){
          wcCopy.style.display='none';wcCopied.style.display='block';
          setTimeout(function(){wcCopy.style.display='';wcCopied.style.display='none'},2000);
        }).catch(function(){});
      });
    }

    // Update text on language change
    document.addEventListener('lang:changed',function(){
      var wcTooltip=document.querySelector('.fab-btn--wechat .fab-tooltip');
      if(wcTooltip)wcTooltip.textContent=__('fab.tooltip.wechat');
      var qrImg=document.querySelector('.fab-wechat-popover__qr img');
      if(qrImg)qrImg.alt=__('fab.wechatQrAlt');
      [document.getElementById('fabPhoneCopy'),document.getElementById('fabWcCopy')].forEach(function(btn){
        if(btn){var txt=btn.lastChild;if(txt&&txt.nodeType===3)txt.textContent=' '+(btn.id==='fabPhoneCopy'?__('fab.tooltip.copyPhone'):__('fab.tooltip.copyWechat'))}
      });
      [document.getElementById('fabPhoneCopied'),document.getElementById('fabWcCopied')].forEach(function(el){
        if(el)el.textContent=__('fab.copied');
      });
    });
  }

  /* === Mobile Contact Bar (injected to all pages) === */
  function initMobileContactBar(){
    if(document.querySelector('.mobile-contact-bar'))return;
    var __=window.App&&window.App.__?window.App.__:function(k){return k;};
    var html='<div class="mobile-contact-bar">'+
      '<a href="tel:19862905209" class="mobile-contact-bar__btn mobile-contact-bar__btn--tel">'+
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'+
        '<span data-i18n="mobile.tel">'+__('mobile.tel')+'</span>'+
      '</a>'+
      '<a href="https://wa.me/8619862905209" target="_blank" rel="noopener" class="mobile-contact-bar__btn mobile-contact-bar__btn--whatsapp">'+
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'+
        '<span data-i18n="mobile.wa">'+__('mobile.wa')+'</span>'+
      '</a>'+
      '<a href="mailto:3539576340@qq.com" class="mobile-contact-bar__btn mobile-contact-bar__btn--email">'+
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'+
        '<span data-i18n="mobile.email">'+__('mobile.email')+'</span>'+
      '</a>'+
      '<a href="contact.html" class="mobile-contact-bar__btn mobile-contact-bar__btn--primary" data-i18n="mobile.inquire">'+__('mobile.inquire')+'</a>'+
    '</div>';
    var div=document.createElement('div');
    div.innerHTML=html;
    while(div.firstChild)document.body.appendChild(div.firstChild);
  }

  /* === Add WhatsApp to Footer === */
  function initFooterWhatsApp(){
    var footerCols=document.querySelectorAll('.footer__col');
    footerCols.forEach(function(col){
      var title=col.querySelector('.footer__col-title');
      if(title&&(title.textContent.trim()==='联系'||title.textContent.trim()==='Contact')){
        var links=col.querySelector('.footer__links');
        if(links&&!links.querySelector('a[href*="wa.me"]')){
          var wa=document.createElement('a');
          wa.href='https://wa.me/8619862905209';
          wa.target='_blank';
          wa.rel='noopener';
          wa.textContent='WhatsApp';
          var emailLink=links.querySelector('a[href^="mailto:"]');
          if(emailLink)emailLink.insertAdjacentElement('afterend',wa);
          else links.appendChild(wa);
        }
      }
    });
  }
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
          '<a href="mailto:3539576340@qq.com" class="contact-popup__item">'+
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

  /* === Tawk.to Live Chat === */
  function initTawkTo(){
    window.Tawk_API=window.Tawk_API||{}; window.Tawk_LoadStart=new Date();
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/6a7bd87a73934d1d3e07bc24/1jvpsb8fn';
    s1.charset='UTF-8';
    s0.parentNode.insertBefore(s1,s0);
    })();
  }

  /* === WebP Fallback === */
  function initWebPFallback(){
    var hasWebP=false;
    try{
      hasWebP=document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp')===0;
    }catch(e){}
    if(hasWebP)return;
    // Swap .webp → .jpg for browsers that don't support WebP
    document.addEventListener('error',function(e){
      var el=e.target;
      if(el&&el.tagName==='IMG'&&el.src&&el.src.indexOf('.webp')!==-1){
        el.src=el.src.replace('.webp','.jpg');
      }
    },true); // capture phase — catches errors before they bubble
    // Also proactively swap all current images
    document.querySelectorAll('img[src*=\".webp\"]').forEach(function(img){
      img.src=img.src.replace('.webp','.jpg');
    });
  }

  /* === Reading Progress Bar === */
  function initReadingProgress(){
    if(document.querySelector('.reading-progress'))return;
    var bar=document.createElement('div');
    bar.className='reading-progress';
    document.body.appendChild(bar);
    var ticking=false;
    function update(){
      ticking=false;
      var doc=document.documentElement;
      var max=doc.scrollHeight-window.innerHeight;
      bar.style.width=(max>0?(window.scrollY/max)*100:0).toFixed(3)+'%';
    }
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(update);ticking=true;}
    },{passive:true});
    window.addEventListener('resize',update);
    update();
  }

  /* === Back to Top === */
  function initBackToTop(){
    if(document.querySelector('.back-to-top'))return;
    var btn=document.createElement('button');
    btn.className='back-to-top';
    btn.setAttribute('aria-label','Back to top');
    btn.innerHTML='<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);
    var ticking=false;
    function toggle(){
      ticking=false;
      btn.classList.toggle('back-to-top--visible',window.scrollY>400);
    }
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(toggle);ticking=true;}
    },{passive:true});
    btn.addEventListener('click',function(){
      var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
    });
    toggle();
  }

  /* === Init === */
  A.Core={init:function(){
    initHeaderScroll();initMobileMenu();initActiveNav();initSmoothScroll();initFadeIn();initFab();initTheme();initCookieBanner();initMobileContactBar();initFooterWhatsApp();initTawkTo();initWebPFallback();initReadingProgress();initBackToTop();
  }};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',A.Core.init)}
  else{A.Core.init()}
})();
