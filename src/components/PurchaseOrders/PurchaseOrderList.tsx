import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash, Eye, CheckCircle, XCircle } from 'lucide-react';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { PurchaseOrderDetails } from './PurchaseOrderDetails';
import { SupplierForm } from '../Suppliers/SupplierForm';
import { StatusBadge } from './StatusBadge';
import { Customer, Project, Supplier, PurchaseOrder, Bill, TimelineEvent } from '@/types';

interface PurchaseOrderListProps {
  purchaseOrders: PurchaseOrder[];
  projects: Project[];
  suppliers: Supplier[];
  customers: Customer[];
  bills: Bill[];
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  onEditPurchaseOrder: (po: PurchaseOrder) => void;
  onDeletePurchaseOrder: (id: string) => void;
  onApprovePO: (poId: string) => void;
  onRejectPO: (poId: string) => void;
  onAssignPO: (poId: string) => void;
  onClosePO: (poId: string) => void;
}

export const PurchaseOrderList = ({ 
  purchaseOrders,
  projects,
  suppliers,
  customers,
  bills,
  onAddPurchaseOrder, 
  onEditPurchaseOrder, 
  onDeletePurchaseOrder,
  onApprovePO,
  onRejectPO,
  onAssignPO,
  onClosePO
}: PurchaseOrderListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | undefined>();
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | undefined>();

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || '-';
  };

  const getProjectDisplay = (projectId?: string) => {
    if (!projectId) return '-';
    const project = projects.find(p => p.id === projectId);
    if (!project) return '-';
    const customer = customers.find(c => c.id === project.customerId);
    return `${project.id} - ${customer?.name || 'N/A'}`;
  };

  const generateTimeline = (po: PurchaseOrder): TimelineEvent[] => {
    const events: TimelineEvent[] = [];
    
    if (po.createdDate) {
      events.push({
        id: `${po.id}-created`,
        type: 'created',
        description: t('purchaseOrderCreated'),
        date: po.createdDate,
        user: po.createdBy
      });
    }
    
    if (po.status === 'waiting_for_approval' || po.approvedDate || po.rejectedDate) {
      events.push({
        id: `${po.id}-submitted`,
        type: 'submitted',
        description: t('submittedForApproval'),
        date: po.createdDate || new Date(),
        user: po.createdBy
      });
    }
    
    if (po.approvedDate) {
      events.push({
        id: `${po.id}-approved`,
        type: 'approved',
        description: t('purchaseOrderApproved'),
        date: po.approvedDate,
        user: po.approvedBy
      });
    }
    
    if (po.rejectedDate) {
      events.push({
        id: `${po.id}-rejected`,
        type: 'rejected',
        description: t('purchaseOrderRejected'),
        date: po.rejectedDate,
        user: po.rejectedBy
      });
    }
    
    if (po.assignedDate) {
      events.push({
        id: `${po.id}-assigned`,
        type: 'assigned',
        description: t('purchaseOrderAssigned'),
        date: po.assignedDate
      });
    }
    
    if (po.closedDate) {
      events.push({
        id: `${po.id}-closed`,
        type: 'closed',
        description: t('purchaseOrderClosed'),
        date: po.closedDate
      });
    }
    
    // Add bill events
    const poBills = bills.filter(bill => bill.purchaseOrderId === po.id);
    poBills.forEach(bill => {
      events.push({
        id: `${bill.id}-uploaded`,
        type: 'bill_uploaded',
        description: t('billUploaded', { fileName: bill.fileName }),
        date: bill.uploadDate
      });
      
      if (bill.approvalDate) {
        events.push({
          id: `${bill.id}-approved`,
          type: 'bill_approved',
          description: t('billApproved', { fileName: bill.fileName }),
          date: bill.approvalDate,
          user: bill.approvedBy
        });
      }
      
      if (bill.paymentDate) {
        events.push({
          id: `${bill.id}-paid`,
          type: 'bill_paid',
          description: t('billPaid', { fileName: bill.fileName }),
          date: bill.paymentDate,
          user: bill.paidBy
        });
      }
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const supplierName = getSupplierName(po.supplierId);
    const projectDisplay = getProjectDisplay(po.projectId);
    return (
      po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (po.cigCode && po.cigCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projectDisplay.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddPO = () => {
    setEditingPO(undefined);
    setIsFormOpen(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setEditingPO(po);
    setIsFormOpen(true);
  };

  const handleSavePO = (po: PurchaseOrder) => {
    if (editingPO) {
      onEditPurchaseOrder(po);
    } else {
      onAddPurchaseOrder(po);
    }
  };

  const handleSupplierClick = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
      setSupplierModalOpen(true);
    }
  };

  const handleViewDetails = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDetailsModalOpen(true);
  };

  const getActionButtons = (po: PurchaseOrder) => {
    const buttons = [];
    
    // View details button
    buttons.push(
      <Button 
        key="view"
        variant="outline" 
        size="sm"
        onClick={() => handleViewDetails(po)}
      >
        <Eye className="h-4 w-4" />
      </Button>
    );
    
    // Edit button (only for draft or rejected)
    if (po.status === 'draft' || po.status === 'rejected') {
      buttons.push(
        <Button 
          key="edit"
          variant="outline" 
          size="sm"
          onClick={() => handleEditPO(po)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }
    
    // Workflow buttons
    if (po.status === 'waiting_for_approval') {
      buttons.push(
        <Button 
          key="approve"
          variant="outline" 
          size="sm"
          onClick={() => onApprovePO(po.id)}
          className="text-green-600 hover:text-green-700"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      );
      buttons.push(
        <Button 
          key="reject"
          variant="outline" 
          size="sm"
          onClick={() => onRejectPO(po.id)}
          className="text-red-600 hover:text-red-700"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      );
    }
    
    // Delete button (only for draft)
    if (po.status === 'draft') {
      buttons.push(
        <Button 
          key="delete"
          variant="outline" 
          size="sm"
          onClick={() => onDeletePurchaseOrder(po.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('purchaseOrders')}</h1>
        <Button onClick={handleAddPO}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addPurchaseOrder')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('purchaseOrders')}</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id')}</TableHead>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('cigCode')}</TableHead>
                <TableHead>{t('supplier')}</TableHead>
                <TableHead>{t('project')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOs.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-mono text-sm">{po.id}</TableCell>
                  <TableCell>{po.name}</TableCell>
                  <TableCell className="font-mono text-sm">{po.cigCode || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => handleSupplierClick(po.supplierId)}
                    >
                      {getSupplierName(po.supplierId)}
                    </Button>
                  </TableCell>
                  <TableCell className="text-sm">{getProjectDisplay(po.projectId)}</TableCell>
                  <TableCell>
                    <StatusBadge status={po.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {getActionButtons(po)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PurchaseOrderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePO}
        purchaseOrder={editingPO}
        projects={projects}
        suppliers={suppliers}
        customers={customers}
      />

      <SupplierForm
        isOpen={supplierModalOpen}
        onClose={() => setSupplierModalOpen(false)}
        onSave={() => {}}
        supplier={selectedSupplier}
        readonly={true}
      />

      {selectedPO && (
        <PurchaseOrderDetails
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          purchaseOrder={selectedPO}
          bills={bills.filter(bill => bill.purchaseOrderId === selectedPO.id)}
          timeline={generateTimeline(selectedPO)}
          suppliers={suppliers}
          customers={customers}
          projects={projects}
          onApprovePO={onApprovePO}
          onRejectPO={onRejectPO}
          onAssignPO={onAssignPO}
          onClosePO={onClosePO}
        />
      )}
    </div>
  );
};
