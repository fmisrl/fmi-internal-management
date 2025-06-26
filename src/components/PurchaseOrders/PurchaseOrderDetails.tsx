
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { BillStatusBadge } from '../Bills/BillStatusBadge';
import { PurchaseOrder, Bill, TimelineEvent, Supplier, Customer, Project } from '@/types';
import { FileText, Calendar, User, Clock, Euro, CheckCircle, XCircle } from 'lucide-react';

interface PurchaseOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder;
  bills: Bill[];
  timeline: TimelineEvent[];
  suppliers: Supplier[];
  customers: Customer[];
  projects: Project[];
  onApprovePO: (poId: string) => void;
  onRejectPO: (poId: string) => void;
  onAssignPO: (poId: string) => void;
  onClosePO: (poId: string) => void;
}

export const PurchaseOrderDetails = ({
  isOpen,
  onClose,
  purchaseOrder,
  bills,
  timeline,
  suppliers,
  customers,
  projects,
  onApprovePO,
  onRejectPO,
  onAssignPO,
  onClosePO
}: PurchaseOrderDetailsProps) => {
  const { t } = useTranslation();

  const supplier = suppliers.find(s => s.id === purchaseOrder.supplierId);
  const project = projects.find(p => p.id === purchaseOrder.projectId);
  const customer = project ? customers.find(c => c.id === project.customerId) : null;

  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalBillsAmount = () => {
    return bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  };

  const getActionButtons = () => {
    const buttons = [];
    
    if (purchaseOrder.status === 'waiting_for_approval') {
      buttons.push(
        <Button
          key="approve"
          onClick={() => onApprovePO(purchaseOrder.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {t('approve')}
        </Button>
      );
      buttons.push(
        <Button
          key="reject"
          variant="outline"
          onClick={() => onRejectPO(purchaseOrder.id)}
          className="text-red-600 hover:text-red-700"
        >
          <XCircle className="h-4 w-4 mr-2" />
          {t('reject')}
        </Button>
      );
    }
    
    if (purchaseOrder.status === 'in_progress') {
      buttons.push(
        <Button
          key="assign"
          onClick={() => onAssignPO(purchaseOrder.id)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t('assignPO')}
        </Button>
      );
    }
    
    if (purchaseOrder.status === 'assigned' || purchaseOrder.status === 'paid') {
      buttons.push(
        <Button
          key="close"
          onClick={() => onClosePO(purchaseOrder.id)}
          variant="outline"
        >
          {t('closePO')}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{t('purchaseOrderDetails')} - {purchaseOrder.id}</span>
            <StatusBadge status={purchaseOrder.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('poName')}</label>
                <p className="font-medium">{purchaseOrder.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('cigCode')}</label>
                <p className="font-medium">{purchaseOrder.cigCode || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('supplier')}</label>
                <p className="font-medium">{supplier?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t('project')}</label>
                <p className="font-medium">{project ? `${project.id} - ${customer?.name}` : '-'}</p>
              </div>
              {purchaseOrder.explanation && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">{t('explanation')}</label>
                  <p className="font-medium">{purchaseOrder.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bills Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('billsSummary')}</span>
                <Badge variant="secondary">{bills.length} {t('bills')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bills.length === 0 ? (
                <p className="text-muted-foreground">{t('noBillsYet')}</p>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">{t('totalAmount')}</p>
                    <p className="text-2xl font-bold">{formatAmount(getTotalBillsAmount())}</p>
                  </div>
                  <div className="space-y-2">
                    {bills.map(bill => (
                      <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{bill.fileName}</p>
                            <p className="text-sm text-muted-foreground">{formatAmount(bill.amount)}</p>
                          </div>
                        </div>
                        <BillStatusBadge status={bill.status} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t('timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{event.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.date)}</span>
                        {event.user && (
                          <>
                            <User className="h-3 w-3" />
                            <span>{event.user}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            {getActionButtons()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
