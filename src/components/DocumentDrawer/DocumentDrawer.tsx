import React, { useEffect } from 'react';
import ModuleWrapper from 'components/ModuleWrapper';
import { DocumentModuleType } from 'types/ProductDetailsType';

type DocumentDrawerProps = {
  drawerTitle: string;
  drawerData: DocumentModuleType;
  registrationRequired: boolean;
  closeDrawer: () => void;
};

const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  drawerTitle,
  drawerData,
  registrationRequired,
  closeDrawer,
}) => {
  useEffect(() => {
    if (!registrationRequired) {
      window.open(drawerData.path, '_self');
      closeDrawer();
    }
  }, [registrationRequired, drawerData.path, closeDrawer]);

  return <ModuleWrapper drawerTitle={drawerTitle} />;
};

export default DocumentDrawer;
