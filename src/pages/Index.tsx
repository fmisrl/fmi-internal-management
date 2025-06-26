import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { CustomerList } from '@/components/Customers/CustomerList';
import { ProjectList } from '@/components/Projects/ProjectList';
import { PurchaseOrderList } from '@/components/PurchaseOrders/PurchaseOrderList';
import { SupplierList } from '@/components/Suppliers/SupplierList';
import { BillsList } from '@/components/Bills/BillsList';
import { Customer, Project, Supplier, PurchaseOrder, Bill } from '@/types';
import '../i18n';

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
  const [bills, setBills] = useState<Bill[]>([
    {
      id: 'BILL-001',
      purchaseOrderId: 'ACQ/2024/001',
      fileName: 'fattura_001.xml',
      xmlFile: new File([''], 'fattura_001.xml', { type: 'text/xml' }),
      amount: 1500.00,
      billNumber: 'FAT-2024-001',
      status: 'needs_approval',
      uploadDate: new Date('2024-01-15'),
    }
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
    const newPO = {
      ...po,
      createdDate: new Date(),
      createdBy: 'Current User' // In real app, this would come from auth
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
  };

  const handleEditPurchaseOrder = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.map(p => p.id === updatedPO.id ? updatedPO : p));
  };

  const handleDeletePurchaseOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
  };

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(pos => pos.map(po => 
      po.id === poId 
        ? { 
            ...po, 
            status: 'in_progress', 
            approvedDate: new Date(),
            approvedBy: 'General Manager' // In real app, this would come from auth
          }
        : po
    ));
  };

  const handleRejectPO = (poId: string) => {
    setPurchaseOrders(pos => pos.map(po => 
      po.id === poId 
        ? { 
            ...po, 
            status: 'rejected',
            rejectedDate: new Date(),
            rejectedBy: 'General Manager' // In real app, this would come from auth
          }
        : po
    ));
  };

  const handleAssignPO = (poId: string) => {
    setPurchaseOrders(pos => pos.map(po => 
      po.id === poId 
        ? { 
            ...po, 
            status: 'assigned',
            assignedDate: new Date()
          }
        : po
    ));
  };

  const handleClosePO = (poId: string) => {
    setPurchaseOrders(pos => pos.map(po => 
      po.id === poId 
        ? { 
            ...po, 
            status: 'closed',
            closedDate: new Date()
          }
        : po
    ));
  };

  // Bill management
  const handleImportBills = (files: File[]) => {
    const newBills: Bill[] = files.map((file, index) => ({
      id: `BILL-${Date.now()}-${index}`,
      purchaseOrderId: purchaseOrders[0]?.id || '', // In real app, this would be selected
      fileName: file.name,
      xmlFile: file,
      status: 'needs_approval',
      uploadDate: new Date(),
    }));
    setBills(prev => [...prev, ...newBills]);
  };

  const handleApproveBill = (billId: string) => {
    setBills(bills => bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'approved', approvalDate: new Date() }
        : bill
    ));
  };

  const handleRejectBill = (billId: string) => {
    setBills(bills => bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'rejected' }
        : bill
    ));
  };

  const handlePayBill = (billId: string) => {
    setBills(bills => bills.map(bill => 
      bill.id === billId 
        ? { ...bill, status: 'paid', paymentDate: new Date() }
        : bill
    ));
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
            bills={bills}
            onAddPurchaseOrder={handleAddPurchaseOrder}
            onEditPurchaseOrder={handleEditPurchaseOrder}
            onDeletePurchaseOrder={handleDeletePurchaseOrder}
            onApprovePO={handleApprovePO}
            onRejectPO={handleRejectPO}
            onAssignPO={handleAssignPO}
            onClosePO={handleClosePO}
          />
        );
      case 'bills':
        return (
          <BillsList
            bills={bills}
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
            customers={customers}
            projects={projects}
            onImportBills={handleImportBills}
            onApproveBill={handleApproveBill}
            onRejectBill={handleRejectBill}
            onPayBill={handlePayBill}
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
