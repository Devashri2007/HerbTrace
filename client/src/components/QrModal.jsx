import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Printer, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const QrModal = ({ product, isOpen, onClose }) => {
  const qrRef = useRef(null);

  if (!isOpen || !product) return null;

  const publicUrl = `${window.location.origin}/trace/${product.productId}`;

  const downloadQR = () => {
    const svg = document.getElementById(`qr-svg-${product.productId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${product.productId}_HerbTrace_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const printQR = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-botanical-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-botanical-700 text-white">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-botanical-950">
              HerbTrace Consumer Product QR
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable/Scannable QR Card */}
        <div className="bg-[#fcfdfc] p-6 rounded-xl border border-botanical-200 text-center space-y-4 shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-botanical-600">
              Authentic Ayurvedic Botanical
            </span>
            <h4 className="text-sm font-bold text-botanical-950">{product.productName}</h4>
            <p className="font-mono text-xs font-semibold text-botanical-700">{product.productId}</p>
          </div>

          <div className="flex justify-center p-3 bg-white rounded-xl border border-botanical-100 shadow-inner inline-block mx-auto">
            <QRCodeSVG
              id={`qr-svg-${product.productId}`}
              value={publicUrl}
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23166534'><path d='M12 2L9.5 7.5L4 8.5L8 12.5L7 18L12 15L17 18L16 12.5L20 8.5L14.5 7.5L12 2Z'/></svg>",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Scan to Trace From Source to Shelf</span>
          </div>

          <p className="text-[11px] font-mono text-gray-400 break-all">{publicUrl}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-botanical-700 hover:bg-botanical-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={printQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-botanical-300 hover:bg-botanical-50 text-botanical-900 rounded-xl text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Label</span>
          </button>
        </div>

        <div className="text-center pt-1">
          <Link
            to={`/trace/${product.productId}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-botanical-700 hover:underline font-semibold"
          >
            <span>Open Public Traceability Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QrModal;
