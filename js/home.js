(function(){'use strict';

  function getProducts(){return (window.App&&window.App.getData().products)||[]}
  function getCategories(){return (window.App&&window.App.getData().categories)||[]}
  function getTestimonials(){return (window.App&&window.App.getData().testimonials)||[]}
  function getStats(){return (window.App&&window.App.getData().stats)||[]}
  function __(key){return window.App&&window.App.__?window.App.__(key):key}
  function getCatName(cat){var cats=getCategories();var found=cats.find(function(c){return c.id===cat});return found?found.name:cat}
  function getPowerLabel(pt){if(pt==='gasoline')return __('filter.gasoline');return pt}

  /* === Hero Slider === */
  function initHero(){
    var slides=document.querySelectorAll('.hero__slide');
    var dots=document.querySelectorAll('.hero__dot');
    var prev=document.querySelector('.hero__arrow--prev');
    var next=document.querySelector('.hero__arrow--next');
    if(!slides.length)return;

    var current=0;var total=slides.length;var interval;
    function goTo(idx){
      slides[current].classList.remove('hero__slide--active');dots[current].classList.remove('hero__dot--active');
      current=((idx%total)+total)%total;
      slides[current].classList.add('hero__slide--active');dots[current].classList.add('hero__dot--active');
    }
    function nextSlide(){goTo(current+1)}
    function prevSlide(){goTo(current-1)}
    function startAuto(){interval=setInterval(nextSlide,5000)}
    function stopAuto(){clearInterval(interval)}

    if(prev)prev.addEventListener('click',function(){prevSlide();stopAuto();startAuto()});
    if(next)next.addEventListener('click',function(){nextSlide();stopAuto();startAuto()});
    dots.forEach(function(d){d.addEventListener('click',function(){goTo(parseInt(this.getAttribute('data-dot')));stopAuto();startAuto()})});

    var touchX=0;
    var hero=document.querySelector('.hero');
    if(hero){
      hero.addEventListener('touchstart',function(e){touchX=e.touches[0].clientX},{passive:true});
      hero.addEventListener('touchend',function(e){
        var diff=touchX-e.changedTouches[0].clientX;
        if(Math.abs(diff)>50){if(diff>0)nextSlide();else prevSlide();stopAuto();startAuto()}
      });
    }
    startAuto();
  }

  /* === Category Cards === */
  function renderCategories(){
    var grid=document.getElementById('categoriesGrid');
    if(!grid)return;
    var catColors={mower:'transparent',chainsaw:'transparent',blower:'transparent'};
    var catSVGs={
      mower:'<img src="assets/images/mower-icon.png" alt="割灌机" style="max-width:80%;max-height:80%;object-fit:contain">',
      chainsaw:'<img src="assets/images/chainsaw-category-bg.png" alt="油锯" style="max-width:90%;max-height:90%;object-fit:contain">',
      blower:'<img src="assets/images/blower-category-bg.png" alt="吹风机" style="max-width:95%;max-height:95%;object-fit:contain;position:relative;top:8%">',
    };
    var catData=getCategories().filter(function(c){return c.id!=='all'});
    grid.innerHTML=catData.map(function(c){
      return '<a href="products.html?category='+c.id+'" class="category-card">'+
        '<div class="category-card__bg" style="background:'+(catColors[c.id]||'#3a3a3a')+'">'+(catSVGs[c.id]||'')+'</div>'+
        '<div class="category-card__overlay"></div>'+
        '<div class="category-card__content"><h3>'+c.name+'</h3><p>'+__('home.viewSeries')+'</p></div>'+
      '</a>';
    }).join('');
  }

  /* === Featured Products === */
  function renderFeatured(){
    var grid=document.getElementById('featuredGrid');
    if(!grid)return;
    var featuredIds=['mower-pro-x1','mower-elite-x2','mower-ride-rx3'];var products=getProducts();var featured=featuredIds.map(function(id){return products.find(function(p){return p.id===id})}).filter(Boolean);
    grid.innerHTML=featured.map(function(p){return createProductCard(p)}).join('');
    bindProductCardEvents();
  }

  function createProductCard(p){
    var certsHTML=(p.certifications||[]).slice(0,3).map(function(c){return '<span class="cert-tag">'+c+'</span>'}).join('');
    return '<div class="product-card">'+
      '<a href="product-detail.html?id='+p.id+'" class="product-card__image" style="display:block"><img src="'+p.image+'" alt="'+p.name+'" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.style.background=\'var(--color-border)\'">'+
        (certsHTML?'<div class="product-card__certs">'+certsHTML+'</div>':'')+
        '<button class="product-card__quickview" data-quickview="'+p.id+'" aria-label="'+__('home.quickView')+'">'+
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'+
        '</button>'+
      '</a>'+
      '<div class="product-card__body">'+
        '<div class="product-card__category">'+getCatName(p.category)+' · '+getPowerLabel(p.powerType)+'</div>'+
        '<h3 class="product-card__name"><a href="product-detail.html?id='+p.id+'">'+p.name+'</a></h3>'+
        '<div class="product-card__specs"><span>'+getKeySpec(p)+'</span></div>'+
        (p.moq?'<div class="product-card__meta"><span>MOQ: '+p.moq+'</span><span>'+__('common.leadTime')+p.leadTime+'</span></div>':'')+
        '<div class="product-card__footer">'+
          '<a href="products.html" class="btn btn--outline btn--sm" style="width:100%">'+__('common.view')+'</a>'+
        '</div>'+
      '</div>'+
    '</div>';
  }

  function getKeySpec(p){if(p.specs.displacement)return p.specs.displacement;if(p.specs.motor)return p.specs.motor;return p.specs.power||''}

  function bindProductCardEvents(){
    document.querySelectorAll('[data-quickview]').forEach(function(btn){
      btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
        var p=getProducts().find(function(x){return x.id===this.getAttribute('data-quickview')});
        if(p)showQuickView(p);
      });
    });
  }

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
          '<div class="quickview__specs">'+Object.entries(p.specs).map(function(e){return '<span><strong>'+e[0]+'</strong>: '+e[1]+'</span>'}).join('')+'</div>'+
          '<ul class="quickview__features">'+p.features.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul>'+
          (certsHTML?'<div style="margin-bottom:var(--space-2)">'+certsHTML+'</div>':'')+
          (p.moq?'<div style="font-size:0.8125rem;color:var(--color-text-light);margin-bottom:4px"><strong>MOQ:</strong> '+p.moq+' &nbsp; <strong>'+__('common.leadTime')+'</strong> '+(p.leadTime||__('common.inquire'))+'</div>':'')+
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
    document.querySelector('.quickview-overlay').addEventListener('click',function(e){if(e.target===this)closeQuickView()});
    document.querySelectorAll('[data-qv-close]').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault();closeQuickView()})});
    document.addEventListener('keydown',function qvEsc(e){if(e.key==='Escape'){closeQuickView();document.removeEventListener('keydown',qvEsc)}});
  }

  function closeQuickView(){
    var overlay=document.querySelector('.quickview-overlay');
    if(overlay)overlay.remove();
    document.body.style.overflow='';
  }

  /* === Stats Counter === */
  function renderStats(){
    var grid=document.getElementById('statsGrid');
    if(!grid)return;
    grid.innerHTML=getStats().map(function(s,i){
      return '<div class="stat-item fade-in"><div class="stat-item__number" data-count="'+s.value+'" data-suffix="'+s.suffix+'">0</div><div class="stat-item__label">'+s.label+'</div></div>';
    }).join('');
    observeStats();
  }

  function observeStats(){
    var counters=document.querySelectorAll('[data-count]');
    if(!counters.length)return;
    var animated=new Set();
    if(!('IntersectionObserver' in window)){animateAll();return}
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){var el=e.target;
          if(!animated.has(el)){animated.add(el);animateCounter(el)}
          observer.unobserve(el)}
      });
    },{threshold:0.5});
    counters.forEach(function(c){observer.observe(c);animated.add(c)});
    setTimeout(function(){counters.forEach(function(c){if(!c.dataset.animated)animateCounter(c)})},2000);
  }

  function animateCounter(el){
    if(el.dataset.animated)return;el.dataset.animated='1';
    var target=parseInt(el.getAttribute('data-count'));
    var suffix=el.getAttribute('data-suffix')||'';
    var duration=1800;var start=performance.now();
    function update(now){
      var elapsed=now-start;var progress=Math.min(elapsed/duration,1);
      var eased=1-Math.pow(1-progress,3);
      var current=Math.round(target*eased);
      el.textContent=current.toLocaleString()+suffix;
      if(progress<1)requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function animateAll(){
    document.querySelectorAll('[data-count]').forEach(function(el){animateCounter(el)});
  }

  /* === Testimonials === */
  function renderTestimonials(){
    var grid=document.getElementById('testimonialsGrid');
    if(!grid)return;
    grid.innerHTML=testimonials.map(function(t){
      var initials=t.name.charAt(0);
      var avatarHTML=t.avatar
        ?'<div class="testimonial-card__avatar"><img src="'+t.avatar+'" alt="'+t.name+'" loading="lazy" style="width:100%;height:100%;border-radius:50%;object-fit:cover"></div>'
        :'<div class="testimonial-card__avatar">'+initials+'</div>';
      return '<div class="testimonial-card fade-in">'+
        '<div class="testimonial-card__stars">'+'★'.repeat(t.rating)+'</div>'+
        '<p class="testimonial-card__text">"'+t.text+'"</p>'+
        '<div class="testimonial-card__author">'+
          avatarHTML+
          '<div><div class="testimonial-card__name">'+t.name+'</div>'+(t.company?'<div class="testimonial-card__company">'+t.company+'</div>':'')+(t.location?'<div class="testimonial-card__location">'+t.location+'</div>':'')+'</div>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  /* === Testimonial Slider === */
  function initTestimonialSlider(){
    var track=document.getElementById('testimonialTrack');
    var dotsContainer=document.getElementById('testimonialDots');
    if(!track)return;
    var slides=getTestimonials().slice(0,4);
    var current=0;var total=slides.length;var interval;

    track.innerHTML=slides.map(function(t,i){
      var len=t.text.length;
      var fontSize=len>140?'0.875rem':len>120?'0.9375rem':'1rem';
      return '<div class="testimonial-slide'+(i===0?' testimonial-slide--active':'')+'" data-tslide="'+i+'">'+
        '<div class="testimonial-slide__card">'+
          '<div class="testimonial-slide__stars">'+'★'.repeat(t.rating)+'</div>'+
          '<p class="testimonial-slide__text" style="font-size:'+fontSize+'">"'+t.text+'"</p>'+
          '<div class="testimonial-slide__author">'+
            '<div class="testimonial-slide__avatar"><img src="'+t.avatar+'" alt="'+t.name+'" loading="lazy"></div>'+
            '<div style="text-align:left">'+
              '<div class="testimonial-slide__name">'+t.name+'</div>'+
              '<div class="testimonial-slide__meta">'+(t.company||'')+(t.location?' · '+t.location:'')+'</div>'+
            '</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    }).join('');

    if(!dotsContainer)return;
    dotsContainer.innerHTML=slides.map(function(_,i){
      return '<button class="testimonial-slider__dot'+(i===0?' testimonial-slider__dot--active':'')+'" data-tdot="'+i+'" aria-label="'+(i+1)+'"></button>';
    }).join('');

    function goTo(idx){
      track.querySelectorAll('.testimonial-slide').forEach(function(s){s.classList.remove('testimonial-slide--active')});
      dotsContainer.querySelectorAll('.testimonial-slider__dot').forEach(function(d){d.classList.remove('testimonial-slider__dot--active')});
      current=((idx%total)+total)%total;
      track.querySelector('[data-tslide="'+current+'"]').classList.add('testimonial-slide--active');
      dotsContainer.querySelector('[data-tdot="'+current+'"]').classList.add('testimonial-slider__dot--active');
    }

    dotsContainer.addEventListener('click',function(e){
      var dot=e.target.closest('[data-tdot]');
      if(dot){goTo(parseInt(dot.getAttribute('data-tdot')));clearInterval(interval);interval=setInterval(rotate,5000)}
    });

    var prevArrow=document.getElementById('tsArrowPrev');
    var nextArrow=document.getElementById('tsArrowNext');
    if(prevArrow)prevArrow.addEventListener('click',function(){goTo(current-1);clearInterval(interval);interval=setInterval(rotate,5000)});
    if(nextArrow)nextArrow.addEventListener('click',function(){goTo(current+1);clearInterval(interval);interval=setInterval(rotate,5000)});

    function rotate(){goTo(current+1)}
    interval=setInterval(rotate,5000);
  }

  /* === Init === */
  /* === Testimonial Submit === */
  function initTestimonialSubmit(){
    var btn=document.getElementById('submitTestimonial');
    var textarea=document.getElementById('testimonialText');
    var success=document.getElementById('testimonialSuccess');
    var starsContainer=document.getElementById('testimonialStars');
    var rating=0;
    if(starsContainer){
      var stars=starsContainer.querySelectorAll('.tstar');
      stars.forEach(function(s){
        s.addEventListener('click',function(){
          rating=parseInt(this.getAttribute('data-star'));
          stars.forEach(function(star,i){star.style.color=i<rating?'var(--color-gold)':'var(--color-border)'});
        });
        s.addEventListener('mouseenter',function(){var v=parseInt(this.getAttribute('data-star'));stars.forEach(function(star,i){star.style.color=i<v?'var(--color-gold)':'var(--color-border)'})});
      });
      starsContainer.addEventListener('mouseleave',function(){stars.forEach(function(star,i){star.style.color=i<rating?'var(--color-gold)':'var(--color-border)'})});
    }
    if(!btn||!textarea)return;
    btn.addEventListener('click',function(){
      var val=textarea.value.trim();
      if(!val){if(window.App&&window.App.toast)window.App.toast(__('home.reviewPlaceholder'));return}
      btn.style.display='none';
      textarea.style.display='none';
      if(starsContainer)starsContainer.parentElement.style.display='none';
      if(success)success.style.display='block';
    });
  }

  /* === Init === */
  function init(){
    renderCategories();renderFeatured();renderStats();initHero();initTestimonialSlider();initTestimonialSubmit();
  }

  window.App=window.App||{};
  window.App.Home={init:init};

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}

  // Re-render on language change
  document.addEventListener('lang:changed',function(){
    renderCategories();renderFeatured();renderStats();initTestimonialSlider();
  });
})();
