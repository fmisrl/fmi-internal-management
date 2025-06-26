import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';
import { Customer, Project, Supplier, PurchaseOrder, PurchaseOrderStatus } from '@/types';

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (po: PurchaseOrder) => void;
  purchaseOrder?: PurchaseOrder;
  projects: Project[];
  suppliers: Supplier[];
  customers: Customer[];
}

export const PurchaseOrderForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  purchaseOrder,
  projects,
  suppliers,
  customers
}: PurchaseOrderFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    name: '', 
    cigCode: '', 
    supplierId: '', 
    projectId: '',
    explanation: '',
    status: 'draft' as PurchaseOrderStatus
  });
  const [signedFile, setSignedFile] = useState<File | undefined>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({ 
        name: purchaseOrder.name,
        cigCode: purchaseOrder.cigCode || '',
        supplierId: purchaseOrder.supplierId,
        projectId: purchaseOrder.projectId || '',
        explanation: purchaseOrder.explanation || '',
        status: purchaseOrder.status
      });
      setSignedFile(purchaseOrder.signedFile);
    } else {
      setFormData({ name: '', cigCode: '', supplierId: '', projectId: '', explanation: '', status: 'draft' });
      setSignedFile(undefined);
    }
    setErrors({});
  }, [purchaseOrder, isOpen]);

  const generatePOId = () => {
    const currentYear = new Date().getFullYear();
    // This should come from the backend in a real implementation
    const nextId = 1;
    return `ACQ/${currentYear}/${nextId.toString().padStart(3, '0')}`;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('required');
    }
    
    if (formData.cigCode && formData.cigCode.length !== 10) {
      newErrors.cigCode = t('cigCodeLength');
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = t('required');
    }

    if (!formData.explanation.trim()) {
      newErrors.explanation = t('required');
    }
    
    if (!purchaseOrder && !signedFile) {
      newErrors.signedFile = t('required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const poData: PurchaseOrder = {
      id: purchaseOrder?.id || generatePOId(),
      name: formData.name.trim(),
      cigCode: formData.cigCode.trim() || undefined,
      supplierId: formData.supplierId,
      projectId: formData.projectId || undefined,
      explanation: formData.explanation.trim(),
      signedFile: signedFile,
      status: formData.status,
      createdDate: purchaseOrder?.createdDate || new Date(),
    };
    
    onSave(poData);
    onClose();
  };

  const getProjectDisplay = (project: Project) => {
    const customer = customers.find(c => c.id === project.customerId);
    const customerName = customer ? customer.name : 'N/A';
    return `${project.id} - ${customerName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {purchaseOrder ? t('editPurchaseOrder') : t('addPurchaseOrder')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('poName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="explanation">{t('explanation')} *</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className={errors.explanation ? 'border-red-500' : ''}
                placeholder={t('explainPurchaseReason')}
                rows={3}
              />
              {errors.explanation && <p className="text-red-500 text-sm mt-1">{errors.explanation}</p>}
            </div>

            <div>
              <Label htmlFor="cigCode">{t('cigCode')}</Label>
              <Input
                id="cigCode"
                value={formData.cigCode}
                onChange={(e) => setFormData({ ...formData, cigCode: e.target.value })}
                maxLength={10}
                className={errors.cigCode ? 'border-red-500' : ''}
                placeholder="10 caratteri alfanumerici (opzionale)"
              />
              {errors.cigCode && <p className="text-red-500 text-sm mt-1">{errors.cigCode}</p>}
            </div>

            <div>
              <Label htmlFor="supplier">{t('supplier')} *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
              >
                <SelectTrigger className={errors.supplierId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={t('selectSupplier')} />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.supplierId && <p className="text-red-500 text-sm mt-1">{errors.supplierId}</p>}
            </div>

            <div>
              <Label htmlFor="project">{t('project')}</Label>
              <Select
                value={formData.projectId}
                onValueChange={(value) => setFormData({ ...formData, projectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {getProjectDisplay(project)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">{t('status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as PurchaseOrderStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t('draft')}</SelectItem>
                  <SelectItem value="waiting_for_approval">{t('waitingForApproval')}</SelectItem>
                  <SelectItem value="in_progress">{t('inProgressByContractsOffice')}</SelectItem>
                  <SelectItem value="assigned">{t('assigned')}</SelectItem>
                  <SelectItem value="paid">{t('paid')}</SelectItem>
                  <SelectItem value="rejected">{t('rejected')}</SelectItem>
                  <SelectItem value="closed">{t('closed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('signedFile')} *</Label>
              <FileUpload
                file={signedFile}
                onFileChange={setSignedFile}
              />
              {errors.signedFile && <p className="text-red-500 text-sm mt-1">{errors.signedFile}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              {t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
