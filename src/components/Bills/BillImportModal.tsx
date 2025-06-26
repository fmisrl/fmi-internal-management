
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';

interface BillImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (files: File[]) => void;
}

export const BillImportModal = ({ isOpen, onClose, onImport }: BillImportModalProps) => {
  const { t } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const xmlFiles = files.filter(file => 
      file.type === 'text/xml' || 
      file.type === 'application/xml' || 
      file.name.toLowerCase().endsWith('.xml')
    );
    
    setSelectedFiles(prev => [...prev, ...xmlFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const xmlFiles = files.filter(file => 
        file.type === 'text/xml' || 
        file.type === 'application/xml' || 
        file.name.toLowerCase().endsWith('.xml')
      );
      setSelectedFiles(prev => [...prev, ...xmlFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    if (selectedFiles.length > 0) {
      onImport(selectedFiles);
      setSelectedFiles([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {t('importBillsTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {t('importBillsDescription')}
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">{t('dragDropXmlFiles')}</p>
            <p className="text-sm text-muted-foreground mb-4">{t('orClickToSelect')}</p>
            <input
              type="file"
              multiple
              accept=".xml,text/xml,application/xml"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button variant="outline" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                {t('selectFiles')}
              </label>
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">{t('selectedFiles')} ({selectedFiles.length})</h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={selectedFiles.length === 0}
          >
            {t('importFiles')} ({selectedFiles.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
