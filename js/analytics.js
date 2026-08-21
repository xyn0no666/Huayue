/* === Google Analytics 4 (条件加载) ===
 *
 * 当前状态：⚠️ 未启用 — GA4 测量 ID 尚未配置
 * 启用步骤：
 *   1. 前往 https://analytics.google.com 创建 GA4 数据流
 *   2. 获取测量 ID（格式：G-XXXXXXXXXX）
 *   3. 将下方 gaId 变量的值替换为真实的测量 ID
 *   4. 部署后验证：在 GA4 实时报告中出现数据即表示成功
 *
 * 未配置真实 ID 时，不会加载任何 GA 脚本，不影响网站性能。
 */
(function(){
  'use strict';

  var gaId = 'G-LTPFMRYXFF';

  // 未配置真实 ID 时不加载
  if (!gaId) return;

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
