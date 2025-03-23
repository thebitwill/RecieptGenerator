import React from 'react';
import { FileImage, File as FilePdf } from 'lucide-react';
import type { ReceiptData } from '../types';
import * as htmlToImage from 'html-to-image';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface ReceiptPreviewProps {
  data: ReceiptData;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 100,
    height: 100,
    objectFit: 'contain',
    marginBottom: 10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storeInfo: {
    fontSize: 10,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    flex: 2,
    fontSize: 10,
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  col1: { width: '40%' },
  col2: { width: '20%' },
  col3: { width: '20%' },
  col4: { width: '20%' },
  total: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    color: '#666',
  },
  signatures: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signature: {
    width: '40%',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    fontSize: 10,
  },
});

const PDFReceipt = ({ data }: ReceiptPreviewProps) => {
  const calculateTotal = () => {
    let totalINR = data.laborAndDiagnosticFees.priceINR;
    let totalUSD = data.laborAndDiagnosticFees.priceUSD;

    data.repairItems.forEach(item => {
      item.parts.forEach(part => {
        totalINR += part.priceINR;
        totalUSD += part.priceUSD;
      });
    });

    return { totalINR, totalUSD };
  };

  const { totalINR, totalUSD } = calculateTotal();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {data.storeInfo.logoUrl && (
              <Image src={data.storeInfo.logoUrl} style={styles.logo} />
            )}
            <Text style={styles.storeName}>{data.storeInfo.name}</Text>
            <Text style={styles.storeInfo}>{data.storeInfo.address}</Text>
            <Text style={styles.storeInfo}>Email: {data.storeInfo.email}</Text>
            <Text style={styles.storeInfo}>Phone: {data.storeInfo.phone}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Repair Invoice</Text>
            <Text style={styles.storeInfo}>Case ID: {data.caseId}</Text>
            <Text style={styles.storeInfo}>Invoice Ref #: {data.invoiceRef}</Text>
            <Text style={styles.storeInfo}>Service Order #: {data.serviceOrder}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{data.customerAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{data.customerPhone}</Text>
          </View>
        </View>

        {/* Repair Agent Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Agent</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{data.repairAgent.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Genius ID:</Text>
            <Text style={styles.value}>{data.repairAgent.geniusId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Store Number:</Text>
            <Text style={styles.value}>{data.repairAgent.storeNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Submitted On:</Text>
            <Text style={styles.value}>{data.repairAgent.submittedDate}</Text>
          </View>
        </View>

        {/* Repair Items */}
        {data.repairItems.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>Item #{index + 1}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Item Name:</Text>
              <Text style={styles.value}>{item.itemName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Item Type:</Text>
              <Text style={styles.value}>{item.itemType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Serial Number:</Text>
              <Text style={styles.value}>{item.serialNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Diagnostics:</Text>
              <Text style={styles.value}>{item.diagnostics}</Text>
            </View>

            {/* Parts Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.col1, { fontSize: 10, fontWeight: 'bold' }]}>Part Name</Text>
                <Text style={[styles.col2, { fontSize: 10, fontWeight: 'bold' }]}>Price (INR)</Text>
                <Text style={[styles.col3, { fontSize: 10, fontWeight: 'bold' }]}>Price (USD)</Text>
              </View>
              {item.parts.map((part, partIndex) => (
                <View key={partIndex} style={styles.tableRow}>
                  <Text style={[styles.col1, { fontSize: 9 }]}>{part.name}</Text>
                  <Text style={[styles.col2, { fontSize: 9 }]}>{part.priceINR}</Text>
                  <Text style={[styles.col3, { fontSize: 9 }]}>{part.priceUSD}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Labor and Diagnostic Fees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Labor & Diagnostic Fees</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Price (INR):</Text>
            <Text style={styles.value}>{data.laborAndDiagnosticFees.priceINR}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price (USD):</Text>
            <Text style={styles.value}>{data.laborAndDiagnosticFees.priceUSD}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total (INR):</Text>
          <Text style={styles.totalValue}>{totalINR}</Text>
          <Text style={styles.totalLabel}>Total (USD):</Text>
          <Text style={styles.totalValue}>{totalUSD}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>Disclaimer</Text>
          <Text>{data.disclaimer}</Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatures}>
          <View style={styles.signature}>
            <Text>Repair Genius's Signature</Text>
          </View>
          <View style={styles.signature}>
            <Text>Customer's Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const saveAsJPEG = async () => {
    if (receiptRef.current) {
      const dataUrl = await htmlToImage.toJpeg(receiptRef.current);
      const link = document.createElement('a');
      link.download = `invoice-${data.caseId}.jpeg`;
      link.href = dataUrl;
      link.click();
    }
  };

  const calculateTotal = () => {
    let totalINR = data.laborAndDiagnosticFees.priceINR;
    let totalUSD = data.laborAndDiagnosticFees.priceUSD;

    data.repairItems.forEach(item => {
      item.parts.forEach(part => {
        totalINR += part.priceINR;
        totalUSD += part.priceUSD;
      });
    });

    return { totalINR, totalUSD };
  };

  const { totalINR, totalUSD } = calculateTotal();

  return (
    <div className="space-y-6">
      <div ref={receiptRef} className="bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b">
          <div>
            {data.storeInfo.logoUrl && (
              <img 
                src={data.storeInfo.logoUrl} 
                alt="Business Logo" 
                className="w-24 h-24 object-contain mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.storeInfo.name}</h1>
            <div className="space-y-1 text-gray-600">
              <p>{data.storeInfo.address}</p>
              <p>Email: {data.storeInfo.email}</p>
              <p>Phone: {data.storeInfo.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Repair Invoice</h2>
            <div className="space-y-1 text-gray-600">
              <p>Case ID: {data.caseId}</p>
              <p>Invoice Ref #: {data.invoiceRef}</p>
              <p>Service Order #: {data.serviceOrder}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Name:</span> {data.customerName}</p>
              <p><span className="font-medium">Address:</span> {data.customerAddress}</p>
              <p><span className="font-medium">Phone:</span> {data.customerPhone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Repair Agent</h3>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Name:</span> {data.repairAgent.name}</p>
              <p><span className="font-medium">Genius ID:</span> {data.repairAgent.geniusId}</p>
              <p><span className="font-medium">Store Number:</span> {data.repairAgent.storeNumber}</p>
              <p><span className="font-medium">Submitted On:</span> {data.repairAgent.submittedDate}</p>
            </div>
          </div>
        </div>

        {/* Repair Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Repair Items</h3>
          {data.repairItems.map((item, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="font-medium">Item Name</p>
                  <p className="text-gray-700">{item.itemName}</p>
                </div>
                <div>
                  <p className="font-medium">Item Type</p>
                  <p className="text-gray-700">{item.itemType}</p>
                </div>
                <div>
                  <p className="font-medium">Serial Number</p>
                  <p className="text-gray-700">{item.serialNumber}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="font-medium">Diagnostics</p>
                <p className="text-gray-700">{item.diagnostics}</p>
              </div>

              {item.parts.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Parts</h4>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2">Part Name</th>
                        <th className="py-2">Price (INR)</th>
                        <th className="py-2">Price (USD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.parts.map((part, partIndex) => (
                        <tr key={partIndex} className="border-b">
                          <td className="py-2">{part.name}</td>
                          <td className="py-2">{part.priceINR}</td>
                          <td className="py-2">{part.priceUSD}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labor and Diagnostic Fees */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Labor & Diagnostic Fees</h3>
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Price (INR)</p>
              <p className="text-gray-700">{data.laborAndDiagnosticFees.priceINR}</p>
            </div>
            <div>
              <p className="font-medium">Price (USD)</p>
              <p className="text-gray-700">{data.laborAndDiagnosticFees.priceUSD}</p>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="text-right mb-8">
          <div className="inline-block p-4 bg-gray-50 rounded-lg">
            <p className="text-lg font-semibold">
              Total (INR): ₹{totalINR}
              <span className="ml-4">Total (USD): ${totalUSD}</span>
            </p>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-sm text-gray-600 mb-8 space-y-2">
          <h4 className="text-lg font-semibold mb-2">Disclaimer</h4>
          {data.disclaimer.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-8">
          <div className="text-center">
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm text-gray-600">Repair Genius's Signature</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm text-gray-600">Customer's Signature</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-center gap-4">
        <PDFDownloadLink
          document={<PDFReceipt data={data} />}
          fileName={`invoice-${data.caseId}.pdf`}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FilePdf className="w-5 h-5 mr-2" />
          Save as PDF
        </PDFDownloadLink>

        <button
          onClick={saveAsJPEG}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <FileImage className="w-5 h-5 mr-2" />
          Save as JPEG
        </button>
      </div>
    </div>
  );
}