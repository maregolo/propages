// Link-preview tags for marketing pages (homepage and industry landing pages).
// Rep pages set their own, so this is not global.
import Head from 'next/head';

import { SITE_URL } from '../lib/site';

export const SITE = SITE_URL;

export default function SiteMeta({
  title = 'ProPages — the link-in-bio built for sales reps',
  description = 'One link that turns your followers into booked appointments.',
  path = '/',
}) {
  const url = SITE + path;
  return (
    <Head>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ProPages" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={SITE + '/og-image.png'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={SITE + '/og-image.png'} />
    </Head>
  );
}
