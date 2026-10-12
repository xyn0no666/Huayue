/* === 滚动联动效果（首页 / 品牌页） ===
   零依赖，只做两件事：错峰延迟变量 + 一个共享的视差滚动循环。

   刻意不碰 .fade-in 的 class、不新建 IntersectionObserver——
   进场显隐仍由 core.js / home.js / brand.js 现有的 observer 负责。
   本文件只写 CSS 变量和 inline transform，因此不会和它们抢状态。 */
(function(){'use strict';

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 错峰进场：给容器的直接子元素编号 --- */
  var STAGGER=['.factory-grid','.categories-grid','.featured-grid',
               '.stats-grid','.sustainability-grid','.values-grid'];

  function assignStagger(){
    for(var s=0;s<STAGGER.length;s++){
      var box=document.querySelector(STAGGER[s]);
      if(!box)continue;
      var kids=box.children;
      for(var i=0;i<kids.length;i++)kids[i].style.setProperty('--fx-i',i);
    }
  }

  /* --- 视差 --- */
  /* 位移幅度 = 容器高度的 4%（0 → 4%，单向）。
     留白余量来自 css 里的基座 scale(1.10)：向四周各溢出 5%。
     取 4% 而非 5% 是留安全边——品牌页背景层是 scale 与 translate 复合，
     实际视觉位移会被放大 1.10 倍。改这里要同步核对的 scale 见 home.css 的 heroZoom
     和 brand.css 的 .brand-hero__bg。 */
  var AMP=0.04;

  var items=[],ticking=false;

  function measure(){
    items=[];
    var els=document.querySelectorAll('[data-fx-parallax]');
    for(var i=0;i<els.length;i++){
      var host=els[i].parentNode;
      items.push({
        el:els[i],
        top:host.getBoundingClientRect().top+window.pageYOffset,
        h:host.offsetHeight
      });
    }
  }

  function frame(){
    ticking=false;
    var y=window.pageYOffset,vh=window.innerHeight;
    for(var i=0;i<items.length;i++){
      var it=items[i];
      if(y>it.top+it.h||y+vh<it.top)continue;      /* 不在视口附近就不算 */
      var p=(y-it.top)/it.h;
      p=p<0?0:(p>1?1:p);
      /* 写 CSS 变量而不是直接写 inline transform：
         品牌页的背景层用 transform 组合了留白用的 scale，直接覆盖会把它抹掉。 */
      it.el.style.setProperty('--fx-y',(p*AMP*it.h).toFixed(1)+'px');
    }
  }

  function schedule(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}

  function init(){
    /* 错峰变量即使开着 reduced-motion 也无害：base.css 已把 transition 置 none */
    assignStagger();

    if(reduce)return;                              /* 无动画，不绑任何滚动监听 */

    measure();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',function(){measure();schedule()});
    /* load 再扫一次兜底：home.js 的卡片注入发生在 DOMContentLoaded，
       若注册顺序有变，这里能补上 --fx-i（幂等，重设同样的值） */
    window.addEventListener('load',function(){assignStagger();measure();schedule()});
    /* 切语言后注入的网格会被重建，--fx-i 会丢，重扫一次补回来。
       本文件必须最后加载，否则这个监听会先于 home.js 的重渲染触发。 */
    document.addEventListener('lang:changed',function(){assignStagger();measure();schedule()});
    schedule();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init)}
  else{init()}
})();
