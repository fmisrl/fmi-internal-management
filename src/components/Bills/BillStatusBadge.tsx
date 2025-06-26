
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { BillStatus } from '@/types';

interface BillStatusBadgeProps {
  status: BillStatus;
}

export const BillStatusBadge = ({ status }: BillStatusBadgeProps) => {
  const { t } = useTranslation();

  const getStatusConfig = (status: BillStatus) => {
    switch (status) {
      case 'needs_approval':
        return {
          label: t('needsApproval'),
          className: 'bg-orange-500 hover:bg-orange-600 text-white'
        };
      case 'approved':
        return {
          label: t('approved'),
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
