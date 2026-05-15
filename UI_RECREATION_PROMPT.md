Build a bold, high-end personal portfolio web app for a data scientist / AI engineer / marketing analyst / ops automation specialist. The site should feel editorial, cinematic, and strategy-focused rather than like a generic developer portfolio. The visual personality should communicate business impact, analytical confidence, and creative intelligence.

Use a React single-page application architecture with Vite. Keep the app as a mostly self-contained frontend with a single `App` component orchestrating section components and light custom hooks. Use React 19 style function components with `useState`, `useEffect`, and `useMemo`. Avoid heavy routing libraries; instead, support two view modes using `window.location.pathname`: the homepage portfolio and individual project detail pages under `/projects/<slug>`. Slugs should be derived from titles by lowercasing, replacing non-alphanumeric characters with hyphens, and trimming leading or trailing hyphens.

The portfolio must support live API-backed content but degrade gracefully to a full fallback dataset if the API is unavailable. Read `VITE_API_URL` from environment variables. On load, fetch profile data from `${VITE_API_URL}/api/profile` if configured. Merge the API response into a complete local fallback object rather than assuming all fields exist. If the API is missing or fails, render the full fallback profile without breaking layout. For the contact form, submit a JSON payload to `${VITE_API_URL}/api/contact`, show a sending state, then render success or error feedback inline. Reset the form only after a successful submission.

Create a complete fallback profile object with these content domains:
- `person`: name, brand mark, eyebrow text, summary, 4-part hero headline, email, phone, LinkedIn URL, GitHub URL
- `ticker`: a repeating list of role labels such as Data Scientist, AI Engineer, Marketing Analyst, Ops Automation
- `manifesto`: eyebrow, heading, and one or more short editorial paragraphs
- `numbers`: impact metrics with label and value
- `skills`: grouped skill lists that can be flattened into a cloud
- `projects`: featured case studies with title, badge, impact line, summary, stack array, highlights array, and repository URL
- `experience`: roles with company, role, period, impact, bullet paragraphs, and tag arrays
- `awards`: rank, name, and description
- `video`: heading, description, status, and tip list

The site structure should be:
1. Fixed navigation
2. Hero section
3. Manifesto section
4. Numbers strip
5. Story / experience timeline
6. Selected work grid
7. Awards grid
8. Skills cloud
9. Video CV block
10. Contact section
11. Footer
12. Project detail pages for each work item

The design direction is critical:
- Dark, moody base with warm paper sections
- Color palette built around near-black ink, warm paper, secondary paper, rust orange, muted sage, and muted gold
- Typography pairing: an elegant editorial serif for statements and headings, a clean sans-serif for body copy, and a condensed sans-serif for labels, UI chrome, and data-like accents
- Use high contrast, oversized type, italic emphasis, outlined words, and sharp clipped buttons
- The site should feel like a cross between a fashion editorial, a strategy deck, and a premium analytics product landing page
- Avoid generic cards everywhere; vary rhythm, density, and background tone section by section

Define CSS custom properties for the main palette and typography families:
- `--ink`: very dark brown-black
- `--paper`: warm off-white
- `--paper2`: slightly darker warm neutral
- `--rust`: burnt orange
- `--rust2`: brighter orange hover state
- `--sage`: muted green
- `--gold`: muted gold
- `--serif`, `--sans`, `--cond`

Global styling requirements:
- Apply a full reset with `box-sizing: border-box`
- Smooth scrolling on the document
- Body background in `--ink`
- Body text in `--paper`
- Hide default cursor on desktop and replace it with a custom cursor system
- Add a subtle full-screen grain texture overlay using an inline SVG noise data URI
- Prevent horizontal overflow

Implement a custom cursor system:
- A small rust-colored cursor dot that snaps directly to the pointer
- A larger translucent ring that lags behind using `requestAnimationFrame` interpolation
- Disable the custom cursor entirely on coarse pointers and smaller mobile screens
- Use `mix-blend-mode: exclusion` for the dot so it feels premium and dynamic

Build a `useCursor` hook that:
- Finds `.cursor-dot` and `.cursor-ring`
- Exits early on coarse pointers
- Tracks mouse coordinates
- Directly transforms the dot on `mousemove`
- Animates the ring in a loop with easing toward the current pointer position
- Cleans up the event listener and animation frame on unmount

Build a `useReveal` hook for scroll-in animations:
- Observe every `.rv` element with `IntersectionObserver`
- Trigger when about 12 percent is visible
- Add an `.on` class once visible
- Unobserve after reveal
- Use CSS to animate from `opacity: 0` and `translateY(34px)` into place

Navigation requirements:
- Fixed at the top across all views
- Transparent by default, becomes solid once the user scrolls beyond about 60px
- Brand mark on the left built from a split name like `A.Chakraborty`, with the period highlighted in rust
- Desktop links: Story, Work, Awards, Skills, Hire Me
- Mobile should collapse into a Menu button that toggles a stacked panel
- Use condensed uppercase text with spacing for all navigation UI

Hero section requirements:
- Full viewport height
- Large rotating circular SVG text on the right side, partially off-canvas, continuously spinning
- Overline with a leading horizontal rust rule
- Massive 4-line hero headline mixing normal text, outlined text, and italic rust emphasis
- Short italic summary with a rust border on the left
- Bottom row with three impact stats and two calls to action
- CTA styles: one filled clipped rust button, one ghost text link with underline border
- A ticker at the bottom of the hero with continuously scrolling role labels separated by a rust `x`

Manifesto section requirements:
- Switch to warm paper background with dark text
- Left side: massive editorial headline such as “Data is my creative medium.”
- Use italic rust emphasis and outlined dark text within the heading
- Right side: a small stack of short paragraphs with airy spacing and thin body weight
- Below it, a full-width rust numbers strip showing several impact metrics in large serif numerals and condensed uppercase labels

Story / experience section requirements:
- Return to dark background
- Open with a large italic statement emphasizing that useful data work survives contact with the business
- Below, render a vertical experience timeline
- Each row should have three columns on desktop: period, visual timeline spine, content
- The timeline spine should use a glowing rust dot and faded vertical connector line
- Each role block includes company label, large serif job title, highlighted impact badge, descriptive paragraphs, and a row of compact uppercase tags

Selected work section requirements:
- Back on warm paper background
- Large editorial title like “Projects with business teeth.”
- Render projects in an asymmetric 12-column mosaic rather than equal cards
- Use six repeating visual variants for different project tiles with slightly different dark background shades
- First row should feel featured with larger tile spans
- Each project tile includes:
  - Small top metadata row with padded project number and badge
  - Large serif project title
  - Rust impact line
  - Short body summary
  - Compact stack chips
  - Link reading “Open project ->”
- On hover, slightly scale the tile and animate a rust line across the bottom edge

Project detail page behavior:
- No router library required; detect pathname manually
- If pathname matches `/projects/<slug>`, replace homepage with a project detail page
- Include a back link to `/#work`
- Use a warm paper background
- Hero area should have large project title, summary, impact pill, and stack tags
- Main body should be a two-column layout:
  - Left: “What this project does” notes with multiple paragraphs and repository link
  - Right: an interactive product-like demo panel matching the project theme

Project detail interactive demos are a major part of the app. Build a different demo UI depending on the project title:
- Multi-agent strategy demo:
  - Sliders for growth push, inventory buffer, and hiring intensity
  - Derived metrics for finance, procurement, sales, ops, overall confidence, and risk
  - Table of agents with signal and recommended action
  - Framing should emphasize negotiation between specialized business agents rather than a single black-box output
- Dynamic pricing demo:
  - Sliders for candidate price, base demand, and elasticity
  - Derived predicted units, revenue lift, margin, and recommendation
  - Price curve table
  - Driver bars for competitor gap, elasticity, and retargeting intent
- Generative BI reporting demo:
  - Freshness slider and generate/reset report button
  - Pipeline steps that change based on generated state
  - Metrics for data quality, risk scoring, and narrative status
  - Table of report sections with status and owner
- Supply chain demo:
  - Sliders for lead time, order variance, and geo risk
  - Derived disruption probability and action priority
  - Supplier table and contribution bars
- Marketing demos:
  - One variant for MMM budget optimization
  - One variant for attribution command center
  - Sliders for search, social, and retargeting allocation
  - Metrics for blended ROAS, best channel, efficiency, and next move
  - Table plus driver bars

Shared demo panel design language:
- Dark product-workbench surface embedded inside the warm editorial page
- Headline, intro copy, control sliders, metric tiles, tables, and bar visualizations
- Metric tiles should use serif numbers in rust
- Table headers should be rust-toned with condensed uppercase labels
- Driver bars should fill horizontally, with one alternate gold tone available
- These demos should feel like mini SaaS dashboards inside a portfolio case study

Awards section requirements:
- Dark background
- Grid of three award cards on desktop, one column on small screens
- Use a surrounding subtle border grid effect
- Each card features an oversized serif rank number, uppercase name, and soft body description

Skills section requirements:
- Background should be `--paper2`
- Large headline like “I don’t just know the tools. I know when to use them.”
- Flatten grouped skills into a single cloud
- Render as chips with varying scale classes such as `lg`, `md`, `sm`
- Dark text on light background
- On hover, invert into rust background with light text

Video CV section requirements:
- Same warm paper secondary background
- Two-column layout
- Left: heading, italic description, and short benefit/tip lines
- Right: large 16:9 faux video frame
- Video frame should use layered gradients, a subtle grid texture, centered play button, status label, and a small rust corner tag like “Upload yours”
- No actual video playback required; treat it as a stylized placeholder

Contact section requirements:
- Return to dark background
- Huge ghosted background typography saying “Hire Me.”
- Overline, massive headline, and supporting italic paragraph
- Two-column layout with contact links on one side and a form on the other
- Links should include email, LinkedIn, GitHub, and phone
- Form fields: name, email, message
- Form surface should be a semi-transparent light overlay with strong focus states in rust
- Display inline success and error message states

Footer requirements:
- Minimal horizontal footer on desktop, stacked on mobile
- Uppercase condensed metadata
- Example content: copyright year and name on the left, tech stack note on the right

Responsive behavior:
- At widths below roughly 980px, collapse most two-column and mosaic layouts into one column
- Reset project grid to a simple single-column stack
- Let project stack chips align left instead of right
- Collapse award grid to one column
- Collapse project detail and demo split layouts to one column
- At widths below roughly 720px:
  - Restore native cursor and hide custom cursor elements
  - Reduce nav padding and enable mobile menu button
  - Make hero padding tighter with more top breathing room for fixed nav
  - Reduce hero headline scale
  - Soften and shrink the spinning ring
  - Reduce section padding
  - Convert numbers strip into a compact 2-column grid
  - Collapse experience timeline into single-column cards and hide the center spine
  - Stack footer items vertically
  - Ensure long email addresses wrap safely

Component architecture should roughly include:
- `Nav`
- `Hero`
- `Manifesto`
- `Story`
- `Work`
- `Awards`
- `Skills`
- `VideoCv`
- `Contact`
- `ProjectPage`
- Shared helpers like `MetricTile`, `DriverBar`, `ModelTable`
- Demo components like `StrategyDemo`, `PricingDemo`, `ReportingDemo`, `SupplyChainDemo`, `MarketingDemo`

Data-driven rendering requirements:
- Map through arrays for projects, experience, awards, tips, skills, numbers, and ticker items
- Duplicate ticker items in memory so the loop appears continuous
- Flatten skill groups with `useMemo`
- Choose the project demo by checking the project title for keywords such as `multi-agent`, `pricing`, `reporting`, `supply chain`, and `mmm`

Technical details to preserve:
- Use `React.StrictMode`
- Import Google Fonts in `index.html` for the serif, sans, and condensed families
- Use a dedicated `styles.css` with all layout, animation, and responsive rules
- Keep the app dependency-light: React, React DOM, Vite, and the React Vite plugin only
- Include a small loading badge when profile data is fetching
- If a project slug is loaded before data resolves, show a temporary “Loading project...” state
- If a slug does not match any project, render a simple “Project not found” page

Micro-interaction notes:
- Smooth section reveal animations
- Spinning circular text in hero
- Continuous marquee ticker
- Hover transitions on links, chips, buttons, and project cards
- Scroll-reactive navigation background
- Custom cursor on desktop only

Tone and copywriting style:
- Confident, sharp, business-literate, and slightly provocative
- Emphasize business outcomes over technical vanity
- Mix strategy language with creative/editorial phrasing
- Avoid generic “passionate developer” language

If you recreate this app, the result should feel like a premium portfolio for someone who turns data systems into real business decisions, combining editorial branding, interactive analytics demos, and a technically simple but highly intentional React implementation.
