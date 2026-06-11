(function(){
  'use strict';

  var currentLang = (function(){
    try { return localStorage.getItem('huayue_lang') || 'zh'; }
    catch(e) { return 'zh'; }
  })();

  var DICT = {
    zh: {
      // Meta
      'meta.index.title':'华悦园林 — 专业园林机械制造商 | 源头工厂','meta.index.desc':'华悦园林 — 专业园林机械制造商，割灌机、油锯、吹风机源头工厂。多年OEM/ODM经验，欢迎全球客户询盘合作。',
      // Nav
      'nav.home':'首页','nav.products':'产品中心','nav.brand':'关于我们','nav.support':'技术支持','nav.contact':'联系我们',
      // Header actions
      'header.dealer':'经销商入口','header.inquire':'立即询问','header.cart':'购物车','header.menu':'菜单',
      // Footer
      'footer.brand.desc':'专业园林机械制造商，源头工厂，多年OEM/ODM经验，欢迎全球客户合作。',
      'footer.products':'产品','footer.company':'公司','footer.support':'支持','footer.contact':'联系',
      'footer.products.mower':'割灌机','footer.products.chainsaw':'油锯','footer.products.blower':'吹风机',
      'footer.company.about':'关于我们','footer.company.factory':'工厂实力','footer.company.info':'公司信息','footer.company.join':'加入我们',
      'footer.support.tech':'技术支持','footer.support.faq':'常见问题','footer.support.guides':'保养指南','footer.support.parts':'售后配件',
      'footer.contact.tel':'19862905209','footer.contact.email':'3539576340@qq.com','footer.contact.inquiry':'在线询盘','footer.contact.dealer':'经销商门户',
      'footer.copyright':'© 2026 华悦园林 — 华悦园林机械',
      // Home hero
      'hero.tag1':'Made in China · Sold Worldwide','hero.title1':'专业园林机械<br>制造商','hero.desc1':'源头工厂，多年OEM/ODM经验，全工序自主生产',
      'hero.tag2':'Precision Engineering','hero.title2':'精工铸械<br>匠心造机','hero.desc2':'深耕园林机械领域，以严苛工艺打磨每一台设备，坚守品质初心，精研性能细节',
      'hero.tag3':'Factory Direct · Wholesale Price','hero.title3':'源头供货<br>合作共赢','hero.desc3':'41,000㎡现代化工厂，全工序自主生产，灵活OEM/ODM，低MOQ试单支持',
      'hero.btn.catalog':'产品目录','hero.btn.inquire':'发送询盘','hero.btn.gasoline':'汽油产品系列','hero.btn.factory':'了解工厂','hero.btn.all':'查看全部产品','hero.btn.dealer':'经销商入口',
      'hero.scroll':'向下探索',
      // Home sections
      'section.factory':'工厂实力','section.factory.sub':'41,000㎡现代化制造基地，全工序自主生产',
      'factory.card1.title':'源头工厂','factory.card1.desc':'完全自主生产，冲压/焊接/涂装/注塑/电机/总装全工序覆盖，无中间环节，成本可控',
      'factory.card2.title':'品质管控','factory.card2.desc':'来料检验、过程巡检、成品全检三道品控关口，每台设备唯一追溯码，为客户提供品质保障',
      'factory.card3.title':'灵活定制','factory.card3.desc':'OEM/ODM全案服务，品牌、配色、配置、包装均可定制。低MOQ试订单，60天新品开发周期',
      'factory.card4.title':'准时交付','factory.card4.desc':'ERP排产管理，常规订单25-35天交货，交付准时率98%以上。双海外仓提供本地配送',
      'section.products':'产品系列','section.products.sub':'全场景园林机械设备，汽油动力硬核高效',
      'section.featured':'推荐产品','section.featured.sub':'全球客户一致推荐的畅销机型',
      'section.testimonials':'客户评价','section.testimonials.sub':'来自全球合作伙伴的真实反馈',
      'testimonials.rating':'评分：',
      'cta.title':'寻找可靠的园林机械供应商？','cta.desc':'立即联系我们，获取产品报价、样品和工厂参观安排',
      'cta.send':'发送询盘','cta.dealer':'申请经销商',
      // Products page
      'products.tag':'Product Catalog','products.title':'产品中心','products.subtitle':'全系列汽油园林机械设备，2冲程/4冲程双动力平台，源头工厂直供，支持OEM/ODM定制',
      'products.filter':'筛选条件','products.reset':'重置','products.search':'搜索产品名称...','products.searchLabel':'搜索',
      'products.category':'产品类别',
      'products.all':'全部产品','products.mower':'割灌机','products.chainsaw':'油锯','products.blower':'吹风机',
      'products.power':'动力类型','products.powerAll':'全部','products.gasoline':'汽油',
      'products.sort':'排序方式','products.sortDefault':'默认排序','products.sortPopular':'按热门度','products.sortName':'按名称',
      'products.count':'共 {count} 款产品','products.noResults':'没有找到匹配的产品，请调整筛选条件','products.resetFilter':'重置筛选',
      // Brand page
      'brand.tag':'Made in China · Sold Worldwide','brand.title':'专业园林机械制造商','brand.subtitle':'多年专注，从山东临沂走向全球——我们以精益制造赢得信任',
      'brand.timeline':'发展历程','brand.timeline.sub':'从小型加工厂到规模化现代制造基地的发展历程',
      'brand.timeline.2008.title':'初创扎根期','brand.timeline.2008.desc':'从2008年注册建厂，聚焦园林机械基础零部件加工、小型整机组装业务。初期的厂区规模较小，员工仅10-30人。',
      'brand.timeline.2013.title':'稳步积累期','brand.timeline.2013.desc':'经过近四年的初创沉淀，工厂进入稳步成长阶段。本阶段重点优化生产工艺，完善产品矩阵，摆脱单一配件的加工模式。',
      'brand.timeline.2017.title':'规模扩产期','brand.timeline.2017.desc':'此阶段是工厂跨越式发展的关键节点，伴随国内园林绿化产业爆发，园林机械市场需求激增，工厂启动全面规模化升级。',
      'brand.timeline.2021.title':'体系成熟期','brand.timeline.2021.desc':'厂区、产能、团队规模成型之后，工厂进入了精细化、体系化升级阶段，彻底告别粗放式生产模式。',
      'brand.timeline.2026.title':'鼎盛稳定期','brand.timeline.2026.desc':'现阶段的工厂成熟发展阶段，41,334㎡的规模化厂区，50+全套生产设备，百人专业团队，形成了业务一体化的完整产业体系。',
      'brand.factory.tag':'Manufacturing Excellence','brand.factory.title':'制造实力，看得见的品质','brand.factory.desc1':'41,000㎡现代化厂区，涵盖冲压、焊接、涂装、注塑、电机、电池PACK、总装七大车间。4条流水装配线日产能800台，满足大订单需求。','brand.factory.desc2':'我们拥有三坐标测量仪、光谱分析仪、盐雾试验箱、耐久性测试台等30余台检测设备。每款产品出厂前需经过来料检验、过程巡检、成品全检三道关口。',
      'brand.factory.stat1':'㎡ 厂区面积','brand.factory.stat2':'条装配线','brand.factory.stat3':'名员工',
      'brand.quality':'品质与责任','brand.quality.sub':'在追求卓越制造的同时，我们同样关注对环境和员工的责任',
      'brand.qcard1.title':'全流程品控体系','brand.qcard1.desc':'从来料检验到成品出厂的全流程质量管理，每台设备均有唯一追溯码，质量问题48小时响应。',
      'brand.qcard2.title':'研发与模具能力','brand.qcard2.desc':'20余位研发工程师，自主模具加工中心，可60天内完成从设计到样机的全流程开发，年新品开发能力15款以上。',
      'brand.qcard3.title':'供应链整合','brand.qcard3.desc':'与国内外优质供应商建立长期采购合作，核心零部件经过严格筛选与测试，确保关键部件品质稳定。',
      'brand.qcard4.title':'快速响应','brand.qcard4.desc':'询盘24小时内回复，样品3-5个工作日发出，常规订单25-35天交货。专职外贸团队提供英语、德语、日语、西班牙语服务。',
      'brand.why':'为什么选择我们','brand.why.sub':'全球客户的信赖之选',
      'brand.vcard1.title':'源头工厂','brand.vcard1.desc':'完全自主生产，无中间环节。从冲压到总装全工序自制，成本可控，品质可溯。',
      'brand.vcard2.title':'灵活定制','brand.vcard2.desc':'OEM/ODM全案服务。品牌、配色、配置、包装均可定制，低MOQ试订单支持，助您快速测试市场。',
      'brand.vcard3.title':'准时交付','brand.vcard3.desc':'ERP生产管理系统排产，订单进度实时追踪。交付准时率98%以上，旺季产能预留服务保障老客户。',
      'brand.vcard4.title':'全球服务','brand.vcard4.desc':'英语、德语、日语、西班牙语外贸团队，德国/美国双海外仓，售后备件72小时全球可达。',
      'brand.company':'公司信息','brand.company.fullname':'公司全称：','brand.company.est':'成立时间：','brand.company.addr':'注册地址：','brand.company.area':'厂房面积：','brand.company.staff':'员工人数：','brand.company.capacity':'年产能：',
      'brand.company.fullname.val':'华悦园林机械','brand.company.est.val':'2008年','brand.company.addr.val':'山东省临沂市罗庄区休闲垂钓园东北200米（银杏路东）','brand.company.area.val':'41,334 平方米','brand.company.staff.val':'100+ 人','brand.company.capacity.val':'15 万台',
      'brand.cert':'品质管控','brand.cert.1':'来料检验体系 — 关键零部件逐批抽检','brand.cert.2':'过程巡检制度 — 关键工序100%监控','brand.cert.3':'成品全检流程 — 功率/油耗/安全逐台检测','brand.cert.4':'耐久性验证 — 模拟极端工况连续运行测试','brand.cert.5':'环保材料管控 — 严格选用环保原材料与工艺','brand.cert.6':'产品追溯系统 — 唯一追溯码，48小时快速响应',
      'brand.partners':'服务承诺','brand.partner.1':'源头工厂直供 — 完全自主生产，成本可控','brand.partner.2':'灵活定制服务 — OEM/ODM全案，低MOQ试单','brand.partner.3':'多语言外贸团队 — 英语/德语/日语/西班牙语','brand.partner.4':'快速响应机制 — 询盘24h回复，样品3-5天发出','brand.partner.5':'完善的售后体系 — 备件充足，技术远程支持',
      'brand.cta.title':'期待与您合作','brand.cta.desc':'欢迎预约验厂，近距离了解我们的制造实力','brand.cta.btn':'发送询盘',
      'brand.issuer':'发证机构:',
      // Contact page
      'contact.tag':'Get In Touch','contact.title':'联系我们','contact.subtitle':'无论产品咨询、获取报价还是预约验厂，我们的专业外贸团队随时为您服务',
      'contact.tab.inquiry':'产品咨询','contact.tab.quote':'获取报价','contact.tab.demo':'预约验厂','contact.tab.dealer':'经销商申请',
      'contact.phone':'19862905209','contact.phone.label':'服务热线','contact.phone.hours':'周一至周六 8:00 - 18:00 (GMT+8)',
      'contact.email.label':'电子邮箱','contact.email.hint':'外贸团队24小时内回复',
      'contact.addr.label':'工厂地址','contact.addr.hint':'距临沂机场30分钟 / 临沂北站25分钟',
      'contact.wechat.label':'微信 / WeChat','contact.wechat.hint':'请备注"园林机械询盘"',
      'contact.qr.label':'微信二维码','contact.qr.hint':'扫码添加微信好友','contact.qr.placeholder':'微信扫码关注',
      'contact.expo':'国际展会','contact.expo.desc':'2026年展会计划：','contact.expo.1':'德国科隆 spoga+gafa (6月)','contact.expo.2':'美国 GIE+EXPO (10月)','contact.expo.3':'广交会 (4月/10月)',
      // Support page
      'support.tag':'Support Center','support.title':'技术支持中心','support.subtitle':'全面的产品FAQ、维护保养知识及外贸常见问题解答',
      'support.search':'搜索问题...（如：OEM / MOQ / 保修 / 保养）',
      'support.catAll':'全部','support.catProduct':'产品选择','support.catMaintain':'维护保养','support.catWarranty':'保修服务','support.catParts':'配件订购','support.catDealer':'经销商',
      'support.guides':'技术指南','support.guides.sub':'从选型到维护，专业资料助您做出最佳决策',
      'support.readTime':'阅读时间：','support.readMore':'阅读全文 →',
      'support.downloads':'资料下载','support.downloads.sub':'选择产品类别，下载规格书与产品手册',
      'support.download':'下载手册','support.noProduct':'没有找到对应产品',
      'support.cta.title':'还没有找到答案？','support.cta.desc':'直接联系我们的技术团队或外贸经理，获取一对一专业服务',
      // Dealer page
      'dealer.tag':'Partner Portal','dealer.title':'经销商门户','dealer.subtitle':'专为合作伙伴打造的数字化管理平台',
      'dealer.login.title':'合作伙伴登录','dealer.login.desc':'登录您的经销商账户以管理库存、订单和营销物料',
      'dealer.login.email':'账户邮箱','dealer.login.password':'密码','dealer.login.remember':'记住登录状态','dealer.login.btn':'登录',
      'dealer.login.forgot':'忘记密码？','dealer.login.apply':'申请成为经销商',
      'dealer.welcome':'欢迎回来','dealer.lastLogin':'最后登录','dealer.logout':'退出登录',
      'dealer.stat.inventory':'库存总量','dealer.stat.orders':'本月订单','dealer.stat.amount':'本月采购额','dealer.stat.rate':'订单满足率',
      'dealer.tab.inventory':'库存管理','dealer.tab.orders':'订单历史','dealer.tab.marketing':'营销物料',
      'dealer.inventory.search':'搜索产品名称或SKU...',
      'dealer.fillBoth':'请填写邮箱和密码','dealer.invalidEmail':'请输入有效的邮箱地址','dealer.passwordShort':'密码长度不能少于6位',
      'dealer.verifying':'验证中...','dealer.loginSuccess':'登录成功','dealer.loginFailed':'邮箱或密码错误',
      'dealer.resetPassword':'请联系外贸经理重置密码，邮箱: 3539576340@qq.com',
      'dealer.partner':'合作伙伴',
      'dealer.dl.pdf':'下载 PDF','dealer.dl.assets':'下载素材','dealer.dl.gallery':'浏览图库','dealer.dl.video':'下载视频','dealer.dl.pack':'下载素材包','dealer.dl.excel':'下载 Excel',
      'dealer.marketing.cat1':'2026 产品画册','dealer.marketing.desc1':'全系列产品高清画册，适合印刷及电子分发',
      'dealer.marketing.cat2':'店头展示海报','dealer.marketing.desc2':'各系列产品宣传海报，多种尺寸可选',
      'dealer.marketing.cat3':'产品高清图库','dealer.marketing.desc3':'白底产品图、场景图、细节图，300dpi',
      'dealer.marketing.cat4':'产品演示视频','dealer.marketing.desc4':'专业产品演示及对比评测视频素材',
      'dealer.marketing.cat5':'社交媒体素材包','dealer.marketing.desc5':'Facebook/Instagram/YouTube推广素材',
      'dealer.marketing.cat6':'产品技术参数表','dealer.marketing.desc6':'全系列产品详细技术参数与对比表',
      'inventory.ok':'充足','inventory.low':'偏低','inventory.out':'缺货','inventory.restock':'补货',
      // Cart
      'cart.empty':'购物车为空','cart.goShopping':'去选购产品','cart.title':'购物车','cart.noItems':'暂无商品',
      'cart.decrease':'减少','cart.increase':'增加','cart.remove':'移除','cart.delete':'删除',
      'cart.summary':'合计 {count} 款 / {qty} 台','cart.checkout':'去结算','cart.continue':'继续选购',
      'cart.add':'加入购物车','cart.added':'已加入购物车',
      // Checkout
      'checkout.tag':'Checkout','checkout.title':'结算','checkout.subtitle':'确认产品清单，填写收货信息并完成支付。',
      'checkout.summary':'订单摘要','checkout.items':'商品清单','checkout.form':'收货信息',
      'checkout.name':'收货人姓名','checkout.phone':'联系电话','checkout.email':'电子邮箱',
      'checkout.address':'收货地址','checkout.note':'备注信息','checkout.submit':'确认下单',
      // Common
      'common.close':'关闭','common.submit':'提交','common.view':'查看','common.leadTime':'交期:','common.unit':'台',
      'common.prev':'上一个','common.next':'下一个','common.inquire':'咨询',
      // Home JS labels
      'home.viewSeries':'查看系列 →','home.quickView':'快速查看','home.factoryPrice':'出厂价咨询','home.sendInquiry':'发送询盘',
      'home.added':'已添加','home.reviewPlaceholder':'在此输入客户评价内容...','home.submitSuccess':'提交成功','home.thanksReview':'感谢点评，砥砺前行',
      // Products JS labels
      'filter.gasoline':'汽油',
      // Validate
      'validate.required':'请填写此项','validate.email':'请输入有效的邮箱地址',
      'contact.submitting':'提交中...',
      // FAB (core.js)
      'fab.wechatQr':'微信扫码\n添加好友','fab.wechatAccount':'公众号：华悦园林机械',
      // Product detail
      'detail.specs':'技术参数','detail.features':'产品特点','detail.moq':'最小起订量','detail.leadTime':'交货周期','detail.price':'参考单价','detail.askQuestion':'咨询详情',
      // Spec keys
      'spec.engine':'发动机','spec.displacement':'排量','spec.cuttingWidth':'割幅','spec.weight':'重量','spec.shaftType':'杆类型',
      'spec.barLength':'导板长度','spec.chainPitch':'链条节距','spec.airVolume':'风量','spec.airSpeed':'风速',
      'spec.power':'功率','spec.tank':'油箱','spec.size':'尺寸',
      // Mobile contact bar
      'mobile.tel':'电话','mobile.email':'邮件','mobile.inquire':'发送询盘',
      // Contact popup
      'contactPopup.title':'联系我们','contactPopup.intro':'专业园林机械制造商，源头工厂直供。无论产品咨询还是合作洽谈，我们随时为您服务。',
      'contactPopup.online':'在线','contactPopup.offline':'离线中，将在工作日回复',
      'contactPopup.wa.label':'WhatsApp','contactPopup.wa.val':'+86 19862905209',
      'contactPopup.wc.label':'微信','contactPopup.wc.val':'HuayueGarden',
      'contactPopup.em.label':'电子邮件','contactPopup.em.val':'3539576340@qq.com',
      'contactPopup.ph.label':'电话','contactPopup.ph.val':'19862905209'
    },
    en: {
      // Meta
      'meta.index.title':'Huayue Garden — Professional Garden Machinery Manufacturer | Source Factory','meta.index.desc':'Huayue Garden — Professional garden machinery manufacturer. Brush cutters, chainsaws, and blowers direct from the source factory. Years of OEM/ODM experience. Contact us for cooperation.',
      // Nav
      'nav.home':'Home','nav.products':'Products','nav.brand':'About Us','nav.support':'Support','nav.contact':'Contact',
      // Header actions
      'header.dealer':'Dealer Portal','header.inquire':'Inquire Now','header.cart':'Cart','header.menu':'Menu',
      // Footer
      'footer.brand.desc':'Professional garden machinery manufacturer, source factory with years of OEM/ODM experience. Welcome global cooperation.',
      'footer.products':'Products','footer.company':'Company','footer.support':'Support','footer.contact':'Contact',
      'footer.products.mower':'Brush Cutter','footer.products.chainsaw':'Chainsaw','footer.products.blower':'Leaf Blower',
      'footer.company.about':'About Us','footer.company.factory':'Factory Strength','footer.company.info':'Company Info','footer.company.join':'Join Us',
      'footer.support.tech':'Tech Support','footer.support.faq':'FAQ','footer.support.guides':'Maintenance Guides','footer.support.parts':'Spare Parts',
      'footer.contact.tel':'19862905209','footer.contact.email':'3539576340@qq.com','footer.contact.inquiry':'Online Inquiry','footer.contact.dealer':'Dealer Portal',
      'footer.copyright':'© 2026 Huayue Garden — Huayue Garden Machinery',
      // Home hero
      'hero.tag1':'Made in China · Sold Worldwide','hero.title1':'Professional Garden<br>Machinery Manufacturer','hero.desc1':'Source factory, years of OEM/ODM experience, full in-house production',
      'hero.tag2':'Precision Engineering','hero.title2':'Precision Crafted<br>Built to Last','hero.desc2':'Deeply rooted in garden machinery, every device refined through rigorous craftsmanship and relentless quality pursuit',
      'hero.tag3':'Factory Direct · Wholesale Price','hero.title3':'Factory Direct<br>Win-Win Partnership','hero.desc3':'41,000m² modern factory, full in-house production, flexible OEM/ODM, low MOQ trial orders supported',
      'hero.btn.catalog':'Product Catalog','hero.btn.inquire':'Send Inquiry','hero.btn.gasoline':'Gasoline Series','hero.btn.factory':'Explore Factory','hero.btn.all':'View All Products','hero.btn.dealer':'Dealer Portal',
      'hero.scroll':'Scroll to explore',
      // Home sections
      'section.factory':'Factory Strength','section.factory.sub':'41,000m² modern manufacturing base with full in-house production',
      'factory.card1.title':'Source Factory','factory.card1.desc':'Complete in-house production covering stamping, welding, coating, injection molding, motor, and final assembly — no middlemen, cost under control',
      'factory.card2.title':'Quality Control','factory.card2.desc':'Three quality gates — incoming inspection, in-process patrol, and final full inspection. Each unit carries a unique traceability code for quality assurance.',
      'factory.card3.title':'Flexible Customization','factory.card3.desc':'Full OEM/ODM services: brand, color, configuration, and packaging all customizable. Low MOQ trial orders, 60-day new product development cycle',
      'factory.card4.title':'On-Time Delivery','factory.card4.desc':'ERP production scheduling, 25-35 day standard lead time, 98%+ on-time delivery rate. Dual overseas warehouses for local distribution',
      'section.products':'Product Series','section.products.sub':'Full-scene garden machinery, gasoline-powered for hardcore efficiency',
      'section.featured':'Featured Products','section.featured.sub':'Best-selling models recommended by global customers',
      'section.testimonials':'Customer Reviews','section.testimonials.sub':'Authentic feedback from global partners',
      'testimonials.rating':'Rating: ',
      'cta.title':'Looking for a reliable garden machinery supplier?','cta.desc':'Contact us now for product quotes, samples, and factory visit arrangements',
      'cta.send':'Send Inquiry','cta.dealer':'Apply as Dealer',
      // Products page
      'products.tag':'Product Catalog','products.title':'Products','products.subtitle':'Full range of gasoline garden machinery, 2-stroke/4-stroke dual power platforms, direct from source factory, OEM/ODM customization supported',
      'products.filter':'Filters','products.reset':'Reset','products.search':'Search product name...','products.searchLabel':'Search',
      'products.category':'Product Category',
      'products.all':'All Products','products.mower':'Brush Cutter','products.chainsaw':'Chainsaw','products.blower':'Leaf Blower',
      'products.power':'Power Type','products.powerAll':'All','products.gasoline':'Gasoline',
      'products.sort':'Sort By','products.sortDefault':'Default','products.sortPopular':'Popularity','products.sortName':'Name',
      'products.count':'{count} products','products.noResults':'No matching products found. Try adjusting your filters.','products.resetFilter':'Reset Filters',
      // Brand page
      'brand.tag':'Made in China · Sold Worldwide','brand.title':'Professional Garden Machinery Manufacturer','brand.subtitle':'Years of dedication, from Linyi China to the world — earning trust through lean manufacturing',
      'brand.timeline':'Our Journey','brand.timeline.sub':'From a small workshop to a scaled modern manufacturing base',
      'brand.timeline.2008.title':'Foundation (2008)','brand.timeline.2008.desc':'Registered and established the factory, focusing on basic garden machinery parts processing and small-scale assembly. The initial facility was modest with 10-30 employees.',
      'brand.timeline.2013.title':'Steady Growth (2013)','brand.timeline.2013.desc':'After four years of foundation work, the factory entered steady growth. This phase focused on optimizing production processes, expanding the product portfolio, and moving beyond single-part processing.',
      'brand.timeline.2017.title':'Rapid Expansion (2017)','brand.timeline.2017.desc':'A key inflection point — fueled by the domestic landscaping industry boom, garden machinery demand surged. The factory launched comprehensive scale-up and facility upgrades.',
      'brand.timeline.2021.title':'System Maturity (2021)','brand.timeline.2021.desc':'With facility, capacity, and team at scale, the factory entered a refinement and systematization phase, moving decisively beyond extensive production models.',
      'brand.timeline.2026.title':'Established Excellence (2026)','brand.timeline.2026.desc':'Today the factory operates at mature scale — 41,334m² facility, 50+ full production equipment sets, 100+ professional team members, forming a complete integrated business system.',
      'brand.factory.tag':'Manufacturing Excellence','brand.factory.title':'Visible Quality, Tangible Strength','brand.factory.desc1':'41,000m² modern facility with seven workshops: stamping, welding, coating, injection molding, motor, battery pack, and final assembly. Four assembly lines produce 800 units daily, meeting large-order demands.','brand.factory.desc2':'We operate 30+ testing devices including CMM, spectrometer, salt spray chamber, and durability test benches. Every product passes three quality gates: incoming inspection, in-process patrol, and final full inspection.',
      'brand.factory.stat1':'m² Facility','brand.factory.stat2':'Assembly Lines','brand.factory.stat3':'Employees',
      'brand.quality':'Quality & Responsibility','brand.quality.sub':'While pursuing manufacturing excellence, we equally value our environmental and employee responsibilities',
      'brand.qcard1.title':'Full-Process Quality Control','brand.qcard1.desc':'Full-process quality management from incoming material inspection to finished product delivery. Each unit has a unique traceability code; quality issues receive 48-hour response.',
      'brand.qcard2.title':'R&D & Tooling Capability','brand.qcard2.desc':'20+ R&D engineers, in-house mold machining center. Complete development from design to prototype in 60 days; annual new product development capacity of 15+ models.',
      'brand.qcard3.title':'Supply Chain Integration','brand.qcard3.desc':'Long-term procurement partnerships with quality domestic and international suppliers. Critical components undergo rigorous screening and testing for consistent quality.',
      'brand.qcard4.title':'Rapid Response','brand.qcard4.desc':'Inquiries answered within 24 hours, samples shipped in 3-5 business days, standard orders delivered in 25-35 days. Dedicated trade team provides service in English, German, Japanese, and Spanish.',
      'brand.why':'Why Choose Us','brand.why.sub':'Trusted by clients worldwide',
      'brand.vcard1.title':'Source Factory','brand.vcard1.desc':'Complete in-house production, zero intermediaries. From stamping to final assembly — all self-manufactured for cost control and quality traceability.',
      'brand.vcard2.title':'Flexible Customization','brand.vcard2.desc':'Full OEM/ODM services. Brand, color, configuration, and packaging all customizable. Low MOQ trial orders to help you test your market quickly.',
      'brand.vcard3.title':'On-Time Delivery','brand.vcard3.desc':'ERP production management with real-time order tracking. 98%+ on-time delivery rate; peak-season capacity reservation for loyal customers.',
      'brand.vcard4.title':'Global Service','brand.vcard4.desc':'Trade team fluent in English, German, Japanese, and Spanish. Dual warehouses in Germany and USA; after-sales spare parts delivered globally within 72 hours.',
      'brand.company':'Company Information','brand.company.fullname':'Company: ','brand.company.est':'Established: ','brand.company.addr':'Address: ','brand.company.area':'Facility Area: ','brand.company.staff':'Employees: ','brand.company.capacity':'Annual Capacity: ',
      'brand.company.fullname.val':'Huayue Garden Machinery','brand.company.est.val':'2008','brand.company.addr.val':'200m NE of Leisure Fishing Garden, Luozhuang District, Linyi, Shandong, China (east of Yinxing Road)','brand.company.area.val':'41,334 m²','brand.company.staff.val':'100+','brand.company.capacity.val':'150,000 units',
      'brand.cert':'Quality Control','brand.cert.1':'Incoming Inspection — Batch sampling of key components','brand.cert.2':'In-Process Patrol — 100% monitoring of critical steps','brand.cert.3':'Final Full Inspection — Power, fuel & safety per unit','brand.cert.4':'Durability Verification — Extended testing under extreme conditions','brand.cert.5':'Eco-Friendly Materials — Strict sourcing of green materials','brand.cert.6':'Product Traceability — Unique ID, 48-hour rapid response',
      'brand.partners':'Service Commitments','brand.partner.1':'Direct Factory Supply — Full in-house, cost under control','brand.partner.2':'Flexible Customization — Full OEM/ODM, low MOQ trials','brand.partner.3':'Multilingual Team — EN/DE/JP/ES trade managers','brand.partner.4':'Rapid Response — 24h reply, 3-5 day sample dispatch','brand.partner.5':'Complete After-Sales — Ample spare parts, remote support',
      'brand.cta.title':'Looking Forward to Working With You','brand.cta.desc':'Schedule a factory visit to experience our manufacturing strength up close','brand.cta.btn':'Send Inquiry',
      'brand.issuer':'Issuer: ',
      // Contact page
      'contact.tag':'Get In Touch','contact.title':'Contact Us','contact.subtitle':'Whether product inquiry, quotation request, or factory visit — our professional trade team is here to serve you',
      'contact.tab.inquiry':'Product Inquiry','contact.tab.quote':'Get Quote','contact.tab.demo':'Factory Visit','contact.tab.dealer':'Dealer Application',
      'contact.phone':'19862905209','contact.phone.label':'Hotline','contact.phone.hours':'Mon-Sat 8:00-18:00 (GMT+8)',
      'contact.email.label':'Email','contact.email.hint':'Trade team responds within 24 hours',
      'contact.addr.label':'Factory Address','contact.addr.hint':'30 min from Linyi Airport / 25 min from Linyubei Station',
      'contact.wechat.label':'WeChat','contact.wechat.hint':'Please note "Garden Machinery Inquiry"',
      'contact.qr.label':'WeChat QR Code','contact.qr.hint':'Scan to add on WeChat','contact.qr.placeholder':'Scan QR Code',
      'contact.expo':'International Trade Shows','contact.expo.desc':'2026 Exhibition Schedule:','contact.expo.1':'Germany Cologne spoga+gafa (June)','contact.expo.2':'USA GIE+EXPO (October)','contact.expo.3':'Canton Fair (April/October)',
      // Support page
      'support.tag':'Support Center','support.title':'Technical Support','support.subtitle':'Comprehensive product FAQ, maintenance guides, and trade-related information',
      'support.search':'Search questions... (e.g. OEM / MOQ / warranty / maintenance)',
      'support.catAll':'All','support.catProduct':'Selection','support.catMaintain':'Maintenance','support.catWarranty':'Warranty','support.catParts':'Spare Parts','support.catDealer':'Dealer',
      'support.guides':'Technical Guides','support.guides.sub':'Professional resources to help you make the best decisions — from selection to maintenance',
      'support.readTime':'Read time: ','support.readMore':'Read More →',
      'support.downloads':'Downloads','support.downloads.sub':'Select product category to download specifications and manuals',
      'support.download':'Download Manual','support.noProduct':'No matching products found',
      'support.cta.title':'Haven\'t found the answer?','support.cta.desc':'Contact our technical team or trade managers directly for one-on-one professional service',
      // Dealer page
      'dealer.tag':'Partner Portal','dealer.title':'Dealer Portal','dealer.subtitle':'A digital management platform built for our partners',
      'dealer.login.title':'Partner Login','dealer.login.desc':'Log in to your dealer account to manage inventory, orders, and marketing materials',
      'dealer.login.email':'Account Email','dealer.login.password':'Password','dealer.login.remember':'Remember me','dealer.login.btn':'Login',
      'dealer.login.forgot':'Forgot password?','dealer.login.apply':'Apply as dealer',
      'dealer.welcome':'Welcome back','dealer.lastLogin':'Last login','dealer.logout':'Logout',
      'dealer.stat.inventory':'Total Inventory','dealer.stat.orders':'Orders This Month','dealer.stat.amount':'Monthly Purchase','dealer.stat.rate':'Order Fill Rate',
      'dealer.tab.inventory':'Inventory','dealer.tab.orders':'Order History','dealer.tab.marketing':'Marketing Materials',
      'dealer.inventory.search':'Search product name or SKU...',
      'dealer.fillBoth':'Please enter email and password','dealer.invalidEmail':'Please enter a valid email address','dealer.passwordShort':'Password must be at least 6 characters',
      'dealer.verifying':'Verifying...','dealer.loginSuccess':'Login successful','dealer.loginFailed':'Invalid email or password',
      'dealer.resetPassword':'Please contact your account manager to reset your password: 3539576340@qq.com',
      'dealer.partner':'Partner',
      'dealer.dl.pdf':'Download PDF','dealer.dl.assets':'Download Assets','dealer.dl.gallery':'Browse Gallery','dealer.dl.video':'Download Video','dealer.dl.pack':'Download Pack','dealer.dl.excel':'Download Excel',
      'dealer.marketing.cat1':'2026 Product Catalog','dealer.marketing.desc1':'Full-range HD product catalog suitable for print and digital distribution',
      'dealer.marketing.cat2':'In-Store Display Posters','dealer.marketing.desc2':'Promotional posters for each product series, multiple sizes available',
      'dealer.marketing.cat3':'HD Product Image Gallery','dealer.marketing.desc3':'White-background, lifestyle, and detail images at 300dpi',
      'dealer.marketing.cat4':'Product Demo Videos','dealer.marketing.desc4':'Professional product demonstration and comparison video assets',
      'dealer.marketing.cat5':'Social Media Asset Pack','dealer.marketing.desc5':'Facebook/Instagram/YouTube promotional materials',
      'dealer.marketing.cat6':'Product Technical Specs','dealer.marketing.desc6':'Detailed technical specifications and comparison tables for the full product range',
      'inventory.ok':'Adequate','inventory.low':'Low','inventory.out':'Out of Stock','inventory.restock':'Restock',
      // Cart
      'cart.empty':'Cart is empty','cart.goShopping':'Browse Products','cart.title':'Shopping Cart','cart.noItems':'No items yet',
      'cart.decrease':'Decrease','cart.increase':'Increase','cart.remove':'Remove','cart.delete':'Delete',
      'cart.summary':'{count} models / {qty} units','cart.checkout':'Checkout','cart.continue':'Continue Shopping',
      'cart.add':'Add to Cart','cart.added':'Added to cart',
      // Checkout
      'checkout.tag':'Checkout','checkout.title':'Checkout','checkout.subtitle':'Review your items and fill in shipping information to complete your order.',
      'checkout.summary':'Order Summary','checkout.items':'Items','checkout.form':'Shipping Information',
      'checkout.name':'Recipient Name','checkout.phone':'Phone','checkout.email':'Email',
      'checkout.address':'Shipping Address','checkout.note':'Order Notes','checkout.submit':'Place Order',
      // Common
      'common.close':'Close','common.submit':'Submit','common.view':'View','common.leadTime':'Lead time: ','common.unit':'units',
      'common.prev':'Previous','common.next':'Next','common.inquire':'Inquire',
      // Home JS labels
      'home.viewSeries':'View Series →','home.quickView':'Quick View','home.factoryPrice':'Factory Price Inquiry','home.sendInquiry':'Send Inquiry',
      'home.added':'Added','home.reviewPlaceholder':'Enter your review here...','home.submitSuccess':'Submitted Successfully','home.thanksReview':'Thank you for your feedback!',
      // Products JS labels
      'filter.gasoline':'Gasoline',
      // Validate
      'validate.required':'This field is required','validate.email':'Please enter a valid email address',
      'contact.submitting':'Submitting...',
      // FAB (core.js)
      'fab.wechatQr':'Scan QR\nAdd on WeChat','fab.wechatAccount':'WeChat: 华悦园林机械',
      // Product detail
      'detail.specs':'Specifications','detail.features':'Features','detail.moq':'MOQ','detail.leadTime':'Lead Time','detail.price':'Reference Price','detail.askQuestion':'Ask a Question',
      // Spec keys
      'spec.engine':'Engine','spec.displacement':'Displacement','spec.cuttingWidth':'Cutting Width','spec.weight':'Weight','spec.shaftType':'Shaft Type',
      'spec.barLength':'Bar Length','spec.chainPitch':'Chain Pitch','spec.airVolume':'Air Volume','spec.airSpeed':'Air Speed',
      'spec.power':'Power','spec.tank':'Fuel Tank','spec.size':'Dimensions',
      // Mobile contact bar
      'mobile.tel':'Call','mobile.email':'Email','mobile.inquire':'Inquire',
      // Contact popup
      'contactPopup.title':'Contact Us','contactPopup.intro':'Professional garden machinery manufacturer, direct from the source factory. We\'re here for product inquiries and partnership discussions.',
      'contactPopup.online':'Online','contactPopup.offline':'Offline — will respond on business days',
      'contactPopup.wa.label':'WhatsApp','contactPopup.wa.val':'+86 19862905209',
      'contactPopup.wc.label':'WeChat','contactPopup.wc.val':'HuayueGarden',
      'contactPopup.em.label':'Email','contactPopup.em.val':'3539576340@qq.com',
      'contactPopup.ph.label':'Phone','contactPopup.ph.val':'19862905209'
    }
  };

  // --- Public API ---
  window.App = window.App || {};

  window.App.__ = function(key){
    var langDict = DICT[currentLang];
    if (langDict && langDict[key] !== undefined) return langDict[key];
    if (currentLang !== 'zh' && DICT.zh[key] !== undefined) return DICT.zh[key];
    return key;
  };

  window.App.lang = function(){ return currentLang; };

  window.App.getData = function(){
    if (currentLang === 'en' && window.APP_DATA_EN) return window.APP_DATA_EN;
    return window.APP_DATA || {};
  };

  // --- CSS-selector-based header/footer translation mapping ---
  function translateHeaderFooter(){
    var map = [
      // Header nav links (matched by href)
      ['.header__nav-link[href="index.html"]', 'nav.home'],
      ['.header__nav-link[href="products.html"]', 'nav.products'],
      ['.header__nav-link[href="brand.html"]', 'nav.brand'],
      ['.header__nav-link[href="support.html"]', 'nav.support'],
      ['.header__nav-link[href="contact.html"]', 'nav.contact'],
      // Also match clean URLs (Netlify)
      ['a.header__nav-link[href="/"]', 'nav.home'],
      ['.header__nav-link[href="/products"]', 'nav.products'],
      ['.header__nav-link[href="/brand"]', 'nav.brand'],
      ['.header__nav-link[href="/support"]', 'nav.support'],
      ['.header__nav-link[href="/contact"]', 'nav.contact'],
      // Header actions
      ['.header__dealer-link', 'header.dealer'],
      ['.header__actions .btn--outline', 'header.inquire'],
      ['.hamburger', 'header.menu', 'aria-label'],
      ['.header__cart-btn', 'header.cart', 'aria-label'],
      // Footer
      ['.footer__brand-desc', 'footer.brand.desc'],
      ['.footer__col:nth-child(2) .footer__col-title', 'footer.products'],
      ['.footer__col:nth-child(3) .footer__col-title', 'footer.company'],
      ['.footer__col:nth-child(4) .footer__col-title', 'footer.support'],
      ['.footer__col:nth-child(5) .footer__col-title', 'footer.contact'],
      // Footer product links
      ['.footer__col:nth-child(2) .footer__links a[href*="mower"]', 'footer.products.mower'],
      ['.footer__col:nth-child(2) .footer__links a[href*="chainsaw"]', 'footer.products.chainsaw'],
      ['.footer__col:nth-child(2) .footer__links a[href*="blower"]', 'footer.products.blower'],
      // Footer company links
      ['.footer__col:nth-child(3) .footer__links a[href="brand.html"]', 'footer.company.about'],
      ['.footer__col:nth-child(3) .footer__links a[href="brand.html#factory"]', 'footer.company.factory'],
      ['.footer__col:nth-child(3) .footer__links a[href="brand.html#company-info"]', 'footer.company.info'],
      ['.footer__col:nth-child(3) .footer__links a[href="contact.html"]', 'footer.company.join'],
      ['.footer__col:nth-child(3) .footer__links a[href="/brand"]', 'footer.company.about'],
      ['.footer__col:nth-child(3) .footer__links a[href="/contact"]', 'footer.company.join'],
      // Footer support links
      ['.footer__col:nth-child(4) .footer__links a[href="support.html"]', 'footer.support.tech'],
      ['.footer__col:nth-child(4) .footer__links a[href="support.html#faqAccordion"]', 'footer.support.faq'],
      ['.footer__col:nth-child(4) .footer__links a[href="support.html#guidesGrid"]', 'footer.support.guides'],
      ['.footer__col:nth-child(4) .footer__links a[href="/support"]', 'footer.support.tech'],
      // Footer contact links
      ['.footer__col:nth-child(5) .footer__links a[href^="tel:"]', 'footer.contact.tel'],
      ['.footer__col:nth-child(5) .footer__links a[href^="mailto:"]', 'footer.contact.email'],
      ['.footer__col:nth-child(5) .footer__links a[href="contact.html"]:not([href*="#"])', 'footer.contact.inquiry'],
      ['.footer__col:nth-child(5) .footer__links a[href="dealer.html"]', 'footer.contact.dealer'],
      ['.footer__col:nth-child(5) .footer__links a[href="/dealer"]', 'footer.contact.dealer'],
      ['.footer__col:nth-child(5) .footer__links a[href="/contact"]:not([href*="#"])', 'footer.contact.inquiry'],
      // Footer copyright
      ['.footer__bottom span:first-child', 'footer.copyright'],
      // Breadcrumb
      ['.breadcrumb__current', 'nav.brand', null]
    ];

    map.forEach(function(entry){
      var selector = entry[0];
      var key = entry[1];
      var attr = entry[2];
      try {
        var els = document.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) {
          var text = window.App.__(key);
          if (attr === 'aria-label') {
            els[i].setAttribute('aria-label', text);
          } else if (attr === 'placeholder') {
            els[i].setAttribute('placeholder', text);
          } else {
            els[i].textContent = text;
          }
        }
      } catch(e) { /* skip invalid selectors */ }
    });
  }

  // --- DOM Translation ---
  function translatePage(){
    document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN';

    // data-i18n attributes
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      els[i].textContent = window.App.__(key);
    }

    // data-i18n-placeholder
    els = document.querySelectorAll('[data-i18n-placeholder]');
    for (i = 0; i < els.length; i++) {
      key = els[i].getAttribute('data-i18n-placeholder');
      els[i].setAttribute('placeholder', window.App.__(key));
    }

    // data-i18n-aria
    els = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < els.length; i++) {
      key = els[i].getAttribute('data-i18n-aria');
      els[i].setAttribute('aria-label', window.App.__(key));
    }

    // data-i18n-content (for meta tags, title)
    els = document.querySelectorAll('[data-i18n-content]');
    for (i = 0; i < els.length; i++) {
      key = els[i].getAttribute('data-i18n-content');
      var val = window.App.__(key);
      if (els[i].tagName === 'META') {
        els[i].setAttribute('content', val);
      } else {
        els[i].textContent = val;
      }
    }

    // data-i18n-html (for elements that need innerHTML)
    els = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < els.length; i++) {
      key = els[i].getAttribute('data-i18n-html');
      els[i].innerHTML = window.App.__(key);
    }

    translateHeaderFooter();

    // Update document title if it has data-i18n-content
    var titleEl = document.querySelector('title[data-i18n-content]');
    if (titleEl) {
      document.title = titleEl.textContent;
    }
  }

  // --- Language Toggle Injection ---
  function injectLangToggle(){
    var actionsEl = document.querySelector('.header__actions');
    if (!actionsEl) return;

    // Create toggle button
    var btn = document.createElement('button');
    btn.className = 'header__lang-btn';
    btn.id = 'langToggle';
    btn.setAttribute('aria-label', 'Switch language');
    btn.textContent = currentLang === 'zh' ? 'EN' : '中文';
    btn.addEventListener('click', function(){
      window.App.setLang(currentLang === 'zh' ? 'en' : 'zh');
    });

    // Insert before the first child (cart button) in header__actions
    var firstChild = actionsEl.firstChild;
    if (firstChild) {
      actionsEl.insertBefore(btn, firstChild);
    } else {
      actionsEl.appendChild(btn);
    }

    // Inject a copy into mobile nav
    var navEl = document.querySelector('.header__nav');
    if (navEl) {
      var mobileBtn = document.createElement('button');
      mobileBtn.className = 'header__lang-btn header__lang-btn--mobile';
      mobileBtn.textContent = currentLang === 'zh' ? 'Switch to English' : '切换到中文';
      mobileBtn.addEventListener('click', function(){
        window.App.setLang(currentLang === 'zh' ? 'en' : 'zh');
      });
      navEl.insertBefore(mobileBtn, navEl.firstChild);
    }

    // Update toggle text after language change
    document.addEventListener('lang:changed', function(e){
      var lang = e.detail.lang;
      var toggleBtn = document.getElementById('langToggle');
      if (toggleBtn) {
        toggleBtn.textContent = lang === 'zh' ? 'EN' : '中文';
      }
      var mobileBtns = document.querySelectorAll('.header__lang-btn--mobile');
      for (var i = 0; i < mobileBtns.length; i++) {
        mobileBtns[i].textContent = lang === 'zh' ? 'Switch to English' : '切换到中文';
      }
    });
  }

  // --- Language switching ---
  window.App.setLang = function(lang){
    if (lang !== 'zh' && lang !== 'en') return;
    if (lang === currentLang) return;
    currentLang = lang;
    try { localStorage.setItem('huayue_lang', lang); } catch(e) {}
    translatePage();
    document.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: lang } }));
  };

  // --- Initialize ---
  function init(){
    injectLangToggle();
    translatePage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
