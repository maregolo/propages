export default function EnvTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log('url:', url);
  console.log('key:', key);
  return (
    <div style={{color: 'white'}}>
      <p>URL: {url ?? 'MISSING'}</p>
      <p>KEY: {key ?? 'MISSING'}</p>
    </div>
  );
}