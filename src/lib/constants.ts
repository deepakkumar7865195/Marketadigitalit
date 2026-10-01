import {
  LayoutDashboard,
  Users,
  CalendarCheck2,
  CalendarDays,
  FolderKanban,
  ListTodo,
  Palmtree,
  Building2,
  Inbox,
  UserCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const COMPANY = {
  name: "Marketa Digital IT",
  domain: "marketadigitalit.com",
  email: "deepak.marketadigitalit@gmail.com",
  phone: "+917870241157",
  phoneDisplay: "78702 41157",
  address: "Hela Battala, Sukanta Pally, Baguiati, Kolkata, West Bengal 700157",
  timezone: "Asia/Kolkata",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    title: "Search Engine Optimization",
    icon: "Search",
    short: "Rank higher on Google with technical + on-page + off-page SEO that drives organic growth.",
    long: "End-to-end SEO that combines deep keyword research, technical audits, on-page optimization and white-hat link building to grow your organic visibility and revenue.",
    slug: "search-engine-optimization",
  },
  {
    title: "Website Design & Development",
    icon: "Code",
    short: "Blazing-fast, conversion-ready websites built with modern stacks that turn visitors into customers.",
    long: "From landing pages to full e-commerce platforms, we design and develop responsive, SEO-friendly, high-performance websites.",
    slug: "website-design-and-development",
  },
  {
    title: "Google Ads / PPC",
    icon: "MousePointerClick",
    short: "High-intent Google Ads campaigns engineered for the lowest possible cost per lead.",
    long: "Search, Shopping, Display and Performance Max campaigns managed with rigorous split testing and transparent reporting.",
    slug: "google-ads-ppc",
  },
  {
    title: "Meta Ads",
    icon: "Share2",
    short: "Scroll-stopping Facebook & Instagram ads that turn cold audiences into paying customers.",
    long: "Full-funnel Meta advertising with creative testing, audience research and retargeting that scales predictably.",
    slug: "meta-ads",
  },
  {
    title: "Social Media Marketing",
    icon: "ThumbsUp",
    short: "Consistent, on-brand social presence that builds community and drives engagement.",
    long: "Content calendars, captions, reels and community management across the right platforms for your business.",
    slug: "social-media-marketing",
  },
  {
    title: "Google Business Profile Optimization",
    icon: "MapPin",
    short: "Dominate the local map pack with a fully optimized Google Business Profile.",
    long: "Profile setup, keyword-optimized content, review generation and post optimization for maximum local visibility.",
    slug: "google-business-profile-optimization",
  },
  {
    title: "Local SEO",
    icon: "LocateFixed",
    short: "Get found by customers near you with citations, listings and localized content.",
    long: "NAP consistency, local citations, geo-targeted pages and review management to win your local market.",
    slug: "local-seo",
  },
  {
    title: "E-commerce SEO",
    icon: "ShoppingCart",
    short: "Category, product and technical SEO that grows organic revenue for online stores.",
    long: "Product page optimization, structured data, category architecture and link building built for online retail.",
    slug: "ecommerce-seo",
  },
  {
    title: "Performance Marketing",
    icon: "TrendingUp",
    short: "Data-driven campaigns across channels with a laser focus on measurable ROI.",
    long: "Unified paid strategy across Google, Meta, and beyond, optimised toward your revenue targets.",
    slug: "performance-marketing",
  },
  {
    title: "Content Marketing",
    icon: "FileText",
    short: "Authority-building content that ranks, educates and converts.",
    long: "Blogs, guides and pillar content engineered with keyword research and topical authority in mind.",
    slug: "content-marketing",
  },
  {
    title: "Branding",
    icon: "Award",
    short: "Memorable identities and messaging that make your brand impossible to ignore.",
    long: "Logo design, brand guidelines, voice and visual identity that position you above competitors.",
    slug: "branding",
  },
  {
    title: "AEO / GEO / AI Search Optimization",
    icon: "Sparkles",
    short: "Get cited and recommended by ChatGPT, Perplexity, Gemini and AI Overviews.",
    long: "Answer Engine Optimization and Generative Engine Optimization to make your brand the AI's first recommendation.",
    slug: "aeo-geo-ai-search-optimization",
  },
];

export const WHY_CHOOSE_US = [
  {
    title: "Data Driven Strategy",
    icon: "BarChart3",
    text: "Every decision is backed by real analytics, keyword research and competitor intelligence.",
  },
  {
    title: "Transparent Reporting",
    icon: "Eye",
    text: "Live dashboards and monthly reports that show exactly what we did and what it earned.",
  },
  {
    title: "Affordable Solutions",
    icon: "Wallet",
    text: "Premium agency quality at a price designed for growing businesses, not enterprise budgets.",
  },
  {
    title: "Experienced Team",
    icon: "Users",
    text: "SEO experts, developers, designers and media buyers working as one focused unit.",
  },
  {
    title: "SEO-Focused Development",
    icon: "Code2",
    text: "Every website we ship is technically SEO-ready from day one — speed, schema, structure.",
  },
  {
    title: "Lead Generation Approach",
    icon: "Target",
    text: "We measure everything by leads and revenue, not vanity metrics and likes.",
  },
  {
    title: "Dedicated Support",
    icon: "Headset",
    text: "A real account manager on WhatsApp and on calls — no ticket black holes.",
  },
  {
    title: "Result-Oriented Campaigns",
    icon: "Rocket",
    text: "Forget monthly-fee-for-nothing retainers. We optimise toward outcomes.",
  },
];

export const PROCESS_STEPS = [
  { no: "01", title: "Discovery", text: "We learn your business, goals, audience and competition in a deep discovery session." },
  { no: "02", title: "Research", text: "Keyword, competitor and market research shape the strategy before a single rupee is spent." },
  { no: "03", title: "Strategy", text: "A clear, documented roadmap covering channels, budgets, timelines and measurable KPIs." },
  { no: "04", title: "Execution", text: "Campaigns launch, content ships and development sprints run on a transparent schedule." },
  { no: "05", title: "Optimization", text: "Continuous A/B testing and data reviews squeeze more performance out of every asset." },
  { no: "06", title: "Reporting & Growth", text: "Clear reports on what worked, what didn't, and the next growth sprint." },
];

export const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    company: "Founder, UrbanCraft Interiors",
    photo: "",
    rating: 5,
    text: "Marketa Digital IT tripled our qualified leads in four months. Their SEO and Google Ads work is genuinely data-driven and the reporting is crystal clear.",
  },
  {
    name: "Priya Nair",
    company: "Director, Nova Healthcare",
    photo: "",
    rating: 5,
    text: "The team rebuilt our website and it loads instantly. Organic appointments are up 210% and they still pick up the phone whenever we call.",
  },
  {
    name: "Amit Deshmukh",
    company: "CEO, FinEdge Co.",
    photo: "",
    rating: 5,
    text: "Finally an agency that speaks business, not jargon. Their local SEO put us on the first page and our Google Business Profile is the best in our category.",
  },
  {
    name: "Sneha Kulkarni",
    company: "Marketing Head, BoutiqueLine",
    photo: "",
    rating: 4,
    text: "Meta Ads spend that actually converts. We scaled from ₹50k to ₹500k monthly ad spend with a consistent positive ROAS. Highly recommended.",
  },
  {
    name: "Vikram Rathod",
    company: "Owner, Rathod Realty",
    photo: "",
    rating: 5,
    text: "Enquiries from Google within days of launching. They treat our budget like their own money. Transparent, fast and professional.",
  },
];

export const CLIENT_LOGOS = [
  "UrbanCraft",
  "Nova Health",
  "FinEdge",
  "BoutiqueLine",
  "Rathod Realty",
  "GreenTech",
  "Skyline Edu",
  "PrimeAuto",
  "Casa Living",
  "Zentrix",
];

export const STATS = [
  { label: "Projects Completed", value: 100, suffix: "+" },
  { label: "Happy Clients", value: 50, suffix: "+" },
  { label: "Years Experience", value: 3, suffix: "+" },
  { label: "Services Offered", value: 12, suffix: "+" },
];

export const PORTFOLIO_PROJECTS = [
  {
    title: "UrbanCraft Interiors",
    client: "UrbanCraft Interiors",
    category: "Local SEO",
    image: "/gallery/gbp.svg",
    description: "Multi-location local SEO + GBP optimization for a premium interiors studio.",
    results: "3x qualified leads · #1 map pack for 12 keywords",
  },
  {
    title: "Nova Healthcare Website",
    client: "Nova Healthcare",
    category: "Website",
    image: "/gallery/web.svg",
    description: "High-performance medical website with appointment booking and schema markup.",
    results: "210% more organic appointments · 98 PageSpeed",
  },
  {
    title: "FinEdge Lead Engine",
    client: "FinEdge Co.",
    category: "Google Ads",
    image: "/gallery/ads.svg",
    description: "Google Ads + SEO for a financial consultancy targeting high-value B2B leads.",
    results: "₹1.9 Cr revenue tracked · 4.7x ROAS",
  },
  {
    title: "BoutiqueLine Social",
    client: "BoutiqueLine",
    category: "Social Media",
    image: "/gallery/social.svg",
    description: "Meta Ads and Instagram growth for an online boutique brand.",
    results: "10x ROAS · 45k followers in 6 months",
  },
  {
    title: "Rathod Realty SEO",
    client: "Rathod Realty",
    category: "SEO",
    image: "/gallery/seo.svg",
    description: "Full-stack SEO and content marketing for a real estate firm.",
    results: "#1 for 20+ money keywords · 340% organic traffic",
  },
  {
    title: "GreenTech E-commerce",
    client: "GreenTech",
    category: "SEO",
    image: "/gallery/perf.svg",
    description: "E-commerce SEO for a sustainable products store.",
    results: "180% organic revenue · 90 products ranking top 10",
  },
];

export const BLOG_POSTS = [
  {
    slug: "local-seo-checklist-2026",
    title: "The Complete Local SEO Checklist for 2026",
    tag: "Local SEO",
    date: "Aug 2026",
    image: "/gallery/gbp.svg",
    excerpt:
      "Dominate the Google map pack with this step-by-step local SEO checklist — GBP optimization, citations and review strategy.",
    body: `Local SEO is the closest thing to "free customers on tap" for businesses with a physical presence. Here is the checklist we run for every local client.

1. Claim and fully optimize your Google Business Profile — categories, services, photos, posts and Q&A.
2. Fix NAP (Name, Address, Phone) consistency across every directory and citation.
3. Build localized landing pages targeting “near me” and city + service keywords.
4. Generate a steady stream of genuine Google reviews — respond to every single one.
5. Embed embedded maps and schema markup (LocalBusiness) on every location page.
6. Build local links: sponsorships, community pages, local press and industry associations.

Do these six things consistently for 90 days and the map pack becomes your number one lead source.`,
  },
  {
    slug: "google-ads-account-structure",
    title: "Google Ads Account Structure That Cuts Cost Per Lead",
    tag: "Google Ads",
    date: "Jul 2026",
    image: "/gallery/ads.svg",
    excerpt:
      "How we structure campaigns, ad groups and keywords to lower CPC and maximise conversion quality.",
    body: `A messy account structure quietly burns budget. The clean structure we use:

1. Campaign per theme — break campaigns by intent (brand, non-brand, competitor, remarketing).
2. Tightly themed ad groups — each ad group covers one search-intent theme, not a keyword dump.
3. Exact phrases in separate ad groups from broad/phrase so you can control spend precisely.
4. A ruthless negative keyword list from day one, reviewed weekly.
5. Search + page one bid strategy with tCPA once conversion data supports it.
6. Ad extensions everywhere: sitelinks, callouts, call, and structured snippets.

Structure is the difference between ₹800 and ₹130 cost per lead on the same budget.`,
  },
  {
    slug: "ai-search-optimization",
    title: "AEO / GEO: Getting Cited by ChatGPT, Perplexity & AI Overviews",
    tag: "AI Search",
    date: "Jun 2026",
    image: "/gallery/perf.svg",
    excerpt:
      "Brands that appear in AI answers win the next search era. Here's how to optimise for generative engines.",
    body: `Generative search engines now answer queries directly. Brands that earn citations in those answers own the next search era.

How to optimise:
1. Write direct, structured answers (definition → evidence → steps) that AI models can quote.
2. Publish original data and research — AI engines love citing unique statistics.
3. Keep consistent brand mentions and entity signals across your site, profiles and directories.
4. Use FAQ and HowTo schema so your content is machine-readable.
5. Earn authoritative backlinks and brand mentions (reviews, press, communities).

We call it AEO (Answer Engine Optimization) — and it now drives a measurable share of our clients' organic pipeline.`,
  },
  {
    slug: "website-page-speed-guide",
    title: "How Page Speed Impacts SEO & How to Get a 95+ PageSpeed Score",
    tag: "Web Development",
    date: "May 2026",
    image: "/gallery/web.svg",
    excerpt:
      "Core Web Vitals are ranking factors. A developer's guide to a fast, conversion-ready website.",
    body: `Core Web Vitals are Google ranking factors and conversion killers when ignored. Every 100ms of extra load time measurably drops conversion rate.

Our non-negotiables:
1. Next-generation image formats (WebP/AVIF) with proper dimensions and lazy loading.
2. Critical CSS inlined; render-blocking scripts deferred.
3. Image CDN and caching headers edge-side.
4. Preload and preconnect for fonts and third-party resources.
5. Avoid heavy carousels and autoplay media; design mobile-first.

A 95+ PageSpeed score is not a vanity metric — it is revenue on autopilot.`,
  },
  {
    slug: "meta-ads-creative-testing",
    title: "Meta Ads Creative Testing Framework That Scales",
    tag: "Meta Ads",
    date: "Apr 2026",
    image: "/gallery/social.svg",
    excerpt:
      "Angle, hook and creative structure — the testing system behind our 10x ROAS Meta campaigns.",
    body: `Creative is 80% of Meta Ads performance. Our testing framework:

1. One variable at a time — angle, hook, format or CTA — never all at once.
2. Minimum 3 creatives per ad set; kill underperformers within 10–14 days.
3. Test hooks hard: statistic, pain point, story, myth-bust.
4. Scale winners with CBO across audiences rather than duplicating ad sets.
5. Refresh creatives before fatigue sets in (usually every 3–4 weeks).

This discipline is how our clients consistently hold 4x–10x ROAS.`,
  },
  {
    slug: "seo-reporting-kpis",
    title: "SEO KPIs That Actually Matter (and Which to Ignore)",
    tag: "SEO",
    date: "Mar 2026",
    image: "/gallery/seo.svg",
    excerpt:
      "Rankings are vanity. Leads are the scoreboard. How we define and report SEO success.",
    body: `Rankings and "keyword positions" are inputs, not outcomes. The KPIs that matter:

1. Organic qualified leads and revenue — the scoreboard.
2. Conversion rate from organic traffic by landing page.
3. Share of voice and impressions for money keywords.
4. Organic traffic to pages that actually generate enquiries.
5. Return on SEO spend (ROAS for organic).

We still track rankings — but only as a diagnostic. The monthly report answers one question: how much revenue did organic marketing bring this month?`,
  },
];

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles?: string[];
};

export const SIDEBAR_ITEMS: { section: string; items: SidebarItem[] }[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Workspace",
    items: [
      { label: "Employees", href: "/staff/employees", icon: Users, roles: ["super_admin", "admin", "manager"] },
      { label: "Attendance", href: "/staff/attendance", icon: CalendarCheck2 },
      { label: "Projects", href: "/staff/projects", icon: FolderKanban, roles: ["super_admin", "admin", "manager"] },
      { label: "Tasks / Work", href: "/staff/tasks", icon: ListTodo },
      { label: "Leaves", href: "/staff/leaves", icon: Palmtree },
      { label: "Holidays", href: "/staff/holidays", icon: CalendarDays },
      { label: "Clients", href: "/staff/clients", icon: Building2 },
      { label: "Leads", href: "/staff/leads", icon: Inbox, roles: ["super_admin", "admin", "manager"] },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Profile", href: "/staff/profile", icon: UserCircle },
      { label: "Settings", href: "/staff/settings", icon: Settings, roles: ["super_admin", "admin"] },
    ],
  },
];

export const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
};

export const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Approve: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Absent: "bg-rose-50 text-rose-700 border-rose-200",
  Late: "bg-amber-50 text-amber-700 border-amber-200",
  "Half Day": "bg-violet-50 text-violet-700 border-violet-200",
  "On Leave": "bg-sky-50 text-sky-700 border-sky-200",
  Holiday: "bg-blue-50 text-blue-700 border-blue-200",
  "Not Started": "bg-slate-100 text-slate-600 border-slate-200",
  "In Progress": "bg-sky-50 text-sky-700 border-sky-200",
  "Under Review": "bg-violet-50 text-violet-700 border-violet-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Blocked: "bg-rose-50 text-rose-700 border-rose-200",
  Planning: "bg-slate-100 text-slate-600 border-slate-200",
  Active: "bg-sky-50 text-sky-700 border-sky-200",
  "On Hold": "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
  Medium: "bg-sky-50 text-sky-700 border-sky-200",
  High: "bg-amber-50 text-amber-700 border-amber-200",
  Urgent: "bg-rose-50 text-rose-700 border-rose-200",
  Lead: "bg-violet-50 text-violet-700 border-violet-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  new: "bg-slate-100 text-slate-600 border-slate-200",
  contacted: "bg-sky-50 text-sky-700 border-sky-200",
  qualified: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-rose-50 text-rose-700 border-rose-200",
};