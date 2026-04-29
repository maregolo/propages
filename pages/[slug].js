import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ─── Industry-aware defaults ─────────────────────────────────────────────────

const INDUSTRY_DEFAULTS = {
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

function getDefaults(industry) {
  return INDUSTRY_DEFAULTS[industry] || INDUSTRY_DEFAULTS.other;
}

// ─── Page styles ──────────────────────────────────────────────────────────────

const PAGE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --sun: #F5A623; --sun-bright: #FFD166; --sky: #0A1628;
    --sky-mid: #112240; --sky-light: #1D3461; --white: #F8F5EE;
    --muted: #8899AA; --accent: #00E5BE; --danger: #FF6B6B;
    --card-bg: rgba(255,255,255,0.04); --card-border: rgba(255,255,255,0.08);
  }
  html { scroll-behavior: smooth; }
  body { background-color: var(--sky); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }

  .bg-atmosphere { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .bg-atmosphere::before { content: ''; position: absolute; top: -20%; left: -10%; width: 70%; height: 70%; background: radial-gradient(ellipse, rgba(245,166,35,0.12) 0%, transparent 70%); animation: breathe 8s ease-in-out infinite alternate; }
  .bg-atmosphere::after { content: ''; position: absolute; bottom: -10%; right: -10%; width: 60%; height: 60%; background: radial-gradient(ellipse, rgba(0,229,190,0.07) 0%, transparent 70%); animation: breathe 10s ease-in-out infinite alternate-reverse; }
  @keyframes breathe { from { transform: scale(1) translate(0,0); } to { transform: scale(1.1) translate(2%,2%); } }

  .page { position: relative; z-index: 1; max-width: 480px; margin: 0 auto; padding: 0 20px 60px; }

  .topbar { display: flex; justify-content: center; padding: 20px 0 0; opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s; }
  .propages-badge { font-family: 'Bebas Neue', sans-serif; font-size: 13px; letter-spacing: 3px; color: var(--muted); border: 1px solid var(--card-border); padding: 4px 12px; border-radius: 20px; background: var(--card-bg); }

  .hero { text-align: center; padding: 40px 0 32px; opacity: 0; animation: fadeUp 0.7s ease forwards 0.25s; }
  .avatar-wrap { position: relative; display: inline-block; margin-bottom: 20px; }
  .avatar { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 2px solid var(--sun); display: block; }
  .avatar-placeholder { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, var(--sky-light), var(--sky-mid)); border: 2px solid var(--sun); display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--sun); }
  .status-dot { position: absolute; bottom: 4px; right: 4px; width: 14px; height: 14px; background: var(--accent); border-radius: 50%; border: 2px solid var(--sky); animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,190,0.4); } 50% { box-shadow: 0 0 0 6px rgba(0,229,190,0); } }

  .hero-name { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 2px; line-height: 1; color: var(--white); margin-bottom: 4px; }
  .hero-title { font-size: 13px; font-weight: 500; color: var(--sun); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .hero-problem { font-size: 22px; font-weight: 300; line-height: 1.4; color: var(--white); margin-bottom: 10px; }
  .hero-problem strong { font-weight: 700; color: var(--sun-bright); }
  .hero-solution { font-size: 14px; color: var(--muted); line-height: 1.6; max-width: 320px; margin: 0 auto 28px; }

  .cta-btn { display: block; width: 100%; padding: 17px 24px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 14px; cursor: pointer; text-align: center; box-shadow: 0 8px 32px rgba(245,166,35,0.3); margin-bottom: 10px; text-decoration: none; transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(245,166,35,0.45); }
  .cta-sub { font-size: 12px; color: var(--muted); text-align: center; margin-bottom: 32px; }

  .stats-strip { display: flex; gap: 10px; }
  .stat-card { flex: 1; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 14px 10px; text-align: center; }
  .stat-number { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: var(--sun-bright); line-height: 1; margin-bottom: 3px; }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 500; letter-spacing: 0.5px; }

  .lead-section { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 28px 24px; }
  .lead-section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .lead-section-headline { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: 6px; line-height: 1.3; }
  .lead-section-sub { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }

  .qualifying-q { margin-bottom: 20px; }
  .qualifying-q p { font-size: 13px; font-weight: 600; color: var(--white); margin-bottom: 10px; }
  .q-options { display: flex; gap: 8px; flex-wrap: wrap; }
  .q-option { padding: 8px 14px; border: 1px solid var(--card-border); border-radius: 30px; font-size: 13px; color: var(--muted); cursor: pointer; background: transparent; font-family: 'DM Sans', sans-serif; transition: all 0.15s ease; }
  .q-option:hover { border-color: var(--sun); color: var(--sun); background: rgba(245,166,35,0.08); }
  .q-option.selected { border-color: var(--sun); color: var(--sun); background: rgba(245,166,35,0.08); }

  .field-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
  .field input { width: 100%; padding: 14px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 12px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s ease; }
  .field input::placeholder { color: var(--muted); }
  .field input:focus { border-color: var(--sun); background: rgba(245,166,35,0.04); }
  .submit-btn { width: 100%; padding: 16px; background: var(--accent); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 6px 24px rgba(0,229,190,0.25); transition: transform 0.15s ease, box-shadow 0.15s ease; }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(0,229,190,0.4); }

  .success-state { text-align: center; padding: 20px 0; }
  .success-icon { font-size: 48px; margin-bottom: 12px; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--accent); margin-bottom: 6px; }
  .success-sub { font-size: 14px; color: var(--muted); line-height: 1.5; }

  .testimonials-section { }
  .section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); text-align: center; margin-bottom: 14px; }
  .testimonial-track { display: flex; flex-direction: column; gap: 10px; }
  .testimonial-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 16px 18px; }
  .testimonial-stars { color: var(--sun); font-size: 13px; margin-bottom: 8px; letter-spacing: 2px; }
  .testimonial-text { font-size: 13px; color: var(--white); line-height: 1.6; font-style: italic; margin-bottom: 10px; font-weight: 300; }
  .testimonial-author { display: flex; align-items: center; gap: 10px; }
  .testimonial-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--sky-light), var(--sun)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: var(--white); flex-shrink: 0; }
  .testimonial-name { font-size: 13px; font-weight: 600; color: var(--white); }
  .testimonial-detail { font-size: 11px; color: var(--muted); }

  .links-section { display: flex; flex-direction: column; gap: 10px; }
  .link-card { display: flex; align-items: center; gap: 14px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 14px 18px; text-decoration: none; color: var(--white); transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease; }
  .link-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); transform: translateX(4px); }
  .link-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; background: rgba(245,166,35,0.15); }
  .link-text { flex: 1; }
  .link-title { font-size: 14px; font-weight: 600; margin-bottom: 1px; }
  .link-sub { font-size: 12px; color: var(--muted); }
  .link-arrow { color: var(--muted); font-size: 16px; }

  .qr-section { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 16px; }
  .qr-placeholder { width: 72px; height: 72px; border-radius: 10px; background: var(--white); flex-shrink: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .qr-placeholder svg { width: 60px; height: 60px; }
  .qr-title { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
  .qr-sub { font-size: 12px; color: var(--muted); line-height: 1.5; }

  .footer { text-align: center; }
  .footer-powered { font-size: 11px; color: var(--muted); letter-spacing: 1px; }
  .footer-powered span { color: var(--sun); font-weight: 700; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; font-size: 13px; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }

  .owner-menu-btn { position: fixed; top: 20px; right: 20px; z-index: 200; background: var(--sky-mid); border: 1px solid var(--card-border); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .owner-menu { position: fixed; top: 68px; right: 20px; z-index: 200; background: var(--sky-mid); border: 1px solid var(--card-border); border-radius: 16px; padding: 8px; min-width: 180px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .owner-menu-item { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 10px; font-size: 14px; font-weight: 600; color: var(--white); cursor: pointer; transition: background 0.15s ease; }
  .owner-menu-item:hover { background: rgba(255,255,255,0.06); }
  .owner-menu-item.active { color: var(--sun); }

  .editor-box { background: var(--sky-mid); border: 1px solid var(--sun); border-radius: 20px; padding: 24px; }
  .editor-box label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
  .editor-box textarea, .editor-box input[type="text"] { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 10px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; resize: vertical; transition: border-color 0.2s ease; }
  .editor-box textarea:focus, .editor-box input[type="text"]:focus { border-color: var(--sun); }
  .editor-box textarea { min-height: 90px; }
  .editor-field { margin-bottom: 16px; }
  .editor-actions { display: flex; gap: 10px; margin-top: 4px; }
  .editor-save { flex: 1; padding: 12px; background: linear-gradient(135deg, var(--sun), var(--sun-bright)); color: var(--sky); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; border: none; border-radius: 10px; cursor: pointer; }
  .editor-cancel { padding: 12px 16px; background: transparent; border: 1px solid var(--card-border); color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 14px; border-radius: 10px; cursor: pointer; }
  .editor-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; margin-top: 14px; }
  .editor-input { width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); border-radius: 10px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; margin-bottom: 12px; transition: border-color 0.2s ease; display: block; }
  .editor-input:focus { border-color: var(--sun); }

  /* ── Block system ── */
  .block-edit-bar { display: flex; align-items: center; justify-content: flex-end; gap: 6px; padding: 6px 0 8px; }
  .block-btn { background: var(--sky-mid); border: 1px solid var(--card-border); border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: var(--muted); transition: border-color 0.15s ease, color 0.15s ease; }
  .block-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--white); }
  .block-btn.danger:hover { border-color: var(--danger); color: var(--danger); }
  .block-hidden-overlay { opacity: 0.35; pointer-events: none; }

  .add-block-zone { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 6px 0; cursor: pointer; opacity: 0; transition: opacity 0.2s ease; }
  .add-block-zone:hover { opacity: 1 !important; }
  .add-block-zone-line { flex: 1; height: 1px; background: var(--card-border); }
  .add-block-zone-btn { width: 28px; height: 28px; border-radius: 50%; background: var(--sky-mid); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--muted); flex-shrink: 0; transition: border-color 0.15s, color 0.15s, background 0.15s; }
  .add-block-zone:hover .add-block-zone-btn { border-color: var(--accent); color: var(--accent); background: rgba(0,229,190,0.08); }
  .add-block-zone:hover .add-block-zone-line { background: rgba(0,229,190,0.2); }

  /* Portfolio */
  .portfolio-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .portfolio-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 10px; display: block; }
  .portfolio-carousel { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .portfolio-carousel::-webkit-scrollbar { display: none; }
  .portfolio-carousel-img { flex-shrink: 0; width: 220px; height: 220px; object-fit: cover; border-radius: 12px; scroll-snap-align: start; }

  /* Video */
  .video-embed-wrap { position: relative; width: 100%; padding-top: 56.25%; border-radius: 14px; overflow: hidden; background: var(--sky-mid); border: 1px solid var(--card-border); }
  .video-embed-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

  /* Text */
  .text-block-content { font-size: 15px; color: var(--muted); line-height: 1.7; }
  .text-block-content h3 { font-size: 17px; font-weight: 700; color: var(--white); margin-bottom: 8px; }

  /* Social feed */
  .social-feed { display: flex; flex-direction: column; gap: 10px; }
  .social-post-card { display: flex; align-items: center; gap: 12px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 14px 16px; text-decoration: none; color: var(--white); transition: background 0.15s ease; }
  .social-post-card:hover { background: rgba(255,255,255,0.07); }
  .social-post-icon { font-size: 22px; flex-shrink: 0; }
  .social-post-text { flex: 1; min-width: 0; }
  .social-post-caption { font-size: 13px; color: var(--white); line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
  .social-post-meta { font-size: 11px; color: var(--muted); }
`;

// ─── Page head ────────────────────────────────────────────────────────────────

function PageHead({ name, pitch }) {
  return (
    <Head>
      <title>{name} · ProPages</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={pitch} />
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&display=swap" rel="stylesheet" />
    </Head>
  );
}

// ─── Top-level page component ─────────────────────────────────────────────────

export default function RepPage({ rep }) {
  if (!rep) {
    return (
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '60px 20px', background: '#0A1628', color: '#F8F5EE', minHeight: '100vh' }}>
        <h1>Page not found</h1>
        <p style={{ color: '#8899AA' }}>This ProPages link doesn&apos;t exist yet.</p>
      </div>
    );
  }
  return <BlockPage rep={rep} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK PAGE
// ═══════════════════════════════════════════════════════════════════════════════

function BlockPage({ rep }) {
  const [isOwner,         setIsOwner]         = useState(false);
  const [authChecked,     setAuthChecked]     = useState(false);
  const [editMode,        setEditMode]        = useState(false);
  const [blocks,          setBlocks]          = useState(rep.blocks || []);
  const [previousBlocks,  setPreviousBlocks]  = useState(null);
  const [editingBlockId,  setEditingBlockId]  = useState(null);
  const [toastVisible,    setToastVisible]    = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  const defaults = getDefaults(rep.industry);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if ((session && session.user.id === rep.auth_id) || rep.auth_id === null) {
        setIsOwner(true);
        const params = new URLSearchParams(window.location.search);
        if (params.get('edit') === 'true') setEditMode(true);
        if (params.get('new') === 'true') {
          setToastVisible(true);
          const welcomed = localStorage.getItem(`pp_welcomed_${rep.slug}`);
          if (!welcomed) setShowWelcomeBanner(true);
        }
        if (params.get('edit') === 'true' || params.get('new') === 'true') {
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
      setAuthChecked(true);
    });
  }, []);

  async function saveBlocks(newBlocks) {
    setPreviousBlocks(blocks);
    setBlocks(newBlocks);
    await supabase.from('reps').update({ blocks: newBlocks }).eq('id', rep.id);
  }

  async function handleUndo() {
    if (!previousBlocks) return;
    setBlocks(previousBlocks);
    setPreviousBlocks(null);
    await supabase.from('reps').update({ blocks: previousBlocks }).eq('id', rep.id);
  }

  function handleBlockSave(blockId, newData) {
    saveBlocks(blocks.map(b => b.id === blockId ? { ...b, data: newData } : b));
    setEditingBlockId(null);
  }

  function handleToggleVisible(blockId) {
    saveBlocks(blocks.map(b => b.id === blockId ? { ...b, visible: !b.visible } : b));
  }

  function handleMoveUp(blockId) {
    const idx = blocks.findIndex(b => b.id === blockId);
    if (idx === 0) return;
    const nb = [...blocks];
    [nb[idx - 1], nb[idx]] = [nb[idx], nb[idx - 1]];
    saveBlocks(nb);
  }

  function handleMoveDown(blockId) {
    const idx = blocks.findIndex(b => b.id === blockId);
    if (idx === blocks.length - 1) return;
    const nb = [...blocks];
    [nb[idx], nb[idx + 1]] = [nb[idx + 1], nb[idx]];
    saveBlocks(nb);
  }

  function handleDelete(blockId) {
    if (!window.confirm('Delete this block?')) return;
    saveBlocks(blocks.filter(b => b.id !== blockId));
  }

  function handleInsertBlock(afterIndex, newBlock) {
    const nb = [...blocks];
    nb.splice(afterIndex + 1, 0, newBlock);
    saveBlocks(nb);
    setEditingBlockId(newBlock.id);
  }

  const pitch = rep.pitch || defaults.pitch;

  return (
    <>
      <PageHead name={rep.name} pitch={pitch} />
      <style>{PAGE_STYLES}</style>
      <div className="bg-atmosphere" />

      {authChecked && isOwner && (
        <OwnerMenu
          editMode={editMode}
          onToggleEdit={() => { setEditMode(e => !e); setEditingBlockId(null); }}
          canUndo={!!previousBlocks}
          onUndo={handleUndo}
        />
      )}

      <LiveToast slug={rep.slug} visible={toastVisible} onDismiss={() => setToastVisible(false)} />

      <div className="page">
        {showWelcomeBanner && isOwner && (
          <WelcomeBanner slug={rep.slug} onDismiss={() => setShowWelcomeBanner(false)} />
        )}

        <div className="topbar">
          <div className="propages-badge">PROPAGES</div>
        </div>

        {blocks.map((block, idx) => (
          <BlockSlot
            key={block.id}
            block={block}
            idx={idx}
            isLast={idx === blocks.length - 1}
            editMode={editMode}
            authChecked={authChecked}
            isOwner={isOwner}
            isEditing={editingBlockId === block.id}
            rep={rep}
            defaults={defaults}
            onEdit={() => setEditingBlockId(block.id)}
            onCancelEdit={() => setEditingBlockId(null)}
            onSave={(newData) => handleBlockSave(block.id, newData)}
            onToggleVisible={() => handleToggleVisible(block.id)}
            onMoveUp={() => handleMoveUp(block.id)}
            onMoveDown={() => handleMoveDown(block.id)}
            onDelete={() => handleDelete(block.id)}
            onInsertAfter={(newBlock) => handleInsertBlock(idx, newBlock)}
            totalBlocks={blocks.length}
          />
        ))}

        {authChecked && editMode && (
          <AddBlockZone onInsert={(nb) => handleInsertBlock(blocks.length - 1, nb)} />
        )}

        <div style={{ marginBottom: 28 }}>
          <QRSection />
        </div>

        <ShareCard slug={rep.slug} isOwner={isOwner} />

        <div className="footer">
          <div className="footer-powered">Powered by <span>PROPAGES</span></div>
        </div>
      </div>
    </>
  );
}

// ─── Block slot ───────────────────────────────────────────────────────────────

function BlockSlot({
  block, idx, isLast, editMode, authChecked, isEditing,
  rep, defaults,
  onEdit, onCancelEdit, onSave,
  onToggleVisible, onMoveUp, onMoveDown, onDelete, onInsertAfter,
}) {
  const isHidden = block.visible === false;

  return (
    <div style={{ marginBottom: 28 }}>
      {authChecked && editMode && (
        <div className="block-edit-bar">
          <button className="block-btn" onClick={onToggleVisible} title={isHidden ? 'Show' : 'Hide'} style={{ opacity: isHidden ? 0.4 : 1 }}>
            {isHidden ? '🙈' : '👁'}
          </button>
          <button className="block-btn" onClick={onMoveUp}   style={{ opacity: idx === 0 ? 0.3 : 1 }} title="Move up">↑</button>
          <button className="block-btn" onClick={onMoveDown} style={{ opacity: isLast ? 0.3 : 1 }}    title="Move down">↓</button>
          <button className="block-btn" onClick={onEdit}   title="Edit">✏️</button>
          <button className="block-btn danger" onClick={onDelete} title="Delete">🗑</button>
        </div>
      )}

      <div className={isHidden && !editMode ? 'block-hidden-overlay' : ''}>
        {isEditing
          ? renderBlockEditor(block, rep, defaults, onSave, onCancelEdit)
          : renderBlock(block, rep, defaults)
        }
      </div>

      {authChecked && editMode && <AddBlockZone onInsert={onInsertAfter} />}
    </div>
  );
}

// ─── Renderers ────────────────────────────────────────────────────────────────

function renderBlock(block, rep, defaults) {
  if (block.visible === false) return null;
  switch (block.type) {
    case 'profile':      return <ProfileBlock block={block} rep={rep} />;
    case 'headline':     return <HeadlineBlock block={block} rep={rep} defaults={defaults} />;
    case 'lead_capture': return <LeadCaptureBlock block={block} rep={rep} defaults={defaults} />;
    case 'stats':        return <StatsBlock block={block} defaults={defaults} />;
    case 'testimonials': return <TestimonialsBlock block={block} defaults={defaults} />;
    case 'links':        return <LinksBlock block={block} defaults={defaults} />;
    case 'text':         return <TextBlock block={block} />;
    case 'video':        return <VideoBlock block={block} />;
    case 'portfolio':    return <PortfolioBlock block={block} />;
    case 'social_feed':  return <SocialFeedBlock block={block} />;
    default:             return null;
  }
}

function renderBlockEditor(block, rep, defaults, onSave, onCancel) {
  const props = { block, rep, defaults, onSave, onCancel };
  switch (block.type) {
    case 'profile':      return <ProfileEditor {...props} />;
    case 'headline':     return <HeadlineBlockEditor {...props} />;
    case 'lead_capture': return <LeadCaptureBlockEditor {...props} />;
    case 'stats':        return <StatsBlockEditor {...props} />;
    case 'testimonials': return <TestimonialsBlockEditor {...props} />;
    case 'links':        return <LinksBlockEditor {...props} />;
    case 'text':         return <TextBlockEditor {...props} />;
    case 'video':        return <VideoBlockEditor {...props} />;
    case 'portfolio':    return <PortfolioBlockEditor {...props} />;
    case 'social_feed':  return <SocialFeedBlockEditor {...props} />;
    default:             return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK RENDER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ProfileBlock({ block, rep }) {
  const d = block.data || {};
  const name      = d.name      || rep.name;
  const title     = d.title     || rep.title;
  const city      = d.city      || rep.city;
  const industry  = d.industry  || rep.industry;
  const photo_url  = d.photo_url  || rep.photo_url;
  const badge_tier = d.badge_tier || rep.badge_tier;
  const initials  = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <div className="hero" style={{ paddingBottom: 0 }}>
      <div className="avatar-wrap">
        {photo_url
          ? <img src={photo_url} alt={name} className="avatar" />
          : <div className="avatar-placeholder">{initials}</div>
        }
        <div className="status-dot" />
      </div>
      <div className="hero-name">{name}</div>
      <div className="hero-title">{[title, city, industry].filter(Boolean).join(' · ')}</div>
      {badge_tier && <BadgePill tier={badge_tier} />}
    </div>
  );
}

function HeadlineBlock({ block, rep, defaults }) {
  const d = block.data || {};
  const headline = d.headline || rep.headline || defaults.headline;
  const pitch    = d.pitch    || rep.pitch    || defaults.pitch;
  const ctaText  = d.cta     || defaults.cta;
  const ctaSub   = d.ctaSub  || defaults.ctaSub;

  return (
    <div style={{ textAlign: 'center', paddingBottom: 4 }}>
      <p className="hero-problem">{headline}</p>
      <p className="hero-solution">{pitch}</p>
      <a href="#get-quote" className="cta-btn">{ctaText}</a>
      <p className="cta-sub">{ctaSub}</p>
    </div>
  );
}

function StatsBlock({ block, defaults }) {
  const stats = (block.data && block.data.stats) || defaults.stats;
  return (
    <div className="stats-strip">
      {stats.map((s, i) => (
        <div className="stat-card" key={i}>
          <div className="stat-number">{s.number}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function LeadCaptureBlock({ block, rep, defaults }) {
  const d  = block.data || {};
  const lc = d.lead_capture || rep.lead_capture || {};
  const form = lc.form || {};
  const formLabel = form.label               || defaults.form.label;
  const formHead  = form.headline            || defaults.form.headline;
  const formSub   = form.sub                 || defaults.form.sub;
  const formQ     = form.qualifying_question || defaults.form.qualifying_question;
  const formOpts  = form.qualifying_options  || defaults.form.qualifying_options;
  const formBtn   = form.button_text         || defaults.form.button_text;

  return (
    <div className="lead-section" id="get-quote">
      <div className="lead-section-label">{formLabel}</div>
      <div className="lead-section-headline">{formHead}</div>
      <div className="lead-section-sub">{formSub}</div>
      <LeadForm
        repId={rep.id}
        repName={rep.name}
        qualifyingQuestion={formQ}
        qualifyingOptions={formOpts}
        buttonText={formBtn}
        namePlaceholder={form.name_placeholder  || 'Your name'}
        phonePlaceholder={form.phone_placeholder || 'Phone number'}
        collectEmail={form.collect_email || false}
        collectZip={form.collect_zip     || false}
      />
    </div>
  );
}

function TestimonialsBlock({ block, defaults }) {
  const testimonials = (block.data && block.data.testimonials) || defaults.testimonials;
  return (
    <div className="testimonials-section">
      <div className="section-label">What Customers Are Saying</div>
      <div className="testimonial-track">
        {testimonials.map((t, i) => (
          <div className="testimonial-card" key={i}>
            <div className="testimonial-stars">★★★★★</div>
            <div className="testimonial-text">&ldquo;{t.text}&rdquo;</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {t.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-detail">{t.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinksBlock({ block, defaults }) {
  const links = (block.data && block.data.links) || defaults.links;
  return (
    <div className="links-section">
      {links.map((l, i) => (
        <a href={l.url || '#'} className="link-card" key={i}>
          <div className="link-icon">{l.icon}</div>
          <div className="link-text">
            <div className="link-title">{l.title}</div>
            <div className="link-sub">{l.sub}</div>
          </div>
          <div className="link-arrow">›</div>
        </a>
      ))}
    </div>
  );
}

function TextBlock({ block }) {
  const d = block.data || {};
  return (
    <div className="text-block-content">
      {d.heading && <h3>{d.heading}</h3>}
      {d.body    && <p style={{ whiteSpace: 'pre-wrap' }}>{d.body}</p>}
    </div>
  );
}

function VideoBlock({ block }) {
  const d   = block.data || {};
  const url = d.url || '';

  function getEmbedUrl(raw) {
    const yt = raw.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    return null;
  }

  if (!url) return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
      🎥 Add a video URL to display it here
    </div>
  );

  const embedUrl = getEmbedUrl(url);
  if (!embedUrl) return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="link-card">
      <div className="link-icon">🎵</div>
      <div className="link-text">
        <div className="link-title">{d.caption || 'Watch Video'}</div>
        <div className="link-sub">{url.replace(/^https?:\/\//, '').slice(0, 40)}</div>
      </div>
      <div className="link-arrow">›</div>
    </a>
  );

  return (
    <div>
      <div className="video-embed-wrap">
        <iframe src={embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={d.caption || 'Video'} />
      </div>
      {d.caption && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>{d.caption}</p>}
    </div>
  );
}

function PortfolioBlock({ block }) {
  const d      = block.data || {};
  const images = d.images   || [];
  const layout = d.layout   || 'grid';

  if (images.length === 0) return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
      🖼 Add image URLs to build your portfolio
    </div>
  );

  return (
    <div>
      {d.heading && <div className="section-label" style={{ textAlign: 'left', marginBottom: 12 }}>{d.heading}</div>}
      {layout === 'carousel'
        ? <div className="portfolio-carousel">
            {images.map((img, i) => <img key={i} src={img.url} alt={img.caption || `Photo ${i + 1}`} className="portfolio-carousel-img" />)}
          </div>
        : <div className="portfolio-grid">
            {images.map((img, i) => <img key={i} src={img.url} alt={img.caption || `Photo ${i + 1}`} className="portfolio-img" />)}
          </div>
      }
    </div>
  );
}

function SocialFeedBlock({ block }) {
  const d     = block.data || {};
  const posts = d.posts    || [];

  function platformIcon(url) {
    if (url.includes('instagram')) return '📸';
    if (url.includes('tiktok'))    return '🎵';
    if (url.includes('twitter') || url.includes('x.com')) return '𝕏';
    if (url.includes('facebook'))  return '📘';
    if (url.includes('linkedin'))  return '💼';
    return '🔗';
  }

  if (posts.length === 0) return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
      📱 Add social post links to display your feed
    </div>
  );

  return (
    <div>
      {d.heading && <div className="section-label" style={{ marginBottom: 12 }}>{d.heading}</div>}
      <div className="social-feed">
        {posts.map((post, i) => (
          <a key={i} href={post.url} target="_blank" rel="noopener noreferrer" className="social-post-card">
            <div className="social-post-icon">{platformIcon(post.url)}</div>
            <div className="social-post-text">
              <div className="social-post-caption">{post.caption || post.url}</div>
              {post.date && <div className="social-post-meta">{post.date}</div>}
            </div>
            <div className="link-arrow" style={{ color: 'var(--muted)', fontSize: 16 }}>›</div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCK EDITOR COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ProfileEditor({ block, rep, onSave, onCancel }) {
  const d = block.data || {};
  const [name,  setName]  = useState(d.name  || rep.name  || '');
  const [title, setTitle] = useState(d.title || rep.title || '');
  const [city,  setCity]  = useState(d.city  || rep.city  || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase.from('reps').update({ name, title, city }).eq('id', rep.id);
    onSave({ ...d, name, title, city });
  }

  return (
    <div className="editor-box">
      <div className="editor-field"><label>Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jake Rivera" /></div>
      <div className="editor-field"><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Solar Energy Consultant" /></div>
      <div className="editor-field"><label>City</label><input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Phoenix, AZ" /></div>
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function HeadlineBlockEditor({ block, rep, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [headline, setHeadline] = useState(d.headline || rep.headline || defaults.headline);
  const [pitch,    setPitch]    = useState(d.pitch    || rep.pitch    || defaults.pitch);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  function handleSave() {
    if (!headline.trim()) { setError('Headline is required.'); return; }
    setSaving(true);
    onSave({ ...d, headline: headline.trim(), pitch: pitch.trim() });
  }

  return (
    <div className="editor-box">
      <div className="editor-field"><label>Headline</label><input type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Your opening hook" /></div>
      <div className="editor-field"><label>Pitch</label><textarea value={pitch} onChange={e => setPitch(e.target.value)} placeholder="A sentence or two about what you do" /></div>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function StatsBlockEditor({ block, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [stats,  setStats]  = useState(d.stats || defaults.stats);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function updateStat(i, field, value) {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function handleSave() {
    if (stats.some(s => !s.number.trim() || !s.label.trim())) { setError('All fields are required.'); return; }
    setSaving(true);
    onSave({ ...d, stats });
  }

  return (
    <div className="editor-box">
      {stats.map((s, i) => (
        <div className="editor-field" key={i}>
          <label>Stat {i + 1}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="text" value={s.number} onChange={e => updateStat(i, 'number', e.target.value)} placeholder="214" style={{ width: '40%' }} />
            <input type="text" value={s.label}  onChange={e => updateStat(i, 'label',  e.target.value)} placeholder="Families Helped" style={{ width: '60%' }} />
          </div>
        </div>
      ))}
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function LeadCaptureBlockEditor({ block, rep, defaults, onSave, onCancel }) {
  const d  = block.data || {};
  const lc = d.lead_capture || rep.lead_capture || {};
  const existing = lc.form || {};
  const df = defaults.form;

  const [label,              setLabel]             = useState(existing.label               || df.label);
  const [headline,           setHeadline]          = useState(existing.headline            || df.headline);
  const [sub,                setSub]               = useState(existing.sub                 || df.sub);
  const [qualifyingQuestion, setQualifyingQuestion]= useState(existing.qualifying_question || df.qualifying_question);
  const [options,            setOptions]           = useState(existing.qualifying_options  || df.qualifying_options);
  const [buttonText,         setButtonText]        = useState(existing.button_text         || df.button_text);
  const [namePlaceholder,    setNamePlaceholder]   = useState(existing.name_placeholder    || 'Your name');
  const [phonePlaceholder,   setPhonePlaceholder]  = useState(existing.phone_placeholder   || 'Phone number');
  const [collectEmail,       setCollectEmail]      = useState(existing.collect_email       || false);
  const [collectZip,         setCollectZip]        = useState(existing.collect_zip         || false);
  const [saving,             setSaving]            = useState(false);

  function handleSave() {
    setSaving(true);
    const lead_capture = {
      ...lc,
      form: {
        label, headline, sub,
        qualifying_question: qualifyingQuestion,
        qualifying_options:  options,
        button_text:         buttonText,
        name_placeholder:    namePlaceholder,
        phone_placeholder:   phonePlaceholder,
        collect_email:       collectEmail,
        collect_zip:         collectZip,
      },
    };
    onSave({ ...d, lead_capture });
  }

  return (
    <div className="editor-box">
      <div className="editor-label" style={{ marginTop: 0 }}>Section Label</div>
      <input className="editor-input" value={label} onChange={e => setLabel(e.target.value)} />
      <div className="editor-label">Headline</div>
      <input className="editor-input" value={headline} onChange={e => setHeadline(e.target.value)} />
      <div className="editor-label">Subtext</div>
      <textarea className="editor-input" rows={2} value={sub} onChange={e => setSub(e.target.value)} style={{ resize: 'vertical' }} />
      <div className="editor-label">Qualifying Question</div>
      <input className="editor-input" value={qualifyingQuestion} onChange={e => setQualifyingQuestion(e.target.value)} />
      <div className="editor-label">Answer Options</div>
      {options.map((opt, i) => (
        <input key={i} className="editor-input" value={opt} onChange={e => {
          const next = [...options]; next[i] = e.target.value; setOptions(next);
        }} />
      ))}
      <div className="editor-label">Button Text</div>
      <input className="editor-input" value={buttonText} onChange={e => setButtonText(e.target.value)} />
      <div className="editor-label">Name Field Placeholder</div>
      <input className="editor-input" value={namePlaceholder} onChange={e => setNamePlaceholder(e.target.value)} />
      <div className="editor-label">Phone Field Placeholder</div>
      <input className="editor-input" value={phonePlaceholder} onChange={e => setPhonePlaceholder(e.target.value)} />
      <div className="editor-label">Optional Fields</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={collectEmail} onChange={e => setCollectEmail(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--sun)', cursor: 'pointer' }} />
          <span style={{ fontSize: 14, color: 'var(--white)' }}>Collect email address</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={collectZip} onChange={e => setCollectZip(e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--sun)', cursor: 'pointer' }} />
          <span style={{ fontSize: 14, color: 'var(--white)' }}>Collect zip code</span>
        </label>
      </div>
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function TestimonialsBlockEditor({ block, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [testimonials, setTestimonials] = useState(d.testimonials || defaults.testimonials);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function updateTestimonial(i, field, value) {
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  }

  function handleSave() {
    if (testimonials.some(t => !t.text.trim() || !t.name.trim())) { setError('Quote and name are required.'); return; }
    setSaving(true);
    onSave({ ...d, testimonials });
  }

  return (
    <div className="editor-box">
      {testimonials.map((t, i) => (
        <div key={i} style={{ marginBottom: i < testimonials.length - 1 ? 24 : 0 }}>
          <div className="editor-field"><label>Quote {i + 1}</label><textarea value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} placeholder="What did they say?" /></div>
          <div className="editor-field"><label>Name</label><input type="text" value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} placeholder="Maria H." /></div>
          <div className="editor-field"><label>Detail</label><input type="text" value={t.detail} onChange={e => updateTestimonial(i, 'detail', e.target.value)} placeholder="Homeowner · Scottsdale, AZ" /></div>
        </div>
      ))}
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function LinksBlockEditor({ block, defaults, onSave, onCancel }) {
  const d = block.data || {};
  const [links,  setLinks]  = useState(d.links || defaults.links);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function updateLink(i, field, value) {
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  }

  function handleSave() {
    if (links.some(l => !l.title.trim())) { setError('Each link needs a title.'); return; }
    setSaving(true);
    onSave({ ...d, links });
  }

  const inp = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--white)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none' };

  return (
    <div className="editor-box">
      {links.map((l, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 0 }}>Link {i + 1}</label>
            <button onClick={() => setLinks(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 13 }}>Remove</button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input type="text" value={l.icon}  onChange={e => updateLink(i, 'icon',  e.target.value)} placeholder="📅" style={{ ...inp, width: '20%' }} />
            <input type="text" value={l.title} onChange={e => updateLink(i, 'title', e.target.value)} placeholder="Title" style={{ ...inp, width: '80%' }} />
          </div>
          <input type="text" value={l.sub} onChange={e => updateLink(i, 'sub', e.target.value)} placeholder="Subtitle"    style={{ ...inp, marginBottom: 8 }} />
          <input type="text" value={l.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://..." style={inp} />
        </div>
      ))}
      <button onClick={() => setLinks(prev => [...prev, { icon: '🔗', title: '', sub: '', url: '' }])} style={{ width: '100%', padding: 10, marginBottom: 16, background: 'transparent', border: '1px dashed var(--card-border)', borderRadius: 10, color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
        + Add Another Link
      </button>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function TextBlockEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [body,    setBody]    = useState(d.body    || '');
  const [saving,  setSaving]  = useState(false);

  return (
    <div className="editor-box">
      <div className="editor-field">
        <label>Heading <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input type="text" value={heading} onChange={e => setHeading(e.target.value)} placeholder="About Me" />
      </div>
      <div className="editor-field">
        <label>Body Text</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write anything you'd like visitors to know..." style={{ minHeight: 120 }} />
      </div>
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={() => { setSaving(true); onSave({ ...d, heading, body }); }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function VideoBlockEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [url,     setUrl]     = useState(d.url     || '');
  const [caption, setCaption] = useState(d.caption || '');
  const [saving,  setSaving]  = useState(false);

  return (
    <div className="editor-box">
      <div className="editor-field"><label>Video URL</label><input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="YouTube or TikTok URL" /></div>
      <div className="editor-field">
        <label>Caption <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Watch my explainer video" />
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>YouTube videos embed directly. TikTok links open in a new tab.</p>
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={() => { setSaving(true); onSave({ ...d, url: url.trim(), caption: caption.trim() }); }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function PortfolioBlockEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [layout,  setLayout]  = useState(d.layout  || 'grid');
  const [images,  setImages]  = useState(d.images  || [{ url: '', caption: '' }]);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  function updateImage(i, field, value) {
    setImages(prev => prev.map((img, idx) => idx === i ? { ...img, [field]: value } : img));
  }

  function handleSave() {
    const valid = images.filter(img => img.url.trim());
    if (valid.length === 0) { setError('Add at least one image URL.'); return; }
    setSaving(true);
    onSave({ ...d, heading, layout, images: valid });
  }

  const inp = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--white)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none', marginBottom: 6, display: 'block' };

  return (
    <div className="editor-box">
      <div className="editor-field">
        <label>Section Heading <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input type="text" value={heading} onChange={e => setHeading(e.target.value)} placeholder="My Work" />
      </div>
      <div className="editor-label" style={{ marginTop: 0 }}>Layout</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['grid', 'carousel'].map(opt => (
          <button key={opt} type="button" onClick={() => setLayout(opt)} style={{ flex: 1, padding: 10, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, border: layout === opt ? '1px solid var(--sun)' : '1px solid var(--card-border)', background: layout === opt ? 'rgba(245,166,35,0.08)' : 'transparent', color: layout === opt ? 'var(--sun)' : 'var(--muted)' }}>
            {opt === 'grid' ? '⊞ Grid' : '↔ Carousel'}
          </button>
        ))}
      </div>
      <div className="editor-label">Images</div>
      {images.map((img, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Image {i + 1}</span>
            {images.length > 1 && <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12 }}>Remove</button>}
          </div>
          <input style={inp} value={img.url}     onChange={e => updateImage(i, 'url',     e.target.value)} placeholder="https://... (image URL)" />
          <input style={inp} value={img.caption} onChange={e => updateImage(i, 'caption', e.target.value)} placeholder="Caption (optional)" />
        </div>
      ))}
      <button onClick={() => setImages(prev => [...prev, { url: '', caption: '' }])} style={{ width: '100%', padding: 10, marginBottom: 16, background: 'transparent', border: '1px dashed var(--card-border)', borderRadius: 10, color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Image</button>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

function SocialFeedBlockEditor({ block, onSave, onCancel }) {
  const d = block.data || {};
  const [heading, setHeading] = useState(d.heading || '');
  const [posts,   setPosts]   = useState(d.posts   || [{ url: '', caption: '', date: '' }]);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  function updatePost(i, field, value) {
    setPosts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  function handleSave() {
    const valid = posts.filter(p => p.url.trim());
    if (valid.length === 0) { setError('Add at least one post URL.'); return; }
    setSaving(true);
    onSave({ ...d, heading, posts: valid });
  }

  const inp = { width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: 10, color: 'var(--white)', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none', marginBottom: 6, display: 'block' };

  return (
    <div className="editor-box">
      <div className="editor-field">
        <label>Section Heading <span style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input type="text" value={heading} onChange={e => setHeading(e.target.value)} placeholder="Follow Along" />
      </div>
      <div className="editor-label">Posts</div>
      {posts.map((p, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Post {i + 1}</span>
            {posts.length > 1 && <button onClick={() => setPosts(prev => prev.filter((_, idx) => idx !== i))} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12 }}>Remove</button>}
          </div>
          <input style={inp} value={p.url}     onChange={e => updatePost(i, 'url',     e.target.value)} placeholder="https://instagram.com/p/..." />
          <input style={inp} value={p.caption} onChange={e => updatePost(i, 'caption', e.target.value)} placeholder="Caption or description" />
          <input style={inp} value={p.date}    onChange={e => updatePost(i, 'date',    e.target.value)} placeholder="Date (e.g. April 2026)" />
        </div>
      ))}
      <button onClick={() => setPosts(prev => [...prev, { url: '', caption: '', date: '' }])} style={{ width: '100%', padding: 10, marginBottom: 16, background: 'transparent', border: '1px dashed var(--card-border)', borderRadius: 10, color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add Post</button>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <div className="editor-actions">
        <button className="editor-cancel" onClick={onCancel}>Cancel</button>
        <button className="editor-save" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
}

// ─── Add Block zone & picker ──────────────────────────────────────────────────

const BLOCK_TYPES = [
  { category: 'Show who you are', items: [
    { type: 'profile',   icon: '🧑', label: 'Profile',    desc: 'Name, photo, title, city' },
    { type: 'headline',  icon: '✍️', label: 'Headline',   desc: 'Opening hook and pitch' },
    { type: 'text',      icon: '📝', label: 'Text / Bio', desc: 'Freeform paragraph' },
    { type: 'portfolio', icon: '🖼', label: 'Portfolio',  desc: 'Image grid or carousel' },
  ]},
  { category: 'Capture leads', items: [
    { type: 'lead_capture', icon: '📋', label: 'Lead Form', desc: 'Qualifying question + contact form' },
  ]},
  { category: 'Build trust', items: [
    { type: 'stats',        icon: '📊', label: 'Stats',        desc: 'Three proof numbers' },
    { type: 'testimonials', icon: '⭐', label: 'Testimonials', desc: 'Customer review cards' },
    { type: 'social_feed',  icon: '📱', label: 'Social Feed',  desc: 'Links to your social posts' },
  ]},
  { category: 'Drive action', items: [
    { type: 'links', icon: '🔗', label: 'Links', desc: 'Button-style link cards' },
    { type: 'video', icon: '🎥', label: 'Video', desc: 'YouTube or TikTok embed' },
  ]},
  { category: 'Coming soon', locked: true, items: [
    { type: 'ai_chat',     icon: '🤖', label: 'AI Chat',            desc: 'Let AI qualify leads for you' },
    { type: 'appointment', icon: '📅', label: 'Appointment Booker', desc: 'Let visitors book directly' },
  ]},
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function AddBlockZone({ onInsert }) {
  const [open, setOpen] = useState(false);

  function handlePick(type) {
    onInsert({ id: generateId(), type, data: {}, visible: true });
    setOpen(false);
  }

  return (
    <div style={{ marginBottom: 4 }}>
      <div className="add-block-zone" style={{ opacity: open ? 1 : undefined }} onClick={() => setOpen(true)}>
        <div className="add-block-zone-line" />
        <div className="add-block-zone-btn">+</div>
        <div className="add-block-zone-line" />
      </div>

      {open && (
        <div style={{ background: 'var(--sky-mid)', border: '1px solid var(--card-border)', borderRadius: 20, padding: '20px 16px', marginTop: 4, marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>Add a block</div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
          </div>
          {BLOCK_TYPES.map(group => (
            <div key={group.category} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>{group.category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.items.map(item => (
                  <button key={item.type} onClick={() => !group.locked && handlePick(item.type)} disabled={group.locked}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, cursor: group.locked ? 'default' : 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', textAlign: 'left', width: '100%', fontFamily: 'inherit', opacity: group.locked ? 0.45 : 1 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 1 }}>
                        {item.label}
                        {group.locked && <span style={{ fontSize: 9, letterSpacing: 1, color: 'var(--accent)', fontWeight: 700, marginLeft: 6 }}>SOON</span>}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{item.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function QRSection() {
  return (
    <div className="qr-section">
      <div className="qr-placeholder">
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4"  y="4"  width="22" height="22" fill="none" stroke="#0A1628" strokeWidth="3"/>
          <rect x="9"  y="9"  width="12" height="12" fill="#0A1628"/>
          <rect x="34" y="4"  width="22" height="22" fill="none" stroke="#0A1628" strokeWidth="3"/>
          <rect x="39" y="9"  width="12" height="12" fill="#0A1628"/>
          <rect x="4"  y="34" width="22" height="22" fill="none" stroke="#0A1628" strokeWidth="3"/>
          <rect x="9"  y="39" width="12" height="12" fill="#0A1628"/>
          <rect x="34" y="34" width="4"  height="4"  fill="#0A1628"/>
          <rect x="40" y="34" width="4"  height="4"  fill="#0A1628"/>
          <rect x="46" y="34" width="10" height="4"  fill="#0A1628"/>
          <rect x="34" y="40" width="10" height="4"  fill="#0A1628"/>
          <rect x="46" y="40" width="4"  height="4"  fill="#0A1628"/>
          <rect x="34" y="46" width="4"  height="10" fill="#0A1628"/>
          <rect x="40" y="46" width="4"  height="4"  fill="#0A1628"/>
          <rect x="46" y="46" width="10" height="4"  fill="#0A1628"/>
          <rect x="46" y="52" width="4"  height="4"  fill="#0A1628"/>
        </svg>
      </div>
      <div>
        <div className="qr-title">Share This Page</div>
        <div className="qr-sub">Print this QR code on your leave-behinds. Homeowners scan it later — you get the lead.</div>
      </div>
    </div>
  );
}

function ShareCard({ slug, isOwner }) {
  const [copied, setCopied] = useState(false);
  const fullUrl    = `https://propages.com/${slug}`;
  const displayUrl = `propages.com/${slug}`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (isOwner) {
    return (
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '18px 20px', marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Your Link</div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--card-border)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{displayUrl}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleCopy} style={{ flex: 1, padding: 11, borderRadius: 10, border: '1px solid', borderColor: copied ? 'rgba(0,229,190,0.4)' : 'var(--card-border)', background: copied ? 'rgba(0,229,190,0.08)' : 'rgba(255,255,255,0.04)', color: copied ? 'var(--accent)' : 'var(--white)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s ease' }}>
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={() => navigator.share({ title: 'My ProPage', url: fullUrl })} style={{ flex: 1, padding: 11, borderRadius: 10, border: '1px solid var(--card-border)', background: 'rgba(123,111,232,0.08)', color: '#7B6FE8', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>↗ Share</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '18px 20px', marginBottom: 28, textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>Want a page like this?</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>ProPages gives every rep their own lead-capturing page — live in 60 seconds.</div>
      <a href={`https://propages.com/?utm_source=propage&utm_medium=refercard&utm_content=${slug}`} style={{ display: 'inline-block', padding: '11px 24px', borderRadius: 10, background: 'linear-gradient(135deg, var(--sun), var(--sun-bright))', color: 'var(--sky)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
        Get Your Own ProPage →
      </a>
    </div>
  );
}

function WelcomeBanner({ slug, onDismiss }) {
  function handleDismiss() {
    localStorage.setItem(`pp_welcomed_${slug}`, 'true');
    onDismiss();
  }
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(123,111,232,0.15), rgba(0,229,190,0.08))', border: '1px solid rgba(123,111,232,0.25)', borderRadius: 14, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>👋</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F8F5EE', marginBottom: 4 }}>This is your page — make it yours.</div>
        <div style={{ fontSize: 13, color: '#8899AA', lineHeight: 1.6 }}>Tap ✏️ to edit any block. Use the controls above each block to reorder, hide, or delete.</div>
      </div>
      <button onClick={handleDismiss} style={{ background: 'transparent', border: 'none', color: '#445566', fontSize: 16, cursor: 'pointer', padding: 0, lineHeight: 1, flexShrink: 0 }}>✕</button>
    </div>
  );
}

function LiveToast({ slug, visible, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const fullUrl    = `https://propages.com/${slug}`;
  const displayUrl = `propages.com/${slug}`;

  if (!visible) return null;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: '#112240', border: '1px solid rgba(0,229,190,0.3)', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)', minWidth: 280, maxWidth: 'calc(100vw - 48px)', animation: 'fadeUp 0.4s ease forwards' }}>
      <div style={{ fontSize: 20 }}>🎉</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#00E5BE', marginBottom: 2 }}>Your page is live!</div>
        <div style={{ fontSize: 12, color: '#8899AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayUrl}</div>
      </div>
      {typeof navigator !== 'undefined' && navigator.share
        ? <button onClick={() => navigator.share({ title: 'My ProPage', url: fullUrl })} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#F8F5EE', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>Share</button>
        : <button onClick={handleCopy} style={{ background: copied ? 'rgba(0,229,190,0.15)' : 'rgba(255,255,255,0.06)', border: '1px solid', borderColor: copied ? 'rgba(0,229,190,0.4)' : 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: copied ? '#00E5BE' : '#F8F5EE', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>{copied ? '✓ Copied!' : 'Copy link'}</button>
      }
      <button onClick={onDismiss} style={{ background: 'transparent', border: 'none', color: '#445566', fontSize: 16, cursor: 'pointer', padding: '0 0 0 4px', lineHeight: 1, flexShrink: 0 }}>✕</button>
    </div>
  );
}

function OwnerMenu({ editMode, onToggleEdit, canUndo, onUndo }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="owner-menu-btn" onClick={() => setOpen(o => !o)}>{open ? '✕' : '☰'}</button>
      {open && (
        <div className="owner-menu">
          <div className={`owner-menu-item${editMode ? ' active' : ''}`} onClick={() => { onToggleEdit(); setOpen(false); }}>
            ✏️ {editMode ? 'Exit Edit Mode' : 'Edit Page'}
          </div>
          {editMode && (
            <div className="owner-menu-item" onClick={() => { if (canUndo) { onUndo(); setOpen(false); } }} style={{ opacity: canUndo ? 1 : 0.35, cursor: canUndo ? 'pointer' : 'default' }}>
              ↩ Undo Last Save
            </div>
          )}
          <div className="owner-menu-item" onClick={() => window.location.href = '/dashboard'}>📋 My Leads</div>
          <div className="owner-menu-item" onClick={() => supabase.auth.signOut().then(() => window.location.href = '/')}>🚪 Sign Out</div>
        </div>
      )}
    </>
  );
}

function LeadForm({ repId, repName, qualifyingQuestion, qualifyingOptions, buttonText, namePlaceholder, phonePlaceholder, collectEmail, collectZip }) {
  const [name,      setName]      = useState('');
  const [phone,     setPhone]     = useState('');
  const [email,     setEmail]     = useState('');
  const [zip,       setZip]       = useState('');
  const [ownership, setOwnership] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  async function handleSubmit() {
    if (!name.trim() || !phone.trim()) { setError('Please fill in your name and phone number.'); return; }
    if (collectEmail && !email.trim()) { setError('Please fill in your email address.'); return; }
    if (collectZip   && !zip.trim())   { setError('Please fill in your zip code.'); return; }
    setError('');
    const payload = {
      name: name.trim(), phone: phone.trim(), rep_id: repId,
      notes: ownership ? `Home ownership: ${ownership}` : null,
      ...(collectEmail && { email: email.trim() }),
      ...(collectZip   && { zip: zip.trim() }),
    };
    const { error: dbError } = await supabase.from('leads').insert([payload]);
    if (dbError) { setError('Something went wrong. Please try again.'); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="success-state">
        <div className="success-icon">✅</div>
        <div className="success-title">You&apos;re All Set</div>
        <div className="success-sub">{repName} will be in touch shortly.</div>
      </div>
    );
  }

  return (
    <>
      <div className="qualifying-q">
        <p>{qualifyingQuestion}</p>
        <div className="q-options">
          {qualifyingOptions.map(option => (
            <button key={option} className={`q-option${ownership === option ? ' selected' : ''}`} onClick={() => setOwnership(option)}>{option}</button>
          ))}
        </div>
      </div>
      <div className="field-group">
        <div className="field"><input type="text" placeholder={namePlaceholder  || 'Your name'}    value={name}  onChange={e => setName(e.target.value)} /></div>
        <div className="field"><input type="tel"  placeholder={phonePlaceholder || 'Phone number'} value={phone} onChange={e => setPhone(e.target.value)} /></div>
        {collectEmail && <div className="field"><input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} /></div>}
        {collectZip   && <div className="field"><input type="text"  placeholder="Zip code"      value={zip}   onChange={e => setZip(e.target.value)} /></div>}
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button className="submit-btn" onClick={handleSubmit}>{buttonText}</button>
    </>
  );
}

function BadgePill({ tier }) {
  const config = {
    pro:       { label: 'PRO',       color: '#8899AA', bg: 'rgba(136,153,170,0.12)', border: 'rgba(136,153,170,0.3)'  },
    verified:  { label: 'VERIFIED',  color: '#00E5BE', bg: 'rgba(0,229,190,0.10)',   border: 'rgba(0,229,190,0.3)'    },
    certified: { label: 'CERTIFIED', color: '#FFD166', bg: 'rgba(255,209,102,0.10)', border: 'rgba(255,209,102,0.35)' },
  };
  const c = config[tier];
  if (!c) return null;
  return (
    <a href={`/certified#${tier}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, border: `1px solid ${c.border}`, background: c.bg, marginBottom: 20, textDecoration: 'none', cursor: 'pointer' }}>
      <span style={{ fontSize: 11, color: c.color }}>✦</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 12, letterSpacing: 2, color: c.color }}>PROPAGES {c.label}</span>
    </a>
  );
}

// ─── Server-side data fetch ───────────────────────────────────────────────────

export async function getServerSideProps({ params }) {
  const slug = params.slug;
  const reserved = ['signup', 'setup', 'envtest', 'api', 'dashboard', 'reset', 'certified'];
  if (reserved.includes(slug)) {
    return { redirect: { destination: `/${slug}`, permanent: false } };
  }
  const { data, error } = await supabase.from('reps').select('*').eq('slug', slug).single();
  if (error || !data) return { props: { rep: null } };
  return { props: { rep: data } };
}