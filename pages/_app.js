import "@/styles/globals.css";
import "@/styles/tokens.css";
import "@/styles/site.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { outfit } from "@/lib/fonts";

// Safety net for email confirmation links. If Supabase sends someone to a
// page other than /welcome (it falls back to the Site URL when the requested
// redirect isn't on its allow list), the link's result is still in the URL
// hash. Forward it to /welcome, which finishes sign-in or explains an expired
// link. Recovery (password reset) links are left alone: /reset handles those.
function isConfirmHash(hash) {
  const p = new URLSearchParams(hash.replace(/^#/, ""));
  if (p.get("type") === "recovery") return false;
  return p.get("type") === "signup" || p.get("error_code") === "otp_expired" || p.get("error") === "access_denied";
}

// Outfit is exposed as --font-outfit on :root (no wrapper element, so page
// layouts are untouched). The font file only downloads on pages that use it.
export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const { hash, pathname } = window.location;
    if (pathname !== "/welcome" && pathname !== "/reset" && hash && isConfirmHash(hash)) {
      router.replace(`/welcome${hash}`);
    }
  }, [router]);

  return (
    <>
      <style jsx global>{`
        :root { --font-outfit: ${outfit.style.fontFamily}; }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
