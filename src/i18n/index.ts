
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      customers: 'Customers',
      projects: 'Projects',
      purchaseOrders: 'Purchase Orders',
      suppliers: 'Suppliers',
      bills: 'Bills',
      
      // Common
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      actions: 'Actions',
      create: 'Create',
      name: 'Name',
      id: 'ID',
      status: 'Status',
      
      // Dashboard
      totalProjects: 'Total Projects',
      totalCustomers: 'Total Customers',
      totalPurchaseOrders: 'Total Purchase Orders',
      recentActivity: 'Recent Activity',
      
      // Customers
      addCustomer: 'Add Customer',
      editCustomer: 'Edit Customer',
      customerName: 'Customer Name',
      
      // Projects
      addProject: 'Add Project',
      editProject: 'Edit Project',
      customer: 'Customer',
      cupCode: 'CUP Code',
      selectCustomer: 'Select Customer',
      
      // Purchase Orders
      addPurchaseOrder: 'Add Purchase Order',
      editPurchaseOrder: 'Edit Purchase Order',
      poName: 'PO Name',
      cigCode: 'CIG Code',
      supplier: 'Supplier',
      project: 'Project',
      signedFile: 'Signed File',
      selectProject: 'Select Project',
      selectSupplier: 'Select Supplier',
      dragDropFile: 'Drag & drop a file here, or click to select',
      fileSelected: 'File selected',
      
      // Purchase Order Status
      draft: 'Draft',
      sentForApproval: 'Sent for Approval',
      waitingForApproval: 'Waiting for Approval',
      inProgressByContractsOffice: 'In Progress by Contracts Office',
      assigned: 'Assigned',
      paid: 'Paid',
      rejected: 'Rejected',
      
      // Bills
      billsManagement: 'Bills Management',
      importBills: 'Import Bills',
      importBillsTitle: 'Import XML Bills',
      importBillsDescription: 'Upload XML files containing bill information. Multiple files can be selected.',
      billId: 'Bill ID',
      fileName: 'File Name',
      billNumber: 'Bill Number',
      amount: 'Amount',
      purchaseOrder: 'Purchase Order',
      uploadDate: 'Upload Date',
      allStatuses: 'All Statuses',
      needsApproval: 'Needs Approval',
      approved: 'Approved',
      markAsPaid: 'Mark as Paid',
      dragDropXmlFiles: 'Drag & drop XML files here',
      orClickToSelect: 'or click to select files',
      selectFiles: 'Select Files',
      selectedFiles: 'Selected Files',
      importFiles: 'Import Files',
      
      // Suppliers
      addSupplier: 'Add Supplier',
      editSupplier: 'Edit Supplier',
      vatNumber: 'VAT Number',
      supplierDetails: 'Supplier Details',
      
      // Validation
      required: 'This field is required',
      cigCodeLength: 'CIG Code must be exactly 10 characters',
      cupCodeLength: 'CUP Code must be exactly 15 characters',
    }
  },
  it: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      customers: 'Clienti',
      projects: 'Progetti',
      purchaseOrders: 'Ordini di Acquisto',
      suppliers: 'Fornitori',
      bills: 'Fatture',
      
      // Common
      add: 'Aggiungi',
      edit: 'Modifica',
      delete: 'Elimina',
      save: 'Salva',
      cancel: 'Annulla',
      search: 'Cerca',
      actions: 'Azioni',
      create: 'Crea',
      name: 'Nome',
      id: 'ID',
      status: 'Stato',
      
      // Dashboard
      totalProjects: 'Progetti Totali',
      totalCustomers: 'Clienti Totali',
      totalPurchaseOrders: 'Ordini di Acquisto Totali',
      recentActivity: 'Attività Recente',
      
      // Customers
      addCustomer: 'Aggiungi Cliente',
      editCustomer: 'Modifica Cliente',
      customerName: 'Nome Cliente',
      
      // Projects
      addProject: 'Aggiungi Progetto',
      editProject: 'Modifica Progetto',
      customer: 'Cliente',
      cupCode: 'Codice CUP',
      selectCustomer: 'Seleziona Cliente',
      
      // Purchase Orders
      addPurchaseOrder: 'Aggiungi Ordine di Acquisto',
      editPurchaseOrder: 'Modifica Ordine di Acquisto',
      poName: 'Nome OA',
      cigCode: 'Codice CIG',
      supplier: 'Fornitore',
      project: 'Progetto',
      signedFile: 'File Firmato',
      selectProject: 'Seleziona Progetto',
      selectSupplier: 'Seleziona Fornitore',
      dragDropFile: 'Trascina e rilascia un file qui, o clicca per selezionare',
      fileSelected: 'File selezionato',
      
      // Purchase Order Status
      draft: 'Bozza',
      sentForApproval: 'Inviato per Approvazione',
      waitingForApproval: 'In Attesa di Approvazione',
      inProgressByContractsOffice: 'In Elaborazione dall\'Ufficio Contratti',
      assigned: 'Assegnato',
      paid: 'Pagato',
      rejected: 'Rifiutato',
      
      // Bills
      billsManagement: 'Gestione Fatture',
      importBills: 'Importa Fatture',
      importBillsTitle: 'Importa Fatture XML',
      importBillsDescription: 'Carica file XML contenenti informazioni sulle fatture. È possibile selezionare più file.',
      billId: 'ID Fattura',
      fileName: 'Nome File',
      billNumber: 'Numero Fattura',
      amount: 'Importo',
      purchaseOrder: 'Ordine di Acquisto',
      uploadDate: 'Data Caricamento',
      allStatuses: 'Tutti gli Stati',
      needsApproval: 'Richiede Approvazione',
      approved: 'Approvata',
      markAsPaid: 'Segna come Pagata',
      dragDropXmlFiles: 'Trascina e rilascia file XML qui',
      orClickToSelect: 'o clicca per selezionare i file',
      selectFiles: 'Seleziona File',
      selectedFiles: 'File Selezionati',
      importFiles: 'Importa File',
      
      // Suppliers
      addSupplier: 'Aggiungi Fornitore',
      editSupplier: 'Modifica Fornitore',
      vatNumber: 'Partita IVA',
      supplierDetails: 'Dettagli Fornitore',
      
      // Validation
      required: 'Questo campo è obbligatorio',
      cigCodeLength: 'Il Codice CIG deve essere di esattamente 10 caratteri',
      cupCodeLength: 'Il Codice CUP deve essere di esattamente 15 caratteri',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it', // default to Italian
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
