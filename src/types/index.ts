
export interface Customer {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  customerId?: string;
  cupCode?: string;
}

export interface Supplier {
  id: string;
  name: string;
  vatNumber: string;
}

export type PurchaseOrderStatus = 'draft' | 'waiting_for_approval' | 'in_progress' | 'assigned' | 'paid' | 'rejected' | 'closed';

export interface PurchaseOrder {
  id: string;
  name: string;
  cigCode?: string;
  supplierId: string;
  projectId?: string;
  signedFile?: File;
  status: PurchaseOrderStatus;
  contractsOfficeLetter?: File;
  explanation?: string;
  createdBy?: string;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectedDate?: Date;
  assignedDate?: Date;
  closedDate?: Date;
  createdDate?: Date;
}

export type BillStatus = 'needs_approval' | 'approved' | 'paid' | 'rejected';

export interface Bill {
  id: string;
  purchaseOrderId: string;
  fileName: string;
  xmlFile: File;
  amount?: number;
  billNumber?: string;
  status: BillStatus;
  uploadDate: Date;
  approvalDate?: Date;
  paymentDate?: Date;
  approvedBy?: string;
  paidBy?: string;
  authorizedPaymentFile?: File;
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'submitted' | 'approved' | 'rejected' | 'assigned' | 'closed' | 'bill_uploaded' | 'bill_approved' | 'bill_paid';
  description: string;
  date: Date;
  user?: string;
}
