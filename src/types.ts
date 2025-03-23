export interface RepairItem {
  id: number;
  itemName: string;
  itemType: string;
  serialNumber: string;
  diagnostics: string;
  parts: RepairPart[];
}

export interface RepairPart {
  id: number;
  name: string;
  priceINR: number;
  priceUSD: number;
}

export interface RepairAgent {
  name: string;
  geniusId: string;
  storeNumber: string;
  submittedDate: string;
  diagnosticDate: string;
}

export interface StoreInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl: string;
}

export interface ReceiptData {
  storeName: string;
  storeAddress: string;
  storeEmail: string;
  storePhone: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  caseId: string;
  invoiceRef: string;
  serviceOrder: string;
  paymentMethod: string;
  repairAgent: RepairAgent;
  repairItems: RepairItem[];
  laborAndDiagnosticFees: {
    priceINR: number;
    priceUSD: number;
  };
  date: string;
  storeInfo: StoreInfo;
  disclaimer: string;
}