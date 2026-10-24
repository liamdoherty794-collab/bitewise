export function compressImage(source: Blob | HTMLVideoElement, max = 960, quality = 0.68): Promise<string> {
  return new Promise((resolve, reject) => {
    if (source instanceof HTMLVideoElement) {
      try {
        resolve(draw(source.videoWidth, source.videoHeight, (ctx, w, h) => ctx.drawImage(source, 0, 0, w, h), max, quality));
      } catch {
        reject(new Error("Couldn't capture that frame."));
      }
      return;
    }
    const url = URL.createObjectURL(source);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        resolve(draw(img.naturalWidth, img.naturalHeight, (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h), max, quality));
      } catch {
        reject(new Error("Couldn't read that photo."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that photo."));
    };
    img.src = url;
  });
}

function draw(
  width: number,
  height: number,
  paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  max: number,
  quality: number,
) {
  const scale = Math.min(1, max / Math.max(width || 1, height || 1));
  const w = Math.max(1, Math.round((width || max) * scale));
  const h = Math.max(1, Math.round((height || max) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Couldn't read that photo.");
  paint(ctx, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}
