{
  "project": "SMARTDEAL HUB",
  "tagline": "Best smartphone deals and cross-store price comparisons (Amazon vs Flipkart)",
  "design_personality": {
    "attributes": ["trustworthy", "fast", "informative", "crisp", "price-first"],
    "style_fusion": "Smartprix/Pricebaba information density + Swiss grid clarity + subtle glass accents (only for non-reading UI) + oceanic palette",
    "layout_style": "Mobile-first, sticky utility header, persistent search, faceted filters with sheet on mobile, 3–6 column product grid desktop"
  },
  "semantic_colors_and_tokens": {
    "notes": "Light, modern e-commerce. Ocean blue primary, teal secondary, lime highlights for best price. Avoid purple. Dark mode uses ink-like neutrals.",
    "css_variables_override": """
@layer base {
  :root {
    --background: 210 33% 99%;           /* near-white */
    --foreground: 222 47% 11%;           /* slate-900 */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Brand */
    --primary: 198 90% 47%;              /* ocean blue #14B3D6 */
    --primary-foreground: 0 0% 100%;
    --secondary: 174 60% 36%;            /* teal #0D9488 */
    --secondary-foreground: 0 0% 100%;
    --accent: 84 72% 57%;                /* lime #A3E635 */
    --accent-foreground: 222 47% 11%;

    /* UI states */
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 35%;
    --destructive: 2 84% 56%;            /* tomato */
    --destructive-foreground: 0 0% 100%;
    --warning: 38 92% 50%;               /* amber */
    --success: 160 84% 39%;              /* emerald */

    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 198 90% 47%;

    /* Charts */
    --chart-1: 198 90% 47%;
    --chart-2: 174 60% 36%;
    --chart-3: 160 84% 39%;
    --chart-4: 38 92% 50%;
    --chart-5: 2 84% 56%;

    --radius: 0.6rem;

    /* Button tokens */
    --btn-radius: 0.6rem;
    --btn-shadow: 0 4px 14px rgba(20,179,214,0.18);
    --btn-motion: 180ms;
  }
  .dark {
    --background: 222 47% 7%;            /* very dark slate */
    --foreground: 0 0% 100%;
    --card: 222 47% 9%;
    --card-foreground: 0 0% 100%;
    --popover: 222 47% 9%;
    --popover-foreground: 0 0% 100%;

    --primary: 198 90% 55%;
    --primary-foreground: 0 0% 8%;
    --secondary: 174 60% 45%;
    --secondary-foreground: 0 0% 8%;
    --accent: 84 72% 62%;
    --accent-foreground: 222 47% 9%;

    --muted: 220 13% 16%;
    --muted-foreground: 216 12% 84%;
    --destructive: 2 82% 56%;
    --destructive-foreground: 0 0% 100%;
    --warning: 38 92% 56%;
    --success: 160 84% 45%;

    --border: 220 13% 18%;
    --input: 220 13% 18%;
    --ring: 198 90% 55%;
  }
}
""",
    "usage": {
      "primary": "CTA buttons, active filters, key highlights",
      "secondary": "Secondary CTAs, hover states",
      "accent": "Best-price badges, deal alerts, small accents only",
      "backgrounds": "Keep content areas solid (no gradients). Use gradients only for hero stripes or large section accents (<20% viewport)"
    }
  },
  "gradients_and_textures": {
    "rule": "Gradient Restriction Rule enforced. Use 2–3 color mild gradients only in section backgrounds, never on dense text blocks, and never covering >20% viewport.",
    "approved_gradients": [
      {
        "name": "Seafoam Mist",
        "css": "background-image: linear-gradient(135deg, rgba(20,179,214,0.12), rgba(13,148,136,0.10), rgba(163,230,53,0.12));"
      },
      {
        "name": "Dawn Coast",
        "css": "background-image: radial-gradient(60% 60% at 20% 20%, rgba(20,179,214,0.18) 0%, rgba(20,179,214,0.0) 60%), linear-gradient(180deg, rgba(13,148,136,0.10), rgba(13,148,136,0.0));"
      }
    ],
    "noise_overlay": "Use a subtle CSS noise layer on hero only: after:absolute after:inset-0 after:pointer-events-none after:opacity-[0.06] after:bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
  },
  "typography": {
    "fonts": {
      "headings": "Space Grotesk",
      "body": "Karla"
    },
    "google_fonts_links": [
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
      "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&display=swap"
    ],
    "tailwind_setup": "Add to tailwind config theme.extend.fontFamily: { heading: ['Space Grotesk', 'ui-sans-serif'], body: ['Karla','system-ui'] }",
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold",
      "h2": "text-base md:text-lg font-semibold text-foreground/90",
      "body": "text-sm md:text-base text-foreground/90 leading-relaxed",
      "small": "text-xs text-foreground/70"
    }
  },
  "layout_and_grid": {
    "container": "mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px]",
    "header": "sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b",
    "product_grid": "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    "filters_sidebar_desktop": "hidden lg:block w-72 shrink-0",
    "filters_sheet_mobile": "lg:hidden",
    "cards_spacing": "space-y-4 sm:space-y-6 md:space-y-8"
  },
  "components": [
    {
      "name": "Navbar",
      "imports": ["./components/ui/navigation-menu", "./components/ui/button", "./components/ui/sheet", "./components/ui/input", "./components/ui/switch", "lucide-react"] ,
      "layout": "Logo left, search center (md+), actions right (wishlist, cart, login). Mobile: menu + search in sheet.",
      "classes": "flex items-center gap-2 py-3",
      "micro": "On scroll, reduce height (py-3 -> py-2) with transition-[padding] duration-200; elevate with shadow-sm",
      "testing": ["data-testid=primary-navbar", "data-testid=navbar-search-input", "data-testid=theme-toggle"]
    },
    {
      "name": "SearchBar",
      "imports": ["./components/ui/input", "./components/ui/command"],
      "pattern": "Quick search input + optional Command palette for power search",
      "classes": "w-full md:w-[520px]",
      "testing": ["data-testid=global-search-input", "data-testid=command-open-button"]
    },
    {
      "name": "FilterPanel (Desktop) / FilterSheet (Mobile)",
      "imports": ["./components/ui/accordion", "./components/ui/checkbox", "./components/ui/slider", "./components/ui/select", "./components/ui/sheet", "./components/ui/button"],
      "facets": ["brand", "price", "ram", "storage", "rating"],
      "classes": "space-y-3",
      "micro": "Apply button shows loading shimmer, Sticky apply bar on mobile",
      "testing": ["data-testid=filter-apply-button", "data-testid=filter-reset-button"]
    },
    {
      "name": "ProductCard",
      "imports": ["./components/ui/card", "./components/ui/badge", "./components/ui/button", "./components/ui/tooltip", "lucide-react"],
      "content": "Image, title, key spec pill (RAM/Storage), ratings, two price rows (Amazon, Flipkart) with best-price highlight, wishlist and compare CTAs",
      "classes": "group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-[box-shadow,background-color] duration-200",
      "hover": "group-hover:-translate-y-[2px] motion-safe:transition-transform motion-safe:duration-200",
      "testing": ["data-testid=product-card", "data-testid=add-to-cart-button", "data-testid=wishlist-toggle", "data-testid=best-price-badge"]
    },
    {
      "name": "DealAlert",
      "imports": ["./components/ui/dialog", "./components/ui/input", "./components/ui/button", "./components/ui/sonner"],
      "behavior": "Users subscribe to price-drop alerts. On success show toast via sonner.",
      "testing": ["data-testid=deal-alert-open", "data-testid=deal-alert-submit", "data-testid=deal-alert-email-input"]
    },
    {
      "name": "ProductDetails",
      "imports": ["./components/ui/tabs", "./components/ui/table", "./components/ui/badge", "./components/ui/button"],
      "sections": ["Gallery", "Specs Table", "Price Comparison", "Reviews Summary"],
      "testing": ["data-testid=specs-table", "data-testid=compare-table"]
    },
    {
      "name": "Cart & Wishlist",
      "imports": ["./components/ui/table", "./components/ui/button", "./components/ui/alert-dialog"],
      "testing": ["data-testid=cart-item-row", "data-testid=remove-from-cart-button", "data-testid=wishlist-item-row"]
    },
    {
      "name": "Auth (Firebase)",
      "imports": ["./components/ui/dialog", "./components/ui/input", "./components/ui/button", "./components/ui/separator"],
      "testing": ["data-testid=login-email-input", "data-testid=login-password-input", "data-testid=google-auth-button"]
    },
    {
      "name": "AdminAnalytics",
      "imports": ["recharts", "./components/ui/card", "./components/ui/tabs"],
      "charts": ["LineChart: price drops over time", "BarChart: brand share", "PieChart: wishlist vs cart"],
      "testing": ["data-testid=admin-chart-line", "data-testid=admin-chart-bar"]
    }
  ],
  "page_blueprints": [
    {
      "page": "Home",
      "structure": ["Navbar", "Hero with particles (subtle)", "Filters + Grid", "Deal Alerts banner"],
      "hero_classes": "relative overflow-hidden py-8 sm:py-10",
      "grid_classes": "mt-4 lg:mt-6"
    },
    {
      "page": "Product Detail",
      "structure": ["Sticky mini-header with name & prices", "Gallery left / Info right", "Tabs: Specs, Compare, Reviews"]
    },
    {
      "page": "Admin Dashboard",
      "structure": ["KPIs top cards", "Charts grid", "Recent alerts table"]
    }
  ],
  "micro_interactions_and_motion": {
    "principles": ["Every interactive control has hover/focus/active states", "Use motion-safe utilities and prefers-reduced-motion respect"],
    "framer_motion": {
      "install": "npm i framer-motion",
      "card_hover": "whileHover:{ y:-2 }, transition:{ duration:0.18 }",
      "list_entrance": "staggerChildren:0.06, child: initial:{opacity:0,y:8} animate:{opacity:1,y:0}"
    },
    "button_motion": "hover:shadow-md active:scale-[0.98] transition-[background-color,box-shadow] duration-[var(--btn-motion)]",
    "nav_scroll_shrink": "Apply data-scrolled class via JS and reduce padding with transition-[padding]"
  },
  "particles_background": {
    "library": "react-tsparticles",
    "install": "npm i tsparticles react-tsparticles",
    "config_snippet": {
      "code": "{\n  fpsLimit: 60,\n  particles: { number: { value: 20 }, color: { value: ['#14B3D6','#0D9488','#A3E635'] }, opacity: { value: 0.15 }, size: { value: { min: 1, max: 2 } }, move: { enable: true, speed: 0.4 }, links: { enable: false } },\n  detectRetina: true\n}"
    },
    "placement": "Absolute behind hero only; never behind dense content"
  },
  "admin_charts": {
    "library": "recharts",
    "install": "npm i recharts",
    "example_line_chart_js": "import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';\nexport const PriceDropChart = ({ data }) => (\n  <div data-testid=\"admin-chart-line\" className=\"h-56\">\n    <ResponsiveContainer width=\"100%\" height=\"100%\">\n      <LineChart data={data}>\n        <XAxis dataKey=\"date\" />\n        <YAxis />\n        <Tooltip />\n        <Line type=\"monotone\" dataKey=\"drop\" stroke=\"hsl(var(--primary))\" strokeWidth={2} dot={false} />\n      </LineChart>\n    </ResponsiveContainer>\n  </div>\n);"
  },
  "buttons_system": {
    "tone": "Professional / Corporate",
    "variants": [
      {
        "name": "primary",
        "base": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-[var(--btn-radius)] shadow-[var(--btn-shadow)]",
        "hover": "hover:bg-[hsl(var(--primary))]/90",
        "focus": "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "sizes": {
          "sm": "h-9 px-3 text-sm",
          "md": "h-10 px-4",
          "lg": "h-11 px-5 text-base"
        }
      },
      {
        "name": "secondary",
        "base": "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-[var(--btn-radius)]",
        "hover": "hover:bg-[hsl(var(--secondary))]/90",
        "sizes": { "md": "h-10 px-4" }
      },
      {
        "name": "ghost",
        "base": "bg-transparent border border-border rounded-[var(--btn-radius)]",
        "hover": "hover:bg-muted",
        "sizes": { "md": "h-10 px-4" }
      }
    ]
  },
  "accessibility": {
    "contrast": "All text meets WCAG AA (4.5:1). Use accent lime only for badges on neutral backgrounds.",
    "focus": "Visible focus ring using ring token; no focus suppression.",
    "reduced_motion": "Respect prefers-reduced-motion: disable hover lifts and heavy transitions.",
    "touch_targets": ">= 44px height for all tappable elements",
    "aria": "Use semantic roles on nav, main, aside; aria-expanded for accordions; aria-pressed for wishlist toggle"
  },
  "testing_selectors": {
    "convention": "kebab-case describing role, not appearance",
    "examples": [
      "data-testid=product-card",
      "data-testid=filter-brand-checkbox",
      "data-testid=compare-amazon-price",
      "data-testid=compare-flipkart-price",
      "data-testid=add-to-cart-button",
      "data-testid=wishlist-toggle",
      "data-testid=login-form-submit-button"
    ]
  },
  "library_integrations": {
    "firebase": "npm i firebase",
    "toast": "Use ./components/ui/sonner.jsx; show success/error for wishlist, cart, alerts",
    "icons": "lucide-react for all icons (no emoji)",
    "particles": "react-tsparticles (subtle, hero only)",
    "charts": "recharts for admin dashboard"
  },
  "js_scaffolds": {
    "ThemeToggle.jsx": "import { Switch } from './components/ui/switch';\nexport const ThemeToggle = () => {\n  const toggle = () => {\n    const root = document.documentElement;\n    root.classList.toggle('dark');\n    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');\n  };\n  return (\n    <div className=\"flex items-center gap-2\">\n      <span className=\"text-sm\">Light</span>\n      <Switch data-testid=\"theme-toggle\" onCheckedChange={toggle} />\n      <span className=\"text-sm\">Dark</span>\n    </div>\n  );\n};",
    "ParticlesBackground.jsx": "import { loadFull } from 'tsparticles';\nimport { useCallback } from 'react';\nimport Particles from 'react-tsparticles';\nexport const ParticlesBackground = () => {\n  const init = useCallback(async (engine) => { await loadFull(engine); }, []);\n  const options = { fpsLimit:60, particles:{ number:{ value:20 }, color:{ value:['#14B3D6','#0D9488','#A3E635'] }, opacity:{ value:0.15 }, size:{ value:{ min:1, max:2 } }, move:{ enable:true, speed:0.4 }, links:{ enable:false } }, detectRetina:true };\n  return <Particles id=\"hero-particles\" init={init} options={options} className=\"absolute inset-0 -z-10\" />;\n};",
    "ProductCard.jsx": "import { Card } from './components/ui/card';\nimport { Badge } from './components/ui/badge';\nimport { Button } from './components/ui/button';\nimport { Heart, ShoppingCart } from 'lucide-react';\nexport const ProductCard = ({ product, onAdd, onWish }) => {\n  const best = product.bestStore; // 'amazon' or 'flipkart'\n  return (\n    <Card data-testid=\"product-card\" className=\"group relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-[box-shadow,background-color] duration-200\">\n      <div className=\"p-3\">\n        <img src={product.image} alt={product.name} className=\"w-full h-40 object-contain\" loading=\"lazy\" />\n        <h3 className=\"mt-2 line-clamp-2 font-medium text-sm md:text-base\">{product.name}</h3>\n        <div className=\"mt-1 flex items-center gap-2 text-xs\">\n          <Badge variant=\"secondary\">{product.ram} RAM</Badge>\n          <Badge variant=\"secondary\">{product.storage} Storage</Badge>\n        </div>\n        <div className=\"mt-3 space-y-1 text-sm\">\n          <div className=\"flex justify-between\">\n            <span>Amazon</span>\n            <span data-testid=\"compare-amazon-price\" className=\"font-semibold\">₹{product.amazonPrice}</span>\n          </div>\n          <div className=\"flex justify-between\">\n            <span>Flipkart</span>\n            <span data-testid=\"compare-flipkart-price\" className=\"font-semibold\">₹{product.flipkartPrice}</span>\n          </div>\n          <Badge data-testid=\"best-price-badge\" className=\"mt-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]\">Best on {best}</Badge>\n        </div>\n        <div className=\"mt-3 flex items-center gap-2\">\n          <Button data-testid=\"add-to-cart-button\" className=\"flex-1\" onClick={() => onAdd(product)}><ShoppingCart className=\"mr-2 h-4 w-4\"/>Add</Button>\n          <Button data-testid=\"wishlist-toggle\" variant=\"ghost\" onClick={() => onWish(product)}><Heart className=\"h-5 w-5\"/></Button>\n        </div>\n      </div>\n    </Card>\n  );\n};",
    "FilterSheet.jsx": "import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';\nimport { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';\nimport { Checkbox } from './components/ui/checkbox';\nimport { Slider } from './components/ui/slider';\nimport { Button } from './components/ui/button';\nexport const FilterSheet = ({ facets, apply, reset }) => (\n  <Sheet>\n    <SheetTrigger asChild><Button data-testid=\"open-filter-sheet\" variant=\"ghost\">Filters</Button></SheetTrigger>\n    <SheetContent side=\"left\" className=\"w-80\">\n      <div className=\"flex items-center justify-between mb-3\">\n        <h3 className=\"font-semibold\">Filters</h3>\n        <Button data-testid=\"filter-reset-button\" variant=\"ghost\" onClick={reset}>Reset</Button>\n      </div>\n      <Accordion type=\"multiple\" className=\"space-y-2\">\n        {/* brand */}\n        <AccordionItem value=\"brand\">\n          <AccordionTrigger>Brand</AccordionTrigger>\n          <AccordionContent>\n            {facets.brands.map(b => (\n              <label key={b} className=\"flex items-center gap-2 py-1\">\n                <Checkbox data-testid=\"filter-brand-checkbox\" value={b} /> <span>{b}</span>\n              </label>))}\n          </AccordionContent>\n        </AccordionItem>\n        {/* price */}\n        <AccordionItem value=\"price\">\n          <AccordionTrigger>Price</AccordionTrigger>\n          <AccordionContent>\n            <Slider data-testid=\"filter-price-slider\" defaultValue={[5000,50000]} max={150000} step={1000} />\n          </AccordionContent>\n        </AccordionItem>\n      </Accordion>\n      <Button data-testid=\"filter-apply-button\" className=\"mt-4 w-full\" onClick={apply}>Apply</Button>\n    </SheetContent>\n  </Sheet>\n);",
    "AdminKPIs.jsx": "import { Card } from './components/ui/card';\nexport const KPI = ({ label, value, testid }) => (\n  <Card className=\"p-4\" data-testid={testid}>\n    <div className=\"text-xs text-foreground/70\">{label}</div>\n    <div className=\"text-2xl font-semibold\">{value}</div>\n  </Card>\n);"
  },
  "navigation_patterns": {
    "sticky_search": "Search input stays visible under header on mobile via sticky top-[var(--header)]",
    "breadcrumbs": "Use ./components/ui/breadcrumb on PDP"
  },
  "dark_light_mode": {
    "default": "System preference, persist in localStorage",
    "toggle": "Switch component toggles .dark on html",
    "iconography": "Use outline icons in dark for better balance"
  },
  "image_urls": [
    {
      "url": "https://images.unsplash.com/photo-1654589654934-7f5cd066bb7e?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Close-up smartphone in hand on blue tones",
      "category": "hero"
    },
    {
      "url": "https://images.unsplash.com/photo-1742762379583-1a461c76f141?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Back of modern phone (cool tones)",
      "category": "section-accent"
    },
    {
      "url": "https://images.unsplash.com/photo-1612247905736-c283f684cd55?crop=entropy&cs=srgb&fm=jpg&q=85",
      "description": "Minimal phone-on-desk visual",
      "category": "empty-states"
    }
  ],
  "component_path": {
    "button": "./components/ui/button",
    "card": "./components/ui/card",
    "badge": "./components/ui/badge",
    "sheet": "./components/ui/sheet",
    "accordion": "./components/ui/accordion",
    "checkbox": "./components/ui/checkbox",
    "slider": "./components/ui/slider",
    "select": "./components/ui/select",
    "input": "./components/ui/input",
    "switch": "./components/ui/switch",
    "dialog": "./components/ui/dialog",
    "tabs": "./components/ui/tabs",
    "table": "./components/ui/table",
    "tooltip": "./components/ui/tooltip",
    "sonner": "./components/ui/sonner"
  },
  "instructions_to_main_agent": [
    "1) Add Google Fonts links to index.html and map Tailwind font families.",
    "2) Paste css_variables_override into src/index.css @layer base to enforce brand tokens.",
    "3) Build Navbar with sticky behavior and SearchBar; include data-testid attributes as listed.",
    "4) Implement FilterSheet for mobile and FilterPanel for desktop using shadcn components only.",
    "5) Create ProductCard per scaffold and use grid classes in layout_and_grid.",
    "6) Integrate react-tsparticles in Hero only with the provided config.",
    "7) Wire Sonner toasts for wishlist, cart, and deal alerts.",
    "8) Use Recharts in Admin pages with given example. Keep charts on light solid backgrounds.",
    "9) Enforce Gradient Restriction Rule; keep gradients to hero/section backgrounds <20% viewport.",
    "10) Ensure every interactive element has an explicit data-testid using kebab-case and role-oriented names.",
    "11) Respect prefers-reduced-motion and keep micro-animations subtle.",
    "12) Use shadcn Calendar only if dates are needed (for analytics ranges)."
  ]
}


<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
