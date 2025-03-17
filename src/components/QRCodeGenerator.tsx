
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function QRCodeGenerator() {
  const currentUrl = window.location.origin;
  const formUrl = `${currentUrl}/`;

  const handleDownload = (format: 'png' | 'pdf') => {
    const svg = document.getElementById('restaurant-qr') as HTMLElement;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      if (format === 'png') {
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'restaurant-form-qr.png';
        downloadLink.href = pngFile;
        downloadLink.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const qrSize = Math.min(pdfWidth - 2 * margin, pdfHeight - 2 * margin);
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('Restaurant Feedback QR Code', pdfWidth / 2, margin, { align: 'center' });
        
        // Add QR code
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, margin + 10, qrSize, qrSize);
        
        // Add instructions
        pdf.setFontSize(12);
        const instructions = [
          'Instructions:',
          '1. Print this QR code and place it on tables or at the entrance',
          '2. Customers can scan it using their smartphone camera',
          '3. They will be directed to the feedback form automatically',
          '4. Ensure good lighting for easy scanning'
        ];
        
        let yPos = margin + qrSize + 20;
        instructions.forEach(line => {
          pdf.text(line, margin, yPos);
          yPos += 8;
        });
        
        pdf.save('restaurant-form-qr.pdf');
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-6">Restaurant QR Code</h2>
          
          <div className="bg-gray-50 p-8 rounded-lg mb-6">
            <QRCodeSVG
              id="restaurant-qr"
              value={formUrl}
              size={300}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>
          
          <p className="text-gray-600 mb-8">
            Print this QR code and place it on tables or at the entrance. 
            Customers can scan it to access the feedback form.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDownload('png')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Download PNG
            </button>
            
            <button
              onClick={() => handleDownload('pdf')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2">Tips for QR Code Usage:</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-2">
              <li>Place the QR code in well-lit areas for easy scanning</li>
              <li>Print in high quality to ensure good scannability</li>
              <li>Consider laminating the printed QR code for durability</li>
              <li>Test the QR code before distributing to ensure it works properly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}