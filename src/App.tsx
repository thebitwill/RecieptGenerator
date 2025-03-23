import React, { useState } from 'react';
import ReceiptForm from './components/ReceiptForm';
import ReceiptPreview from './components/ReceiptPreview';
import type { ReceiptData } from './types';
import { Camera } from 'lucide-react';

function App() {
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const handleFormSubmit = (data: ReceiptData) => {
    setReceiptData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Camera Repair Invoice Generator</h1>
          </div>
          <p className="text-gray-600">Generate professional invoices for your camera repair services</p>
        </div>

        {!receiptData ? (
          <ReceiptForm onSubmit={handleFormSubmit} />
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setReceiptData(null)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Form
            </button>
            <ReceiptPreview data={receiptData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;