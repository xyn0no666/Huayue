# Garden Machinery Website — Design Spec

## Brand Direction
**Luxury Botanical** — warm beige base, bronze-gold accents, heritage craftsmanship.
Combines brand showcase, e-commerce, lead generation, and dealer portal.

## Visual System

### Color Palette
| Role | Value | Usage |
|------|-------|-------|
| Primary bg | `#f5f2eb` | Page backgrounds |
| Surface | `#ffffff` | Cards, panels |
| Primary text | `#2c2416` | Headings, body |
| Accent gold | `#c4a97d` | CTAs, highlights, icons |
| Accent dark | `#8b7355` | Secondary text, labels |
| Success green | `#5a7a5a` | Badges, confirmations |
| Border | `#e8e0d5` | Dividers, input borders |
| Dark bg | `#1a1814` | Footer, dark sections |

### Typography
- **Headings**: Playfair Display (serif) — brand titles, hero text
- **Body**: Inter / system sans-serif — product info, navigation
- **Technical data**: JetBrains Mono — specs, parameters
- **Chinese fallback**: Noto Serif SC, Noto Sans SC

### Spacing
- Grid: 8px base unit
- Section padding: 80px vertical
- Container max-width: 1280px

## Site Structure
6 pages:

1. **Home** (`index.html`) — Hero, category cards, featured products, stats, testimonials, CTA
2. **Products** (`products.html`) — Filter grid, product cards, comparison, cart sidebar
3. **Brand** (`brand.html`) — Story timeline, craftsmanship, values, sustainability
4. **Support** (`support.html`) — Guides, maintenance, FAQ accordion, manual download
5. **Dealer Portal** (`dealer.html`) — Login, dashboard mock, inventory, marketing materials
6. **Contact** (`contact.html`) — Inquiry form, dealer application, demo booking, location

## Technical Stack
- Pure HTML/CSS/JS — no framework, instant load
- Vanilla JS for: cart, filters, accordions, form validation
- CSS custom properties for theming
- Responsive: mobile-first, 3 breakpoints (768, 1024, 1280)
- No external dependencies except Google Fonts
