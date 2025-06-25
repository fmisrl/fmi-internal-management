
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { ProjectForm } from './ProjectForm';

interface Customer {
  id: string;
  name: string;
}

interface Project {
  id: string;
  customerId?: string;
  cupCode?: string;
}

interface ProjectListProps {
  projects: Project[];
  customers: Customer[];
  onAddProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectList = ({ 
  projects, 
  customers,
  onAddProject, 
  onEditProject, 
  onDeleteProject 
}: ProjectListProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return '-';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || '-';
  };

  const filteredProjects = projects.filter(project => {
    const customerName = getCustomerName(project.customerId);
    return (
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.cupCode && project.cupCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: Project) => {
    if (editingProject) {
      onEditProject(project);
    } else {
      onAddProject(project);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('projects')}</h1>
        <Button onClick={handleAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addProject')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('projects')}</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id')}</TableHead>
                <TableHead>{t('customer')}</TableHead>
                <TableHead>{t('cupCode')}</TableHead>
                <TableHead className="text-right">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-sm">{project.id}</TableCell>
                  <TableCell>{getCustomerName(project.customerId)}</TableCell>
                  <TableCell className="font-mono text-sm">{project.cupCode || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteProject(project.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
        customers={customers}
      />
    </div>
  );
};
