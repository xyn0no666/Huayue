from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.pdfgen import canvas
from reportlab.platypus.doctemplate import PageTemplate, BaseDocTemplate, Frame
from reportlab.platypus.frames import Frame
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
import os

# ---------- output path ----------
OUTPUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "report.pdf")

# ---------- colors ----------
GOLD       = HexColor("#c4a97d")
GOLD_LIGHT = HexColor("#d9c89e")
DARK_BG    = HexColor("#1a1a1a")
DARK_PANEL = HexColor("#222222")
DARK_CARD  = HexColor("#2a2a2a")
TEXT_WHITE = HexColor("#f0f0f0")
TEXT_MUTED = HexColor("#aaaaaa")
RED_ACCENT = HexColor("#e05555")
GREEN_ACC  = HexColor("#4caf84")
BORDER     = HexColor("#333333")

# ---------- register Chinese font ----------
# Try to register a Chinese font – use system available font
try:
    pdfmetrics.registerFont(UnicodeCIDFont('STSong-Light'))
    CN_FONT = 'STSong-Light'
except:
    try:
        pdfmetrics.registerFont(UnicodeCIDFont('HeiseiMin-W3'))
        CN_FONT = 'HeiseiMin-W3'
    except:
        CN_FONT = 'Helvetica'

# ---------- page template with dark background ----------
class DarkBackgroundDocTemplate(BaseDocTemplate):
    def __init__(self, filename, **kwargs):
        super().__init__(filename, **kwargs)
        frame = Frame(18*mm, 18*mm, A4[0]-36*mm, A4[1]-36*mm, id='main')
        self.addPageTemplates([PageTemplate(id='dark', frames=frame, onPage=self.draw_background)])

    def draw_background(self, canvas_obj, doc):
        w, h = A4
        # full dark background
        canvas_obj.setFillColor(DARK_BG)
        canvas_obj.rect(0, 0, w, h, fill=1, stroke=0)
        # gold accent line at top
        canvas_obj.setFillColor(GOLD)
        canvas_obj.rect(0, h-4*mm, w, 4*mm, fill=1, stroke=0)
        # gold accent line at bottom
        canvas_obj.rect(0, 0, w, 2*mm, fill=1, stroke=0)
        # page number
        canvas_obj.setFillColor(TEXT_MUTED)
        canvas_obj.setFont('Helvetica', 8)
        canvas_obj.drawRightString(w - 18*mm, 10*mm, f"— {canvas_obj.getPageNumber()} —")
        # header brand name
        canvas_obj.setFillColor(GOLD)
        canvas_obj.setFont('Helvetica-Bold', 9)
        canvas_obj.drawString(18*mm, h - 13*mm, "HUAYUE GARDEN MACHINERY")
        canvas_obj.setFillColor(TEXT_MUTED)
        canvas_obj.setFont('Helvetica', 7)
        canvas_obj.drawString(18*mm, h - 17*mm, "网站审查报告  ·  Confidential")


# ---------- styles ----------
styles = getSampleStyleSheet()

body_style = ParagraphStyle('cn_body', fontName=CN_FONT, fontSize=10, leading=18,
    textColor=TEXT_WHITE, alignment=TA_JUSTIFY, spaceAfter=6)

body_small = ParagraphStyle('cn_small', fontName=CN_FONT, fontSize=8.5, leading=15,
    textColor=TEXT_MUTED, alignment=TA_JUSTIFY, spaceAfter=4)

section_title = ParagraphStyle('sec_title', fontName=CN_FONT, fontSize=15, leading=22,
    textColor=GOLD, alignment=TA_LEFT, spaceAfter=10, spaceBefore=6)

card_title = ParagraphStyle('card_title', fontName=CN_FONT, fontSize=12, leading=18,
    textColor=GOLD_LIGHT, alignment=TA_LEFT, spaceAfter=4)

list_style = ParagraphStyle('cn_list', fontName=CN_FONT, fontSize=9.5, leading=17,
    textColor=TEXT_WHITE, alignment=TA_LEFT, spaceAfter=2, leftIndent=12, bulletIndent=0)

code_style = ParagraphStyle('code', fontName='Courier', fontSize=8.5, leading=13,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=2, leftIndent=8,
    fontName='Courier')

# ---------- helper functions ----------
def gold_hr():
    return HRFlowable(width="100%", thickness=1, color=GOLD, spaceBefore=6, spaceAfter=12)

def muted_hr():
    return HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceBefore=4, spaceAfter=8)

def bullet(text, style=list_style):
    return Paragraph(f"•  {text}", style)

def card(items, bg=DARK_CARD):
    """Wrap a list of Paragraphs in a dark card with padding"""
    rows = [[item] for item in items]
    tbl = Table(rows, colWidths=[A4[0]-58*mm])
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,-1), bg),
        ('LEFTPADDING', (0,0), (0,-1), 14),
        ('RIGHTPADDING', (0,0), (0,-1), 14),
        ('TOPPADDING', (0,0), (0,-1), 8),
        ('BOTTOMPADDING', (0,0), (0,-1), 8),
        ('ROUNDEDCORNERS', [6,6,6,6]),
        ('LINEBELOW', (0,0), (0,-2), 0.5, BORDER),
    ]))
    return tbl

def badge(text, color=RED_ACCENT):
    return Paragraph(f'<font color="{color}"><b>●</b></font>  {text}', list_style)

def green(text):
    return f'<font color="#4caf84">{text}</font>'

def gold(text):
    return f'<font color="#c4a97d">{text}</font>'

def red(text):
    return f'<font color="#e05555">{text}</font>'

def muted(text):
    return f'<font color="#aaaaaa">{text}</font>'


# ---------- build content ----------
story = []

# ===== COVER =====
story.append(Spacer(1, 35*mm))
story.append(Paragraph("华悦园林机械", ParagraphStyle('cover_cn', fontName=CN_FONT, fontSize=36,
    leading=46, textColor=GOLD, alignment=TA_CENTER)))
story.append(Spacer(1, 6*mm))
story.append(Paragraph("HUAYUE  GARDEN  MACHINERY", ParagraphStyle('cover_en', fontName='Helvetica',
    fontSize=11, leading=16, textColor=TEXT_MUTED, alignment=TA_CENTER, letterSpacing=6)))
story.append(Spacer(1, 14*mm))
story.append(HRFlowable(width="50%", thickness=2, color=GOLD, spaceBefore=0, spaceAfter=18))
story.append(Paragraph("工厂官方网站 · 审查报告", ParagraphStyle('cover_sub', fontName=CN_FONT, fontSize=20,
    leading=28, textColor=TEXT_WHITE, alignment=TA_CENTER)))
story.append(Spacer(1, 10*mm))
story.append(Paragraph("必须修改的关键问题", ParagraphStyle('cover_tag', fontName=CN_FONT, fontSize=13,
    leading=20, textColor=TEXT_MUTED, alignment=TA_CENTER)))
story.append(Spacer(1, 25*mm))

# meta info card
meta_items = [
    Paragraph(f'{muted("日期")}　　2026年6月8日', body_small),
    Paragraph(f'{muted("版本")}　　v1.0', body_small),
    Paragraph(f'{muted("范围")}　　16个HTML页面 + 3个JS数据文件', body_small),
    Paragraph(f'{muted("域名")}　　huayueyuanlin.com', body_small),
]
meta_tbl = Table([[item] for item in meta_items], colWidths=[120*mm])
meta_tbl.setStyle(TableStyle([
    ('ALIGN', (0,0), (0,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (0,-1), 6),
    ('BOTTOMPADDING', (0,0), (0,-1), 6),
]))
story.append(meta_tbl)

story.append(PageBreak())

# ===== PAGE 2+: TABLE OF CONTENTS =====
story.append(Spacer(1, 8*mm))
story.append(Paragraph("问题概览", ParagraphStyle('toc_title', fontName=CN_FONT, fontSize=22,
    leading=30, textColor=GOLD, alignment=TA_LEFT)))
story.append(gold_hr())

toc_data = [
    [Paragraph(gold("01"), body_style), Paragraph("电话号码区号不匹配", card_title),
     Paragraph("0579 金华/永康 → 0539 临沂", body_small)],
    [Paragraph(gold("02"), body_style), Paragraph("域名 / URL 混乱", card_title),
     Paragraph("GitHub测试域名 vs 正式域名不一致", body_small)],
    [Paragraph(gold("03"), body_style), Paragraph("占位符未替换", card_title),
     Paragraph("GA追踪ID / ICP备案号 / 微信二维码", body_small)],
    [Paragraph(gold("04"), body_style), Paragraph("残留虚假内容", card_title),
     Paragraph("搜索提示 / 客户评价中的虚假认证", body_small)],
    [Paragraph(gold("05"), body_style), Paragraph("客户评价 AI 头像", card_title),
     Paragraph("dicebear.com 卡通头像影响可信度", body_small)],
]

toc_tbl = Table(toc_data, colWidths=[12*mm, 65*mm, 80*mm])
toc_tbl.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('LINEBELOW', (0,0), (-1,-4), 0.5, BORDER),
]))
story.append(toc_tbl)
story.append(Spacer(1, 12*mm))

# Severity summary
story.append(Paragraph("严重程度说明", card_title))
story.append(muted_hr())
severity_data = [
    [Paragraph(f'{red("🔴")} 高', body_style), Paragraph('影响专业可信度，必须立即修改', body_small)],
    [Paragraph(f'{gold("🟡")} 中', body_style), Paragraph('建议在上线前完成修改', body_small)],
]
sev_tbl = Table(severity_data, colWidths=[25*mm, 135*mm])
sev_tbl.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
story.append(sev_tbl)

story.append(PageBreak())

# ===== SECTION 1: Phone =====
story.append(Paragraph("01", ParagraphStyle('num', fontName='Helvetica', fontSize=48,
    leading=52, textColor=GOLD, alignment=TA_LEFT, alpha=0.4)))
story.append(Paragraph("电话号码区号不匹配", section_title))
story.append(gold_hr())

story.append(Paragraph("当前全站使用的电话号码区号属于金华/永康地区，但工厂地址已迁至临沂，区号必须更新。", body_style))
story.append(Spacer(1, 6*mm))

# Before/After comparison
ba_data = [
    [Paragraph(gold("当前值"), card_title), Paragraph(red("0579-8722-8888"), ParagraphStyle('big', fontName='Courier', fontSize=14, leading=20, textColor=RED_ACCENT))],
    [Paragraph(gold("应改为"), card_title), Paragraph(green("0539-XXXXXXX"), ParagraphStyle('big2', fontName='Courier', fontSize=14, leading=20, textColor=GREEN_ACC))],
]
ba_tbl = Table(ba_data, colWidths=[30*mm, 100*mm])
ba_tbl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_CARD),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 12),
    ('ROUNDEDCORNERS', [4,4,4,4]),
]))
story.append(ba_tbl)
story.append(Spacer(1, 8*mm))

story.append(Paragraph("影响范围", card_title))
story.append(muted_hr())
story.append(badge("全站 Footer 联系方式（16个HTML页面）", RED_ACCENT))
story.append(badge("联系我们 页面顶部电话 + 表单成功提示", RED_ACCENT))
story.append(badge("经销商页面 紧急联系提示", RED_ACCENT))
story.append(badge("隐私政策页面 联系方式", RED_ACCENT))
story.append(badge("i18n.js 中英文翻译键值", RED_ACCENT))
story.append(Spacer(1, 2*mm))
story.append(Paragraph(f'{muted("共约 25 处需要修改")}', body_small))

story.append(PageBreak())

# ===== SECTION 2: URL =====
story.append(Paragraph("02", ParagraphStyle('num2', fontName='Helvetica', fontSize=48,
    leading=52, textColor=GOLD, alignment=TA_LEFT, alpha=0.4)))
story.append(Paragraph("域名 / URL 混乱", section_title))
story.append(gold_hr())

story.append(Paragraph("网站的 canonical URL、Open Graph URL 和资源路径指向三个不同的域名/路径，严重损害 SEO 和品牌一致性。", body_style))
story.append(Spacer(1, 8*mm))

# URL comparison
url_items = [
    [Paragraph(gold("canonical"), ParagraphStyle('lbl', fontName='Courier', fontSize=9, textColor=GOLD, leading=14)),
     Paragraph(red("xyn0no666.github.io/Huayue/"), code_style),
     Paragraph("GitHub Pages 测试域名", body_small)],
    [Paragraph(gold("og:url"), ParagraphStyle('lbl', fontName='Courier', fontSize=9, textColor=GOLD, leading=14)),
     Paragraph(green("huayueyuanlin.com"), code_style),
     Paragraph("正式域名", body_small)],
    [Paragraph(gold("manifest"), ParagraphStyle('lbl', fontName='Courier', fontSize=9, textColor=GOLD, leading=14)),
     Paragraph("/Huayue/manifest.json", code_style),
     Paragraph("子目录路径，正式部署不可用", body_small)],
]
url_tbl = Table(url_items, colWidths=[24*mm, 58*mm, 75*mm])
url_tbl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_CARD),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('LINEBELOW', (0,0), (-1,-2), 0.5, BORDER),
    ('ROUNDEDCORNERS', [4,4,4,4]),
]))
story.append(url_tbl)
story.append(Spacer(1, 10*mm))

story.append(Paragraph("影响范围", card_title))
story.append(muted_hr())
story.append(badge("全部 16 个 HTML 页面的 canonical 标签", RED_ACCENT))
story.append(badge("index / products / brand / contact / support 等页面的 og:image 和 twitter:image", RED_ACCENT))
story.append(badge("manifest.json 的路径引用", RED_ACCENT))
story.append(Spacer(1, 6*mm))

# Fix suggestion
fix_items = [
    Paragraph('所有 canonical URL 统一改为 <font color="#4caf84">https://huayueyuanlin.com/xxx.html</font>', list_style),
    Paragraph('所有 og:image 统一改为 <font color="#4caf84">https://huayueyuanlin.com/assets/images/...</font>', list_style),
    Paragraph('manifest.json 路径从 <font color="#e05555">/Huayue/manifest.json</font> 改为 <font color="#4caf84">/manifest.json</font>', list_style),
]
story.append(Paragraph(gold("建议修改方案"), card_title))
story.append(card(fix_items))

story.append(PageBreak())

# ===== SECTION 3: PLACEHOLDERS =====
story.append(Paragraph("03", ParagraphStyle('num3', fontName='Helvetica', fontSize=48,
    leading=52, textColor=GOLD, alignment=TA_LEFT, alpha=0.4)))
story.append(Paragraph("占位符未替换", section_title))
story.append(gold_hr())

story.append(Paragraph("以下内容仍为占位符或测试值，出现在面向客户的正式页面中。", body_style))
story.append(Spacer(1, 6*mm))

# Issue cards
# GA
story.append(Paragraph("Google Analytics 追踪 ID", card_title))
ph_items = [
    Paragraph(f'当前值：{red("G-XXXXXXXXXX")}', list_style),
    Paragraph(f'应替换为真实的 GA4 测量 ID', list_style),
    Paragraph(f'{muted("影响 16 个 HTML 页面 + 1 个 JS 文件")}', body_small),
]
story.append(card(ph_items))
story.append(Spacer(1, 6*mm))

# ICP
story.append(Paragraph("ICP 备案号", card_title))
ph_items2 = [
    Paragraph(f'当前值：{red("浙ICP备2024XXXXXX号-1")}', list_style),
    Paragraph('工厂位于山东 → 应为 ' + green("鲁ICP备XXXXXXXX号-1"), list_style),
    Paragraph(f'中间 6 位数字为占位符 X，须替换为真实备案号', list_style),
    Paragraph(f'{muted("影响 support.html footer")}', body_small),
]
story.append(card(ph_items2))
story.append(Spacer(1, 6*mm))

# WeChat
story.append(Paragraph("微信公众号二维码", card_title))
ph_items3 = [
    Paragraph('当前为空白占位 div，无二维码图片', list_style),
    Paragraph(f'位于 {muted("contact.html 联系我们页面")} 右下角', list_style),
    Paragraph('需替换为真实的公众号二维码图片（PNG/JPG）', list_style),
]
story.append(card(ph_items3))

story.append(PageBreak())

# ===== SECTION 4: FAKE CONTENT =====
story.append(Paragraph("04", ParagraphStyle('num4', fontName='Helvetica', fontSize=48,
    leading=52, textColor=GOLD, alignment=TA_LEFT, alpha=0.4)))
story.append(Paragraph("残留虚假内容", section_title))
story.append(gold_hr())

story.append(Paragraph("前期清理遗漏了部分虚假内容，仍可能引起客户质疑。", body_style))
story.append(Spacer(1, 6*mm))

fake_data = [
    [Paragraph(gold("位置"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=9.5, textColor=GOLD, leading=14)),
     Paragraph(gold("当前内容"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=9.5, textColor=GOLD, leading=14)),
     Paragraph(gold("问题"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=9.5, textColor=GOLD, leading=14))],
    [Paragraph("support.html 搜索框", body_small),
     Paragraph('"搜索问题... 认证"', ParagraphStyle('it', fontName=CN_FONT, fontSize=8.5, textColor=RED_ACCENT, leading=13)),
     Paragraph("含虚假\"认证\"提示", body_small)],
    [Paragraph("客户评价 · Karim Hassan", body_small),
     Paragraph('"SASO 认证单证处理非常专业"', ParagraphStyle('it', fontName=CN_FONT, fontSize=8.5, textColor=RED_ACCENT, leading=13)),
     Paragraph("暗示公司有 SASO 认证能力", body_small)],
    [Paragraph("客户评价 · Marco Ferrara", body_small),
     Paragraph('"年订单从 30 万欧元增长到 180 万欧元"', ParagraphStyle('it', fontName=CN_FONT, fontSize=8.5, textColor=RED_ACCENT, leading=13)),
     Paragraph("虚假营收数字，无据可查", body_small)],
]
fake_tbl = Table(fake_data, colWidths=[38*mm, 62*mm, 57*mm])
fake_tbl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_CARD),
    ('BACKGROUND', (0,1), (-1,-1), DARK_BG),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 7),
    ('BOTTOMPADDING', (0,0), (-1,-1), 7),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER),
    ('ROUNDEDCORNERS', [2,2,2,2]),
]))
story.append(fake_tbl)
story.append(Spacer(1, 10*mm))

story.append(Paragraph("建议修改", card_title))
fix_items4 = [
    Paragraph('搜索框提示改为 ' + green('"搜索问题...（如：OEM / MOQ / 保修 / 保养）"'), list_style),
    Paragraph('Karim Hassan 评价：删除 "SASO 认证" 字样', list_style),
    Paragraph('Marco Ferrara 评价：删除具体营收数字，改为模糊描述', list_style),
]
story.append(card(fix_items4))

story.append(PageBreak())

# ===== SECTION 5: AI AVATARS =====
story.append(Paragraph("05", ParagraphStyle('num5', fontName='Helvetica', fontSize=48,
    leading=52, textColor=GOLD, alignment=TA_LEFT, alpha=0.4)))
story.append(Paragraph("客户评价 AI 头像", section_title))
story.append(gold_hr())

story.append(Paragraph("首页 6 条客户评价全部使用 dicebear.com 生成的卡通风格 SVG 头像。这种风格常见于开发测试，用于正式工厂网站显得不够专业。", body_style))
story.append(Spacer(1, 6*mm))

story.append(Paragraph("当前头像来源", card_title))
avatar_items = [
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=chen-zhiyuan&backgroundColor=...", code_style),
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=zhao-minghui&backgroundColor=...", code_style),
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=lin-xiaoyu&backgroundColor=...", code_style),
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=sun-wenbo&backgroundColor=...", code_style),
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=marco-ferrara&backgroundColor=...", code_style),
    Paragraph("https://api.dicebear.com/8.x/avataaars/svg?seed=karim-hassan&backgroundColor=...", code_style),
]
story.append(card(avatar_items, DARK_PANEL))
story.append(Spacer(1, 8*mm))

story.append(Paragraph("建议修改", card_title))
avatar_fix = [
    Paragraph('方案A：替换为真实客户公司 Logo（需客户授权）', list_style),
    Paragraph('方案B：使用中性图标（如地球、行业图标）替代', list_style),
    Paragraph('方案C：去掉头像，仅保留文字评价（最保守）', list_style),
]
story.append(card(avatar_fix))

# ===== FINAL PAGE: SUMMARY =====
story.append(Spacer(1, 15*mm))
story.append(Paragraph("修改优先级", ParagraphStyle('final_title', fontName=CN_FONT, fontSize=20,
    leading=28, textColor=GOLD, alignment=TA_LEFT)))
story.append(gold_hr())

priority_data = [
    [Paragraph(gold("#"), ParagraphStyle('hdr', fontName='Helvetica', fontSize=9, textColor=GOLD, leading=13)),
     Paragraph(gold("问题"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=10, textColor=GOLD, leading=14)),
     Paragraph(gold("等级"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=10, textColor=GOLD, leading=14)),
     Paragraph(gold("修改量"), ParagraphStyle('hdr', fontName=CN_FONT, fontSize=10, textColor=GOLD, leading=14))],
    [Paragraph("1", body_style), Paragraph("域名 / URL 统一", body_style), Paragraph(red("高"), body_style), Paragraph("16处", body_small)],
    [Paragraph("2", body_style), Paragraph("电话号码区号", body_style), Paragraph(red("高"), body_style), Paragraph("25处", body_small)],
    [Paragraph("3", body_style), Paragraph("GA 追踪 ID", body_style), Paragraph(red("高"), body_style), Paragraph("17处", body_small)],
    [Paragraph("4", body_style), Paragraph("ICP 备案号", body_style), Paragraph("中 🟡", body_style), Paragraph("1处", body_small)],
    [Paragraph("5", body_style), Paragraph("二维码图片", body_style), Paragraph("中 🟡", body_style), Paragraph("1处", body_small)],
    [Paragraph("6", body_style), Paragraph("残留虚假认证", body_style), Paragraph("中 🟡", body_style), Paragraph("3处", body_small)],
    [Paragraph("7", body_style), Paragraph("AI 头像替换", body_style), Paragraph("低", body_style), Paragraph("6条", body_small)],
]
pri_tbl = Table(priority_data, colWidths=[10*mm, 60*mm, 15*mm, 15*mm])
pri_tbl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_PANEL),
    ('BACKGROUND', (0,1), (-1,-1), DARK_CARD),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('LINEBELOW', (0,0), (-1,-1), 0.5, BORDER),
    ('ROUNDEDCORNERS', [2,2,2,2]),
]))
story.append(pri_tbl)

story.append(Spacer(1, 18*mm))
story.append(Paragraph("预计总修改量：约 <font color='#c4a97d'><b>68 处</b></font>，预计工作量 <font color='#c4a97d'><b>2-3 小时</b></font>", body_style))
story.append(Spacer(1, 8*mm))
story.append(Paragraph("—  END  —", ParagraphStyle('end', fontName='Helvetica', fontSize=10,
    leading=16, textColor=TEXT_MUTED, alignment=TA_CENTER)))


# ---------- build ----------
doc = DarkBackgroundDocTemplate(OUTPUT, pagesize=A4,
    title='华悦园林机械 — 网站审查报告',
    author='Huayue Garden Machinery',
    subject='Website Audit Report')

doc.build(story)
print(f"PDF created: {OUTPUT}")
