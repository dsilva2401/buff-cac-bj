import React, { useEffect } from 'react';
import ModuleWrapper from 'components/ModuleWrapper';
import { DocumentModuleType } from 'types/ProductDetailsType';

type DocumentDrawerProps = {
  drawerTitle: string;
  drawerData: DocumentModuleType;
  locked: boolean;
  closeDrawer: () => void;
};

const DocumentDrawer: React.FC<DocumentDrawerProps> = ({
  drawerTitle,
  drawerData,
  locked,
  closeDrawer,
}) => {
  useEffect(() => {
    if (!locked) {
      window.open(drawerData.path, '_self');
      closeDrawer();
    }
  }, [locked, drawerData.path, closeDrawer]);

  return <ModuleWrapper drawerTitle={drawerTitle} />;
};

export default DocumentDrawer;
