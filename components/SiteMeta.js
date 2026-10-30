// Link-preview tags for marketing pages (homepage and industry landing pages).
// Rep pages set their own, so this is not global.
import Head from 'next/head';

// Production only lives at propages.vercel.app until DNS is set up; set
// NEXT_PUBLIC_SITE_URL in Vercel once propages.pro / propages.com point here.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://propages.vercel.app';

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
