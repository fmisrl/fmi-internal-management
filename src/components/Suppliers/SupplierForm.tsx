
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Supplier {
  id: string;
  name: string;
  vatNumber: string;
}

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier;
  readonly?: boolean;
}

export const SupplierForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  supplier,
  readonly = false 
}: SupplierFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', vatNumber: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (supplier) {
      setFormData({ name: supplier.name, vatNumber: supplier.vatNumber });
    } else {
      setFormData({ name: '', vatNumber: '' });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('required');
    }
    
    if (!formData.vatNumber.trim()) {
      newErrors.vatNumber = t('required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (readonly) return;
    if (!validateForm()) return;
    
    const supplierData: Supplier = {
      id: supplier?.id || Date.now().toString(),
      name: formData.name.trim(),
      vatNumber: formData.vatNumber.trim(),
    };
    
    onSave(supplierData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {readonly ? t('supplierDetails') : 
             supplier ? t('editSupplier') : t('addSupplier')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
                readOnly={readonly}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <Label htmlFor="vatNumber">{t('vatNumber')} *</Label>
              <Input
                id="vatNumber"
                value={formData.vatNumber}
                onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                className={errors.vatNumber ? 'border-red-500' : ''}
                readOnly={readonly}
              />
              {errors.vatNumber && <p className="text-red-500 text-sm mt-1">{errors.vatNumber}</p>}
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              {readonly ? 'Chiudi' : t('cancel')}
            </Button>
            {!readonly && (
              <Button type="submit">
                {t('save')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
