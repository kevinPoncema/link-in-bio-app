import React, { useRef } from 'react';
import { X, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const QRModal = ({ isOpen, onClose, url, profileName }) => {
  const qrRef = useRef(null);

  const handleDownloadQR = () => {
    // Obtener el canvas del QR
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.download = `qr-${profileName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(url);
    // Feedback visual temporal
    const button = document.getElementById('copy-url-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = '¡Copiado!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">
            Código QR
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Name */}
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-1">
              {profileName}
            </h4>
            <p className="text-sm text-gray-400">
              Comparte tu perfil escaneando este código
            </p>
          </div>

          {/* QR Code */}
          <div 
            ref={qrRef}
            className="flex justify-center bg-white p-6 rounded-xl"
          >
            <QRCodeCanvas
              value={url}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>

          {/* URL Display */}
          <div className="bg-gray-700 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">
              URL del perfil
            </p>
            <p className="text-sm text-white break-all font-mono">
              {url}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {/* Download QR Button */}
            <button
              onClick={handleDownloadQR}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Descargar QR</span>
            </button>

            {/* Copy URL Button */}
            <button
              id="copy-url-btn"
              onClick={handleCopyURL}
              className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
            >
              Copiar URL
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>

          {/* Info Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              El código QR se descarga directamente en tu dispositivo. No se guarda en el servidor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
