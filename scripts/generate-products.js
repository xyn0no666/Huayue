/* One-time script: generate 17 individual product HTML files from data.js */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// Read data.js (Chinese) and i18n-data.js (English)
const dataRaw = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');
const i18nRaw = fs.readFileSync(path.join(root, 'js', 'i18n-data.js'), 'utf8');

// Fake window object to eval the data
global.window = {};
eval(dataRaw);
const APP = global.window.APP_DATA;

global.window = {};
eval(i18nRaw);
const APP_EN = global.window.APP_DATA_EN;

const products = APP.products;
const categories = APP.categories;

// Build English product lookup
const enProductMap = {};
(APP_EN.products || []).forEach(p => { enProductMap[p.id] = p; });

function getCatName(catId) {
  const c = categories.find(x => x.id === catId);
  return c ? c.name : catId;
}

function getPowerLabel(pt) {
  if (pt === 'gasoline') return '汽油';
  return pt;
}

function getCatEnglish(catId) {
  const map = { mower: 'Brush Cutter', chainsaw: 'Chainsaw', blower: 'Leaf Blower' };
  return map[catId] || catId;
}

// HTML template
function buildPage(p) {
  const catName = getCatName(p.category);
  const catEN = getCatEnglish(p.category);
  const enP = enProductMap[p.id] || {};
  const enName = enP.name || p.name;
  const enDesc = enP.description || p.description;
  const seoTitle = `${enName} ${catEN} — 华悦园林 Huayue Garden Machinery`;
  const url = `https://xyn0no666.github.io/Huayue/product-${p.id}.html`;
  const imgUrl = `https://xyn0no666.github.io/Huayue/${p.image}`;
  const desc = p.description;
  const seoDesc = enDesc || desc;

  // Certs
  const certsHTML = (p.certifications || []).map(c =>
    `<span class="product-detail__cert">${c}</span>`
  ).join('');

  // Specs table
  const specLabels = {
    engine: '发动机', displacement: '排量', power: '功率', tank: '油箱',
    shaft: '传动轴', weight: '重量', size: '尺寸', barLength: '导板长度',
    airSpeed: '风速', engineSpeed: '转速', motor: '电机'
  };
  const specsHTML = Object.entries(p.specs).map(([k, v]) => {
    const label = specLabels[k] || k;
    return `<tr><td>${label}</td><td>${v}</td></tr>`;
  }).join('');

  // Features
  const featuresHTML = (p.features || []).map(f => `<li>${f}</li>`).join('');

  const priceStr = p.price ? `¥${p.price.toLocaleString()} / 台` : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="${seoDesc}">
<meta name="keywords" content="${enName},${catEN},Huayue Garden Machinery,Chinese Factory,OEM,Wholesale">
<meta property="og:title" content="${seoTitle}">
<meta property="og:description" content="${seoDesc}">
<meta property="og:image" content="${imgUrl}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="product">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${seoTitle}">
<meta name="twitter:description" content="${seoDesc}">
<meta name="twitter:image" content="${imgUrl}">
<title>${seoTitle}</title>
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en" href="${url}?lang=en">
<link rel="alternate" hreflang="zh" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://ui-avatars.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/product-detail.css">
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#c4a97d">
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"Product",
  "name":"${p.name}",
  "description":"${desc.replace(/"/g, '\\"')}",
  "image":"${imgUrl}",
  "sku":"${p.id}",
  "category":"${catName}",
  "brand":{"@type":"Brand","name":"华悦园林"},
  "manufacturer":{"@type":"Organization","name":"华悦园林机械"},
  "offers":{
    "@type":"Offer",
    "price":"${p.price || 0}",
    "priceCurrency":"USD",
    "availability":"https://schema.org/InStock",
    "eligibleQuantity":{"@type":"QuantitativeValue","value":"${p.moq || '1'}","unitText":"台"}
  }
}
</script>
</head>
<body>
<noscript>
  <div style="background:#fff;color:#1a1a2e;text-align:center;padding:16px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;border-bottom:3px solid #c4a97d;line-height:1.6">
    <p style="margin:0 0 6px;font-size:15px;font-weight:600">华悦园林 Huayue Garden Machinery</p>
    <p style="margin:0;font-size:13px;color:#666">⚠️ 请启用 JavaScript 以浏览完整网站（产品展示 / 在线询盘 / 经销商系统）<br>Please enable JavaScript to view the full site (Products · Inquiry · Dealer Portal)</p>
    <p style="margin:8px 0 0;font-size:13px">📞 <a href="tel:19862905209" style="color:#c4a97d">19862905209</a> &nbsp;|&nbsp; ✉️ <a href="mailto:3539576340@qq.com" style="color:#c4a97d">3539576340@qq.com</a> &nbsp;|&nbsp; 🏭 山东·临沂</p>
  </div>
</noscript>

<header class="site-header" id="siteHeader">
  <div class="header__inner">
    <a href="index.html" class="header__logo" aria-label="华悦园林">华悦<span>园林</span><span class="header__logo-dot"></span></a>
    <nav class="header__nav" id="headerNav">
      <a href="index.html" class="header__nav-link" data-i18n="nav.home">首页</a>
      <a href="products.html" class="header__nav-link" data-i18n="nav.products">产品中心</a>
      <a href="brand.html" class="header__nav-link" data-i18n="nav.brand">关于我们</a>
      <a href="support.html" class="header__nav-link" data-i18n="nav.support">技术支持</a>
      <a href="contact.html" class="header__nav-link" data-i18n="nav.contact">联系我们</a>
      <button class="header__lang-btn header__lang-btn--mobile" id="langToggleMobile" aria-label="Switch language">EN</button>
    </nav>
    <div class="header__actions">
      <button class="header__lang-btn" id="langToggle" aria-label="Switch language">EN</button>
      <button class="header__theme-btn" id="themeToggle" aria-label="Toggle theme">
        <svg class="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <svg class="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <button class="header__cart-btn" id="headerCartBtn" data-cart-toggle aria-label="购物车">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <span class="header__cart-count" id="headerCartCount">0</span>
      </button>
      <a href="dealer.html" class="header__dealer-link">经销商入口</a>
      <a href="contact.html" class="btn btn--outline btn--sm">立即询问</a>
      <button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<main>
  <section class="product-detail" id="productDetail">
    <div class="u-container">
      <nav class="product-detail__breadcrumb">
        <a href="index.html" data-i18n="nav.home">首页</a> /
        <a href="products.html" data-i18n="nav.products">产品中心</a> /
        <span id="breadcrumbCat">${catName}</span> /
        <span id="breadcrumbName">${p.name}</span>
      </nav>
      <div id="productDetailContent">
        <div class="product-detail__layout">
          <div>
            <div class="product-detail__image-wrapper">
              <img src="${p.image}" alt="${p.name}" loading="eager" decoding="sync" width="600" height="600" onerror="this.parentElement.style.background='var(--color-border)';this.style.display='none'">
              ${certsHTML ? `<div class="product-detail__certs">${certsHTML}</div>` : ''}
            </div>
          </div>
          <div>
            <div class="product-detail__category">${catName} · ${getPowerLabel(p.powerType)}</div>
            <h1 class="product-detail__name">${p.name}</h1>
            <p class="product-detail__desc">${desc}</p>
            <div class="product-detail__specs">
              <h3 class="product-detail__specs-title" data-i18n="detail.specs">技术参数</h3>
              <table class="product-detail__specs-table"><tbody>${specsHTML}</tbody></table>
            </div>
            <div class="product-detail__features">
              <h3 class="product-detail__features-title" data-i18n="detail.features">产品特点</h3>
              <ul class="product-detail__features-list">${featuresHTML}</ul>
            </div>
            <div class="product-detail__trade">
              <div class="product-detail__trade-grid">
                ${p.moq ? `<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">最小起订量</div><div class="product-detail__trade-item__value">${p.moq}</div></div>` : ''}
                ${p.leadTime ? `<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">交货周期</div><div class="product-detail__trade-item__value">${p.leadTime}</div></div>` : ''}
                ${priceStr ? `<div class="product-detail__trade-item"><div class="product-detail__trade-item__label">参考单价</div><div class="product-detail__trade-item__value">${priceStr}</div></div>` : ''}
              </div>
            </div>
            <div class="product-detail__qty-row">
              <div class="product-detail__qty-selector">
                <button class="product-detail__qty-btn" data-detail-qty="minus" aria-label="减少">−</button>
                <input type="number" class="product-detail__qty-input" id="detailQty" value="1" min="1" max="9999">
                <button class="product-detail__qty-btn" data-detail-qty="plus" aria-label="增加">+</button>
              </div>
            </div>
            <div class="product-detail__cta">
              <button class="btn btn--primary btn--lg" id="detailAddToCart" data-cart-add="${p.id}">加入购物车</button>
              <a href="contact.html?tab=inquiry" class="btn btn--gold-outline btn--lg">咨询详情</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="footer__grid">
    <div class="footer__col">
      <div class="footer__brand-name">华悦园林</div>
      <p class="footer__brand-desc">专业园林机械制造商 — 割灌机、油锯、吹风机源头工厂。多年OEM/ODM经验，服务全球50+国家客户。</p>
    </div>
    <div class="footer__col">
      <div class="footer__col-title">导航</div>
      <div class="footer__links">
        <a href="index.html">首页</a><a href="products.html">产品中心</a><a href="brand.html">关于我们</a><a href="support.html">技术支持</a><a href="contact.html">联系我们</a>
      </div>
    </div>
    <div class="footer__col">
      <div class="footer__col-title">产品</div>
      <div class="footer__links">
        <a href="products.html?category=mower">割灌机</a><a href="products.html?category=chainsaw">油锯</a><a href="products.html?category=blower">吹风机</a><a href="product-detail.html">查看全部</a>
      </div>
    </div>
    <div class="footer__col">
      <div class="footer__col-title">服务</div>
      <div class="footer__links">
        <a href="support.html">FAQ</a><a href="dealer.html">经销商门户</a><a href="guide-1.html">选购指南</a><a href="guide-2.html">安全手册</a><a href="privacy.html">隐私政策</a>
      </div>
    </div>
    <div class="footer__col">
      <div class="footer__col-title">联系</div>
      <div class="footer__links">
        <a href="tel:19862905209">19862905209</a>
        <a href="mailto:&#51;&#53;&#51;&#57;&#53;&#55;&#54;&#51;&#52;&#48;&#64;&#113;&#113;&#46;&#99;&#111;&#109;">&#51;&#53;&#51;&#57;&#53;&#55;&#54;&#51;&#52;&#48;&#64;&#113;&#113;&#46;&#99;&#111;&#109;</a>
        <a href="contact.html">在线询盘</a>
        <a href="dealer.html">经销商门户</a>
      </div>
    </div>
  </div>
  <div class="footer__bottom">
    <span>&copy; 2026 华悦园林 版权所有</span>
    <span>山东临沂·华悦园林机械有限公司</span>
  </div>
</footer>

<script src="js/analytics.js"></script>
<script src="js/i18n.js"></script>
<script src="js/core.js"></script>
<script src="js/data.js"></script>
<script src="js/i18n-data.js"></script>
<script src="js/cart.js"></script>
<script src="js/product-detail.js"></script>

<div class="cookie-banner" id="cookieBanner">
  <div class="cookie-banner__inner">
    <div class="cookie-banner__text">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <span>本站使用Cookie以提升您的浏览体验。继续访问即表示您同意我们的 <a href="privacy.html">隐私政策</a>。</span>
    </div>
    <div class="cookie-banner__actions">
      <button class="btn btn--outline btn--sm" data-cookie="essential">仅必要</button>
      <button class="btn btn--primary btn--sm" data-cookie="all">全部接受</button>
    </div>
  </div>
</div>
</body>
</html>`;
}

// Create products directory if needed
const outDir = root;
console.log(`Generating ${products.length} product pages...`);

products.forEach(p => {
  const html = buildPage(p);
  const filename = `product-${p.id}.html`;
  fs.writeFileSync(path.join(outDir, filename), html, 'utf8');
  console.log(`  ✓ ${filename}`);
});

console.log('Done!');
