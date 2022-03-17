import React from 'react';
import HtmlWrapper from 'components/HtmlWrapper';
import ModuleWrapper from 'components/ModuleWrapper';
import { CustomModuleType } from 'types/ProductDetailsType';

type CustomDrawerProps = {
  drawerTitle: string;
  drawerData: CustomModuleType;
};

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  drawerTitle,
  drawerData,
}) => {
  return (
    <ModuleWrapper drawerTitle={drawerTitle}>
      <HtmlWrapper
        direction='column'
        width='calc(100vw - 56px)'
        dangerouslySetInnerHTML={{ __html: drawerData.content }}
      />
    </ModuleWrapper>
  );
};

export default CustomDrawer;
