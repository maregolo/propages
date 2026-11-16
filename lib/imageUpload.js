// Photo uploads from the browser: shrink, then store in Supabase Storage.
//
//   const url = await uploadImage(file, { slug: rep.slug, kind: 'portfolio' });
//
// Every photo is resized on the rep's device before upload (a 10 MB phone photo
// becomes ~200–400 KB), re-encoded as JPEG (which also drops EXIF data such as
// GPS location), and stored in the existing public `avatars` bucket with the
// same flat `<slug>-…` naming the profile photo has always used.

import { supabase } from './supabase';

const BUCKET = 'avatars';
export const MAX_SOURCE_MB = 25;

const PRESETS = {
  avatar:    { max: 800,  quality: 0.85 },  // shown at ~72–160px; 800 covers retina
  portfolio: { max: 1600, quality: 0.82 },  // full-width on phones, tap-to-view later
};

export class ImageError extends Error {}

function decodeWithImg(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode')); };
    img.src = url;
  });
}

async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { /* fall through */ }
  }
  return decodeWithImg(file);
}

export async function shrinkImage(file, kind = 'portfolio') {
  if (!file || !/^image\//.test(file.type || 'image/')) throw new ImageError("That file isn't a photo.");
  if (file.size > MAX_SOURCE_MB * 1024 * 1024) throw new ImageError(`That photo is over ${MAX_SOURCE_MB} MB. Try a smaller one.`);

  const { max, quality } = PRESETS[kind] || PRESETS.portfolio;
  let src;
  try { src = await decode(file); } catch (e) {
    throw new ImageError("We couldn't read that photo. Try a JPG or PNG. (On iPhone: Settings › Camera › Formats › Most Compatible.)");
  }
  const w = src.width || src.naturalWidth;
  const h = src.height || src.naturalHeight;
  const scale = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';                 // PNG transparency → white, not black
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  if (src.close) src.close();

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob) throw new ImageError("We couldn't process that photo. Try another one.");
  return blob;
}

export async function uploadImage(file, { slug, kind = 'portfolio' }) {
  const blob = await shrinkImage(file, kind);
  const rand = Math.random().toString(36).slice(2, 8);
  const path = `${slug || 'rep'}-${kind}-${Date.now()}-${rand}.jpg`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
  });
  if (error) throw new ImageError('Upload failed. Check your connection and try again.');
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
