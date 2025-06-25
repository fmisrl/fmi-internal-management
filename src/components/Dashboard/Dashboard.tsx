
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, ShoppingCart, TrendingUp } from 'lucide-react';

interface DashboardProps {
  customers: any[];
  projects: any[];
  purchaseOrders: any[];
}

export const Dashboard = ({ customers, projects, purchaseOrders }: DashboardProps) => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t('totalCustomers'),
      value: customers.length,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: t('totalProjects'),
      value: projects.length,
      icon: FolderOpen,
      color: 'text-green-600'
    },
    {
      title: t('totalPurchaseOrders'),
      value: purchaseOrders.length,
      icon: ShoppingCart,
      color: 'text-purple-600'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">FMI Dashboard</h1>
        <p className="text-muted-foreground mt-2">Gestione progetti e ordini di acquisto</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            Sistema di gestione progetti FMI S.r.l. operativo
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
