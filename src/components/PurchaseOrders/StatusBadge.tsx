
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

type PurchaseOrderStatus = 'draft' | 'sent_for_approval' | 'in_progress' | 'assigned' | 'paid' | 'rejected';

interface StatusBadgeProps {
  status: PurchaseOrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'draft':
        return {
          label: t('draft'),
          className: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
      case 'sent_for_approval':
        return {
          label: t('sentForApproval'),
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'in_progress':
        return {
          label: t('inProgressByContractsOffice'),
          className: 'bg-yellow-500 hover:bg-yellow-600 text-white'
        };
      case 'assigned':
        return {
          label: t('assigned'),
          className: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'paid':
        return {
          label: t('paid'),
          className: 'bg-blue-500 hover:bg-blue-600 text-white'
        };
      case 'rejected':
        return {
          label: t('rejected'),
          className: 'bg-red-500 hover:bg-red-600 text-white'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-500 hover:bg-gray-600 text-white'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};
