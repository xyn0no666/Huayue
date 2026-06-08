const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'assets', '网站审查报告.pdf');
const W = 595, H = 842;
const FONT_PATH = 'C:/Windows/Fonts/simhei.ttf';

const GOLD = rgb(0.769, 0.663, 0.490);
const GOLD_LT = rgb(0.851, 0.788, 0.620);
const DARK = rgb(0.102, 0.102, 0.102);
const CARD = rgb(0.137, 0.137, 0.137);
const PANEL = rgb(0.165, 0.165, 0.165);
const WHITE = rgb(0.94, 0.94, 0.94);
const MUTED = rgb(0.667, 0.667, 0.667);
const RED = rgb(0.878, 0.333, 0.333);
const GREEN = rgb(0.298, 0.686, 0.518);
const BORDER = rgb(0.2, 0.2, 0.2);
const MX = 45, CW = W - 90;

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const en = await doc.embedFont(StandardFonts.Helvetica);
  const enB = await doc.embedFont(StandardFonts.HelveticaBold);
  const enM = await doc.embedFont(StandardFonts.Courier);
  const cnFontBytes = fs.readFileSync(FONT_PATH);
  const cn = await doc.embedFont(cnFontBytes);

  function addPage() {
    const pg = doc.addPage([W, H]);
    pg.drawRectangle({ x: 0, y: 0, width: W, height: H, color: DARK });
    pg.drawRectangle({ x: 0, y: H - 8, width: W, height: 8, color: GOLD });
    pg.drawRectangle({ x: 0, y: 0, width: W, height: 3, color: GOLD });
    return pg;
  }

  function header(pg, num) {
    pg.drawText('HUAYUE  GARDEN  MACHINERY', { x: MX, y: H - 26, size: 7, font: enB, color: GOLD });
    pg.drawText('网站审查报告  ·  Confidential', { x: MX, y: H - 36, size: 7, font: cn, color: MUTED });
    if (num > 0) pg.drawText(`— ${num} —`, { x: W - MX - 30, y: 18, size: 7, font: en, color: MUTED });
  }

  function secTitle(pg, num, title, y) {
    pg.drawText(num, { x: MX, y, size: 36, font: enB, color: GOLD, opacity: 0.35 });
    pg.drawText(title, { x: MX + 42, y: y + 8, size: 14, font: cn, color: GOLD });
    pg.drawLine({ start: { x: MX, y: y - 10 }, end: { x: MX + CW, y: y - 10 }, color: GOLD, thickness: 1 });
    return y - 30;
  }

  function text(pg, str, y, sz = 9, col = WHITE, f = cn) {
    pg.drawText(str, { x: MX, y, size: sz, font: f, color: col });
    return y - sz - 8;
  }

  function bullet(pg, str, y, col = RED) {
    pg.drawText('●', { x: MX + 10, y, size: 7, font: cn, color: col });
    pg.drawText(str, { x: MX + 26, y, size: 9, font: cn, color: WHITE });
    return y - 18;
  }

  function hr(pg, y, col = GOLD, thick = 1) {
    pg.drawLine({ start: { x: MX, y }, end: { x: MX + CW, y }, color: col, thickness: thick });
  }

  function card(pg, lines, y, bg = CARD) {
    const h = lines.length * 18 + 24;
    pg.drawRectangle({ x: MX + 6, y: y - h + 6, width: CW - 12, height: h, color: bg, borderRadius: 4 });
    let cy = y - 20;
    for (const ln of lines) {
      if (typeof ln === 'string') {
        pg.drawText(ln, { x: MX + 22, y: cy, size: 9, font: cn, color: WHITE });
      } else {
        pg.drawText(ln.t, { x: MX + 22, y: cy, size: ln.s || 9, font: ln.f || cn, color: ln.c || WHITE });
      }
      cy -= 18;
    }
    return y - h - 12;
  }

  // ============== PAGE 0: COVER ==============
  const pg0 = addPage();
  header(pg0, 0);
  let y = H - 170;
  y = text(pg0, '华悦园林机械', y, 34, GOLD);
  y = text(pg0, 'HUAYUE  GARDEN  MACHINERY', y + 10, 9, MUTED, en, true);
  y -= 6;

  const dx = (W - 200) / 2;
  pg0.drawLine({ start: { x: dx, y }, end: { x: dx + 200, y }, color: GOLD, thickness: 2 });
  y -= 24;

  y = text(pg0, '工厂官方网站  ·  审查报告', y, 18, WHITE);
  y = text(pg0, '必须修改的关键问题', y, 12, MUTED);
  y -= 40;

  // Meta box
  const meta = ['日    期          2026 年 6 月 8 日', '版    本          v1.0', '审查范围          16 个 HTML 页面  +  3 个 JS 数据文件', '正式域名          huayueyuanlin.com'];
  const mw = 280, mh = meta.length * 22 + 24, mx2 = (W - mw) / 2;
  pg0.drawRectangle({ x: mx2, y: y - mh, width: mw, height: mh, color: CARD, borderRadius: 4 });
  let my = y - 20;
  for (const m of meta) { pg0.drawText(m, { x: mx2 + 16, y: my, size: 8.5, font: cn, color: MUTED }); my -= 22; }
  y = y - mh - 50;

  pg0.drawText('— 华悦园林机械  —', { x: MX, y: 60, size: 8, font: cn, color: GOLD });
  pg0.drawText('专业园林机械制造商', { x: MX, y: 46, size: 8, font: cn, color: MUTED });

  // ============== PAGE 1: OVERVIEW ==============
  const pg1 = addPage();
  header(pg1, 1);
  y = H - 70;
  y = text(pg1, '问题概览', y, 22, GOLD);
  y -= 4; hr(pg1, y); y -= 28;

  const toc = [['01', '电话号码区号不匹配', '0579 金华/永康  →  0539 临沂'], ['02', '域名 / URL 混乱', 'GitHub 测试域名 vs 正式域名不一致'], ['03', '占位符未替换', 'GA 追踪 ID  ·  ICP 备案号  ·  微信二维码'], ['04', '残留虚假内容', '搜索提示  ·  客户评价中的虚假认证'], ['05', '客户评价 AI 头像', 'dicebear.com 卡通头像影响可信度']];
  for (const [n, t, d] of toc) {
    pg1.drawText(n, { x: MX, y, size: 18, font: enB, color: GOLD });
    pg1.drawText(t, { x: MX + 38, y, size: 11, font: cn, color: GOLD_LT });
    pg1.drawText(d, { x: MX + 38, y: y - 14, size: 8, font: cn, color: MUTED });
    y -= 44;
    if (n !== '05') hr(pg1, y + 22, BORDER, 0.5);
  }

  y -= 26;
  y = text(pg1, '严重程度说明', y, 11, GOLD_LT);
  y -= 8;
  pg1.drawText('●', { x: MX + 8, y, size: 8, font: cn, color: RED });
  pg1.drawText('高  —  影响专业可信度，必须立即修改', { x: MX + 26, y, size: 9, font: cn, color: RED });
  y -= 18;
  pg1.drawText('●', { x: MX + 8, y, size: 8, font: cn, color: GOLD });
  pg1.drawText('中  —  建议在上线前完成修改', { x: MX + 26, y, size: 9, font: cn, color: GOLD });

  // ============== PAGE 2: PHONE + URL ==============
  const pg2 = addPage();
  header(pg2, 2);
  y = H - 70;

  y = secTitle(pg2, '01', '电话号码区号不匹配', y);
  y = text(pg2, '当前全站电话区号为金华/永康 (0579)，工厂地址已迁至临沂 (0539)，区号必须更新。', y, 9, WHITE);
  y -= 8;

  // Before/After
  const bah = 64;
  pg2.drawRectangle({ x: MX + 6, y: y - bah + 6, width: CW - 12, height: bah, color: CARD, borderRadius: 4 });
  pg2.drawText('当  前', { x: MX + 22, y: y - 18, size: 8, font: cn, color: GOLD });
  pg2.drawText('0579-8722-8888', { x: MX + 70, y: y - 20, size: 13, font: enM, color: RED });
  pg2.drawText('应改为', { x: MX + 22, y: y - 42, size: 8, font: cn, color: GOLD });
  pg2.drawText('0539-XXXXXXX', { x: MX + 70, y: y - 44, size: 13, font: enM, color: GREEN });
  y -= bah + 14;

  y = text(pg2, '影响范围', y, 10, GOLD_LT);
  y -= 6;
  y = bullet(pg2, '全站 Footer 联系方式（16 个 HTML 页面）', y);
  y = bullet(pg2, '联系我们 页面顶部电话 + 表单成功提示', y);
  y = bullet(pg2, '经销商页面 紧急联系提示', y);
  y = bullet(pg2, '隐私政策页面 联系方式', y);
  y = bullet(pg2, 'i18n.js 中英文翻译键值', y);
  y -= 2;
  pg2.drawText('共约 25 处需要修改', { x: MX + 18, y, size: 8, font: cn, color: MUTED });
  y -= 30;

  // Section 2: URL
  y = secTitle(pg2, '02', '域名 / URL 混乱', y);
  y = text(pg2, '网站的 canonical URL、Open Graph URL 和资源路径指向三个不同的域名/路径，严重损害 SEO 和品牌一致性。', y, 9, WHITE);
  y -= 8;

  const urls = [{ l: 'canonical', v: 'xyn0no666.github.io/Huayue/', c: RED, d: 'GitHub Pages 测试域名' }, { l: 'og:url', v: 'huayueyuanlin.com', c: GREEN, d: '正式域名' }, { l: 'manifest', v: '/Huayue/manifest.json', c: RED, d: '子目录路径，正式部署不可用' }];
  const uh = urls.length * 26 + 18;
  pg2.drawRectangle({ x: MX + 6, y: y - uh + 6, width: CW - 12, height: uh, color: CARD, borderRadius: 4 });
  let uy = y - 18;
  for (const u of urls) {
    pg2.drawText(u.l, { x: MX + 22, y: uy, size: 8, font: enB, color: GOLD });
    pg2.drawText(u.v, { x: MX + 105, y: uy, size: 8, font: enM, color: u.c });
    pg2.drawText(u.d, { x: MX + 340, y: uy, size: 7.5, font: cn, color: MUTED });
    uy -= 26;
  }
  y -= uh + 16;

  y = text(pg2, '建议修改', y, 10, GOLD_LT);
  y -= 6;
  const fixes = ['所有 canonical 统一改为  https://huayueyuanlin.com/xxx.html', '所有 og:image 统一改为  https://huayueyuanlin.com/assets/images/...', 'manifest 从 /Huayue/manifest.json  改为  /manifest.json'];
  for (const f of fixes) { pg2.drawText(f, { x: MX + 16, y, size: 8.5, font: cn, color: WHITE }); y -= 16; }

  // ============== PAGE 3: PLACEHOLDERS + FAKE ==============
  const pg3 = addPage();
  header(pg3, 3);
  y = H - 70;

  y = secTitle(pg3, '03', '占位符未替换', y);
  y = text(pg3, '以下内容仍为占位符或测试值，出现在面向客户的正式页面中。', y, 9, WHITE);
  y -= 8;

  y = text(pg3, 'Google Analytics 追踪 ID', y + 6, 10, GOLD_LT);
  y -= 2;
  y = card(pg3, [{ t: '当前值：G-XXXXXXXXXX', c: RED }, '应替换为真实的 GA4 测量 ID', '影响 16 个 HTML 页面 + 1 个 JS 文件'], y);
  y -= 8;

  y = text(pg3, 'ICP 备案号', y + 6, 10, GOLD_LT);
  y -= 2;
  y = card(pg3, [{ t: '当前值：浙ICP备2024XXXXXX号-1', c: RED }, { t: '工厂位于山东  →  应改为 鲁ICP备XXXXXXXX号-1', c: GREEN }, '中间 6 位数字为占位符 X，须替换为真实备案号', '影响 support.html footer'], y);
  y -= 8;

  y = text(pg3, '微信公众号二维码', y + 6, 10, GOLD_LT);
  y -= 2;
  y = card(pg3, ['当前为空白占位 div，无二维码图片', '位于  contact.html  联系我们页面右下角', '需替换为真实的公众号二维码图片（PNG / JPG）'], y);
  y -= 18;

  y = secTitle(pg3, '04', '残留虚假内容', y);
  y = text(pg3, '前期清理遗漏了部分虚假内容，仍可能引起客户质疑。', y, 9, WHITE);
  y -= 12;

  // Fake table
  const fhdr = y;
  pg3.drawRectangle({ x: MX + 2, y: y - 24, width: CW - 4, height: 24, color: PANEL, borderRadius: 2 });
  pg3.drawText('位  置', { x: MX + 16, y: y - 18, size: 8, font: cn, color: GOLD });
  pg3.drawText('当前内容', { x: MX + 170, y: y - 18, size: 8, font: cn, color: GOLD });
  pg3.drawText('问  题', { x: MX + 390, y: y - 18, size: 8, font: cn, color: GOLD });
  y -= 20;

  const frows = [['support.html 搜索框', '"搜索问题... 认证"', '含虚假"认证"提示'], ['客户评价 · Karim Hassan', '"SASO 认证单证处理专业"', '暗示有 SASO 认证能力'], ['客户评价 · Marco Ferrara', '"订单从 30 万€ 增长到 180 万€"', '虚假营收数字，无据可查']];
  for (const [loc, cnt, prob] of frows) {
    y -= 4;
    pg3.drawText(loc, { x: MX + 16, y, size: 8, font: cn, color: WHITE });
    pg3.drawText(cnt, { x: MX + 170, y, size: 8, font: cn, color: RED });
    pg3.drawText(prob, { x: MX + 390, y, size: 8, font: cn, color: MUTED });
    y -= 18;
    hr(pg3, y + 9, BORDER, 0.3);
  }
  const fh = fhdr - y - 4;
  pg3.drawRectangle({ x: MX + 2, y: y + 4, width: CW - 4, height: fh, color: CARD, borderRadius: 4, opacity: 0.4 });

  y -= 16;
  y = text(pg3, '建议修改', y, 10, GOLD_LT);
  y -= 6;
  for (const f of ['搜索框：改为  "搜索问题...（如：OEM / MOQ / 保修 / 保养）"', 'Karim Hassan 评价：删除 "SASO 认证" 字样', 'Marco Ferrara 评价：删除具体营收数字']) { pg3.drawText(f, { x: MX + 16, y, size: 8.5, font: cn, color: WHITE }); y -= 16; }

  // ============== PAGE 4: AVATARS + PRIORITY ==============
  const pg4 = addPage();
  header(pg4, 4);
  y = H - 70;

  y = secTitle(pg4, '05', '客户评价 AI 头像', y);
  y = text(pg4, '首页 6 条客户评价全部使用 dicebear.com 生成的卡通风格 SVG 头像。这种风格常见于开发测试，用于正式工厂网站显得不够专业。', y, 9, WHITE);
  y -= 8;

  y = text(pg4, '当前头像来源', y + 6, 10, GOLD_LT);
  y -= 2;
  const avas = ['https://api.dicebear.com/8.x/avataaars/svg?seed=chen-zhiyuan&...', 'https://api.dicebear.com/8.x/avataaars/svg?seed=zhao-minghui&...', 'https://api.dicebear.com/8.x/avataaars/svg?seed=lin-xiaoyu&...', 'https://api.dicebear.com/8.x/avataaars/svg?seed=sun-wenbo&...', 'https://api.dicebear.com/8.x/avataaars/svg?seed=marco-ferrara&...', 'https://api.dicebear.com/8.x/avataaars/svg?seed=karim-hassan&...'];
  const ah = avas.length * 16 + 16;
  pg4.drawRectangle({ x: MX + 6, y: y - ah + 6, width: CW - 12, height: ah, color: PANEL, borderRadius: 4 });
  let ay = y - 14;
  for (const a of avas) { pg4.drawText(a, { x: MX + 22, y: ay, size: 7, font: enM, color: MUTED }); ay -= 16; }
  y -= ah + 16;

  y = text(pg4, '建议修改方案', y + 6, 10, GOLD_LT);
  y -= 2;
  y = card(pg4, [{ t: '方案 A  —  替换为真实客户公司 Logo（需客户授权）', c: WHITE }, { t: '方案 B  —  使用中性图标（如地球、行业图标）替代', c: WHITE }, { t: '方案 C  —  去掉头像，仅保留文字评价（最保守）', c: WHITE }], y, PANEL);
  y -= 26;

  // Priority table
  y = text(pg4, '修改优先级汇总', y, 18, GOLD);
  y -= 2; hr(pg4, y); y -= 22;

  const pri = [['1', '域名 / URL 统一', '高', '16 处'], ['2', '电话号码区号', '高', '25 处'], ['3', 'GA 追踪 ID', '高', '17 处'], ['4', 'ICP 备案号', '中', '1 处'], ['5', '二维码图片', '中', '1 处'], ['6', '残留虚假认证', '中', '3 处'], ['7', 'AI 头像替换', '低', '6 条']];

  // header row
  pg4.drawRectangle({ x: MX + 6, y: y - 22, width: CW - 12, height: 22, color: PANEL, borderRadius: 2 });
  pg4.drawText('#', { x: MX + 26, y: y - 16, size: 9, font: cn, color: GOLD });
  pg4.drawText('问  题', { x: MX + 55, y: y - 16, size: 9, font: cn, color: GOLD });
  pg4.drawText('等级', { x: MX + 370, y: y - 16, size: 9, font: cn, color: GOLD });
  pg4.drawText('修改量', { x: MX + 440, y: y - 16, size: 9, font: cn, color: GOLD });
  y -= 28;

  for (const [n, iss, lvl, cnt] of pri) {
    hr(pg4, y + 12, BORDER, 0.3);
    pg4.drawText(n, { x: MX + 30, y, size: 10, font: en, color: WHITE });
    pg4.drawText(iss, { x: MX + 55, y, size: 10, font: cn, color: WHITE });
    const lc = lvl === '高' ? RED : lvl === '中' ? GOLD : MUTED;
    pg4.drawText(lvl, { x: MX + 370, y, size: 10, font: cn, color: lc });
    pg4.drawText(cnt, { x: MX + 440, y, size: 10, font: cn, color: MUTED });
    y -= 20;
  }
  pg4.drawRectangle({ x: MX + 6, y, width: CW - 12, height: pri.length * 20 + 22, color: BORDER, borderRadius: 4, borderWidth: 0.5 });

  y -= 32;
  pg4.drawText('预计总修改量：约 68 处，预计工作量 2 — 3 小时', { x: MX, y, size: 10, font: cn, color: GOLD });
  y -= 36;
  pg4.drawText('—  END  —', { x: MX, y, size: 9, font: cn, color: MUTED });

  // Save
  const pdfBytes = await doc.save();
  fs.writeFileSync(OUTPUT, pdfBytes);
  console.log(`PDF created: ${OUTPUT}`);
  console.log(`Pages: ${doc.getPageCount()}`);
}

main().catch(err => { console.error(err); process.exit(1); });
