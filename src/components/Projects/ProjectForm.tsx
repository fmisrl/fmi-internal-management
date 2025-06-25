
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface Customer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  customerId?: string;
  cupCode?: string;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project;
  customers: Customer[];
}

export const ProjectForm = ({ isOpen, onClose, onSave, project, customers }: ProjectFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ customerId: '', cupCode: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (project) {
      setFormData({ 
        customerId: project.customerId || '', 
        cupCode: project.cupCode || '' 
      });
    } else {
      setFormData({ customerId: '', cupCode: '' });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (formData.cupCode && formData.cupCode.length !== 15) {
      newErrors.cupCode = t('cupCodeLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const projectData: Project = {
      id: project?.id || Date.now().toString(),
      customerId: formData.customerId || undefined,
      cupCode: formData.cupCode || undefined,
    };
    
    onSave(projectData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {project ? t('editProject') : t('addProject')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer">{t('customer')}</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectCustomer')} />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="cupCode">{t('cupCode')}</Label>
              <Input
                id="cupCode"
                value={formData.cupCode}
                onChange={(e) => setFormData({ ...formData, cupCode: e.target.value })}
                maxLength={15}
                className={errors.cupCode ? 'border-red-500' : ''}
                placeholder="15 caratteri alfanumerici"
              />
              {errors.cupCode && <p className="text-red-500 text-sm mt-1">{errors.cupCode}</p>}
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
