/* === Google Analytics (条件加载) ===
 * 使用方法：将下方 gaId 替换为你的 Google Analytics 测量 ID（格式：G-XXXXXXXXXX）
 * 留空或保持 'G-XXXXXXXXXX' 则不会加载任何 GA 脚本
 */
(function(){
  'use strict';

  var gaId = 'G-XXXXXXXXXX'; // ← 替换为真实 GA ID 即可启用

  // 未配置真实 ID 时不加载
  if (!gaId || gaId === 'G-XXXXXXXXXX') return;

  // 加载 gtag.js
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(script);

  // 初始化 dataLayer 和 gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', gaId);
})();
