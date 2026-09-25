export type UploadedFile = {
  name: string;
  media_type: "image/jpeg" | "application/pdf";
  data: string;
  previewUrl: string | null;
};

export const MAX_PDF_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_SIDE = 2000;
const JPEG_QUALITY = 0.85;

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("unreadable image"));
    img.src = url;
  });
}

async function resizeImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function prepareUpload(file: File): Promise<UploadedFile> {
  if (file.type === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) throw new Error("pdf_too_large");
    const dataUrl = await readAsDataUrl(file);
    return {
      name: file.name,
      media_type: "application/pdf",
      data: dataUrl.split(",")[1],
      previewUrl: null,
    };
  }
  if (file.type.startsWith("image/") || file.type === "") {
    const dataUrl = await resizeImage(file);
    return {
      name: file.name,
      media_type: "image/jpeg",
      data: dataUrl.split(",")[1],
      previewUrl: dataUrl,
    };
  }
  throw new Error("unsupported");
}
