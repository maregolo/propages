// Industry defaults for rep pages: copy a new rep starts with, per industry.
//
// What's safe to show publicly (see lib/repBlocks.js):
//   headline, highlight, pitch, cta, ctaSub, form  → shown until the rep edits them
//   stats, testimonials, links                     → SAMPLES ONLY: shown to the rep in
//     edit mode as placeholders, never to visitors (they'd read as the rep's own
//     claims, which is a credibility and FTC endorsement problem).
//
// Link `icon` values are legacy emoji; components/rep/RepIcon.js maps them to line icons.

export const INDUSTRY_DEFAULTS = {
  solar: {
    headline: "You shouldn't have to overpay for electricity in 2026.",
    pitch: "Most homeowners are leaving thousands of dollars on the table every year. I help families lock in lower rates and take control of their energy bill — for good.",
    cta: "See What You Could Save →",
    ctaSub: "Free estimate · No obligation · Takes 60 seconds",
    form: {
      label: "Free Savings Estimate",
      headline: "Find out what your neighbors are saving",
      sub: "Takes less than a minute. No sales pressure — just numbers.",
      qualifying_question: "Do you own your home?",
      qualifying_options: ["Yes, I own it", "I rent", "Not sure"],
      button_text: "Get My Free Estimate",
    },
    stats: [
      { number: "214", label: "Families Helped" },
      { number: "$1.4K", label: "Avg. Annual Savings" },
      { number: "4.9★", label: "Google Rating" },
    ],
    testimonials: [
      { text: "Zero pressure. We're saving $130 a month and wish we'd done it sooner.", name: "Maria H.", detail: "Homeowner · Scottsdale, AZ" },
      { text: "I was skeptical but the math checked out. Savings hit exactly like he said they would.", name: "Tom R.", detail: "Homeowner · Tempe, AZ" },
    ],
    links: [
      { icon: "📅", title: "Book a 15-Min Call", sub: "Pick a time that works for you", url: "#" },
      { icon: "⚡", title: "How Solar Works", sub: "Plain-English explainer · 2 min read", url: "#" },
      { icon: "📸", title: "Recent Installs", sub: "See recent work in your neighborhood", url: "#" },
    ],
  },
  roofing: {
    headline: "Your roof is your home's first line of defense.",
    pitch: "A damaged or aging roof doesn't wait for a convenient time to fail. I help homeowners in this area get honest inspections and fair quotes — before small problems become expensive ones.",
    cta: "Get a Free Roof Inspection →",
    ctaSub: "No cost · No obligation · On your schedule",
    form: {
      label: "Free Roof Inspection",
      headline: "Find out the real condition of your roof",
      sub: "Takes about 20 minutes. Honest assessment, no pressure.",
      qualifying_question: "Do you own your home?",
      qualifying_options: ["Yes, I own it", "I rent", "Not sure"],
      button_text: "Schedule My Free Inspection",
    },
    stats: [
      { number: "380+", label: "Roofs Inspected" },
      { number: "5★", label: "Average Rating" },
      { number: "24hr", label: "Avg. Response Time" },
    ],
    testimonials: [
      { text: "Found damage I didn't even know was there. Claim was approved and the job was done in two days.", name: "Kevin M.", detail: "Homeowner · Austin, TX" },
      { text: "No upsell, no pressure. Just a straight answer about what needed fixing and what didn't.", name: "Sandra P.", detail: "Homeowner · Dallas, TX" },
    ],
    links: [
      { icon: "📅", title: "Schedule an Inspection", sub: "Pick a time that works for you", url: "#" },
      { icon: "🏠", title: "Signs Your Roof Needs Attention", sub: "Quick homeowner checklist · 2 min read", url: "#" },
      { icon: "📸", title: "Recent Work", sub: "See completed jobs in your area", url: "#" },
    ],
  },
  pest: {
    headline: "One treatment. No more uninvited guests.",
    pitch: "Pests don't wait, and neither should you. I offer fast, effective treatments that protect your home and family — with plans that keep them gone for good.",
    cta: "Get a Free Home Assessment →",
    ctaSub: "Same-day availability · No contracts required",
    form: {
      label: "Free Home Assessment",
      headline: "Find out what's in your home — before it gets worse",
      sub: "Quick, non-invasive assessment. No charge, no commitment.",
      qualifying_question: "What are you dealing with?",
      qualifying_options: ["Ants / Roaches", "Rodents", "Termites", "Not sure"],
      button_text: "Book My Free Assessment",
    },
    stats: [
      { number: "500+", label: "Homes Treated" },
      { number: "98%", label: "Satisfaction Rate" },
      { number: "4.9★", label: "Google Rating" },
    ],
    testimonials: [
      { text: "Had a roach problem for months. One treatment and they were gone. Haven't seen one since.", name: "Diane R.", detail: "Homeowner · Tampa, FL" },
      { text: "Fast, professional, and actually explained what they were doing. Will absolutely use again.", name: "James L.", detail: "Homeowner · Orlando, FL" },
    ],
    links: [
      { icon: "📅", title: "Book a Same-Day Visit", sub: "Available 7 days a week", url: "#" },
      { icon: "🐜", title: "Common Pests in This Area", sub: "Know what to look for", url: "#" },
      { icon: "🛡️", title: "Our Protection Plans", sub: "Ongoing coverage options", url: "#" },
    ],
  },
  windows: {
    headline: "Old windows are costing you more than you think.",
    pitch: "Drafty windows and outdated doors drive up energy bills and make your home harder to sell. I help homeowners upgrade without the runaround — quality installs, honest pricing.",
    cta: "Get a Free In-Home Quote →",
    ctaSub: "No pressure · Measurements included · Takes 30 minutes",
    form: {
      label: "Free In-Home Quote",
      headline: "Find out what new windows could save you",
      sub: "We measure, we quote, we answer questions. Zero obligation.",
      qualifying_question: "What are you looking to replace?",
      qualifying_options: ["Windows", "Doors", "Both", "Not sure yet"],
      button_text: "Schedule My Free Quote",
    },
    stats: [
      { number: "600+", label: "Windows Installed" },
      { number: "15%", label: "Avg. Energy Savings" },
      { number: "4.8★", label: "Google Rating" },
    ],
    testimonials: [
      { text: "The difference in temperature and noise was immediate. Should have done this years ago.", name: "Beth S.", detail: "Homeowner · Denver, CO" },
      { text: "Quoted three companies. This was the most honest and the most competitive. Glad I went with them.", name: "Frank D.", detail: "Homeowner · Colorado Springs, CO" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Measurement", sub: "In-home, no obligation", url: "#" },
      { icon: "🪟", title: "Window Buying Guide", sub: "What to know before you decide", url: "#" },
      { icon: "📸", title: "Before & After Gallery", sub: "Real installs in your area", url: "#" },
    ],
  },
  hvac: {
    headline: "Don't let a broken system ruin your summer.",
    pitch: "Whether it's a tune-up, a repair, or a full replacement, I help homeowners get the right fix at the right price — no upsells, no surprises.",
    cta: "Get a Free System Check →",
    ctaSub: "Fast scheduling · Honest diagnosis · No call-out fee",
    form: {
      label: "Free System Check",
      headline: "Find out if your system is ready for the season",
      sub: "Quick 30-minute check. We'll tell you exactly what we find.",
      qualifying_question: "What do you need?",
      qualifying_options: ["Tune-up / Maintenance", "Repair", "New System", "Not sure"],
      button_text: "Book My Free Check",
    },
    stats: [
      { number: "900+", label: "Systems Serviced" },
      { number: "Same-Day", label: "Service Available" },
      { number: "4.9★", label: "Google Rating" },
    ],
    testimonials: [
      { text: "AC died in July. They were out within two hours and fixed it the same day. Lifesavers.", name: "Chris T.", detail: "Homeowner · Phoenix, AZ" },
      { text: "Quoted me a third of what another company wanted. Honest, fast, and professional.", name: "Renee G.", detail: "Homeowner · Scottsdale, AZ" },
    ],
    links: [
      { icon: "📅", title: "Book a Service Visit", sub: "Same-day slots available", url: "#" },
      { icon: "❄️", title: "HVAC Maintenance Tips", sub: "Extend the life of your system", url: "#" },
      { icon: "💰", title: "Financing Options", sub: "Flexible payment plans available", url: "#" },
    ],
  },
  security: {
    headline: "Most break-ins happen in under 60 seconds.",
    pitch: "The right security system doesn't just record — it deters. I help homeowners find the right level of protection for their home and budget, with no pushy packages.",
    cta: "Get a Free Home Security Assessment →",
    ctaSub: "No cost · No pressure · Takes 20 minutes",
    form: {
      label: "Free Security Assessment",
      headline: "Find out how protected your home really is",
      sub: "We walk the property, identify vulnerabilities, and recommend what actually makes sense.",
      qualifying_question: "What's your biggest concern?",
      qualifying_options: ["Break-ins", "Package theft", "Cameras", "Full system"],
      button_text: "Book My Free Assessment",
    },
    stats: [
      { number: "700+", label: "Homes Protected" },
      { number: "24/7", label: "Monitoring Available" },
      { number: "4.9★", label: "Google Rating" },
    ],
    testimonials: [
      { text: "Porch pirates hit our neighbors twice last month. We haven't had a single issue since installing.", name: "Laura K.", detail: "Homeowner · Nashville, TN" },
      { text: "No contracts, honest advice, and the install was clean and fast. Couldn't ask for more.", name: "Mike W.", detail: "Homeowner · Brentwood, TN" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Assessment", sub: "Walk-through at your convenience", url: "#" },
      { icon: "🔒", title: "Home Security Guide", sub: "What actually works — and what doesn't", url: "#" },
      { icon: "📹", title: "Our Camera Options", sub: "Indoor, outdoor, doorbell and more", url: "#" },
    ],
  },
  landscaping: {
    headline: "Your yard should be the best-looking one on the block.",
    pitch: "Consistent, reliable lawn care and landscaping — without the hassle of chasing down a crew or guessing when they'll show up. I keep your property looking sharp, season after season.",
    cta: "Get a Free Quote →",
    ctaSub: "Free estimate · No obligation · Most quotes same week",
    form: {
      label: "Free Lawn & Landscape Quote",
      headline: "See what a season of care actually costs",
      sub: "Takes under a minute. No pressure, just a number.",
      qualifying_question: "What do you need help with?",
      qualifying_options: ["Regular mowing", "Landscaping/design", "Cleanup", "Not sure"],
      button_text: "Get My Free Quote",
    },
    stats: [
      { number: "320+", label: "Properties Serviced" },
      { number: "4.9★", label: "Google Rating" },
      { number: "48hr", label: "Avg. Quote Turnaround" },
    ],
    testimonials: [
      { text: "Same crew every time, always on schedule. Yard's never looked better.", name: "Rachel D.", detail: "Homeowner · Charlotte, NC" },
      { text: "Redesigned our front beds and it completely changed how the house looks.", name: "Marcus T.", detail: "Homeowner · Raleigh, NC" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Quote", sub: "Pick a time that works for you", url: "#" },
      { icon: "🌱", title: "Seasonal Care Guide", sub: "What your yard needs this month", url: "#" },
      { icon: "📸", title: "Recent Projects", sub: "See recent transformations", url: "#" },
    ],
  },
 
  moving: {
    headline: "Moving day, minus the chaos.",
    pitch: "Booking a move shouldn't feel like a gamble. I help people get a clear, upfront quote and a crew that actually shows up on time — so moving day goes the way it's supposed to.",
    cta: "Get a Free Moving Quote →",
    ctaSub: "Free estimate · No obligation · Available this week",
    form: {
      label: "Free Moving Quote",
      headline: "Find out what your move actually costs",
      sub: "Takes about a minute. No hidden fees, no surprises.",
      qualifying_question: "What kind of move is this?",
      qualifying_options: ["Local", "Long-distance", "Just a few items", "Not sure"],
      button_text: "Get My Free Quote",
    },
    stats: [
      { number: "1,200+", label: "Moves Completed" },
      { number: "4.8★", label: "Google Rating" },
      { number: "0", label: "Hidden Fees" },
    ],
    testimonials: [
      { text: "Quoted a price and that's exactly what we paid. Crew was fast and careful with everything.", name: "Priya S.", detail: "Customer · Denver, CO" },
      { text: "Booked two days before our move and they made it happen without a hitch.", name: "Dan W.", detail: "Customer · Aurora, CO" },
    ],
    links: [
      { icon: "📅", title: "Book Your Move", sub: "Pick a date that works for you", url: "#" },
      { icon: "📦", title: "Packing Checklist", sub: "What to do the week before", url: "#" },
      { icon: "💬", title: "Get a Quote by Text", sub: "Send us your move details", url: "#" },
    ],
  },
 
  exterior_remodel: {
    headline: "Your home's exterior takes the hit so the inside doesn't have to.",
    pitch: "Worn siding, clogged gutters, and aging trim aren't just cosmetic — they're how water finds its way in. I help homeowners fix it right the first time, with honest quotes and quality materials.",
    cta: "Get a Free Exterior Inspection →",
    ctaSub: "No cost · No obligation · On your schedule",
    form: {
      label: "Free Exterior Inspection",
      headline: "Find out what your home's exterior actually needs",
      sub: "20-minute walkthrough. Straight answers, no upsell.",
      qualifying_question: "What are you looking at?",
      qualifying_options: ["Gutters", "Siding", "Both", "Not sure"],
      button_text: "Schedule My Free Inspection",
    },
    stats: [
      { number: "260+", label: "Homes Inspected" },
      { number: "5★", label: "Average Rating" },
      { number: "24hr", label: "Avg. Response Time" },
    ],
    testimonials: [
      { text: "Showed me exactly where water was getting in. Fixed it in a day and it hasn't been a problem since.", name: "Laura B.", detail: "Homeowner · Columbus, OH" },
      { text: "Fair quote, no pressure to upgrade things I didn't need.", name: "Eric N.", detail: "Homeowner · Dayton, OH" },
    ],
    links: [
      { icon: "📅", title: "Schedule an Inspection", sub: "Pick a time that works for you", url: "#" },
      { icon: "🏠", title: "Warning Signs Checklist", sub: "What to look for on your home", url: "#" },
      { icon: "📸", title: "Recent Work", sub: "See completed jobs in your area", url: "#" },
    ],
  },
 
  real_estate: {
    headline: "Buying or selling shouldn't feel like guesswork.",
    pitch: "I help people navigate the market with a clear plan, straight answers, and no pressure — whether you're finding your next home or getting top dollar for your current one.",
    cta: "Get a Free Home Valuation →",
    ctaSub: "No cost · No obligation · Takes 2 minutes",
    form: {
      label: "Free Home Valuation",
      headline: "Find out what your home is worth in today's market",
      sub: "Quick estimate based on recent local sales.",
      qualifying_question: "Are you looking to...",
      qualifying_options: ["Sell", "Buy", "Both", "Just exploring"],
      button_text: "Get My Free Valuation",
    },
    stats: [
      { number: "140+", label: "Homes Sold" },
      { number: "4.9★", label: "Client Rating" },
      { number: "18", label: "Avg. Days on Market" },
    ],
    testimonials: [
      { text: "Sold our house in under two weeks, above asking. Never felt out of the loop once.", name: "Angela F.", detail: "Seller · Phoenix, AZ" },
      { text: "Found us the right house in a brutal market. Patient, sharp, and always available.", name: "Chris & Dana M.", detail: "Buyers · Scottsdale, AZ" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "🏡", title: "Search Active Listings", sub: "Browse homes in your area", url: "#" },
      { icon: "📊", title: "Free Home Valuation", sub: "See what your home is worth", url: "#" },
    ],
  },
 
  mortgage: {
    headline: "The right loan changes what you can afford.",
    pitch: "Rates and programs change constantly — I help buyers cut through the noise and find a loan that actually fits their situation, with clear numbers from day one.",
    cta: "Get Pre-Approved →",
    ctaSub: "Free · No obligation · Usually same-day",
    form: {
      label: "Free Pre-Approval",
      headline: "Find out what you qualify for",
      sub: "A few quick questions — no credit pull required to start.",
      qualifying_question: "Where are you in the process?",
      qualifying_options: ["Just starting", "Found a home", "Refinancing", "Not sure"],
      button_text: "Start My Pre-Approval",
    },
    stats: [
      { number: "$42M+", label: "Loans Funded" },
      { number: "4.9★", label: "Client Rating" },
      { number: "24hr", label: "Avg. Pre-Approval Time" },
    ],
    testimonials: [
      { text: "Explained every option in plain English and got us pre-approved in a day.", name: "Jordan K.", detail: "Homebuyer · Denver, CO" },
      { text: "Refinanced and saved money every month. Wish we'd called sooner.", name: "Beth & Sam R.", detail: "Homeowners · Boulder, CO" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "🧮", title: "Mortgage Calculator", sub: "Estimate your monthly payment", url: "#" },
      { icon: "📋", title: "Documents You'll Need", sub: "Get ahead of the process", url: "#" },
    ],
  },
 
  property_management: {
    headline: "Your property, actually taken care of.",
    pitch: "From tenant screening to maintenance calls at midnight, I handle the parts of owning a property that owners don't want to. Fewer headaches, better tenants, steady income.",
    cta: "Get a Free Rental Analysis →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Rental Analysis",
      headline: "Find out what your property should be renting for",
      sub: "Quick estimate based on your property and local market.",
      qualifying_question: "What do you need help with?",
      qualifying_options: ["Finding tenants", "Full management", "Maintenance only", "Not sure"],
      button_text: "Get My Free Analysis",
    },
    stats: [
      { number: "180+", label: "Units Managed" },
      { number: "4.8★", label: "Owner Rating" },
      { number: "<2%", label: "Vacancy Rate" },
    ],
    testimonials: [
      { text: "Haven't had to think about my rental in two years. Rent shows up on time, every time.", name: "Howard L.", detail: "Property Owner · Tampa, FL" },
      { text: "Filled a vacancy in 9 days with a great tenant. Wish I'd hired a manager years ago.", name: "Nina P.", detail: "Property Owner · St. Petersburg, FL" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "📋", title: "What We Handle", sub: "Full scope of management services", url: "#" },
      { icon: "📊", title: "Free Rental Analysis", sub: "See what your property could earn", url: "#" },
    ],
  },
 
  str_hosts: {
    headline: "Your property could be earning more than it is right now.",
    pitch: "Whether you're hosting a short-term rental or building a portfolio, I help owners get more from their property — better bookings, smarter pricing, less guesswork.",
    cta: "See Your Property's Earning Potential →",
    ctaSub: "Free estimate · No obligation",
    form: {
      label: "Free Earning Potential Report",
      headline: "Find out what your property could be making",
      sub: "Based on comparable listings and local demand.",
      qualifying_question: "What's your situation?",
      qualifying_options: ["I host already", "Thinking about hosting", "Looking to invest", "Not sure"],
      button_text: "Get My Free Report",
    },
    stats: [
      { number: "85+", label: "Properties Optimized" },
      { number: "4.9★", label: "Host Rating" },
      { number: "32%", label: "Avg. Revenue Increase" },
    ],
    testimonials: [
      { text: "Repriced our listing and occupancy jumped almost overnight. Should've done this a year ago.", name: "Traci & Ben H.", detail: "Hosts · Asheville, NC" },
      { text: "Walked us through our first investment property from offer to first guest. Total pro.", name: "Marcus J.", detail: "Investor · Gatlinburg, TN" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "📈", title: "Free Earning Report", sub: "See what your property could make", url: "#" },
      { icon: "🏘️", title: "Portfolio Examples", sub: "See properties we've helped optimize", url: "#" },
    ],
  },
 
  financial_advisor: {
    // Compliance note: stats/testimonials intentionally avoid performance
    // claims, dollar returns, or guarantees. Recommend an actual compliance
    // review before onboarding real financial advisors.
    headline: "A plan for your money, not just a pitch.",
    pitch: "Retirement, investing, and financial planning shouldn't feel like a sales conversation. I help people build a clear plan built around their actual goals and timeline.",
    cta: "Book a Free Introductory Call →",
    ctaSub: "No cost · No obligation · 100% confidential",
    form: {
      label: "Free Introductory Call",
      headline: "Let's talk about where you want to be",
      sub: "A no-pressure conversation about your goals and options.",
      qualifying_question: "What's on your mind?",
      qualifying_options: ["Retirement planning", "Investing", "General financial plan", "Not sure yet"],
      button_text: "Book My Free Call",
    },
    stats: [
      { number: "15+", label: "Years Experience" },
      { number: "200+", label: "Families Served" },
      { number: "CFP®", label: "Certified Planner" },
    ],
    testimonials: [
      { text: "Finally have an actual plan instead of just guessing. Explains everything without the jargon.", name: "Patricia W.", detail: "Client · Charlotte, NC" },
      { text: "Patient, thorough, and never once made me feel rushed into a decision.", name: "Robert & Anne K.", detail: "Clients · Charlotte, NC" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Call", sub: "Pick a time that works for you", url: "#" },
      { icon: "📄", title: "What to Bring", sub: "Get the most out of our first call", url: "#" },
      { icon: "📚", title: "Financial Planning Basics", sub: "A plain-English primer", url: "#" },
    ],
  },
 
  insurance: {
    headline: "The right coverage, without the runaround.",
    pitch: "Insurance shouldn't require an insurance degree to understand. I help people compare real options and find coverage that actually fits their life — home, auto, life, or business.",
    cta: "Get a Free Quote →",
    ctaSub: "Free comparison · No obligation · Takes 2 minutes",
    form: {
      label: "Free Insurance Quote",
      headline: "See what you could be paying",
      sub: "Quick comparison across top carriers.",
      qualifying_question: "What are you looking to cover?",
      qualifying_options: ["Home", "Auto", "Life", "Business", "Not sure"],
      button_text: "Get My Free Quote",
    },
    stats: [
      { number: "600+", label: "Policies Written" },
      { number: "4.9★", label: "Client Rating" },
      { number: "12", label: "Carriers Compared" },
    ],
    testimonials: [
      { text: "Found me better coverage for less than I was paying. Took the guesswork out of the whole thing.", name: "Deborah S.", detail: "Client · Nashville, TN" },
      { text: "Walked me through my options without pushing me toward the most expensive one.", name: "Tyler M.", detail: "Client · Franklin, TN" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "📊", title: "Free Coverage Comparison", sub: "See how your rate compares", url: "#" },
      { icon: "❓", title: "Coverage Basics", sub: "What each policy type actually covers", url: "#" },
    ],
  },
 
  life_coach: {
    headline: "You don't need more information. You need a plan.",
    pitch: "Coaching isn't about motivation — it's about clarity and accountability. I help people get unstuck and move toward the goals they've been circling for months, or years.",
    cta: "Book a Free Discovery Call →",
    ctaSub: "No cost · No obligation · 30 minutes",
    form: {
      label: "Free Discovery Call",
      headline: "Let's figure out what's actually in your way",
      sub: "A real conversation, not a sales pitch.",
      qualifying_question: "What are you working on?",
      qualifying_options: ["Career/business", "Personal growth", "Both", "Not sure yet"],
      button_text: "Book My Free Call",
    },
    stats: [
      { number: "250+", label: "Clients Coached" },
      { number: "4.9★", label: "Client Rating" },
      { number: "92%", label: "Renew After First Package" },
    ],
    testimonials: [
      { text: "Six months ago I was stuck. Now I have a business and an actual plan. Worth every session.", name: "Alicia T.", detail: "Client" },
      { text: "Direct, honest, and never let me off the hook for my own excuses. Exactly what I needed.", name: "Marcus D.", detail: "Client" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Discovery Call", sub: "Pick a time that works for you", url: "#" },
      { icon: "📖", title: "My Approach", sub: "How coaching with me actually works", url: "#" },
      { icon: "💬", title: "Client Stories", sub: "Real results from real clients", url: "#" },
    ],
  },
 
  fitness_coach: {
    headline: "The plan matters more than the motivation.",
    pitch: "Generic workouts and cookie-cutter meal plans don't work long-term. I build programs around your actual life, so the results stick instead of disappearing after a month.",
    cta: "Get Your Free Fitness Assessment →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Fitness Assessment",
      headline: "Let's find out what's actually holding your results back",
      sub: "A quick conversation about your goals and current routine.",
      qualifying_question: "What's your main goal?",
      qualifying_options: ["Lose weight", "Build strength", "General health", "Not sure"],
      button_text: "Get My Free Assessment",
    },
    stats: [
      { number: "180+", label: "Clients Coached" },
      { number: "4.9★", label: "Client Rating" },
      { number: "12wk", label: "Avg. Program Length" },
    ],
    testimonials: [
      { text: "First program that actually fit my schedule. Down 22 pounds and still going.", name: "Jenna K.", detail: "Client" },
      { text: "Finally understand nutrition instead of just following a random meal plan.", name: "Omar R.", detail: "Client" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Assessment", sub: "Pick a time that works for you", url: "#" },
      { icon: "📋", title: "Program Options", sub: "See how coaching works", url: "#" },
      { icon: "💬", title: "Client Transformations", sub: "Real results from real clients", url: "#" },
    ],
  },
 
  sales_coach: {
    headline: "More reps close more, or they don't. This does it.",
    pitch: "I help sales teams and individual reps close the gap between average and top performer — real scripts, real objection handling, real accountability.",
    cta: "Book a Free Strategy Call →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Strategy Call",
      headline: "Let's find out what's actually costing you deals",
      sub: "A straight conversation about your current numbers.",
      qualifying_question: "What are you looking for?",
      qualifying_options: ["Individual coaching", "Team training", "One-time workshop", "Not sure"],
      button_text: "Book My Free Call",
    },
    stats: [
      { number: "3,000+", label: "Reps Trained" },
      { number: "4.9★", label: "Client Rating" },
      { number: "31%", label: "Avg. Close Rate Lift" },
    ],
    testimonials: [
      { text: "Rebuilt our entire close process. Team's numbers went up within the first month.", name: "Derek H.", detail: "Sales Manager, Roofing Co." },
      { text: "Best training I've been through in ten years in sales. Straight to the point, no fluff.", name: "Samantha B.", detail: "Sales Rep" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Strategy Call", sub: "Pick a time that works for you", url: "#" },
      { icon: "🎓", title: "Training Options", sub: "1:1, team, and workshop formats", url: "#" },
      { icon: "🎧", title: "Free Sales Tips", sub: "Bite-sized training on the go", url: "#" },
    ],
  },
 
  career_coach: {
    headline: "Your next move shouldn't be a guess.",
    pitch: "Whether you're changing careers, chasing a promotion, or leading a team for the first time, I help professionals get clear on the path forward — and actually take it.",
    cta: "Book a Free Career Consultation →",
    ctaSub: "No cost · No obligation · 30 minutes",
    form: {
      label: "Free Career Consultation",
      headline: "Let's map out your next move",
      sub: "A real conversation about where you are and where you want to be.",
      qualifying_question: "What are you working on?",
      qualifying_options: ["Career change", "Promotion/leadership", "Job search", "Not sure yet"],
      button_text: "Book My Free Call",
    },
    stats: [
      { number: "400+", label: "Professionals Coached" },
      { number: "4.9★", label: "Client Rating" },
      { number: "87%", label: "Landed Their Target Role" },
    ],
    testimonials: [
      { text: "Helped me negotiate a big raise and finally step into the role I actually wanted.", name: "Priya N.", detail: "Client" },
      { text: "Gave me a real framework instead of vague advice. Landed the VP role three months later.", name: "Daniel K.", detail: "Client" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "📄", title: "Resume & LinkedIn Review", sub: "See what's holding your profile back", url: "#" },
      { icon: "💬", title: "Client Success Stories", sub: "Real career moves, real people", url: "#" },
    ],
  },
 
  marketing_consultant: {
    headline: "Your marketing should make you money, not just look nice.",
    pitch: "I help businesses build marketing that actually converts — not just campaigns that get likes. Strategy, execution, and reporting that ties back to revenue.",
    cta: "Book a Free Marketing Audit →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Marketing Audit",
      headline: "Find out what's leaking in your current marketing",
      sub: "A quick look at what's working and what's not.",
      qualifying_question: "What do you need help with?",
      qualifying_options: ["Paid ads", "Content/social", "Full strategy", "Not sure"],
      button_text: "Get My Free Audit",
    },
    stats: [
      { number: "60+", label: "Clients Served" },
      { number: "4.9★", label: "Client Rating" },
      { number: "3.2x", label: "Avg. ROAS Delivered" },
    ],
    testimonials: [
      { text: "Cut our ad spend waste in half and doubled qualified leads within two months.", name: "Grant Williams", detail: "Owner, local HVAC company" },
      { text: "Finally have marketing that ties directly back to sales instead of vanity metrics.", name: "Nicole F.", detail: "Founder, boutique retailer" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Audit", sub: "Pick a time that works for you", url: "#" },
      { icon: "📊", title: "Case Studies", sub: "See results from past clients", url: "#" },
      { icon: "🛠️", title: "Services", sub: "How I can help your business", url: "#" },
    ],
  },
 
  designer: {
    headline: "Your brand should look as good as your work is.",
    pitch: "I design websites, brands, and visuals that make businesses look like the real deal — clean, professional, and built to actually convert visitors into customers.",
    cta: "Get a Free Design Consultation →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Design Consultation",
      headline: "Let's talk about what you're building",
      sub: "A quick conversation about your project and goals.",
      qualifying_question: "What do you need?",
      qualifying_options: ["Website", "Branding/logo", "Both", "Not sure yet"],
      button_text: "Book My Free Call",
    },
    stats: [
      { number: "90+", label: "Projects Completed" },
      { number: "4.9★", label: "Client Rating" },
      { number: "2wk", label: "Avg. Turnaround" },
    ],
    testimonials: [
      { text: "Turned our outdated site into something we're actually proud to send people to.", name: "Kevin O.", detail: "Founder, local business" },
      { text: "Nailed our brand identity on the first round. Fast, communicative, genuinely talented.", name: "Michelle A.", detail: "Owner, boutique studio" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "🎨", title: "Portfolio", sub: "See recent work", url: "#" },
      { icon: "💬", title: "Client Reviews", sub: "What past clients say", url: "#" },
    ],
  },
 
  photographer: {
    headline: "Your moments, captured the way you actually remember them.",
    pitch: "From weddings to brand content, I help people and businesses get photos and video that feel real — not stiff, not staged, just genuinely good.",
    cta: "Check My Availability →",
    ctaSub: "No obligation · Fast response",
    form: {
      label: "Check Availability",
      headline: "See if your date is open",
      sub: "Tell me a bit about what you're looking for.",
      qualifying_question: "What are you booking?",
      qualifying_options: ["Wedding", "Portraits", "Brand/business content", "Not sure"],
      button_text: "Check Availability",
    },
    stats: [
      { number: "200+", label: "Sessions Shot" },
      { number: "4.9★", label: "Client Rating" },
      { number: "48hr", label: "Sneak Peek Turnaround" },
    ],
    testimonials: [
      { text: "Made everyone feel completely at ease. Photos looked natural, not posed at all.", name: "Emily & Josh R.", detail: "Wedding clients" },
      { text: "Best brand photos we've ever had. Booked again for our next launch already.", name: "Tasha M.", detail: "Business owner" },
    ],
    links: [
      { icon: "📅", title: "Check Availability", sub: "See if your date is open", url: "#" },
      { icon: "📷", title: "Portfolio", sub: "Browse recent work", url: "#" },
      { icon: "💰", title: "Packages & Pricing", sub: "See what's included", url: "#" },
    ],
  },
 
  writer: {
    headline: "Words that get read — and get results.",
    pitch: "I write copy and content that sounds human and actually moves people to act — websites, emails, ads, and everything in between.",
    cta: "Get a Free Project Quote →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Project Quote",
      headline: "Tell me about what you need written",
      sub: "A few details and I'll get back to you with a quote.",
      qualifying_question: "What do you need?",
      qualifying_options: ["Website copy", "Email/marketing", "Blog/content", "Not sure"],
      button_text: "Get My Free Quote",
    },
    stats: [
      { number: "120+", label: "Projects Delivered" },
      { number: "4.9★", label: "Client Rating" },
      { number: "3-5d", label: "Typical Turnaround" },
    ],
    testimonials: [
      { text: "Rewrote our homepage and conversions jumped almost immediately.", name: "Ben Carter", detail: "Founder, SaaS startup" },
      { text: "Captured our brand voice better than we could've written it ourselves.", name: "Sophie L.", detail: "Marketing Lead" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "✍️", title: "Writing Samples", sub: "See past work", url: "#" },
      { icon: "💰", title: "Rates & Packages", sub: "See how pricing works", url: "#" },
    ],
  },
 
  personal_trainer: {
    headline: "Real coaching. Real results. No guesswork.",
    pitch: "One-on-one training built around your body, your schedule, and your actual goals — not a generic plan pulled off the internet.",
    cta: "Book a Free Trial Session →",
    ctaSub: "No cost · No obligation",
    form: {
      label: "Free Trial Session",
      headline: "Come try a session, on me",
      sub: "See if we're the right fit before committing.",
      qualifying_question: "What's your main goal?",
      qualifying_options: ["Lose weight", "Build muscle", "General fitness", "Not sure"],
      button_text: "Book My Free Session",
    },
    stats: [
      { number: "150+", label: "Clients Trained" },
      { number: "4.9★", label: "Client Rating" },
      { number: "5yr", label: "Training Experience" },
    ],
    testimonials: [
      { text: "Down 30 pounds and stronger than I've ever been. Never once felt judged, just pushed.", name: "Carla V.", detail: "Client" },
      { text: "Best trainer I've worked with. Actually listens and adjusts the plan when life gets in the way.", name: "Mike T.", detail: "Client" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Trial Session", sub: "Pick a time that works for you", url: "#" },
      { icon: "📋", title: "Training Packages", sub: "See pricing and options", url: "#" },
      { icon: "💬", title: "Client Transformations", sub: "Real results from real clients", url: "#" },
    ],
  },
 
  medspa: {
    headline: "Look like the best version of yourself — safely.",
    pitch: "From injectables to skincare treatments, I help clients feel confident with results that look natural, done by a licensed professional who takes the time to get it right.",
    cta: "Book a Free Consultation →",
    ctaSub: "No cost · No obligation · Licensed provider",
    form: {
      label: "Free Consultation",
      headline: "Let's talk about what you're looking for",
      sub: "A relaxed, no-pressure conversation about your goals.",
      qualifying_question: "What are you interested in?",
      qualifying_options: ["Injectables", "Skincare treatments", "Not sure yet"],
      button_text: "Book My Free Consultation",
    },
    stats: [
      { number: "500+", label: "Treatments Performed" },
      { number: "4.9★", label: "Client Rating" },
      { number: "Licensed", label: "Certified Provider" },
    ],
    testimonials: [
      { text: "Natural results, no pressure to overdo it. Exactly what I wanted.", name: "Renee K.", detail: "Client" },
      { text: "Took the time to explain everything and made me feel completely comfortable.", name: "Sarah J.", detail: "Client" },
    ],
    links: [
      { icon: "📅", title: "Book a Free Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "💉", title: "Services & Pricing", sub: "See treatment options", url: "#" },
      { icon: "📸", title: "Before & After", sub: "See real results", url: "#" },
    ],
  },
  
  other: {
    headline: "Professional service you can actually trust.",
    pitch: "I take pride in doing the job right and being straight with every homeowner I meet. No runaround, no surprises — just honest work and real results.",
    cta: "Get in Touch →",
    ctaSub: "Free consultation · No obligation",
    form: {
      label: "Free Consultation",
      headline: "Let's talk about what you need",
      sub: "Quick and easy. I'll answer your questions and give you a straight answer.",
      qualifying_question: "Do you own your home?",
      qualifying_options: ["Yes, I own it", "I rent", "Not sure"],
      button_text: "Get in Touch",
    },
    stats: [
      { number: "200+", label: "Customers Served" },
      { number: "5★", label: "Average Rating" },
      { number: "100%", label: "Satisfaction Guaranteed" },
    ],
    testimonials: [
      { text: "Straightforward, professional, and got the job done right the first time.", name: "Alex P.", detail: "Homeowner" },
      { text: "Refreshing to work with someone who just tells you the truth. Highly recommend.", name: "Jordan M.", detail: "Homeowner" },
    ],
    links: [
      { icon: "📅", title: "Book a Consultation", sub: "Pick a time that works for you", url: "#" },
      { icon: "⭐", title: "Customer Reviews", sub: "See what others are saying", url: "#" },
      { icon: "📞", title: "Contact Me Directly", sub: "Questions? Just reach out", url: "#" },
    ],
  },
};

// The phrase in each headline that gets the highlighter swipe in the hero.
// Must appear verbatim in that industry's headline.
const HIGHLIGHTS = {
  solar: 'overpay for electricity',
  roofing: 'first line of defense',
  pest: 'No more uninvited guests',
  windows: 'costing you more',
  hvac: 'ruin your summer',
  security: 'under 60 seconds',
  landscaping: 'best-looking one on the block',
  moving: 'minus the chaos',
  exterior_remodel: 'takes the hit',
  real_estate: 'feel like guesswork',
  mortgage: 'what you can afford',
  property_management: 'actually taken care of',
  str_hosts: 'earning more',
  financial_advisor: 'not just a pitch',
  insurance: 'without the runaround',
  life_coach: 'You need a plan',
  fitness_coach: 'The plan matters more',
  sales_coach: 'close more',
  career_coach: "shouldn't be a guess",
  marketing_consultant: 'make you money',
  designer: 'as good as your work',
  photographer: 'the way you actually remember them',
  writer: 'get results',
  personal_trainer: 'Real results',
  medspa: 'the best version of yourself',
  other: 'actually trust',
};

export function getDefaults(industry) {
  const key = INDUSTRY_DEFAULTS[industry] ? industry : 'other';
  return { ...INDUSTRY_DEFAULTS[key], highlight: HIGHLIGHTS[key] || '' };
}
