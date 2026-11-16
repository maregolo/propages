// US states for the location picker (setup step 1 and the hero editor).
// The location is still stored as one text column, reps.city:
//   city + state  → "Phoenix, AZ"
//   state only    → "Arizona"
//   city only     → "Phoenix"   (older free-text values stay as they were)

export const US_STATES = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['PR', 'Puerto Rico'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'],
  ['SD', 'South Dakota'], ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'],
  ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];

const BY_CODE = Object.fromEntries(US_STATES);
const BY_NAME = Object.fromEntries(US_STATES.map(([c, n]) => [n.toLowerCase(), c]));

export function formatLocation(city, state) {
  const c = (city || '').trim().replace(/,+$/, '');
  if (c && state) return `${c}, ${state}`;
  if (state) return BY_CODE[state] || '';
  return c;
}

// "Phoenix, AZ" → { city: 'Phoenix', state: 'AZ' }; "Arizona" → { city: '', state: 'AZ' }.
export function parseLocation(value) {
  const v = (value || '').trim();
  if (!v) return { city: '', state: '' };
  const m = v.match(/^(.*?),\s*([A-Za-z]{2}|[A-Za-z .]+)$/);
  if (m) {
    const code = m[2].length === 2 ? m[2].toUpperCase() : BY_NAME[m[2].toLowerCase()];
    if (code && BY_CODE[code]) return { city: m[1].trim(), state: code };
  }
  if (BY_NAME[v.toLowerCase()]) return { city: '', state: BY_NAME[v.toLowerCase()] };
  return { city: v, state: '' };
}
