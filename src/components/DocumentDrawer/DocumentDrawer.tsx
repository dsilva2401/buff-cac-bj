import React, { useEffect } from 'react';
import ModuleWrapper from 'components/ModuleWrapper';
import { DocumentModuleType } from 'types/ProductDetailsType';

type DocumentDrawerProps = {
  drawerTitle: string;
  drawerData: DocumentModuleType;
  registrationRequired: boolean;
  closeDrawer: () => void;
  isPreviewMode: boolean;
};

const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  drawerTitle,
  drawerData,
  registrationRequired,
  closeDrawer,
  isPreviewMode,
}) => {
  useEffect(() => {
    if (!registrationRequired) {
      window.open(drawerData.path, isPreviewMode ? '_blank' : '_self');
      closeDrawer();
    }
  }, [registrationRequired, drawerData.path, closeDrawer, isPreviewMode]);

  return <ModuleWrapper drawerTitle={drawerTitle} />;
};

export default DocumentDrawer;
