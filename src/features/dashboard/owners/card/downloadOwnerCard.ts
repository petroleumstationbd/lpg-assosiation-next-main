import type {OwnerRow} from '../types';

const CARD_IMAGE_PATH = '/id-card/ID.jpg';

const loadImage = (src?: string) =>
   new Promise<HTMLImageElement | null>(resolve => {
      if (!src) {
         resolve(null);
         return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
   });

const resolvePhotoUrl = (url?: string) => {
   if (!url) return undefined;
   if (url.startsWith('data:image/svg')) return undefined;
   if (/^https?:\/\//i.test(url)) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
   }
   return url;
};

const drawRoundedRect = (
   ctx: CanvasRenderingContext2D,
   x: number,
   y: number,
   w: number,
   h: number,
   r: number,
) => {
   ctx.beginPath();
   ctx.moveTo(x + r, y);
   ctx.lineTo(x + w - r, y);
   ctx.quadraticCurveTo(x + w, y, x + w, y + r);
   ctx.lineTo(x + w, y + h - r);
   ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
   ctx.lineTo(x + r, y + h);
   ctx.quadraticCurveTo(x, y + h, x, y + h - r);
   ctx.lineTo(x, y + r);
   ctx.quadraticCurveTo(x, y, x + r, y);
   ctx.closePath();
};

const drawCoverImage = (
   ctx: CanvasRenderingContext2D,
   image: HTMLImageElement,
   x: number,
   y: number,
   w: number,
   h: number,
) => {
   const scale = Math.max(w / image.width, h / image.height);
   const sw = w / scale;
   const sh = h / scale;
   const sx = (image.width - sw) / 2;
   const sy = (image.height - sh) / 2;
   ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
};

const drawFittedText = (
   ctx: CanvasRenderingContext2D,
   text: string,
   x: number,
   y: number,
   maxWidth: number,
   fontWeight: number,
   fontSize: number,
) => {
   let size = fontSize;
   ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
   while (ctx.measureText(text).width > maxWidth && size > 12) {
      size -= 1;
      ctx.font = `${fontWeight} ${size}px "Segoe UI", sans-serif`;
   }
   ctx.fillText(text, x, y);
};

const drawPhoto = (
   ctx: CanvasRenderingContext2D,
   photo: HTMLImageElement | null,
   frame: Rect,
) => {
   ctx.save();
   ctx.shadowColor = 'rgba(15, 23, 42, 0.25)';
   ctx.shadowBlur = 18;
   ctx.shadowOffsetY = 6;
   ctx.fillStyle = '#615363';
   drawRoundedRect(ctx, frame.x, frame.y, frame.w, frame.h, 16);
   ctx.fill();
   ctx.restore();

   ctx.save();
   drawRoundedRect(
      ctx,
      frame.x + 6,
      frame.y + 6,
      frame.w - 12,
      frame.h - 12,
      12,
   );
   ctx.clip();
   if (photo) {
      drawCoverImage(
         ctx,
         photo,
         frame.x + 6,
         frame.y + 6,
         frame.w - 12,
         frame.h - 12,
      );
   } else {
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(frame.x + 6, frame.y + 6, frame.w - 12, frame.h - 12);
      ctx.fillStyle = '#111827';
      ctx.font = '600 16px "Segoe UI", sans-serif';
      ctx.fillText('Photo', frame.x + frame.w * 0.32, frame.y + frame.h * 0.55);
   }
   ctx.restore();
};

const drawQr = (
   ctx: CanvasRenderingContext2D,
   qr: HTMLImageElement | null,
   frame: Rect,
) => {
   ctx.save();
   ctx.fillStyle = 'rgba(255,255,255,0.92)';
   drawRoundedRect(ctx, frame.x, frame.y, frame.w, frame.h, 12);
   ctx.fill();
   ctx.restore();

   if (qr) {
      ctx.save();
      drawRoundedRect(
         ctx,
         frame.x + 4,
         frame.y + 4,
         frame.w - 8,
         frame.h - 8,
         10,
      );
      ctx.clip();
      ctx.drawImage(qr, frame.x + 4, frame.y + 4, frame.w - 8, frame.h - 8);
      ctx.restore();
   }
};

type Rect = {x: number; y: number; w: number; h: number};

const base64ToBytes = (base64: string) => {
   const binary = atob(base64);
   const bytes = new Uint8Array(binary.length);
   for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
   }
   return bytes;
};

const createPdfBlobFromCanvas = (canvas: HTMLCanvasElement) => {
   const jpegDataUrl = canvas.toDataURL('image/jpeg', 1);
   const [header, base64Data] = jpegDataUrl.split(',');
   if (!base64Data || !header) return null;

   const match = /data:image\/jpeg/.exec(header);
   if (!match) return null;

   const imageBytes = base64ToBytes(base64Data);
   const width = canvas.width;
   const height = canvas.height;
   const encoder = new TextEncoder();
   const parts: Uint8Array[] = [];
   const offsets: number[] = [];
   let offset = 0;

   const pushString = (value: string) => {
      const bytes = encoder.encode(value);
      parts.push(bytes);
      offset += bytes.length;
   };

   const pushBytes = (bytes: Uint8Array) => {
      parts.push(bytes);
      offset += bytes.length;
   };

   const startObject = (id: number) => {
      offsets[id] = offset;
      pushString(`${id} 0 obj\n`);
   };

   const endObject = () => {
      pushString('endobj\n');
   };

   pushString('%PDF-1.4\n');

   startObject(1);
   pushString('<< /Type /Catalog /Pages 2 0 R >>\n');
   endObject();

   startObject(2);
   pushString('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n');
   endObject();

   startObject(3);
   pushString(
      `<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 4 0 R >> /ProcSet [/PDF /ImageC] >> /MediaBox [0 0 ${width} ${height}] /Contents 5 0 R >>\n`,
   );
   endObject();

   startObject(4);
   pushString(
      `<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,
   );
   pushBytes(imageBytes);
   pushString('\nendstream\n');
   endObject();

   const contentStream = `q\n${width} 0 0 ${height} 0 0 cm\n/Im0 Do\nQ\n`;
   const contentBytes = encoder.encode(contentStream);
   startObject(5);
   pushString(`<< /Length ${contentBytes.length} >>\nstream\n`);
   pushBytes(contentBytes);
   pushString('endstream\n');
   endObject();

   const xrefOffset = offset;
   pushString('xref\n0 6\n');
   pushString('0000000000 65535 f \n');
   for (let i = 1; i <= 5; i += 1) {
      const entry = `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
      pushString(entry);
   }
   pushString('trailer\n<< /Size 6 /Root 1 0 R >>\n');
   pushString(`startxref\n${xrefOffset}\n%%EOF`);

   // return new Blob(parts, {type: 'application/pdf'});
};

const drawOwnerOverlay = (ctx: CanvasRenderingContext2D, owner: OwnerRow) => {
   const width = ctx.canvas.width;
   const height = ctx.canvas.height;
   const frontHeight = height / 2;

   const nameText = owner.ownerName ?? '—';
   const memberIdText = owner.memberId ?? owner.id ?? '—';

   const photoFrame: Rect = {
      x: width * 0.075,
      y: frontHeight * 0.44,
      w: width * 0.18,
      h: frontHeight * 0.34,
   };

   const qrSize = width * 0.22;
   const qrFrame: Rect = {
      x: width * 0.685,
      y: frontHeight * 0.58,
      w: qrSize,
      h: qrSize,
   };

   ctx.fillStyle = '#1F2937';
   drawFittedText(
      ctx,
      nameText,
      width * 0.34,
      frontHeight * 0.57,
      width * 0.52,
      700,
      Math.round(width * 0.03),
   );

   ctx.fillStyle = '#111827';
   drawFittedText(
      ctx,
      memberIdText,
      width * 0.472,
      frontHeight * 0.65,
      width * 0.28,
      600,
      Math.round(width * 0.026),
   );

   return {photoFrame, qrFrame};
};

const pickText = (...v: Array<string | null | undefined>) =>
   v.find(s => typeof s === 'string' && s.trim().length > 0)?.trim() ?? '—';

const fetchStationInfoFromPublicOwners = async (memberId?: string | null) => {
   if (!memberId) {
      return {stationName: '—', division: '—', district: '—'};
   }

   try {
      const res = await fetch(
         'https://admin.petroleumstationbd.com/api/public/station-owners/list?per_page=2000',
         {cache: 'no-store'},
      );

      if (!res.ok) {
         return {stationName: '—', division: '—', district: '—'};
      }

      const data = await res.json();
      const owners = Array.isArray(data?.data) ? data.data : [];
      const match = owners.find(
         (o: any) => String(o?.station_owner_id) === String(memberId),
      );

      const station = match?.gas_stations?.[0];

      return {
         stationName: pickText(station?.station_name),
         division: pickText(station?.location?.division),
         district: pickText(station?.location?.district),
      };
   } catch {
      return {stationName: '—', division: '—', district: '—'};
   }
};

export async function downloadOwnerCard(row: OwnerRow) {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   if (!ctx) return;

   const stationInfo = await fetchStationInfoFromPublicOwners(row.memberId);

   const ownerName = pickText(
      (row as any).ownerName,
      (row as any).fullName,
      (row as any).name,
   );

   const qrValue = [
      'PETROLEUM STATION BD',
      'Member Information',
      '-------------------',
      `Member: ${ownerName}`,
      `Member ID: ${row.memberId ?? '—'}`,
      '',
      `Station: ${stationInfo.stationName}`,
      `Division: ${stationInfo.division}`,
      `District: ${stationInfo.district}`,
      '',
      'Facebook: https://www.facebook.com/bdpetroleumstation/',
   ].join('\n');

   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      qrValue,
   )}`;

   const [card, photo, qr] = await Promise.all([
      loadImage(CARD_IMAGE_PATH),
      loadImage(resolvePhotoUrl(row.photoUrl)),
      loadImage(qrUrl),
   ]);

   const width = card?.width ?? 900;
   const height = card?.height ?? 560;
   canvas.width = width;
   canvas.height = height;

   if (card) {
      ctx.drawImage(card, 0, 0, width, height);
   } else {
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(0, 0, width, height);
   }

   const {photoFrame, qrFrame} = drawOwnerOverlay(ctx, row);
   drawPhoto(ctx, photo, photoFrame);
   drawQr(ctx, qr, qrFrame);

   const imageDataUrl = canvas.toDataURL('image/png');
   const link = document.createElement('a');
   link.download = `owner-card-${row.memberId ?? row.id}.png`;
   link.href = imageDataUrl;
   link.click();

   const pdfBlob = createPdfBlobFromCanvas(canvas);
   // if (pdfBlob) {
   //    const pdfUrl = URL.createObjectURL(pdfBlob);
   //    const pdfLink = document.createElement('a');
   //    pdfLink.download = `owner-card-${row.memberId ?? row.id}.pdf`;
   //    pdfLink.href = pdfUrl;
   //    pdfLink.click();
   //    URL.revokeObjectURL(pdfUrl);
   // }
}
