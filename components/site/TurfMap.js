// Turf map backgrounds from the homepage board ("spark: both"): a faint,
// rotated street grid with one claimed territory (dashed mint) and lead pins
// (coral). Purely decorative. Each map is positioned by the className the
// page passes in. <Route> draws the dashed route line that runs section to
// section down the page.

export function Route({ d, className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={className}>
      <path d={d} fill="none" stroke="#0F7A4A" strokeOpacity="0.38" strokeWidth="1.5"
        strokeDasharray="6 6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function HeroMap({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 846" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs><radialGradient id="tm-hero-g" cx="0.72" cy="0.3" r="0.6"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#000000"/></radialGradient><mask id="tm-hero-m"><rect width="640" height="846" fill="url(#tm-hero-g)"/></mask></defs>
      <g mask="url(#tm-hero-m)"><g transform="rotate(-12 320 423)" fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1.25">
      <path d="M-100 -200V1050M-10 -200V1050M90 -200V1050M175 -200V1050M270 -200V1050M455 -200V1050M540 -200V1050M640 -200V1050M735 -200V1050"/>
      <path d="M-200 -40H850M-200 60H850M-200 150H850M-200 255H850M-200 345H850M-200 545H850M-200 630H850M-200 735H850M-200 830H850M-200 930H850"/>
      <path d="M360 -200V1050M-200 440H850" strokeWidth="3" strokeOpacity="0.08"/>
      <polygon points="360,60 540,60 540,150 640,150 640,345 455,345 455,255 360,255" fill="#8EF0B8" fillOpacity="0.06" stroke="#8EF0B8" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g stroke="none" fillOpacity="0.75"><circle cx="410" cy="108" r="4" fill="#FFB59C"/><circle cx="500" cy="205" r="4" fill="#FFB59C"/><circle cx="595" cy="300" r="4" fill="#FFB59C"/><circle cx="420" cy="215" r="4" fill="#8EF0B8"/></g>
      </g></g>
      </svg>
  );
}

export function ProblemMap({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs><radialGradient id="tm-prob-g" cx="0.62" cy="0.55" r="0.55"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#000000"/></radialGradient><mask id="tm-prob-m"><rect width="600" height="500" fill="url(#tm-prob-g)"/></mask></defs>
      <g mask="url(#tm-prob-m)"><g transform="rotate(-12 300 250)" fill="none" stroke="#222A33" strokeOpacity="0.07" strokeWidth="1.25">
      <path d="M-200 30H800M-200 120H800M-200 215H800M-200 300H800M-200 395H800M-200 485H800"/>
      <path d="M20 -200V700M110 -200V700M205 -200V700M300 -200V700M395 -200V700M480 -200V700M575 -200V700"/>
      <polygon points="300,120 480,120 480,215 575,215 575,395 395,395 395,300 300,300" fill="#0F7A4A" fillOpacity="0.04" stroke="#0F7A4A" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g stroke="none" fill="#B23E22" fillOpacity="0.5"><circle cx="350" cy="170" r="4"/><circle cx="440" cy="255" r="4"/><circle cx="520" cy="345" r="4"/></g>
      </g></g>
      </svg>
  );
}

export function FeaturesMap({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs><radialGradient id="tm-feat-g" cx="0.3" cy="0.35" r="0.55"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#000000"/></radialGradient><mask id="tm-feat-m"><rect width="600" height="500" fill="url(#tm-feat-g)"/></mask></defs>
      <g mask="url(#tm-feat-m)"><g transform="rotate(-12 300 250)" fill="none" stroke="#222A33" strokeOpacity="0.07" strokeWidth="1.25">
      <path d="M-200 -20H800M-200 70H800M-200 165H800M-200 250H800M-200 345H800M-200 435H800M-200 530H800"/>
      <path d="M60 -200V700M150 -200V700M245 -200V700M340 -200V700M435 -200V700M520 -200V700M615 -200V700"/>
      <polygon points="80,70 260,70 260,345 165,345 165,250 80,250" fill="#0F7A4A" fillOpacity="0.04" stroke="#0F7A4A" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g stroke="none" fill="#B23E22" fillOpacity="0.5"><circle cx="215" cy="120" r="4"/><circle cx="130" cy="205" r="4"/><circle cx="210" cy="300" r="4"/></g>
      </g></g>
      </svg>
  );
}

export function PricingMap({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 520" preserveAspectRatio="xMinYMax slice" className={className}>
      <defs><radialGradient id="tm-price-g" cx="0.4" cy="0.78" r="0.55"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#000000"/></radialGradient><mask id="tm-price-m"><rect width="640" height="520" fill="url(#tm-price-g)"/></mask></defs>
      <g mask="url(#tm-price-m)"><g transform="rotate(-12 320 260)" fill="none" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="1.25">
      <path d="M-60 -200V800M40 -200V800M135 -200V800M235 -200V800M330 -200V800M430 -200V800M525 -200V800"/>
      <path d="M-200 40H860M-200 130H860M-200 225H860M-200 320H860M-200 415H860M-200 505H860"/>
      <polygon points="135,320 330,320 330,415 430,415 430,600 135,600" fill="#8EF0B8" fillOpacity="0.05" stroke="#8EF0B8" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g stroke="none" fillOpacity="0.7"><circle cx="190" cy="370" r="4" fill="#FFB59C"/><circle cx="290" cy="455" r="4" fill="#FFB59C"/><circle cx="385" cy="480" r="4" fill="#8EF0B8"/></g>
      </g></g>
      </svg>
  );
}

export function ClosingMap({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <defs><radialGradient id="tm-inv-g" cx="0.45" cy="0.5" r="0.55"><stop offset="0" stopColor="#FFFFFF"/><stop offset="1" stopColor="#000000"/></radialGradient><mask id="tm-inv-m"><rect width="600" height="500" fill="url(#tm-inv-g)"/></mask></defs>
      <g mask="url(#tm-inv-m)"><g transform="rotate(-12 300 250)" fill="none" stroke="#222A33" strokeOpacity="0.07" strokeWidth="1.25">
      <path d="M-200 25H800M-200 115H800M-200 210H800M-200 295H800M-200 390H800M-200 480H800"/>
      <path d="M15 -200V700M105 -200V700M200 -200V700M295 -200V700M390 -200V700M475 -200V700M570 -200V700"/>
      <polygon points="105,115 295,115 295,210 390,210 390,390 200,390 200,295 105,295" fill="#0F7A4A" fillOpacity="0.04" stroke="#0F7A4A" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 6"/>
      <g stroke="none" fill="#B23E22" fillOpacity="0.5"><circle cx="160" cy="165" r="4"/><circle cx="250" cy="250" r="4"/><circle cx="340" cy="340" r="4"/></g>
      </g></g>
      </svg>
  );
}
