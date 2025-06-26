
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  ShoppingCart, 
  Building2,
  Receipt,
  Menu,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { id: 'dashboard', title: t('dashboard'), icon: LayoutDashboard },
    { id: 'customers', title: t('customers'), icon: Users },
    { id: 'projects', title: t('projects'), icon: FolderOpen },
    { id: 'purchaseOrders', title: t('purchaseOrders'), icon: ShoppingCart },
    { id: 'bills', title: t('bills'), icon: Receipt },
    { id: 'suppliers', title: t('suppliers'), icon: Building2 },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'it' ? 'en' : 'it';
    i18n.changeLanguage(newLang);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">FMI</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 w-8 p-0"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
