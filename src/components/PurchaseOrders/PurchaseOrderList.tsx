
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
import { Plus, Search, Edit, Trash, Eye } from 'lucide-react';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { SupplierForm } from '../Suppliers/SupplierForm';
import { StatusBadge } from './StatusBadge';
import { Customer, Project, Supplier, PurchaseOrder } from '@/types';

interface PurchaseOrderListProps {
  purchaseOrders: PurchaseOrder[];
  projects: Project[];
  suppliers: Supplier[];
  customers: Customer[];
  onAddPurchaseOrder: (po: PurchaseOrder) => void;
  onEditPurchaseOrder: (po: PurchaseOrder) => void;
  onDeletePurchaseOrder: (id: string) => void;
}

export const PurchaseOrderList = ({ 
  purchaseOrders,
  projects,
  suppliers,
  customers,
  onAddPurchaseOrder, 
  onEditPurchaseOrder, 
  onDeletePurchaseOrder 
}: PurchaseOrderListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | undefined>();
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();

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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPO(po)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeletePurchaseOrder(po.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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
    </div>
  );
};
