import { useEffect, useRef, useState, type ReactNode } from "react";
import { Camera, ImagePlus, ScanLine, X } from "lucide-react";
import { compressImage } from "@/lib/nara/image";

export function Scanner({
  mode,
  onMode,
  onClose,
  onBarcode,
  onPhoto,
  onManual,
  mealError,
  mealBusy,
  photosLeft,
}: {
  mode: "choose" | "barcode" | "meal";
  onMode: (mode: "choose" | "barcode" | "meal") => void;
  onClose: () => void;
  onBarcode: (code: string) => void;
  onPhoto: (dataUrl: string) => void;
  onManual: () => void;
  mealError: string | null;
  mealBusy: boolean;
  photosLeft: number | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const onBarcodeRef = useRef(onBarcode);
  onBarcodeRef.current = onBarcode;
  const [camError, setCamError] = useState<string | null>(null);
  const [manual, setManual] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "barcode" && mode !== "meal") return;
    const video = videoRef.current;
    if (!video) return;
    let stopped = false;
    let controls: { stop: () => void } | null = null;

    const halt = () => {
      stopped = true;
      controls?.stop();
      const stream = video.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    };

    void (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        });
        if (stopped) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        await video.play();
        if (mode !== "barcode") {
          controls = { stop: () => stream.getTracks().forEach((track) => track.stop()) };
          return;
        }
        const Detector = (
          window as Window & {
            BarcodeDetector?: new (opts: { formats: string[] }) => {
              detect: (src: HTMLVideoElement) => Promise<{ rawValue?: string }[]>;
            };
          }
        ).BarcodeDetector;
        let native: InstanceType<NonNullable<typeof Detector>> | null = null;
        if (Detector) {
          try {
            native = new Detector({
              formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
            });
            await native.detect(video);
          } catch {
            native = null;
          }
        }
        if (native) {
          const detector = native;
          const loop = async () => {
            if (stopped) return;
            try {
              const codes = await detector.detect(video);
              const value = codes?.find((code) => code.rawValue)?.rawValue;
              if (value) {
                stopped = true;
                onBarcodeRef.current(value);
                return;
              }
            } catch {
              /* frame not ready */
            }
            if (!stopped) requestAnimationFrame(() => void loop());
          };
          void loop();
          controls = { stop: () => stream.getTracks().forEach((track) => track.stop()) };
          return;
        }
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (stopped) return;
        const reader = new BrowserMultiFormatReader();
        const zx = await reader.decodeFromVideoElement(video, (result) => {
          const text = result?.getText();
          if (stopped || !text) return;
          stopped = true;
          zx.stop();
          onBarcodeRef.current(text);
        });
        controls = zx;
      } catch (error) {
        if (!stopped) setCamError(cameraMessage(error));
      }
    })();

    return halt;
  }, [mode]);

  async function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setPhotoError("Camera isn't ready. Upload a photo instead.");
      return;
    }
    try {
      const dataUrl = await compressImage(video);
      onPhoto(dataUrl);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Couldn't capture that frame.");
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      onPhoto(dataUrl);
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Couldn't read that photo.");
    }
  }

  if (mode === "choose") {
    return (
      <div className="scrim fixed inset-0 z-50 flex items-end justify-center">
        <div className="sheet-in w-full max-w-md rounded-t-3xl bg-paper px-5 pb-8 pt-4">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl">What are you scanning?</h2>
            <button type="button" className="press grid h-11 w-11 place-items-center rounded-full bg-moss" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            <Choice icon={<ScanLine className="h-6 w-6" />} title="Packaged food" copy="Read the barcode and score the label." onClick={() => onMode("barcode")} />
            <Choice
              icon={<Camera className="h-6 w-6" />}
              title="A meal"
              copy={
                photosLeft === 0
                  ? "Today's 3 photos are used. You can still type the meal."
                  : photosLeft == null
                    ? "Photograph the plate and estimate the macros."
                    : `${photosLeft} photo ${photosLeft === 1 ? "estimate" : "estimates"} left today.`
              }
              onClick={() => onMode("meal")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-camera text-camera-fg">
      <div className="flex h-full w-full max-w-md flex-col">
        <div className="flex items-center justify-between px-4 py-4">
          <button type="button" className="press grid h-11 w-11 place-items-center rounded-full bg-camera-fg/10" onClick={onClose} aria-label="Close scanner">
            <X className="h-5 w-5" />
          </button>
          <p className="font-medium">{mode === "barcode" ? "Barcode" : "Meal"}</p>
          <button type="button" className="press text-sm font-medium text-camera-fg/80" onClick={() => onMode("choose")}>
            Switch
          </button>
        </div>
        <div className="relative mx-4 flex-1 overflow-hidden rounded-3xl bg-camera">
          <video ref={videoRef} className="h-full w-full object-cover" muted playsInline autoPlay />
          {mode === "barcode" ? (
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-camera-fg/80" />
          ) : null}
          {mealBusy ? (
            <div className="absolute inset-0 grid place-items-center bg-camera/70 px-6 text-center">
              <p className="font-display text-3xl">Reading the plate…</p>
            </div>
          ) : null}
        </div>
        <div className="tabbar-pad space-y-3 px-4 py-4">
          {camError ? <p className="text-sm text-amber">{camError}</p> : null}
          {photoError || mealError ? <p className="text-sm text-amber">{photoError || mealError}</p> : null}
          {mode === "barcode" ? (
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                const code = manual.replace(/[^\d]/g, "");
                if (code.length >= 6) onBarcode(code);
              }}
            >
              <input
                value={manual}
                onChange={(event) => setManual(event.target.value)}
                inputMode="numeric"
                placeholder="Or type the barcode"
                className="min-w-0 flex-1 rounded-full bg-camera-fg/10 px-4 py-3 text-camera-fg placeholder:text-camera-fg/50"
                aria-label="Barcode number"
              />
              <button type="submit" className="press rounded-full bg-fresh px-4 py-3 font-semibold text-[#222]">
                Look up
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                className="press grid h-12 w-12 place-items-center rounded-full bg-camera-fg/10"
                onClick={() => fileRef.current?.click()}
                aria-label="Upload a photo"
              >
                <ImagePlus className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="press grid h-16 w-16 place-items-center rounded-full bg-fresh text-[#222] disabled:opacity-50"
                onClick={() => void takePhoto()}
                disabled={mealBusy}
                aria-label="Take photo"
              >
                <Camera className="h-7 w-7" />
              </button>
              <span className="w-12" />
            </div>
          )}
          {mode === "meal" ? (
            <button type="button" className="press w-full text-center text-sm font-medium text-camera-fg/80" onClick={onManual}>
              Add foods by hand
            </button>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}

function Choice({
  icon,
  title,
  copy,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="press flex items-center gap-4 rounded-3xl border border-line bg-surface px-4 py-4 text-left" onClick={onClick}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-moss text-forest">{icon}</span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-muted">{copy}</span>
      </span>
    </button>
  );
}

function cameraMessage(error: unknown) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError") return "Camera is blocked. Type the barcode, or upload a meal photo.";
  if (name === "NotFoundError") return "No camera found on this device. Type the barcode instead.";
  return "Camera didn't start. Type the barcode, or upload a photo.";
}
