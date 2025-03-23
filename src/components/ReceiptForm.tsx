import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Camera, Receipt, Upload } from 'lucide-react';
import type { ReceiptData, RepairItem } from '../types';

interface ReceiptFormProps {
  onSubmit: (data: ReceiptData) => void;
}

const initialRepairItem: RepairItem = {
  id: 1,
  itemName: '',
  itemType: '',
  serialNumber: '',
  diagnostics: '',
  parts: []
};

const USD_RATE = 0.012; // 1 INR = 0.012 USD (approximately 1/86)

export default function ReceiptForm({ onSubmit }: ReceiptFormProps) {
  const [formData, setFormData] = useState<ReceiptData>({
    storeName: '',
    storeAddress: '',
    storeEmail: '',
    storePhone: '',
    customerName: '',
    customerAddress: '',
    customerPhone: '',
    caseId: `SB-STU-${Date.now().toString().slice(-6)}`,
    invoiceRef: `KM${Date.now().toString().slice(-6)}`,
    serviceOrder: `${Math.floor(Math.random() * 9000) + 1000}`,
    paymentMethod: 'Cash [ Indian Rupees ]',
    repairAgent: {
      name: '',
      geniusId: '',
      storeNumber: '',
      submittedDate: new Date().toISOString().split('T')[0],
      diagnosticDate: new Date().toISOString().split('T')[0]
    },
    repairItems: [initialRepairItem],
    laborAndDiagnosticFees: {
      priceINR: 0,
      priceUSD: 0
    },
    date: new Date().toISOString().split('T')[0],
    storeInfo: {
      name: '',
      address: '',
      email: '',
      phone: '',
      logoUrl: ''
    },
    disclaimer: `*Price includes all TAX and as Mentioned in USD is just for the reference as per the customer's request.
We DO NOT accept foreign currency as mode of payment. We only can take INR as mode of payment.
*We Take 30 Days Guarantee Post Repair for any mechanical or operational failure occurs due to the repair inadequacy.
We do not cover any broken or spilled damage after the repair.`
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          storeInfo: {
            ...prev.storeInfo,
            logoUrl: reader.result as string
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePriceChange = (value: string) => {
    const priceINR = parseFloat(value) || 0;
    const priceUSD = Number((priceINR * USD_RATE).toFixed(2));
    
    setFormData({
      ...formData,
      laborAndDiagnosticFees: {
        priceINR,
        priceUSD
      }
    });
  };

  const addRepairItem = () => {
    setFormData({
      ...formData,
      repairItems: [
        ...formData.repairItems,
        { ...initialRepairItem, id: formData.repairItems.length + 1 }
      ]
    });
  };

  const removeRepairItem = (id: number) => {
    setFormData({
      ...formData,
      repairItems: formData.repairItems.filter(item => item.id !== id)
    });
  };

  const updateRepairItem = (id: number, field: keyof RepairItem, value: any) => {
    setFormData({
      ...formData,
      repairItems: formData.repairItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Store Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Store Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
              <div className="flex items-center space-x-4">
                {formData.storeInfo.logoUrl && (
                  <img 
                    src={formData.storeInfo.logoUrl} 
                    alt="Business Logo" 
                    className="w-16 h-16 object-contain"
                  />
                )}
                <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-5 h-5 mr-2 text-gray-500" />
                  Upload Logo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.storeInfo.name}
                onChange={(e) => setFormData({
                  ...formData,
                  storeInfo: { ...formData.storeInfo, name: e.target.value }
                })}
                placeholder="Enter store name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Phone</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.storeInfo.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  storeInfo: { ...formData.storeInfo, phone: e.target.value }
                })}
                placeholder="Enter store phone"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Store Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.storeInfo.email}
                onChange={(e) => setFormData({
                  ...formData,
                  storeInfo: { ...formData.storeInfo, email: e.target.value }
                })}
                placeholder="Enter store email"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Store Address</label>
              <textarea
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.storeInfo.address}
                onChange={(e) => setFormData({
                  ...formData,
                  storeInfo: { ...formData.storeInfo, address: e.target.value }
                })}
                placeholder="Enter store address"
              />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Repair Agent Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Repair Agent Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.repairAgent.name}
                onChange={(e) => setFormData({
                  ...formData,
                  repairAgent: { ...formData.repairAgent, name: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Genius ID</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.repairAgent.geniusId}
                onChange={(e) => setFormData({
                  ...formData,
                  repairAgent: { ...formData.repairAgent, geniusId: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Store Number</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.repairAgent.storeNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  repairAgent: { ...formData.repairAgent, storeNumber: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.repairAgent.submittedDate}
                onChange={(e) => setFormData({
                  ...formData,
                  repairAgent: { ...formData.repairAgent, submittedDate: e.target.value }
                })}
              />
            </div>
          </div>
        </div>

        {/* Repair Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Repair Items</h2>
            <button
              type="button"
              onClick={addRepairItem}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="w-5 h-5 mr-1" />
              Add Item
            </button>
          </div>

          {formData.repairItems.map((item) => (
            <div key={item.id} className="mb-6 p-6 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={item.itemName}
                    onChange={(e) => updateRepairItem(item.id, 'itemName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Item Type</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={item.itemType}
                    onChange={(e) => updateRepairItem(item.id, 'itemType', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={item.serialNumber}
                    onChange={(e) => updateRepairItem(item.id, 'serialNumber', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnostics</label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  value={item.diagnostics}
                  onChange={(e) => updateRepairItem(item.id, 'diagnostics', e.target.value)}
                />
              </div>

              {formData.repairItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRepairItem(item.id)}
                  className="mt-4 text-red-600 hover:text-red-800"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Labor and Diagnostic Fees */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Labor & Diagnostic Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
              <input
                type="number"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.laborAndDiagnosticFees.priceINR || ''}
                onChange={(e) => handlePriceChange(e.target.value)}
                onFocus={(e) => e.target.value === '0' && (e.target.value = '')}
                placeholder="Enter amount in INR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
              <input
                type="number"
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                value={formData.laborAndDiagnosticFees.priceUSD}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={6}
            value={formData.disclaimer}
            onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Receipt className="w-5 h-5 mr-2" />
          Generate Invoice
        </button>
      </div>
    </form>
  );
}