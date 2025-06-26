
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
import { Plus, Search, CheckCircle, XCircle, Upload, FileText } from 'lucide-react';
import { BillImportModal } from './BillImportModal';
import { BillStatusBadge } from './BillStatusBadge';
import { Bill, PurchaseOrder, Supplier, Customer, Project } from '@/types';

interface BillsListProps {
  bills: Bill[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  customers: Customer[];
  projects: Project[];
  onImportBills: (files: File[]) => void;
  onApproveBill: (billId: string) => void;
  onRejectBill: (billId: string) => void;
  onPayBill: (billId: string) => void;
}

export const BillsList = ({
  bills,
  purchaseOrders,
  suppliers,
  customers,
  projects,
  onImportBills,
  onApproveBill,
  onRejectBill,
  onPayBill
}: BillsListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getPurchaseOrderInfo = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return { poName: '-', supplierName: '-', customerName: '-' };
    
    const supplier = suppliers.find(s => s.id === po.supplierId);
    const project = projects.find(p => p.id === po.projectId);
    const customer = project ? customers.find(c => c.id === project.customerId) : null;
    
    return {
      poName: po.name,
      supplierName: supplier?.name || '-',
      customerName: customer?.name || '-'
    };
  };

  const filteredBills = bills.filter(bill => {
    const { poName, supplierName } = getPurchaseOrderInfo(bill.purchaseOrderId);
    const matchesSearch = (
      bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplierName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('bills')}</h1>
        <Button onClick={() => setIsImportModalOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          {t('importBills')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('billsManagement')}</span>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">{t('allStatuses')}</option>
                <option value="needs_approval">{t('needsApproval')}</option>
                <option value="approved">{t('approved')}</option>
                <option value="paid">{t('paid')}</option>
                <option value="rejected">{t('rejected')}</option>
              </select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('billId')}</TableHead>
                <TableHead>{t('fileName')}</TableHead>
                <TableHead>{t('billNumber')}</TableHead>
                <TableHead>{t('amount')}</TableHead>
                <TableHead>{t('purchaseOrder')}</TableHead>
                <TableHead>{t('supplier')}</TableHead>
                <TableHead>{t('uploadDate')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => {
                const { poName, supplierName } = getPurchaseOrderInfo(bill.purchaseOrderId);
                return (
                  <TableRow key={bill.id}>
                    <TableCell className="font-mono text-sm">{bill.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {bill.fileName}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{bill.billNumber || '-'}</TableCell>
                    <TableCell>{formatAmount(bill.amount)}</TableCell>
                    <TableCell>{poName}</TableCell>
                    <TableCell>{supplierName}</TableCell>
                    <TableCell>{formatDate(bill.uploadDate)}</TableCell>
                    <TableCell>
                      <BillStatusBadge status={bill.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {bill.status === 'needs_approval' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onApproveBill(bill.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRejectBill(bill.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {bill.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPayBill(bill.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {t('markAsPaid')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BillImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={onImportBills}
      />
    </div>
  );
};
