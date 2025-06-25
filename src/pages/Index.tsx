
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CustomerList } from '@/components/Customers/CustomerList';
import { ProjectList } from '@/components/Projects/ProjectList';
import { PurchaseOrderList } from '@/components/PurchaseOrders/PurchaseOrderList';
import { SupplierList } from '@/components/Suppliers/SupplierList';
import '../i18n';

interface Customer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  customerId?: string;
  cupCode?: string;
}

interface Supplier {
  id: string;
  name: string;
  vatNumber: string;
}

interface PurchaseOrder {
  id: string;
  name: string;
  cigCode?: string;
  supplierId: string;
  projectId?: string;
  signedFile?: File;
  status: 'draft' | 'sent_for_approval' | 'in_progress' | 'assigned' | 'paid' | 'rejected';
}

const Index = () => {
  console.log('Index component rendering...');
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([
    { id: '1', name: 'Azienda Roma S.p.A.' },
    { id: '2', name: 'Impresa Milano S.r.l.' },
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', customerId: '1', cupCode: 'A12B34C56D78E90' },
    { id: '2', customerId: '2' },
  ]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'Fornitore Tech S.r.l.', vatNumber: '12345678901' },
    { id: '2', name: 'Servizi Informatici S.p.A.', vatNumber: '09876543210' },
  ]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    { 
      id: 'ACQ/2024/001', 
      name: 'Ordine Software', 
      cigCode: 'Z1A2B3C4D5', 
      supplierId: '1',
      projectId: '1',
      status: 'draft'
    },
  ]);

  // Customer management
  const handleAddCustomer = (customer: Customer) => {
    setCustomers([...customers, customer]);
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Project management
  const handleAddProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const handleEditProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Supplier management
  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers([...suppliers, supplier]);
  };

  const handleEditSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const handleDeleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  // Purchase Order management
  const handleAddPurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders([...purchaseOrders, po]);
  };

  const handleEditPurchaseOrder = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.map(p => p.id === updatedPO.id ? updatedPO : p));
  };

  const handleDeletePurchaseOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
  };

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
    
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            customers={customers}
            projects={projects}
            purchaseOrders={purchaseOrders}
          />
        );
      case 'customers':
        return (
          <CustomerList
            customers={customers}
            onAddCustomer={handleAddCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
          />
        );
      case 'projects':
        return (
          <ProjectList
            projects={projects}
            customers={customers}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'purchaseOrders':
        return (
          <PurchaseOrderList
            purchaseOrders={purchaseOrders}
            projects={projects}
            suppliers={suppliers}
            customers={customers}
            onAddPurchaseOrder={handleAddPurchaseOrder}
            onEditPurchaseOrder={handleEditPurchaseOrder}
            onDeletePurchaseOrder={handleDeletePurchaseOrder}
          />
        );
      case 'suppliers':
        return (
          <SupplierList
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onEditSupplier={handleEditSupplier}
            onDeleteSupplier={handleDeleteSupplier}
          />
        );
      default:
        return <Dashboard customers={customers} projects={projects} purchaseOrders={purchaseOrders} />;
    }
  };

  useEffect(() => {
    console.log('Index component mounted successfully');
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="mb-4">
            <SidebarTrigger />
          </div>
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
