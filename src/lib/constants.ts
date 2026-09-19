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
  email: "support@marketadigitalit.com",
  phone: "+917870241157",
  phoneDisplay: "78702 41157",
  address: "Nagpur, Maharashtra, India",
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
    image: "",
    description: "Multi-location local SEO + GBP optimization for a premium interiors studio.",
    results: "3x qualified leads · #1 map pack for 12 keywords",
  },
  {
    title: "Nova Healthcare Website",
    client: "Nova Healthcare",
    category: "Website",
    image: "",
    description: "High-performance medical website with appointment booking and schema markup.",
    results: "210% more organic appointments · 98 PageSpeed",
  },
  {
    title: "FinEdge Lead Engine",
    client: "FinEdge Co.",
    category: "Google Ads",
    image: "",
    description: "Google Ads + SEO for a financial consultancy targeting high-value B2B leads.",
    results: "₹1.9 Cr revenue tracked · 4.7x ROAS",
  },
  {
    title: "BoutiqueLine Social",
    client: "BoutiqueLine",
    category: "Social Media",
    image: "",
    description: "Meta Ads and Instagram growth for an online boutique brand.",
    results: "10x ROAS · 45k followers in 6 months",
  },
  {
    title: "Rathod Realty SEO",
    client: "Rathod Realty",
    category: "SEO",
    image: "",
    description: "Full-stack SEO and content marketing for a real estate firm.",
    results: "#1 for 20+ money keywords · 340% organic traffic",
  },
  {
    title: "GreenTech E-commerce",
    client: "GreenTech",
    category: "SEO",
    image: "",
    description: "E-commerce SEO for a sustainable products store.",
    results: "180% organic revenue · 90 products ranking top 10",
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