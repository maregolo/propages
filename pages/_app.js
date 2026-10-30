import "@/styles/globals.css";
import "@/styles/tokens.css";
import { outfit } from "@/lib/fonts";

// Outfit is exposed as --font-outfit on :root (no wrapper element, so page
// layouts are untouched). The font file only downloads on pages that use it.
export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root { --font-outfit: ${outfit.style.fontFamily}; }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
